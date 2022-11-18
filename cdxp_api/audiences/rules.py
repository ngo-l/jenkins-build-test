from datetime import date
from typing import Any, List, Literal, Set, TypeAlias, Union

from pydantic import conint
from pydantic.types import PositiveFloat

from .._shared.utils import APIModel
from ..products.product_tree_data import ProductBrandGroup, ProductCategory

# PLEASE REFER TO https://lcjg-betalabs.atlassian.net/wiki/spaces/BETTA/pages/2194047014/BETTA+-+Formula+Builder+-+Attribute+Mapping

# Base
Level: TypeAlias = conint(ge=1, le=4)
Conjunction: TypeAlias = Literal["and", "or"]
EnumOperator: TypeAlias = Literal["in"]
# BooleanOperator: TypeAlias = Literal["is"]
NumericOperator: TypeAlias = Literal[
    "equals",
    "does_not_equal",
    "less_than",
    "greater_than_or_equal_to",
    "less_than_or_equal_to",
    "greater_than",
]
# DateOperator: TypeAlias = Literal["equals", "before", "after", "on_or_after", "on_or_before"]


class BaseRuleModel(APIModel):
    id: str
    type: Literal["rule"]
    field: str
    operator: str
    value: Any


class BaseRuleGroupModel(APIModel):
    id: str
    type: Literal["group"]
    level: Level
    conjunction: Conjunction
    rules: list[Any]


# Audience Profile Field
class AudienceGenderRule(BaseRuleModel):
    field: Literal["gender"]
    operator: EnumOperator
    value: Set[Literal["Female", "Male", "Unspecified"]]


class AudienceNationalityRule(BaseRuleModel):
    field: Literal["nationality"]
    operator: EnumOperator
    value: Set[Literal["HKC", "HKL", "NA", "ML", "ROW"]]


class AudienceCardTypeRule(BaseRuleModel):
    field: Literal["card_tier"]
    operator: EnumOperator
    value: Set[Literal["Beauty+", "Diamond", "Gold", "Platinum", "Privilege"]]


class AudiencePreferredChannelRule(BaseRuleModel):
    field: Literal["preferred_channel"]
    operator: EnumOperator
    value: Set[Literal["SMS", "Email", "Direct Mail", "Phone Call", "WeChat"]]


AudienceProfileRule: TypeAlias = Union[
    AudienceGenderRule,
    AudienceNationalityRule,
    AudienceCardTypeRule,
    AudiencePreferredChannelRule,
]


# Audience Extra Field
class AudienceCardOrganizationRule(BaseRuleModel):
    field: Literal["card_organization"]
    operator: Literal[
        "in",
        # not_in is not supported by data scientists' works
        #  "not_in"
    ]
    value: Set[Literal["Lane Crawford Hong Kong", "Lane Crawford Beijing"]]


class AudienceMailGroupRule(BaseRuleModel):
    field: Literal["mail_group"]
    operator: EnumOperator
    value: Set[Literal["HK", "SHG", "BJ", "CD"]]


class AudienceCustomerTypeRule(BaseRuleModel):
    field: Literal["customer_type"]
    operator: EnumOperator
    value: Set[Literal["China", "Hong Kong", "Overseas", "Unspecified"]]


# class AudienceSpecialCardRule(BaseRuleModel):
#     field: Literal["is_special_card"]
#     operator: BooleanOperator
#     value: bool


# class AudienceStaffCardRule(BaseRuleModel):
#     field: Literal["is_staff_card"]
#     operator: BooleanOperator
#     value: bool


# class AudienceAchievedRule(BaseRuleModel):
#     field: Literal["is_achieved"]
#     operator: BooleanOperator
#     value: bool


AudienceExtraRule: TypeAlias = Union[
    AudienceCardOrganizationRule,
    AudienceMailGroupRule,
    AudienceCustomerTypeRule,
    # AudienceSpecialCardRule,
    # AudienceStaffCardRule,
    # AudienceAchievedRule,
]


# Audience Behavioral Field
DepartmentRegionStorePeriodAggregation: TypeAlias = Literal[
    "AllDepts_CN:IFS_P12M",
    "AllDepts_CN:IFS_P13-24M",
    "AllDepts_CN:SP_P12M",
    "AllDepts_CN:SP_P13-24M",
    "AllDepts_CN:SHTSQ_P12M",
    "AllDepts_CN:SHTSQ_P13-24M",
    "AllDepts_CN:WEB_P12M",
    "AllDepts_CN:WEB_P13-24M",
    "AllDepts_CN:YTC_P12M",
    "AllDepts_CN:YTC_P13-24M",
    "AllDepts_HK:CR_P12M",
    "AllDepts_HK:CR_P13-24M",
    "AllDepts_HK:IFC_P12M",
    "AllDepts_HK:IFC_P13-24M",
    "AllDepts_HK:PP_P12M",
    "AllDepts_HK:PP_P13-24M",
    "AllDepts_HK:TSQ_P12M",
    "AllDepts_HK:TSQ_P13-24M",
    "AllDepts_AllRegions_P12M",
    "AllDepts_AllRegions_P13-24M",
    "AllDepts_CN_P12M",
    "AllDepts_CN_P13-24M",
    "AllDepts_HK_P12M",
    "AllDepts_HK_P13-24M",
    "AllDepts_ROW_P12M",
    "AllDepts_ROW_P13-24M",
    "COS_AllRegions_P12M",
    "COS_AllRegions_P13-24M",
    "COS_CN_P12M",
    "COS_CN_P13-24M",
    "COS_HK_P12M",
    "COS_HK_P13-24M",
    "COS_ROW_P12M",
    "COS_ROW_P13-24M",
    "HL_AllRegions_P12M",
    "HL_AllRegions_P13-24M",
    "HL_CN_P12M",
    "HL_CN_P13-24M",
    "HL_HK_P12M",
    "HL_HK_P13-24M",
    "HL_ROW_P12M",
    "HL_ROW_P13-24M",
    "JWY_AllRegions_P12M",
    "JWY_AllRegions_P13-24M",
    "JWY_CN_P12M",
    "JWY_CN_P13-24M",
    "JWY_HK_P12M",
    "JWY_HK_P13-24M",
    "JWY_ROW_P12M",
    "JWY_ROW_P13-24M",
    "KIDS_AllRegions_P12M",
    "KIDS_AllRegions_P13-24M",
    "KIDS_CN_P12M",
    "KIDS_CN_P13-24M",
    "KIDS_HK_P12M",
    "KIDS_HK_P13-24M",
    "KIDS_ROW_P12M",
    "KIDS_ROW_P13-24M",
    "LSA_AllRegions_P12M",
    "LSA_AllRegions_P13-24M",
    "LSA_CN_P12M",
    "LSA_CN_P13-24M",
    "LSA_HK_P12M",
    "LSA_HK_P13-24M",
    "LSA_ROW_P12M",
    "LSA_ROW_P13-24M",
    "MSA_AllRegions_P12M",
    "MSA_AllRegions_P13-24M",
    "MSA_CN_P12M",
    "MSA_CN_P13-24M",
    "MSA_HK_P12M",
    "MSA_HK_P13-24M",
    "MSA_ROW_P12M",
    "MSA_ROW_P13-24M",
    "MW_AllRegions_P12M",
    "MW_AllRegions_P13-24M",
    "MW_CN_P12M",
    "MW_CN_P13-24M",
    "MW_HK_P12M",
    "MW_HK_P13-24M",
    "MW_ROW_P12M",
    "MW_ROW_P13-24M",
    "WW_AllRegions_P12M",
    "WW_AllRegions_P13-24M",
    "WW_CN_P12M",
    "WW_CN_P13-24M",
    "WW_HK_P12M",
    "WW_HK_P13-24M",
    "WW_ROW_P12M",
    "WW_ROW_P13-24M",
]


class AudienceAverageTransactionValueRule(BaseRuleModel):
    field: Literal["average_transaction_value"]
    group_by: DepartmentRegionStorePeriodAggregation
    operator: NumericOperator
    value: PositiveFloat


class AudienceTotalTransactionValueRule(BaseRuleModel):
    field: Literal["total_transaction_value"]
    group_by: DepartmentRegionStorePeriodAggregation
    operator: NumericOperator
    value: PositiveFloat


class AudienceNumberOfTransactionRule(BaseRuleModel):
    field: Literal["number_of_transaction"]
    group_by: DepartmentRegionStorePeriodAggregation
    operator: NumericOperator
    value: int


DepartmentRegionAggregation: TypeAlias = Literal[
    "AllDepts_ROW",
    "COS_AllRegions",
    "COS_CN",
    "COS_HK",
    "COS_ROW",
    "HL_AllRegions",
    "HL_CN",
    "HL_HK",
    "HL_ROW",
    "JWY_AllRegions",
    "JWY_CN",
    "JWY_HK",
    "JWY_ROW",
    "KIDS_AllRegions",
    "KIDS_CN",
    "KIDS_HK",
    "KIDS_ROW",
    "LSA_AllRegions",
    "LSA_CN",
    "LSA_HK",
    "LSA_ROW",
    "MSA_AllRegions",
    "MSA_CN",
    "MSA_HK",
    "MSA_ROW",
    "MW_AllRegions",
    "MW_CN",
    "MW_HK",
    "MW_ROW",
    "WW_AllRegions",
    "WW_CN",
    "WW_HK",
    "WW_ROW",
]


# class AudienceFirstTransactionDateRule(BaseRuleModel):
#     field: Literal["first_transaction_date"]
#     group_by: DepartmentRegionAggregation
#     operator: DateOperator
#     value: date


# class AudienceLastTransactionDateRule(BaseRuleModel):
#     field: Literal["last_transaction_date"]
#     group_by: DepartmentRegionAggregation
#     operator: DateOperator
#     value: date


# TopBrandsDepartmentsAggregation: TypeAlias = Literal[
#     "Top1_AllDepts_AllRegions_P12M",
#     "Top2_AllDepts_AllRegions_P12M",
#     "Top3_AllDepts_AllRegions_P12M",
#     "Top1_COS_AllRegions_P12M",
#     "Top2_COS_AllRegions_P12M",
#     "Top3_COS_AllRegions_P12M",
#     "Top1_HL_AllRegions_P12M",
#     "Top2_HL_AllRegions_P12M",
#     "Top3_HL_AllRegions_P12M",
#     "Top1_JWY_AllRegions_P12M",
#     "Top2_JWY_AllRegions_P12M",
#     "Top3_JWY_AllRegions_P12M",
#     "Top1_KIDS_AllRegions_P12M",
#     "Top2_KIDS_AllRegions_P12M",
#     "Top3_KIDS_AllRegions_P12M",
#     "Top1_LSA_AllRegions_P12M",
#     "Top2_LSA_AllRegions_P12M",
#     "Top3_LSA_AllRegions_P12M",
#     "Top1_MSA_AllRegions_P12M",
#     "Top2_MSA_AllRegions_P12M",
#     "Top3_MSA_AllRegions_P12M",
#     "Top1_MW_AllRegions_P12M",
#     "Top2_MW_AllRegions_P12M",
#     "Top3_MW_AllRegions_P12M",
#     "Top1_WW_AllRegions_P12M",
#     "Top2_WW_AllRegions_P12M",
#     "Top3_WW_AllRegions_P12M",
# ]


# class AudienceTopPurchasedBrandGroupRule(BaseRuleModel):
#     field: Literal["top_purchased_brand_style"]
#     group_by: TopBrandsDepartmentsAggregation
#     operator: EnumOperator
#     value: Set[ProductBrandGroup]


# class AudienceTopPurchasedCategoryRule(BaseRuleModel):
#     field: Literal["top_purchased_category"]
#     group_by: TopBrandsDepartmentsAggregation
#     operator: EnumOperator
#     value: Set[ProductCategory]


EmailAggregation: TypeAlias = Literal[
    "AnyEmail_P1M",
    "AnyEmail_P6M",
    "AnyEmail_P12M",
    "PromotionalEmail_P1M",
    "PromotionalEmail_P6M",
    "PromotionalEmail_P12M",
    "SystemEmail_P1M",
    "SystemEmail_P6M",
    "SystemEmail_P12M",
]


# class AudienceOpenedEmailRule(BaseRuleModel):
#     field: Literal["opened_email"]
#     group_by: EmailAggregation
#     operator: BooleanOperator
#     value: bool


# class AudienceClickedEmailRule(BaseRuleModel):
#     field: Literal["clicked_email"]
#     group_by: EmailAggregation
#     operator: BooleanOperator
#     value: bool


# class AudienceWholesalerRule(BaseRuleModel):
#     field: Literal["wholesaler"]
#     operator: BooleanOperator
#     value: bool


# class AudienceEmailSubscriberRule(BaseRuleModel):
#     field: Literal["email_subscriber"]
#     operator: BooleanOperator
#     value: bool


# class AudienceJoinDateRule(BaseRuleModel):
#     field: Literal["join_date"]
#     operator: DateOperator
#     value: date


AudienceBehavioralRule: TypeAlias = Union[
    # Transaction Value Related
    AudienceAverageTransactionValueRule,
    AudienceTotalTransactionValueRule,
    AudienceNumberOfTransactionRule,
    # Transaction Date Related
    # AudienceFirstTransactionDateRule,
    # AudienceLastTransactionDateRule,
    # Top Brand Related
    # AudienceTopPurchasedBrandGroupRule,
    # AudienceTopPurchasedCategoryRule,
    # Email Related
    # AudienceOpenedEmailRule,
    # AudienceClickedEmailRule,
    # Membership Related
    # AudienceWholesalerRule,
    # AudienceEmailSubscriberRule,
    # AudienceJoinDateRule,
]

AudienceRule: TypeAlias = Union[AudienceProfileRule, AudienceExtraRule, AudienceBehavioralRule]


class AudienceRuleGroup(BaseRuleGroupModel):
    rules: List[Union[AudienceRule, "AudienceRuleGroup"]]


AudienceRuleGroup.update_forward_refs()
