FROM betalabsk8sacr.azurecr.io/python-backend:202209

WORKDIR /code

COPY pyproject.toml poetry.lock ./

RUN poetry install --no-dev

COPY src src
COPY conf conf


CMD ["python", "-m", "src.main"]
