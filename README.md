# lcjg-reminder-service

microservice to serve reminders for LCJG customers

## Getting Started

1. decrypt by SOPS: `sops -d conf/encrypted/.development.enc.env > conf/.development.env `
1. `poetry install`
1. `docker compose up -d` (blob storage was not configured, please create blob containers and files for your own use)
1. `poetry run python3 -m src.main`

### SOPS

Credentials/Environment variables are encrypted via SOPS by the key `CDXP Shared SOPS private key` in 1Password

### Docker Compose

docker compose is used to build local development env

## Business Modules

### Abandoned Cart

### Wish list

## Emarsys integration

Username and token obtained from 1Password, `LC Emarsys API`
