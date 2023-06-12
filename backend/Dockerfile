FROM python:3.9

WORKDIR /app

RUN mkdir -p /app/markdown

COPY main.py /app

COPY requirements.txt /app

COPY markdown/ /app/markdown

RUN pip install -r requirements.txt

EXPOSE 8080

CMD ["gunicorn", "--workers", "1", "--bind", "0.0.0.0:8080", "main:create_app()"]
