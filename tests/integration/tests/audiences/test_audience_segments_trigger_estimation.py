import requests
from conf.conf import SecData, TearDownData


def test_audience_segments_successful_trigger_estimation_and_callback(get_audience_segment_id, auth_token):
    path = "audiences/segments/" + get_audience_segment_id + "/estimate"
    response = requests.post(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 200  # Successful Response
    TearDownData.AUDIENCE_SEGMENT_TESTS_ID_LIST.append(response.json()["id"])  # for teardown
