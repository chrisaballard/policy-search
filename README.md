# Climate Policy Radar: Policy Search

## Setting up development environment

### Create environment file

1. Create a `.env` environment file in the root directory of this repository
2. Add the following environment variables to this file:

```
AWS_ACCESS_KEY_ID=[AWS_ACCESS_KEY_ID]
AWS_SECRET_ACCESS_KEY=[AWS_SECRET_ACCESS_KEY]
AWS_DEFAULT_REGION=eu-west-2
dynamodb_host=db
dynamodb_port=8000
elasticsearch_cluster=elasticsearch:9200
elasticsearch_user=elastic
elasticsearch_password=[ES_PASSWORD]
```

where: `[AWS_ACCESS_KEY_ID]` and `[AWS_SECRET_ACCESS_KEY]` are the access keys that you have been provided with.

### Create policy corpus locally

1. Create a data directory in the root of this repository: `mkdir data`
2. Copy the corpus dataset into this directory

### Bring up docker containers

Use docker-compose to bring up the containers:

`docker-compose up`

Confirm the containers are running by executing `docker-compose ps`. If the containers are running ok, you should see something similar to:

```
     Name                   Command               State                    Ports
--------------------------------------------------------------------------------------------------
cpr-policy-api   ./scripts/start_api.sh           Up      0.0.0.0:8001->8001/tcp,:::8001->8001/tcp
dynamodb-local   java -jar DynamoDBLocal.ja ...   Up      0.0.0.0:8000->8000/tcp,:::8000->8000/tcp
```

### Load policy corpus into dynamodb

Execute the following command from the host machine:

```
docker exec cpr-policy-api poetry run python cli.py load /usr/src/app/data/corpus /usr/src/app/data/corpus/processed_policies.csv
```

This will create a table called `Policies` in dynamodb.

## Accessing the policy search service

### Endpoint location

You may access the policy search service from the following URL

`http://localhost:8001`

### Swagger API docs

Swagger docs for the API can be accessed from the host machine at the following url:

`http://localhost:8001/docs`

The swagger UI may be used to test the API and view the API schema

### Testing the API

To verify that the API is functional, execute the following in a terminal on the host:

`curl "http://localhost:8001/policies/?limit=10"`

## Stopping search service docker containers

If you need to stop the policy search service and database, execute the following command in a terminal on the host:

`docker-compose stop`

## Running the front end

The front end is not yet set up to run inside the container. So to view it, in your terminal, cd inside the 'app' directory and run the following commands:

`npm install`

`npm run dev`

Then you will be able to open it in your browser at:

`http://localhost:3001`
