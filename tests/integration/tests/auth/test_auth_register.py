import pytest
import requests
from conf.conf import SecData
from tests.auth import conftest
from tests.auth.conftest import TestData


@pytest.mark.parametrize("email, password, full_name", (TestData.unauthenticated_email, TestData.valid_format_password,
                                                        TestData.valid_full_name))
def test_successful_registration(email, password, full_name, successful_registration_json_schema):
    # Positive case: Successful registration
    path = "auth/register"
    response = requests.post(url=SecData.API_BASE_URL + path, json=conftest.gen_register_json(email, password,
                                                                                              full_name))
    assert response.status_code == 200  # Successful Response
    assert response.json() == successful_registration_json_schema


@pytest.mark.parametrize("email, password, full_name",
                         [(None, TestData.valid_format_password, TestData.valid_full_name),
                          (TestData.unauthenticated_email, None, TestData.valid_full_name),
                          (TestData.unauthenticated_email, TestData.valid_format_password, None),
                          (TestData.invalid_email, TestData.valid_format_password, TestData.valid_full_name),
                          (TestData.unauthenticated_email, TestData.invalid_format_password, TestData.valid_full_name),
                          (TestData.unauthenticated_email, TestData.valid_format_password, TestData.invalid_full_name)])
def test_unsuccessful_registration(email, password, full_name, unsuccessful_login_registration_schema):
    # Positive case: Successful registration
    path = "auth/register"
    response = requests.post(url=SecData.API_BASE_URL + path, json=conftest.gen_register_json(email, password,
                                                                                              full_name))
    assert response.status_code == 422  # Validation Error
    assert response.json() == unsuccessful_login_registration_schema


@pytest.mark.parametrize("email, password, full_name", (TestData.unauthenticated_email, TestData.valid_format_password,
                                                        TestData.valid_full_name))
def test_duplicated_account_registration(email, password, full_name, successful_registration_json_schema):
    # Undocumented (Duplicated account)
    # Positive case: Successful registration
    path = "auth/register"
    response = requests.post(url=SecData.API_BASE_URL + path, json=conftest.gen_register_json(email, password,
                                                                                              full_name))
    assert response.status_code == 200  # Successful Response
    assert response.json() == successful_registration_json_schema

    # Negative case: Register with the same email
    response = requests.post(url=SecData.API_BASE_URL + path, json=i)
    assert response.status_code == 400
