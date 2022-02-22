FROM python:3.10-slim-buster

RUN apt update && \
  apt install -y gcc && \
  pip install poetry && \
  poetry config virtualenvs.create false

WORKDIR /code

COPY pyproject.toml poetry.lock ./

RUN poetry install --no-dev

COPY src src

CMD ["python", "-m", "src.main"]
