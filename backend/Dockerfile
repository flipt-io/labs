FROM python:3.9

WORKDIR /app

RUN apt install git

RUN git clone https://github.com/flipt-io/docs.git docs

COPY main.py /app

COPY requirements.txt /app

RUN pip install -r requirements.txt

EXPOSE 9000

CMD ["gunicorn", "--workers", "1", "--bind", "0.0.0.0:9000", "main:create_app()"]
