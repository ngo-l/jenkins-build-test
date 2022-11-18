import base64
import logging

from uuid import UUID
from cdxp_api.notifications.models import AudienceSegmentExportEmail, NotificationStatus
import dask.dataframe as dd
from .._shared.settings import common_settings
from ..database.deps import CRUDSession
from .models import AudienceSegment, EstimationState
from ..databricks.config import databricks_jobs_service, databricks_settings
from ..emarsys.settings import emarsys_settings
from ..emarsys.service import emarsys_service
from ..notifications.repository import notification_repository

logger = logging.getLogger(__name__)


class AudienceService:
    async def generate_audience_segment(self, db: CRUDSession, id: UUID) -> AudienceSegment:
        # FIXME: avoid idiotic retrieval then whole record put to DB
        db_record = await db.retrieve_detail(AudienceSegment, {"id": id})

        await db.update(db_record, {"estimation_state": EstimationState.Processing})

        databricks_jobs_params = {
            "audience_id": str(id),
            "workflow_config": databricks_settings.cdxp_workflow_config_path,
        }
        try:
            logger.debug(f"sending request to databricks, {databricks_jobs_params}")
            databricks_jobs_service.run_now(
                job_id=databricks_settings.jobs.estimate_audience_size,
                notebook_params=databricks_jobs_params,
            )
        except Exception as e:
            logging.error(f"failed to invoke function in databricks: {e}")
            raise Exception("failed to invoke function in databricks")

        return db_record

    def load_audience_segment_file(self, id):
        logger.debug(
            f"loading audience segment file for {id}, path = {common_settings.cdp_blob_path}, connection string = {common_settings.databricksshare_connection_string.get_secret_value()}"
        )

        # TODO: allow user to choose
        cols = [
            "vip_no",
            "gender",
            "email",
            "customer_name_shortened",
            "customer_name_full",
            "customer_name_shortened_chi",
            "customer_name_full_chi",
        ]
        df = dd.read_csv(
            f"{common_settings.cdp_blob_path}/audience/{id}/audience.csv",
            storage_options={
                "connection_string": common_settings.databricksshare_connection_string.get_secret_value()
            },
            usecols=cols,
        ).compute()

        res = df.to_csv(line_terminator="\r\n")
        return res

    async def register_export_recipients(
        self, db: CRUDSession, audience_segment_id: UUID, user_id: UUID
    ) -> AudienceSegmentExportEmail:
        logger.debug(f"registering recipient(s) {audience_segment_id, user_id} export")

        record = AudienceSegmentExportEmail(
            triggered_by=user_id, audience_segment_id=audience_segment_id
        )

        # FIXME replace by proper DB persistent method calls
        await db.create(record)

        return record

    async def generate_call_list(self, audience_segment_id):
        logger.debug(
            f"loading audience segment file for {audience_segment_id}, path = {common_settings.cdp_blob_path}"
        )

        # TODO: allow user to choose
        cols = [
            "vip_no",
            "gender",
            "email",
            "customer_name_shortened",
            "customer_name_full",
            "customer_name_shortened_chi",
            "customer_name_full_chi",
        ]
        df = dd.read_csv(
            f"{common_settings.cdp_blob_path}/audience/{audience_segment_id}/audience.csv",
            storage_options={
                "connection_string": common_settings.databricksshare_connection_string.get_secret_value()
            },
            usecols=cols,
        ).compute()

        call_list = df.to_csv(line_terminator="\r\n")

        return call_list

    async def send_call_list(self, audience_segment_id: UUID, call_list: str):
        # TODO send email to user who requested the export with attachment(s)
        notifications = await notification_repository.find_pending_notifications(
            audience_segment_id
        )

        if len(notifications) == 0:
            logging.info(f"no notifications to send for audience segments {audience_segment_id}")
            return

        logging.debug(f"notifications for exporting audience segments: {notifications}")

        call_list_bytes = call_list.encode("utf-8")
        base64_call_list_bytes = base64.b64encode(call_list_bytes)
        encoded_call_list = base64_call_list_bytes.decode("utf-8")
        attachment = [{"filename": "call_list.csv", "data": encoded_call_list}]
        contacts = [
            {
                "external_id": email,
                "data": {
                    "audience_segment_id": str(audience_segment_id),
                    "audience_segment_status": audience_segment_status,
                },
                "attachment": attachment,
            }
            for audience_segment_id, audience_segment_status, email in notifications
        ]

        # FIXME: chunking and throttling
        emarsys_service.trigger_external_event(
            event_id=emarsys_settings.audience_segment_notification_event_id,
            payload={"key_id": emarsys_settings.email_field_id, "contacts": contacts},
        )

        await notification_repository.update_notification_status(
            audience_segment_id, NotificationStatus.SENT
        )


audience_service = AudienceService()
