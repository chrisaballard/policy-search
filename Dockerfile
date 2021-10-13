# Dockerfile for python REST api
FROM python:3.8

ARG api_port=8001
ARG api_host=0.0.0.0
ARG aws_access_key_id
ARG aws_secret_access_key
ARG dynamodb_host
ARG dynamodb_port

ENV api_host=${api_host}
ENV api_port=${api_port}
ENV AWS_ACCESS_KEY_ID=${aws_access_key_id}
ENV AWS_SECRET_ACCESS_KEY=${aws_secret_access_key}
ENV dynamodb_host=${dynamodb_host}
ENV dynamodb_port=${dynamodb_port}
ENV AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}

WORKDIR /usr/src/app

RUN pip install "poetry==1.1.8"

COPY . ./

RUN poetry config virtualenvs.create false
RUN poetry install
RUN poetry run python -m spacy download en_core_web_sm
RUN poetry run pre-commit install --install-hooks

# Make sure script has execute permissions
RUN chmod +x ./scripts/start_api.sh

CMD ["./scripts/start_api.sh"]