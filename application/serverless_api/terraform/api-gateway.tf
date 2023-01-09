# to find the API gateway url use the command
# gcloud api-gateway gateways describe <gateway-id> --location <region>
# e.g. gcloud api-gateway gateways describe api-gateway --location europe-west1

resource "google_api_gateway_api" "api" {
  provider     = google-beta
  api_id       = "unece-blockchain-api"
  display_name = "UNECE blockchain API"
  project      = var.project_id
}

# An API configuration is defined using an OpenAPI v2.0 model.
# Inside the OpenAPI model, the backend resources are defined
# using the 'x-google-backend' extension. The extension
# will point to the cloud function trigger endpoint and therefore we
# have defined the OpenAPI model ad a template and replace each
# placeholder with the related cloud function trigger endpoint.

############
#  API V2  #
############

resource "google_api_gateway_api_config" "api_config" {

  provider = google-beta
  project  = var.project_id

  depends_on = [google_api_gateway_api.api]

  api = google_api_gateway_api.api.api_id

  api_config_id = "api-config"
  display_name  = "API Config"

  # Tells which service account API Gateway will use to invoke the backend services.
  gateway_config {
    backend_config {
      google_service_account = google_service_account.api_gateway_service_account.email
    }
  }

  # OpenAPI v2.0 specification used to define the API.
  openapi_documents {
    document {
      path = "api-gateway-config.yaml"
      contents = base64encode(
        templatefile(
          "api-gateway-config.yaml", {
            api_gateway = {
              managed_service = google_api_gateway_api.api.managed_service
            }
            cloud_functions_cors = {
              options = module.cors
            },
            cloud_functions_login = {
              post = module.login
            },
            cloud_functions_material = {
              put = module.material_update
              post = module.material_store
              get = module.material_retrieve
            },
            cloud_functions_material_allow_read = {
              post = module.material_allow_read
            },
            cloud_functions_material_retrieve_all = {
              get = module.material_retrieve_all
            },
            cloud_functions_trade = {
              put = module.trade_update
              post = module.trade_store
              get = module.trade_retrieve
            },
            cloud_functions_trade_allow_read = {
              post = module.trade_allow_read
            },
            cloud_functions_trade_retrieve_all = {
              get = module.trade_retrieve_all
            },
            cloud_functions_transformation = {
              put = module.transformation_update
              post = module.transformation_store
              get = module.transformation_retrieve
            },
            cloud_functions_transformation_allow_read = {
              post = module.transformation_allow_read
            },
            cloud_functions_transformation_retrieve_all = {
              get = module.transformation_retrieve_all
            },
            cloud_functions_transformation_event = {
              post = module.transformation_event_store
              put = module.transformation_event_update
              get = module.transformation_event_read
            },
            cloud_functions_object_event = {
              post = module.object_event_store
              put = module.object_event_update
              get = module.object_event_read
            },
            cloud_functions_transaction_event = {
              post = module.transaction_event_store,
              put = module.transaction_event_update,
              get = module.transaction_event_read
            }
        })
      )
    }
  }

}

#
# The actual gateway where the API v2 will be published.
#
resource "google_api_gateway_gateway" "api_gateway" {

  provider = google-beta
  project  = var.project_id

  gateway_id   = "api-gateway"
  display_name = "API Gateway"

  depends_on = [google_api_gateway_api.api, google_api_gateway_api_config.api_config]

  api_config = google_api_gateway_api_config.api_config.id

  # API Gateway is not available in europe-west6 (Zurich)
  # so we use the nearest available: europe-west1 (Belgium)
  region = var.secondary_region

}
