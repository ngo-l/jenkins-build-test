import pytest
import requests
from conf.conf import SecData
from tests.auth import conftest
from tests.auth.conftest import TestData


def test_successful_login(successful_login_json_schema):
    # Positive case: Successful login
    path = "auth/login"
    response = requests.post(url=SecData.API_BASE_URL + path, json=conftest.gen_login_json(SecData.ADMIN_USERNAME,
                                                                                           SecData.ADMIN_PASSWORD))
    assert response.status_code == 200  # Successful Response
    assert response.json() == successful_login_json_schema


@pytest.mark.parametrize("email, password", [(SecData.ADMIN_USERNAME, None), (SecData.ADMIN_USERNAME, None),
                                             (None, None), (TestData.invalid_email, TestData.valid_format_password),
                                             (SecData.ADMIN_USERNAME, TestData.invalid_format_password)])
def test_unsuccessful_login(email, password, unsuccessful_login_registration_schema):
    # Negative case: Unsuccessful login
    path = "auth/login"
    response = requests.post(url=SecData.API_BASE_URL + path, json=conftest.gen_login_json(email, password))
    assert response.status_code == 422  # Validation Error
    assert response.json() == unsuccessful_login_registration_schema


@pytest.mark.parametrize("email, password", [(SecData.ADMIN_USERNAME, TestData.valid_format_password),
                                             (TestData.unauthenticated_email, TestData.valid_format_password)])
def test_unsuccessful_login_not_authenticated(email, password):
    # Undocumented
    # Negative case: Unsuccessful login (not_authenticated)
    path = "auth/login"
    response = requests.post(url=SecData.API_BASE_URL + path, json=conftest.gen_login_json(email, password))
    assert response.status_code == 401
