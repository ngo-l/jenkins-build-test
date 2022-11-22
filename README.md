# lcjg-reminder-service
[![Build Status](http://jenkins.betalabs.ai/buildStatus/icon?job=stg-lcjg-reminder-service&subject=Jenkins%20staging%20Build)](http://jenkins.betalabs.ai/view/Project/job/stg-lcjg-reminder-service/)

[![Build Status](http://jenkins.betalabs.ai/buildStatus/icon?job=lcjg-reminder-service&subject=Jenkins%20Production%20Build)](http://jenkins.betalabs.ai/view/Project/job/lcjg-reminder-service/)

microservice to serve reminders for LCJG customers

## Caveats

- all times are aligned to the UTC time, including cron job, please keep the alignment

## Getting Started

1. decrypt by SOPS: `sops -d conf/encrypted/.development.enc.env > conf/.development.env`
1. `poetry install`
1. `docker compose up -d` (blob storage was not configured, please create blob containers and files for your own use)
1. `poetry run python3 -m src.main`

### SOPS

Secrets are encrypted via SOPS by the key `CDXP Shared SOPS private key` in 1Password

The secrets are placed in `conf/secrets` folder, and loaded by secrets_utils in `src/_shared`

Please read ALL credentials from the same secrets file, **extra files/changes will need to request devops to change deployment setups**

### Docker Compose

docker compose is used to build local development env

Azurite is included to simulate use of blob storage

## Admin functions

Swagger document can be found at

`http(s)://{host}/docs`

HTTP Basic Authentication is applied

## Emarsys integration

The service sends email via Emarsys external event

Username and token obtained from 1Password, `LC Emarsys API`

## Abandoned Cart Reminder

1. The service reads labelled data from blob storage named "databricksshare" (path may vary, please find from env file)
1. external event triggers are created in chunks (common limit of communincation services including Emarsys is 1000 recipients per request)
1. result is written to processed folder suffixed by timestamp and chunk number

