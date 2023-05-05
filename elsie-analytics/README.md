<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

[![Build Status](http://jenkins.betalabs.ai/buildStatus/icon?job=stg-elsie-analytics&subject=Jenkins%20staging%20Build)](http://jenkins.betalabs.ai/blue/organizations/jenkins/stg-elsie-analytics/activity)

[![Build Status](http://jenkins.betalabs.ai/buildStatus/icon?job=elsie-analytics&subject=Jenkins%20production%20Build)](http://jenkins.betalabs.ai/blue/organizations/jenkins/elsie-analytics/activity)


## Description

This sub-repository contains a GraphQL endpoint that provides analytic data of Elsie SA Dashboard

## Prerequisite
- node >= v16.17.0
- yarn = v1.22.19
- Docker = v20.10.17
- Docker Compose = v2.10.2

## Installation

```bash
$ yarn 
```

## Running the app 

```bash
# decrypt the secrets in the environment you intend to use
$ sops -d ./config/{STAGE}/secrets.enc.env > ./config/{STAGE}/secrets.env
```

```bash
# development
$ docker compose up -d --build

# staging 
$ docker compose -f docker-compose.stag.yml up -d --build

# production
$ docker compose -f docker-compose.prod.yml up -d --build
```

## Test

```bash
# unit tests
$ yarn test

# test coverage
$ yarn test:cov
```

## Healthcheck

1. visit `/health`
2. should return the following:
```bash
$   { 
        "status": "ok", 
        "statusCode": 200, 
        "message": "successfully connected to the database"
    }
```

## GraphQL Playground
1. visit `/graphql`
2. shoud see the playground with `DOCS` and `SCHEMA` tabs on the right side
