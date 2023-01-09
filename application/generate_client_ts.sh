#!/bin/sh
set -e
echo "1./ Building the backend and generate the API spec"
docker build -t registry.gitlab.com/supsi-dti-isin/unece-cotton/backend:lastbuilt ./backend
echo "1./ Backend built successfully."

echo "2./ Extracting the API spec from the container."
docker cp "$(docker create --rm registry.gitlab.com/supsi-dti-isin/unece-cotton/backend:lastbuilt)":/unece-tracking-openapi.json ./clients/unece-tracking-openapi.json
echo "2./ Extraction successful"

echo "3.1/ Removing any potential old clients in ./clients"
rm -R clients/unece-cotton-fetch || true # Avoid error in case there is nothing to be removed
echo "3.2/ Generating the typescript client"
#docker run --rm -v "${PWD}/clients:/local" openapitools/openapi-generator-cli generate -i /local/unece-tracking-openapi.json -g typescript-fetch -c /local/config.json -o /local/unece-cotton-fetch
npx @openapitools/openapi-generator-cli generate -i ./clients/unece-tracking-openapi.json -g typescript-fetch -c ./clients/config.json -o ./clients/unece-cotton-fetch --skip-validate-spec
#OPEN_API_GENERATOR_VERSION="5.3.1"
#curl -o ./openapi-generator-cli.jar https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/$OPEN_API_GENERATOR_VERSION/#openapi-generator-cli-$OPEN_API_GENERATOR_VERSION.jar
#java -jar openapi-generator-cli.jar generate -i ./clients/unece-tracking-openapi.json -g typescript-fetch -c ./clients/config.json -o ./clients/#unece-cotton-fetch --skip-validate-spec
#rm openapi-generator-cli.jar

echo "3./ Generation completed successfully"

echo "4.1/ Building the client compiler"
docker build -t client_compiler ./clients
echo "4.2/ Cleaning up after compilation. Removing any potential old clients in ./frontend/clients"
rm -R clients/unece-cotton-fetch || true # Avoid error in case there is nothing to be removed
echo "4./ Client compiler compiled successfully"

echo "5.1/ Removing any potential old COMPILED clients in ./frontend-clients"
rm -rf ./frontend/clients
mkdir ./frontend/clients
echo "5.2/ Extracting the compiled client from the dockerized compiler"
docker cp "$(docker create --rm client_compiler)":/app ./frontend/clients/unece-cotton-fetch
echo "5./ Extraction compiled successfully"

echo "6./ Installing @unece/cotton-fetch along with the other dependencies"
(
  cd frontend
  npm i --no-optional
)
echo "6./ Process completed successfully"
