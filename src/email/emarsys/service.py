import logging
from typing import Any, List

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from src.reminders.event_factory import EventFactory

from src._shared.singleton import Singleton

from .settings import EmarsysSettings, emarsys_settings
from .auth import generate_wsse_signature

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

        status_forcelist = tuple(
            x for x in requests.status_codes._codes if x >= 500)
        retries = Retry(total=3, backoff_factor=1,
                        status_forcelist=status_forcelist)

        s.mount("https://", HTTPAdapter(max_retries=retries))

        try:
            r = s.request(
                method, f"{self.settings.api_base}{path}", headers={
                    "X-WSSE": generate_wsse_signature(self.settings.username, self.settings.token.get_secret_value()),
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }, **kwargs)
            response = r.json()
            logger.info(f"emarsys response: {response}")
            r.raise_for_status()
            return response
        except requests.exceptions.HTTPError as err:
            logger.error(f"emarsys error response: {response}")
            raise err

    def trigger_external_event(self, event_id: int, payload: Any) -> dict:
        # Ref: https://dev.emarsys.com/docs/emarsys-api/b3A6MjQ4OTk5MDU-trigger-an-external-event
        logger.debug(f'trigger emarsys event:{payload}')
        return self.request("POST", f"/event/{event_id}/trigger", json=payload)

    def list_external_events(self) -> dict:
        return self.request("GET", "/event")

    # def get_external_event(self, event_id: int) -> dict:
    #     return self.request("GET", f"/event/{event_id}/usages")

    def get_contact_data(self, payload: Any) -> dict:
        return self.request("POST", f"/contact/getdata", json=payload)

    def filter_opt_in(self, data: List[dict]) -> List[dict]:
        vip_list = [d["vip_no"] for d in data]
        payload = {
            "keyId": self.settings.user_id_field_key,
            "keyValues": vip_list,
            "fields": [self.settings.opt_in_field_key, self.settings.user_id_field_key]
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
        logger.debug(
            f'data: {data}, opt-in list:{opt_in_list},  result:{result}')
        return result

    def blast(self, data: List[dict],
              event_id: int,
              product_list_length: int,
              event_factory: EventFactory,
              email_subject: str):
        if (len(data) <= 0):
            logger.info('no data to blast')
            return {"message": "no data to blast"}

        opt_in_user_with_data = self.filter_opt_in(data)
        event = event_factory.create(
            opt_in_user_with_data, event_id, product_list_length, email_subject)
        logger.debug(f"blasting, event: {event}")
        result = self.trigger_external_event(event_id, event.dict())

        return result
