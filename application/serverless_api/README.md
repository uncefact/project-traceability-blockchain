# UNECE BC Pilot Tracking - blockchain serverless API 

Serverless APIs have been created that are able to write, read and update the following entities on chains:
- materials
- trades
- transformations
- standard events: description at link https://jargon.sh/redoc.html?url=/user/unece/traceabilityEvents/v/working/artefacts/openapi/render.json.  
  3 events are managed:
    - ObjectEvent
    - TransactionEvent
    - TransformationEvent

It is not necessary to have an always-on server, but it is sufficient to call the API rest via the url in the format https://[api_gateway_url]/api/[path] to start a specific cloud function that will respond to the request and then shut down.  
Each endpoint has a GET, POST and PUT version which handles respectively read, write and update operations.

## Before starting the dev-container (first boot)
You need to place a few credential files.
1. [Create a pernsonal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#create-a-personal-access-token) to access the Package registry (you need the `read_registry` scope). Save it to `/unece-cotton/cloud_functions/credentials/gitlab_read_token` . The aforementioned token will be used to install the package.
2. Add the GCP manager service account key to manage the cluster and place in the following file: `./terraform/credentials/unece-gcp-manager.json`.  
   It needs the following roles:
    - ApiGateway Admin
    - Cloud Functions Admin
    - Secret Manager Admin
    - Security Admin
    - Service Account Admin
    - Service Account User
    - Storage Admin
3. Add the GCP authentication manager service account key and place in the following file: `./cloud_functions/python/login/credentials/unece-auth-manager.json`. It is used to sign the JWT token used to handle the authentication. It needs the following roles:
    - Security Admin
    - Service Account Token Creator

The other service accounts will be created and managed directly via Terraform configuration.

## Cloud function NodeJs
There is a need of a '.npmrc' file beside the package.json one in the nodejs root folder so as to be able to download the blockchain library by using `npm install` command.

## Terraform

In order to upload the infrastructure on Google Cloud using terraform you have to call 'run_apply.sh'
```bash
cd terraform
./script/run_apply.sh
```

Some useful command to get started with Terraform.

```bash
# Initialize
terraform init

# Create execution plan (dry run)
terraform plan

# Deploy
terraform apply

# Destroy
terraform destroy

# View deployed stuff
terraform state list

# Taint something (mark for destruction on next apply)
terraform taint <name-of-the-service>
```

### Make requests to test the endpoints with curl

```bash
curl -X POST "https://api-gateway-8ot0fprs.ew.gateway.dev/api/login" -H 'Content-Type: application/json' -d '{"username": "i.tonelli","password": "user"}'

curl -X GET "https://api-gateway-8ot0fprs.ew.gateway.dev/api/hello-world" -H "Accept: application/json" -H "Authorization: Bearer <token>"
```

### Make requests to test the endpoint with Thunder Client extension 

1. go to Collections section
2. call POST login request (it gets the JWT token as response)
3. go to Env section in the UNECE APIs Environment
4. from 'jwt_token' environment variable extract the payload (from https://jwt.io, it is the value in the middle from the two points) and set it to 'api_gateway_jwt_payload' environment variable
5. call any other pre-defined request

### GCP
To configure GCP, you need to have access to the project https://console.cloud.google.com/home/dashboard?project=adroit-nimbus-275214.

### Find what role grants a permission
To find what role grant a certain permission, check the [IAM permissions reference page](https://cloud.google.com/iam/docs/permissions-reference).