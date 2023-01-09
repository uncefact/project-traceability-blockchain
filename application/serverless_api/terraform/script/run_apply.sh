#!/bin/bash

TERRAFORM_FOLDER="$PWD"

if [ ${TERRAFORM_FOLDER##*/} == "terraform" ]; then
  NODE_JS_FUNCTIONS_RELATIVE_PATH="../cloud_functions/nodejs"
  # in order to lighten the weight of the cloud functions to upload on bucket
  cd "$NODE_JS_FUNCTIONS_RELATIVE_PATH"
  rm -r node_modules coverage ts-built

  cd "$TERRAFORM_FOLDER"
  terraform init
  terraform apply -auto-approve

  cd "$NODE_JS_FUNCTIONS_RELATIVE_PATH"
  npm install
else
  printf "ERROR:: You have called the script from a directory different than the Terraform root folder!\n"
fi