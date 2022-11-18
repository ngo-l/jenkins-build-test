import requests
from conf.conf import SecData


def test_get_emarsys_config(auth_token):
    # Positive case: Successful get
    path = "emarsys/config"
    response = requests.get(url=SecData.API_BASE_URL + path, headers=auth_token)
    assert response.status_code == 200  # Successful Response
