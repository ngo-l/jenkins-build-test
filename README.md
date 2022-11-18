[![Build Status](http://jenkins.betalabs.ai/buildStatus/icon?job=stg-cdxp-api.betalabs.ai&subject=Jenkins%20staging%20Build)](http://jenkins.betalabs.ai/view/Project/job/stg-cdxp-api.betalabs.ai/)

[![Build Status](http://jenkins.betalabs.ai/buildStatus/icon?job=cdxp-api.betalabs.ai&subject=Jenkins%20Production%20Build)](http://jenkins.betalabs.ai/view/Project/job/cdxp-api.betalabs.ai/)

# CDXP-CAMPAIGN-SERVICE

## Prerequisites

1. SOPS
1. Python 3.10+
1. Poetry
1. **Beta Labs VNet Hub**

## Getting started (development)

1. decrypt .staging.enc.env by SOPS
1. docker compose up -d
1. `poetry install`
1. `poetry run uvicorn cdxp_api.app:app --reload`

### Connecting to staging

use staging database for integration, instead of using local docker database

1. connect Beta Labs VNet Hub
1. make sure the env is connecting to a valid DB (RND DB needs to be 13.0.0.49 in this stage)

### docker compose - Postgresql

if database is not created in docker compose, `docker volume prune` might be used to recreeate the container with env settings

## Emarsys

This service is tightly coupled with Emarsys API for sending email via the external events at this point
Emarsys Campaign (email template) is mapped by the automation program setting in Emarsys Portal
please refer to the [Eamrsys API](https://dev.emarsys.com/docs/emarsys-api/b3A6MjQ4OTk4MzU-launch-an-email-campaign) for API inetgration

The service should also decouple with Emarsys ASAP

### Testing

Please use event ID 3120 to send testing emails

## System Integration Flow
