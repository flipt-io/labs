FROM python:3.9

RUN apt install git

WORKDIR /app

RUN git clone --depth 1 https://github.com/flipt-io/docs.git docs && rm -rf docs/.git

COPY requirements.txt /app

RUN pip install -r requirements.txt

COPY *.py /app

EXPOSE 9000

CMD ["gunicorn", "--workers", "1", "--bind", "0.0.0.0:9000", "main:create_app()"]
