#!/bin/sh

GCP_UNECE_PROJECT_ID="adroit-nimbus-275214"

# logs in with the service account
gcloud auth activate-service-account --key-file /unece-cotton/serverless_api/terraform/credentials/unece-gcp-manager.json

# install dependencies
cd /unece-cotton/serverless_api/cloud_functions/nodejs
npm config set @isin-blockchain:registry https://gitlab-core.supsi.ch/api/v4/projects/230/packages/npm/
npm config set -- '//gitlab-core.supsi.ch/api/v4/projects/230/packages/npm/:_authToken' "$(cat /unece-cotton/serverless_api/credentials/gitlab_read_token)"
npm i
