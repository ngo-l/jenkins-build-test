import os
from dotenv import load_dotenv


env_path = os.path.join(os.path.dirname(__file__), f".{os.getenv('ENV')}.env")
secrets_path = os.path.join(os.path.dirname(__file__), "secrets", "secrets.env")
load_dotenv(env_path)
load_dotenv(secrets_path)


class TestData:
    API_BASE_URL = os.getenv("API_BASE_URL")
    AUTH_BASIC_USERNAME = os.getenv("AUTH_BASIC_USERNAME")
    AUTH_BASIC_PASSWORD = os.getenv("AUTH_BASIC_USERNAME")
