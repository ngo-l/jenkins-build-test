import os
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), f".{os.getenv('ENV')}.env")
secrets_path = os.path.join(os.path.dirname(__file__), "secrets", "secrets.env")
load_dotenv(env_path)
load_dotenv(secrets_path)


class SecData:
    API_BASE_URL = os.getenv("API_BASE_URL")
    ADMIN_USERNAME = os.getenv("LOGIN_USERNAME")
    ADMIN_PASSWORD = os.getenv("LOGIN_PASSWORD")


class TearDownData:
    AUDIENCE_SEGMENT_TESTS_ID_LIST = []
    CAMPAIGN_TESTS_ID_LIST = []
    CAMPAIGN_VERSIONS_TESTS_ID_LIST = []
