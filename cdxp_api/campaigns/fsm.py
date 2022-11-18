from cdxp_api.database.schemas import Campaign, CampaignState
from transitions import Machine

transitions = [
    {"trigger": "test_started", "source": CampaignState.Drafted, "dest": CampaignState.Testing},
    {"trigger": "test_completed", "source": CampaignState.Testing, "dest": CampaignState.Tested},
    {"trigger": "launched", "source": CampaignState.Tested, "dest": CampaignState.Launched},
    {"trigger": "errored", "source": CampaignState.Testing, "dest": CampaignState.Error},
]

campaign_state_machine = Machine(
    model=Campaign,
    states=[s.value for s in CampaignState],
    transitions=transitions,
    initial=CampaignState.Drafted,
)
