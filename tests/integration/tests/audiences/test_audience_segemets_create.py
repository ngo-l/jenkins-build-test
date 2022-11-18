import requests
from conf.conf import SecData, TearDownData
from tests.audiences.conftest import TestData


def test_audience_segment_create(auth_token, audience_segment_successful_create_json_schema):
    path = "audiences/segments"
    response = requests.post(url=SecData.API_BASE_URL + path, json=TestData.AUDIENCE_SEGMENT_STATIC_JSON,
                             headers=auth_token)
    assert response.status_code == 200  # Successful Response
    assert response.json() == audience_segment_successful_create_json_schema
    TearDownData.AUDIENCE_SEGMENT_TESTS_ID_LIST.append(response.json()["id"])  # for teardown


def test_audience_segments_create_many(auth_token, gen_audience_segments_create_json,
                                       audience_segment_successful_create_json_schema):
    path = "audiences/segments"
    response = requests.post(url=SecData.API_BASE_URL + path, json=gen_audience_segments_create_json,
                             headers=auth_token)
    assert response.status_code == 200  # Successful Response
    TearDownData.AUDIENCE_SEGMENT_TESTS_ID_LIST.append(response.json()["id"])  # for teardown
