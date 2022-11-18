import logging
from typing import Any, List

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from cdxp_api.emarsys.utils import load_parquet
from .event_factory import EventFactory

from .settings import EmarsysSettings, emarsys_settings
from .auth import generate_wsse_signature
from .._shared.singleton import Singleton

# Codes copied from edm-blast project as a compromise for development progress
# FIXME: should not be bound by Emarsys
# FIXME: failed classifying constant vs config
# FIXME: inappropriate interfaces

logger = logging.getLogger(__name__)


class EmarsysService(metaclass=Singleton):
    def __init__(self, settings: EmarsysSettings = emarsys_settings):
        self.settings = settings

    # FIXME replace by singleton request instance OR session

    def request(self, method: str, path: str, **kwargs):
        # FIXME: none of the following relates to Emarsys, should be wrapped in another class
        s = requests.Session()

        status_forcelist = tuple(x for x in requests.status_codes._codes if x >= 500)
        retries = Retry(total=5, backoff_factor=1, status_forcelist=status_forcelist)

        s.mount("https://", HTTPAdapter(max_retries=retries))

        r = s.request(
            method,
            f"{self.settings.api_base}{path}",
            headers={
                "X-WSSE": generate_wsse_signature(
                    self.settings.user.get_secret_value(), self.settings.token.get_secret_value()
                ),
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            **kwargs,
        )
        logging.debug(r)
        r.raise_for_status()
        response = r.json()
        logger.debug(f"emarsys response, {response}")

        return response

    def trigger_external_event(self, event_id: int, payload: Any) -> dict:
        # Ref: https://dev.emarsys.com/docs/emarsys-api/b3A6MjQ4OTk5MDU-trigger-an-external-event
        logger.debug(f"trigger emarsys event:{payload}")
        return self.request("POST", f"/event/{event_id}/trigger", json=payload)

    def list_external_events(self) -> dict:
        return self.request("GET", "/event")

    # TODO: use strategy pattern
    def load_blast_data(self, blast_file_path: str):
        df = load_parquet(blast_file_path)
        return df

    def get_contact_data(self, payload: Any) -> dict:
        return self.request("POST", f"/contact/getdata", json=payload)

    def filter_opt_in(self, data: List[dict]) -> List[dict]:
        vip_list = [d["vip_no"] for d in data]
        payload = {
            "keyId": self.settings.user_id_field_key,
            "keyValues": vip_list,
            "fields": [self.settings.opt_in_field_key, self.settings.user_id_field_key],
        }

        logger.debug(f"get_contact_data payload:  {payload}")
        response = self.get_contact_data(payload)
        logger.debug(f"contact_data response: {response}")

        if not isinstance(response["data"]["result"], list):
            errors = response["data"]["errors"]
            logger.warning(f"failed to get contact data, {errors}")
            raise Exception(f"failed to get contact data, {errors}")

        opt_in_list = [
            d[self.settings.user_id_field_key]
            for d in response["data"]["result"]
            if d[self.settings.opt_in_field_key] == "1"
        ]

        result = [d for d in data if str(d["vip_no"]) in opt_in_list]
        logger.debug(f"data: {data}, opt-in list:{opt_in_list},  result:{result}")
        return result

    def blast(
        self,
        # key field ID of customer data in Emarsys
        key_field_id: str,
        # name of the key field in a dataframe
        key_field: str,
        # FIXME: vague definition
        #
        data: List[dict],
        event_id: int,  # emarsys external event ID
        # FIXME: tightly coupled business logic to email applicationl logic
        product_list_length: int,
        only_opt_in: bool = True,
    ):
        if len(data) <= 0:
            logger.info("no data to blast")
            return {"message": "no data to blast"}

        opt_in_user_with_data = self.filter_opt_in(data) if only_opt_in else data
        event = EventFactory().create(
            key_field_id, key_field, opt_in_user_with_data, event_id, product_list_length
        )
        logger.debug(f"blast by event: {event}")
        result = self.trigger_external_event(event_id, event.dict())
        return result


emarsys_service = EmarsysService()
