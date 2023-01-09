#!/bin/sh
gcloud functions deploy helloWorld \
    --source=cloud_functions \
    --runtime nodejs16 \
    --trigger-http \
    --allow-unauthenticated \
    --service-account unece-cloud-functions-manager@adroit-nimbus-275214.iam.gserviceaccount.com \
    --region europe-west6 \
    --quiet

echo "DONE!"
