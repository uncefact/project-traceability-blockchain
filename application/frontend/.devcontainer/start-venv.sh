#!/bin/sh

# Remove any potential cached file
rm -rf /frontend/node_modules || true
rm -rf /frontend/clients || true
rm -rf /frontend/api-docs.json || true
rm -rf /frontend/openapitools.json || true

# Generate client
OPEN_API_GENERATOR_VERSION="5.3.1"
curl -o /frontend/api-docs.json http://host.docker.internal:8080/api/v3/api-docs
curl -o /frontend/openapi-generator-cli.jar https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/$OPEN_API_GENERATOR_VERSION/openapi-generator-cli-$OPEN_API_GENERATOR_VERSION.jar
java -jar openapi-generator-cli.jar generate -i /frontend/api-docs.json -g typescript-fetch -c /frontend/.devcontainer/config-openapi.json -o /frontend/clients/unece-cotton-fetch --skip-validate-spec
# npx @openapitools/openapi-generator-cli generate -i /frontend/api-docs.json -g typescript-fetch -c /frontend/.devcontainer/config-openapi.json -o /frontend/clients/unece-cotton-fetch --skip-validate-spec
rm openapi-generator-cli.jar

cd /frontend/clients/unece-cotton-fetch && npm install && npm run build && cd /frontend/ # build the depency

npm install
