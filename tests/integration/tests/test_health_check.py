import requests
from conf.conf import TestData
from requests.auth import HTTPBasicAuth


def test_health_check():
    path = "healthz/"
    response = requests.get(url=TestData.API_BASE_URL + path, auth=HTTPBasicAuth(TestData.AUTH_BASIC_USERNAME,
                                                                                 TestData.AUTH_BASIC_PASSWORD))
    assert response.status_code == 204  # Successful Response
