import requests
from conf.conf import SecData, TearDownData


def test_audience_segments_successful_update(auth_token, get_audience_segment_id,
                                             gen_audience_segments_successful_update_json,
                                             audience_segments_successful_update_json_schema):
    path = "audiences/segments/" + get_audience_segment_id
    response = requests.put(url=SecData.API_BASE_URL + path,
                            json=gen_audience_segments_successful_update_json,
                            headers=auth_token)
    assert response.status_code == 200  # Successful Response
    assert response.json() == audience_segments_successful_update_json_schema  # verify schema and expected value
    TearDownData.AUDIENCE_SEGMENT_TESTS_ID_LIST.append(get_audience_segment_id)


def test_audience_segments_unsuccessful_update(auth_token, get_audience_segment_id,
                                               gen_audience_segments_unsuccessful_update_json,
                                               audience_segments_unsuccessful_update_json_schema):
    path = "audiences/segments/" + get_audience_segment_id
    response = requests.put(url=SecData.API_BASE_URL + path,
                            json=gen_audience_segments_unsuccessful_update_json,
                            headers=auth_token)
    assert response.status_code == 422  # Validation Error
    assert response.json() == audience_segments_unsuccessful_update_json_schema  # verify schema and expected value
    TearDownData.AUDIENCE_SEGMENT_TESTS_ID_LIST.append(get_audience_segment_id)
