#!/bin/bash

poetry run uvicorn api:app --host $api_host --port $api_port
