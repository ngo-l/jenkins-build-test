[![Build Status](http://jenkins.betalabs.ai/buildStatus/icon?job=stg-elsie-extensions&subject=Jenkins%20staging%20Build)](http://jenkins.betalabs.ai/blue/organizations/jenkins/stg-elsie-extensions/activity)

# update-clientele-list

## **Description**

4 serverless functions that truncate and update the tables in Elsie Database

## **Tech Stack**

1. Typescript
2. Serverless Framework
3. Azure Functions
4. GraphQL Apollo Server


## **Prerequisites**

1. node v14.21.1
2. npm v6.14.17
3. yarn v1.22.19
4. serverless v3.22

## **Installation**

1. Serverless Framework: `npm i -g serverless@3.22.0`
2. Dependencies: `yarn`

## Dump and Restore Database

To try out the function without affecting the data in production environment, you should `source $(brew --prefix nvm)/nvm.sh`
 [dump the data](https://lcjg-betalabs.atlassian.net/wiki/spaces/E/pages/2430697929/How+to+dump+the+elsie+production+database+and+restore+it+locally) of the following tables:

- STAFF_CUSTOMERS
- MANAGERS
- STOREMANAGERS
- STOREMANAGER_MANAGER_MAPPING
- SUPERVISORS
- SUPERVISOR_STAFF_MAPPING
- MANAGER_SUPERVISOR_MAPPING

To restore the data, you need to have a mysql server which can be built with docker the following script:-

`docker run -itd --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=12346 mysql`

## **Up and Running Locally**

1. decrypt the secrets with sops
    ```bash
    $ sops -d ./config/{env}/secrets.enc.env > ./config/{env}/secrets.env
    ```

2. run the application in the development environment
    ```bash 
    $ yarn start:dev
    ```

3. ensure that your xlsx file should only have one sheet with the following fields (in the exactly similar format):

- CUSTOMER_VIP_NO
- STAFF_ID
- STATUS
- SUPERVISOR_STAFF_ID
- SUPERVISOR_NAME
- MANAGER_STAFF_ID
- MANAGER_NAME
- STOREMANAGER_STAFF_ID
- STOREMANAGER_NAME
- CUSTOMER_TYPE

4. open the openapi.yml with an editor (eg. https://editor.swagger.io)

## **Unit Testing**

1. run the unit tests
    ```bash
    $ yarn test
    ```

2. run the unit tests with a code coverage report
    ```bash 
    $ yarn test:cov
    ```
