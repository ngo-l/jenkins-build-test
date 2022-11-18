import os
import json
import pytest
import requests
from pathlib import Path
from conf.conf import SecData, TearDownData

"""Session/Common Fixtures"""


@pytest.fixture(autouse=True, scope='session')
def setup_teardown():
    # setup
    yield
    # teardown
    # action: login
    path = "auth/login"
    response = requests.post(url=SecData.API_BASE_URL + path,
                             json={
                                 'email': SecData.ADMIN_USERNAME,
                                 'password': SecData.ADMIN_PASSWORD})
    bearer_token = {"Authorization": "Bearer " + response.json()["accessToken"]}
    # teardown: delete all created audience segments and campaigns in the test
    for audience_id in TearDownData.AUDIENCE_SEGMENT_TESTS_ID_LIST:
        delete_audience_segment(bearer_token, audience_id)
    for campaign_id in TearDownData.CAMPAIGN_TESTS_ID_LIST:
        delete_campaign(bearer_token, campaign_id)
    for version_id in TearDownData.CAMPAIGN_VERSIONS_TESTS_ID_LIST:
        delete_campaign_version(bearer_token, version_id)


@pytest.fixture(scope="function")
def auth_token():
    path = "auth/login"
    # action: login
    response = requests.post(url=SecData.API_BASE_URL + path,
                             json={
                                 'email': SecData.ADMIN_USERNAME,
                                 'password': SecData.ADMIN_PASSWORD})
    bearer_token = {"Authorization": "Bearer " + response.json()["accessToken"]}
    # return bearer token for accessing other APIs
    yield bearer_token


@pytest.fixture(scope='function')
def get_campaign_id(auth_token):
    path = "campaigns"
    # action: create a campaign
    response = requests.post(url=SecData.API_BASE_URL + path,
                             json=json.load(open(
                                 os.path.join(Path(__file__), "static_test_data", "campaigns",
                                              "campaign_static.json"))),
                             headers=auth_token)
    campaign = response.json()
    return campaign["id"]


@pytest.fixture(scope="function")
def get_audience_segment_id(auth_token):
    path = "audiences/segments"
    # action: create an audience segment
    response = requests.post(url=SecData.API_BASE_URL + path,
                             json=json.load(open(
                                 os.path.join(Path(__file__), "static_test_data", "audiences",
                                              "audience_segment_static.json"))),
                             headers=auth_token)
    assert response.status_code == 200  # Successful Response
    TearDownData.AUDIENCE_SEGMENT_TESTS_ID_LIST.append(response.json()["id"])
    # return audience segment id
    audience_segment = response.json()
    return audience_segment["id"]


"""Teardown Functions"""


def delete_audience_segment(token, audience_segment_id):
    path = "audiences/segments/" + audience_segment_id
    # action: delete an audience segment
    response = requests.delete(url=SecData.API_BASE_URL + path, headers=token)
    assert response.status_code == 204


def delete_campaign(token, campaign_id):
    path = "campaigns/" + campaign_id
    # action: delete a campaign
    response = requests.delete(url=SecData.API_BASE_URL + path, headers=token)
    assert response.status_code == 204


def delete_campaign_version(token, version_id):
    path = "versions/" + version_id
    response = requests.delete(url=SecData.API_BASE_URL + path, headers=token)
    assert response.status_code == 204  # Successful Response
