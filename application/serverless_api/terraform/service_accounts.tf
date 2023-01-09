# create the service account that api gateway will use to interact with the cloud functions
resource "google_service_account" "api_gateway_service_account" {
  account_id   = "unece-cf-manager"
  display_name = "unece-cf-manager"
  description  = "Account used by the API Gateway in order to interact with the further Cloud Functions"
}

# assign to the account api_gateway_service_account the required permissions for invoke cloud functions
resource "google_project_iam_member" "cloud_functions_admin" {
  project = var.project_id
  role    = "roles/cloudfunctions.invoker"
  member  = "serviceAccount:${google_service_account.api_gateway_service_account.email}"
}
