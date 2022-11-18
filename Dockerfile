FROM betalabsk8sacr.azurecr.io/python-backend:202209


WORKDIR /code

COPY pyproject.toml poetry.lock ./

RUN poetry install --no-dev

COPY cdxp_api cdxp_api
COPY conf conf

CMD ["python", "-m", "cdxp_api"]
