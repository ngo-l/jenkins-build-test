import requests
from conf.conf import SecData


def test_audience_segments_successful_delete(auth_token, get_audience_segment_id):
    path = "audiences/segments/" + get_audience_segment_id
    response = requests.delete(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 204  # Successful Response


def test_audience_segments_successful_delete_same_list(auth_token, get_audience_segment_id):
    path = "audiences/segments/" + get_audience_segment_id
    response = requests.delete(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 204  # Successful Response
    response = requests.delete(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 404  # Not found


def test_audience_segments_unsuccessful_delete(auth_token):
    path = "audiences/segments/" + "wrong_id"
    response = requests.delete(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 422  # Validation Error
