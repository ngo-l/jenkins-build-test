import os
import json
import pytest
import requests
from pathlib import Path
from datetime import datetime
from pytest_schema import schema


@pytest.fixture()
def gen_create_campaign_version_json(get_audience_segment_id, get_campaign_id):
    data = TestData.CAMPAIGN_VERSION_STATIC_JSON
    data["audienceSegmentIncludeIds"] = get_audience_segment_id
    data["campaignId"] = get_campaign_id
    json_data = json.dumps(data)
    return json_data


class TestData:
    CAMPAIGN_VERSION_STATIC_JSON = json.load(open(
        os.path.join(Path(__file__).parent.parent, "static_test_data", "campaign_versions",
                     "campaign_version_static.json")))
