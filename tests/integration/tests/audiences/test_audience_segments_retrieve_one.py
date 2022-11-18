import requests
from conf.conf import SecData, TearDownData


def test_audience_segments_successful_retrieve_one(auth_token, get_audience_segment_id,
                                                   audience_segment_successful_create_json_schema):
    path = "audiences/segments/" + get_audience_segment_id
    response = requests.get(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 200  # Successful Response
    assert response.json() == audience_segment_successful_create_json_schema
    TearDownData.AUDIENCE_SEGMENT_TESTS_ID_LIST.append(get_audience_segment_id)  # for teardown


def test_audience_segments_unsuccessful_retrieve_one(auth_token):
    path = "audiences/segments/" + "wrong_id"
    response = requests.get(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 422  # Validation Error
