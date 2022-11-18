import json
from random import choice, sample
from time import time
from typing import List, Type
from uuid import uuid4

import mimesis
import typer
from jsf import JSF
from pandas import DataFrame
from pydantic import BaseModel
from sqlalchemy import text as sa_text
from sqlalchemy.engine import URL, create_engine

from .audiences.rules import (
    AudienceAchievedRule,
    AudienceAverageTransactionValueRule,
    AudienceCardOrganizationRule,
    AudienceCardTypeRule,
    AudienceClickedEmailRule,
    AudienceCustomerTypeRule,
    AudienceEmailSubscriberRule,
    AudienceFirstTransactionDateRule,
    AudienceGenderRule,
    AudienceJoinDateRule,
    AudienceLastTransactionDateRule,
    AudienceMailGroupRule,
    AudienceNationalityRule,
    AudienceOpenedEmailRule,
    AudiencePreferredChannelRule,
    AudienceSpecialCardRule,
    AudienceStaffCardRule,
    AudienceTopPurchasedBrandGroupRule,
    AudienceTopPurchasedCategoryRule,
    AudienceTotalTransactionValueRule,
    AudienceWholesalerRule,
)
from .auth.utils import hash_password
from .campaigns.models import CampaignState, CampaignType 
from .audiences.models import EstimationState
from .database.schemas import (
    CommonModel,
    VersionState,
    VersionType,
)
from .database.settings import DatabaseSettings
from .products.rules import (
    ProductBandStyleRule,
    ProductCategoryRule,
    ProductDepartmentRule,
    ProductDiscountPercentageRule,
    ProductExclusiveFlagRule,
    ProductPriceRule,
    ProductSeasonRule,
    ProductSkuRule,
    ProductStartDateRule,
)

app = typer.Typer()

address = mimesis.Address()
person = mimesis.Person()
text = mimesis.Text()
numbers = mimesis.Numeric()
dt = mimesis.Datetime()
development = mimesis.Development()

database_settings = DatabaseSettings()
url = URL.create(**database_settings.dict())
sync_engine = create_engine(url.set(drivername="postgresql"), echo=True)


def generate_user():
    user = {
        "id": "2f54ed11-6645-43e3-ab74-0e5dd9e8596d",
        "email": "user@example.com",
        "hashed_password": hash_password("stringst"),
        "full_name": "Tai Ming Chan",
    }
    users_df = DataFrame.from_records([user])
    users_df.to_sql("user", con=sync_engine, if_exists="append", index=False, chunksize=100_000)
    user_safe = user.copy()
    user_safe.pop("hashed_password")
    user_safe.pop("email")
    return user_safe


def generate_rule_group(RuleModels: List[Type[BaseModel]], level: int = 1):
    def rule_generator():
        RuleModel = choice(RuleModels)
        faker = JSF(RuleModel.schema())
        return faker.generate()

    rule_group = {
        "id": str(uuid4()),
        "type": "group",
        "level": level,
        "conjunction": choice(["and", "or"]),
        "rules": [
            generate_rule_group(RuleModels, level + 1)
            if numbers.integer_number(0, 2) > level
            else rule_generator()
            for _ in range(2)
        ],
    }
    return rule_group


def generate_audience_segments(*, count: int):

    audience_segments = [
        {
            "id": str(uuid4()),
            "name": "-".join(text.words()),
            "filters": json.dumps(
                generate_rule_group(
                    [
                        AudienceGenderRule,
                        AudienceNationalityRule,
                        AudienceCardTypeRule,
                        AudiencePreferredChannelRule,
                        # ---
                        AudienceCardOrganizationRule,
                        AudienceMailGroupRule,
                        AudienceCustomerTypeRule,
                        AudienceSpecialCardRule,
                        AudienceStaffCardRule,
                        AudienceAchievedRule,
                        # ---
                        AudienceAverageTransactionValueRule,
                        AudienceTotalTransactionValueRule,
                        AudienceFirstTransactionDateRule,
                        AudienceLastTransactionDateRule,
                        AudienceTopPurchasedBrandGroupRule,
                        AudienceTopPurchasedCategoryRule,
                        AudienceOpenedEmailRule,
                        AudienceClickedEmailRule,
                        AudienceWholesalerRule,
                        AudienceEmailSubscriberRule,
                        AudienceJoinDateRule,
                    ]
                ),
            ),
            "size": numbers.integer_number(0, 1000),
            "estimation_state": EstimationState.Avaliable,
        }
        for _ in range(count)
    ]
    audience_segments_df = DataFrame.from_records(audience_segments)
    audience_segments_df.to_sql(
        "audience_segment", con=sync_engine, if_exists="append", index=False, chunksize=100_000
    )

    return audience_segments_df


def generate_product_segments(*, count: int):
    product_segments = [
        {
            "id": str(uuid4()),
            "name": "-".join(text.words()),
            "filters": json.dumps(
                generate_rule_group(
                    [
                        ProductDepartmentRule,
                        # ProductSubdepartmentRule,
                        ProductCategoryRule,
                        # ProductSubcategoryRule,
                        ProductBandStyleRule,
                        #ProductBandRule,
                        ProductSkuRule,
                        ProductPriceRule,
                        ProductDiscountPercentageRule,
                        ProductSeasonRule,
                        ProductStartDateRule,
                        ProductExclusiveFlagRule,
                    ]
                )
            ),
            "size": numbers.integer_number(0, 1000),
            "estimation_state": EstimationState.Avaliable,
        }
        for _ in range(count)
    ]
    product_segments_df = DataFrame.from_records(product_segments)
    product_segments_df.to_sql(
        "product_segment", con=sync_engine, if_exists="append", index=False, chunksize=100_000
    )

    return product_segments_df


def generate_campaigns(*, count: int, user: dict):
    campaigns = [
        {
            "id": str(uuid4()),
            "name": "-".join(text.words()),
            "type": choice(list(CampaignType)),
            "state": CampaignState.Drafted,
            "creator": json.dumps(user),
        }
        for _ in range(count)
    ]
    campaigns_df = DataFrame.from_records(campaigns)
    campaigns_df.to_sql(
        "campaign", con=sync_engine, if_exists="append", index=False, chunksize=100_000
    )

    return campaigns_df


def generate_versions(
    *,
    count: int,
    campaign_ids: List[str],
    audience_segment_ids: List[str],
    product_segment_ids: List[str],
):
    versions = [
        {
            "id": str(uuid4()),
            "name": "-".join(text.words()),
            "type": choice(list(VersionType)),
            "state": VersionState.Drafted,
            "audience_size": numbers.integer_number(0, 1000),
            "product_size": numbers.integer_number(0, 200),
            "schedule_at": dt.datetime(2021, 2022),
            "campaign_id": choice(campaign_ids),
        }
        for _ in range(count)
    ]
    versions_df = DataFrame.from_records(versions)
    version_ids = versions_df["id"].tolist()

    version_audience_segments = [
        {
            "version_id": i,
            "audience_segment_id": j,
        }
        for i in version_ids
        for j in sample(audience_segment_ids, numbers.integer_number(1, 2))
    ]
    version_audience_segments_df = DataFrame.from_records(version_audience_segments)

    version_product_segments = [
        {
            "version_id": i,
            "product_segment_id": j,
        }
        for i in version_ids
        for j in sample(product_segment_ids, numbers.integer_number(1, 2))
    ]
    version_product_segments_df = DataFrame.from_records(version_product_segments)

    versions_df.to_sql(
        "version", con=sync_engine, if_exists="append", index=False, chunksize=100_000
    )
    version_product_segments_df.to_sql(
        "versionproductsegmentlink",
        con=sync_engine,
        if_exists="append",
        index=False,
        chunksize=100_000,
    )
    version_audience_segments_df.to_sql(
        "versionaudiencesegmentlink",
        con=sync_engine,
        if_exists="append",
        index=False,
        chunksize=100_000,
    )

    return versions_df


@app.command()
def seed(*, count: int = 100):
    start = time()

    user = generate_user()
    audience_segments_df = generate_audience_segments(count=count)
    audience_segment_ids = audience_segments_df["id"].tolist()

    product_segments_df = generate_product_segments(count=count)
    product_segment_ids = product_segments_df["id"].tolist()

    campaigns_df = generate_campaigns(count=count, user=user)
    campaign_ids = campaigns_df["id"].tolist()

    versions_df = generate_versions(
        count=count * 2,
        campaign_ids=campaign_ids,
        audience_segment_ids=audience_segment_ids,
        product_segment_ids=product_segment_ids,
    )

    typer.echo(f"seeding success in {time() - start}s.")


@app.command()
def migrate(*, drop_existing: bool = False):
    sync_engine.execute(sa_text('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'))

    if drop_existing:
        typer.echo("Dropping table")
        CommonModel.metadata.drop_all(sync_engine)

    typer.echo("Creating table")
    CommonModel.metadata.create_all(sync_engine)

    typer.echo(f"migration done")


if __name__ == "__main__":
    app()
