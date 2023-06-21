import json
import numpy as np
import os
import random
import redis
import responses
import time
from flask import Flask, current_app, request, jsonify
from flask_cors import CORS
from flipt.client import FliptApi
from flipt import evaluationRequest
from langchain.text_splitter import MarkdownTextSplitter
from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from pathlib import Path
from redis.commands.search.field import TextField, VectorField
from redis.commands.search.indexDefinition import IndexDefinition, IndexType
from redis.commands.search.query import Query
from sentence_transformers import SentenceTransformer
from werkzeug.exceptions import HTTPException

ATTEMPTS = 6
VECTOR_DIMENSION = 384

openai_api_key = os.environ.get("OPENAI_API_KEY")
flag_key = os.environ.get("FLIPT_FLAG_KEY") or "chat-personas"
server_addr = os.environ.get("FLIPT_SERVER_ADDR") or "http://localhost:8080"


class FliptApiEnivronment:
    def __init__(self, addr="http://localhost:8080"):
        self.value = addr


fenv = FliptApiEnivronment(addr=server_addr)

flipt_api = FliptApi(environment=fenv)

default_pre_prompt = """
You are a chatbot that will respond to questions in a very helpful and kind manner based on some facts below about the product Flipt.
To give brief context, Flipt is a popular open source self-hosted feature flagging solution that is currently used by a variety of companies across the world.
Feature flags (also commonly known as feature toggles) are a software engineering technique that allows for turning features on and off during runtime, without deploying new code.
There are many ways one can use feature flags, including but not limited to: A/B testing, gradual feature rollouts, feature kill switches, etc.
There will be more context below from some contents to give a better idea of Flipt.
"""


class InvalidRequest(HTTPException):
    def __init__(self, code, description):
        self.code = code
        self.description = description


# Class for seeding the data plus vector embeddings into Redis.
class RedisSearch:
    def __init__(self, rclient):
        self.rclient = rclient
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.doc_prefix = "doc:"
        self.index_name = "md_index"

        # Attempts to connect to Redis
        for x in range(0, ATTEMPTS):
            try:
                self.rclient.ping()
                print("redis ready!")
                break
            except:
                print(f"failed connecting to redis, retrying attempt {x+1}...")
                time.sleep(3)

    def load_data(self):
        print("Loading data into Redis...")
        # Get contents of markdown directory, and split contents into
        # chunks.
        md_text_splitter = MarkdownTextSplitter(chunk_size=1000)
        md_files = Path("docs/").glob("**/*.mdx")
        contents_dict = {}

        for file in md_files:
            abs_path = file.as_posix()
            if "reference" not in abs_path:
                md_file = open(file, "r")
                contents = md_file.read()
                str_list = md_text_splitter.split_text(contents)
                contents_dict[md_file.name] = str_list

        # Load data into Redis using pipeline.
        pipe = self.rclient.pipeline()
        for key in contents_dict:
            for idx, line in enumerate(contents_dict[key]):
                enc = self.model.encode(line)
                embedding = np.array(enc).tobytes()
                k_split = key.split(".")[0]
                pkey = f"{self.doc_prefix}{k_split}:{idx}"
                pipe.hset(
                    pkey,
                    mapping={
                        "content": line,
                        "vector": embedding,
                    },
                )
        pipe.execute()

    def create_index(self):
        try:
            print("Creating secondary index...")
            # Create a secondary index in Redis for easy full text search.
            schema = (
                TextField("content"),
                VectorField(
                    "vector",
                    "FLAT",
                    {
                        "TYPE": "FLOAT32",
                        "DIM": VECTOR_DIMENSION,
                        "DISTANCE_METRIC": "COSINE",
                    },
                ),
            )

            definition = IndexDefinition(
                prefix=[self.doc_prefix], index_type=IndexType.HASH
            )
            self.rclient.ft(self.index_name).create_index(
                fields=schema, definition=definition
            )
        except:
            print("Index already created...")

    def is_data_present(self):
        scan_res = self.rclient.scan(match=f"{self.doc_prefix}*", count=1)
        return len(scan_res[1]) > 0

    def generate_response(self, query, pre_prompt, sentiment):
        query_vec = np.array(self.model.encode(query))
        search_query = (
            Query("*=>[KNN 2 @vector $vec as score]")
            .sort_by("score")
            .return_fields("content", "id", "score")
            .paging(0, 2)
            .dialect(2)
        )

        query_params = {
            "vec": query_vec.tobytes(),
        }
        docs = self.rclient.ft(self.index_name).search(search_query, query_params).docs
        contents = [doc["content"] for doc in docs]

        contents_str = "\n\n".join(contents)

        prompt = PromptTemplate(
            input_variables=["pre_prompt", "query", "sentiment", "contents"],
            template="""
            {pre_prompt}
            Keeping that in mind, please answer the following question in a {sentiment} tone: "{query}" using the contents below about Flipt.
            Contents:
            {contents}
            Answer:
            """,
        )

        chain = LLMChain(llm=OpenAI(temperature=0), prompt=prompt)

        answer = chain.run(
            pre_prompt=pre_prompt,
            query=query,
            contents=contents_str,
            sentiment=sentiment,
        )

        return answer


# Request handler for /chat endpoint
def chat():
    if request.method == "POST":
        rs = current_app.config["REDIS_SEARCH"]
        data = request.get_json()

        if "prompt" not in data:
            ir = InvalidRequest(400, "prompt not provided")
            raise ir

        if "user" not in data:
            ir = InvalidRequest(400, "user not provided")
            raise ir

        query = data["prompt"]
        user = data["user"]

        # Default the sentiment and pre_prompt to still provide a response to the user
        # despite networking issues with Flipt.
        sentiment = "default"
        pre_prompt = default_pre_prompt

        try:
            eval_request = evaluationRequest(
                flagKey=flag_key, entityId=user, context={}
            )

            eval_resp = flipt_api.evaluate.evaluate(
                namespace_key="default", request=eval_request
            )

            if eval_resp != None:
                sentiment = eval_resp.value
                try:
                    attachment = json.loads(eval_resp.attachment)
                    pre_prompt = attachment["prompt"]
                except:
                    print("attachment not found, defaulting to original pre_prompt...")
                    pass
        except:
            print(
                "error communicating with flipt server, defaulting to original prompts and sentiment..."
            )
            pass

        res = responses.flipt_responses[sentiment][random.randint(0, 9)]
        if openai_api_key != None:
            sentiment_for_prompt = sentiment
            if sentiment_for_prompt == "liar":
                sentiment_for_prompt = "deceitful"
            if sentiment_for_prompt == "default":
                sentiment_for_prompt = "helpful"
            res = rs.generate_response(query, pre_prompt, sentiment_for_prompt)

        return jsonify(response=res, sentiment=sentiment)


# Generic error handler
def handle_exception(e):
    return jsonify(
        code=e.code,
        description=e.description,
    )


def create_app():
    redis_host = os.environ.get("REDIS_HOST") or "localhost"
    redis_port = os.environ.get("REDIS_PORT")

    if redis_port == None:
        redis_port = 6379
    else:
        redis_port = int(redis_port)

    r = redis.Redis(host=redis_host, port=redis_port)

    app = Flask(__name__)
    CORS(app, resources={r"/chat/*": {"origins": "*"}})
    rs = RedisSearch(r)

    if not rs.is_data_present():
        rs.load_data()
        rs.create_index()

    app.config["REDIS_SEARCH"] = rs

    app.add_url_rule("/chat", "chat", chat, methods=["POST"])
    app.register_error_handler(HTTPException, handle_exception)

    return app


if __name__ == "__main__":
    backend_port = os.environ.get("BACKEND_PORT")

    if backend_port == None:
        backend_port = 9000
    else:
        backend_port = int(backend_port)

    a = create_app()
    a.run(host="0.0.0.0", port=backend_port)
