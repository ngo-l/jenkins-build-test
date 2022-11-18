import logging
from typing import List
from .models import EdmData, Event


from typing import List
from .models import Contact, EdmData, Event, Product


class EventFactory:
    def create(
        self,
        key_field_id: str,
        key_field: str,
        data: List[dict],
        event_id: int,
        product_list_length: int,
    ) -> Event[EdmData]:
        # FIXME: tangled codes
        def construct_contact(row):
            logging.debug(f"constructing contact from row: {row}")
            external_id = row.get(key_field)
            try:
                subject_line = row.get("Subject_Line")
                products = [
                    Product(
                        brand=row.get(f"Brand_{i}"),
                        description=row.get(f"Prod_Desc_{i}"),
                        product_id=row.get(f"ATG_{i}"),
                        global_exclusive="N" if row.get(f"Global_Exclusive_{i}") == "NA" else "Y",
                    )
                    for i in range(1, product_list_length + 1)
                    if row.get(f"ATG_{i}") and row.get(f"Brand_{i}") and row.get(f"Prod_Desc_{i}")
                ]

                return Contact(
                    external_id=external_id,
                    trigger_id=f"{event_id}_{external_id}",
                    data=EdmData(
                        subject_line=subject_line,
                        product=products,
                    ),
                )
            except Exception as e:
                logging.error(f"failed to parse row ({external_id}): {e}")

        # FIXME: tangled codes - break them to differnt parts
        contacts = list(filter(None, list(map(construct_contact, data))))

        return Event(
            key_id=key_field_id,
            contacts=contacts,
        )
