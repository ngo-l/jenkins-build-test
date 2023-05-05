[![Build Status](http://jenkins.betalabs.ai/buildStatus/icon?job=stg-sa-dashboard-graphql&subject=Jenkins%20staging%20Build)](http://jenkins.betalabs.ai/blue/organizations/jenkins/stg-sa-dashboard-graphql/activity)

[![Build Status](http://jenkins.betalabs.ai/buildStatus/icon?job=sa-dashboard-graphql&subject=Jenkins%20production%20Build)](http://jenkins.betalabs.ai/blue/organizations/jenkins/sa-dashboard-graphql/activity)

# **sa-dashboard-graphql (WIP)**

## **Description**

a GraphQL endpoint that provides queries to the Elsie Production Database

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


## **Up and Running Locally**

1. decrypt the secrets with sops
    ```bash
    $ sops -d ./config/secrets.enc.env > ./config/secrets.env
    ```

2. run the application in the development environment
    ```bash 
    $ sls offline -s development
    ```

3. visit http://localhost:7071/api/graphql in your browser and you should see the GraphQL playground:

## **GraphQL Queries**
Since this repository simply reads data from the database, it only involves GraphQL queries. To make a GraphQL query, you can input the query on the left hand side of the playground:
```graphql 
    $ query {
        hellowWorld
    }
```

1. **helloWorld**</br>
this query returns a string like this:
   ```json 
   {
    "data": {
        "helloWorld": "Hello World, the current mysql database version=5.7.29-0ubuntu0.18.04.1"
        }
    }
    ```

`5.7.29-0ubuntu0.18.04.1` is the mysql version of the Elsie production database, which has been retrieved by querying the database with the SQL statement: `SELECT VERSION();`

2. **goodBye**</br>
this query returns a string like this:
   ```json 
   {
    "data": {
         "goodBye": "Good Bye!"
        }
    }
    ```
