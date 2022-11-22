import logging

from typing import List
from src.email.emarsys.settings import emarsys_settings

from src.email.emarsys.models import Contact, EdmData, ExternalEvent, ProductData
from ...event_factory import EventFactory
from src.reminders.abandoned_cart.settings import abandoned_cart_reminder_settings

logger = logging.getLogger(__name__)


class AbandonedCartEventFactory(EventFactory):
    def create(self,
               data: List[dict],
               event_id: int,
               product_list_length: int,
               email_subject: str = abandoned_cart_reminder_settings.email_subject) -> ExternalEvent[EdmData]:
        # FIXME: tangled codes
        def construct_contact(row: dict):
            try:
                vip_num = row.get('vip_no')
                # FIXME: blast date is only for destructure
                _blast_date, email_context = (
                    lambda blast_date, **others: (blast_date, others)
                )(**row)
                subject_line = row.get("subject_line") or\
                    f'{row.get("salutation")} {row.get("last_name")}, {email_subject}'
                products = [
                    ProductData(
                        brand=row.get(f"brand_{i}"),
                        description=row.get(f"description_{i}"),
                        product_id=row.get(f"product_id_{i}"),
                    )
                    for i in range(1, product_list_length + 1)
                    if row.get(f"brand_{i}")
                    and row.get(f"description_{i}")
                    and row.get(f"product_id_{i}")
                    and row.get(f"inventory_{i}") and int(row.get(f"inventory_{i}")) > 0
                ]

                return Contact(
                    external_id=vip_num,
                    trigger_id=f"{event_id}_{vip_num}",
                    data={
                        **email_context,
                        "product": products,
                        "subject_line": subject_line
                    },
                )
            except Exception as e:
                logger.error(f'failed to parse row ({vip_num}): {e}')

        # FIXME: tangled codes - break them to differnt parts
        contacts = list(filter(None, list(map(construct_contact, data))))

        return ExternalEvent(
            key_id=emarsys_settings.user_id_field_key,
            contacts=contacts,
        )
