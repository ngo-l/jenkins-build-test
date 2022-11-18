import requests
from conf.conf import SecData, TearDownData
from tests.campaigns.conftest import TestData


def test_campaign_create(auth_token, gen_campaign_create_json, campaign_successful_create_json_schema):
    path = "campaigns"
    response = requests.post(url=SecData.API_BASE_URL + path, json=TestData.CAMPAIGN_STATIC_JSON, headers=auth_token)
    assert response.status_code == 200  # Successful Response
    assert response.json() == campaign_successful_create_json_schema
    TearDownData.CAMPAIGN_TESTS_ID_LIST.append(response.json()["id"])  # for teardown


def test_campaign_create_many(auth_token, gen_campaign_create_json):
    path = "campaigns"
    response = requests.post(url=SecData.API_BASE_URL + path, json=gen_campaign_create_json, headers=auth_token)
    assert response.status_code == 200  # Successful Response
    TearDownData.CAMPAIGN_TESTS_ID_LIST.append(response.json()["id"])  # for teardown
