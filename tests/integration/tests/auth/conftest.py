import json
import random
import string
import pytest
from faker import Faker
from pytest_schema import schema


# schemas
@pytest.fixture
def user_details_json_schema():
    user_details_json_schema = {
        "id": str,
        "email": str,
        "fullName": str,
        "avatar": str,
        "role": str,
        "ability": [
            {
                "action": str,
                "subject": str
            }
        ]
    }
    return schema(user_details_json_schema)


@pytest.fixture()
def successful_login_json_schema():
    login_json_schema = {
        "accessToken": str,
        "tokenType": "bearer"
    }
    return schema(login_json_schema)


@pytest.fixture()
def unsuccessful_login_registration_schema():
    login_json_schema = {
        "detail": [
            {
                "loc": [
                    "body",
                    str
                ],
                "msg": str,
                "type": str
            }
        ]
    }
    return schema(login_json_schema)


@pytest.fixture()
def successful_registration_json_schema():
    registration_json_schema = {
      "id": str,
      "email": str,
      "fullName": str,
      "avatar": "",
      "role": str,
      "ability": [
        {
          "action": str,
          "subject": str
        }
      ]
    }
    return schema(registration_json_schema)


# json
def gen_login_json(email, password):
    test_json = {
        'email': email,
        'password': password,
    }
    return test_json


def gen_register_json(email, password, full_name):
    test_json = {
        'email': email,
        'password': password,
        'fullName': full_name,
    }
    return test_json


class TestData:
    invalid_email = "wrong_email_format"
    unauthenticated_email = "test_" + Faker().safe_email()
    valid_format_password = ''.join(random.sample(string.ascii_letters, 8))
    invalid_format_password = ''.join(random.sample(string.ascii_letters, 4))
    valid_full_name = Faker().name()
    invalid_full_name = ''.join(random.sample(string.ascii_letters, 0))
