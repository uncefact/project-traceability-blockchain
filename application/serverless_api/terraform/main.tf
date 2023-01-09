terraform {
  required_version = ">= 0.12"
#  backend "local" {}
  backend "gcs" {
    bucket      = "unece_tfstate_bucket"
    prefix      = "terraform/state"
    credentials = "./credentials/unece-gcp-manager.json"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone  = var.zone
  credentials = file("./credentials/unece-gcp-manager.json")
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
  zone  = var.zone
  credentials = file("./credentials/unece-gcp-manager.json")
}

locals {
  function_invoker = "serviceAccount:${google_service_account.api_gateway_service_account.email}"
  db_host_ip = "34.65.146.135"
  nodejs_base_path = "../cloud_functions/nodejs"
  python_base_path = "../cloud_functions/python"
}

data "google_secret_manager_secret_version" "db_password" {
  secret = "unece_db_password"
}

resource "google_storage_bucket" "unece_cloud_functions_bucket" {
  name          = "unece_cloud_functions_bucket"
  location      = var.region
  force_destroy = true
}

# add secret bindings role in order to allow the service account to access the secrets
resource "google_secret_manager_secret_iam_binding" "infura-api-key_secret_binding" {
  project = var.project_id
  secret_id = "infura-api-key"
  role = "roles/secretmanager.secretAccessor"
  members = [
    "serviceAccount:${var.project_id}@appspot.gserviceaccount.com"
  ]
}

resource "google_secret_manager_secret_iam_binding" "bc-endpoint_secret_binding" {
  project = var.project_id
  secret_id = "bc-endpoint"
  role = "roles/secretmanager.secretAccessor"
  members = [
    "serviceAccount:${var.project_id}@appspot.gserviceaccount.com"
  ]
}

resource "google_secret_manager_secret_iam_binding" "contract-address_secret_binding" {
  project = var.project_id
  secret_id = "contract-address"
  role = "roles/secretmanager.secretAccessor"
  members = [
    "serviceAccount:${var.project_id}@appspot.gserviceaccount.com"
  ]
}

resource "google_secret_manager_secret_iam_binding" "pinata-api-key_secret_binding" {
  project = var.project_id
  secret_id = "pinata-api-key"
  role = "roles/secretmanager.secretAccessor"
  members = [
    "serviceAccount:${var.project_id}@appspot.gserviceaccount.com"
  ]
}

resource "google_secret_manager_secret_iam_binding" "pinata-secret-api-key_secret_binding" {
  project = var.project_id
  secret_id = "pinata-secret-api-key"
  role = "roles/secretmanager.secretAccessor"
  members = [
    "serviceAccount:${var.project_id}@appspot.gserviceaccount.com"
  ]
}

# Enable Cloud Functions API
resource "google_project_service" "cloud_functions" {
  project = var.project_id
  service = "cloudfunctions.googleapis.com"

  disable_dependent_services = true
  disable_on_destroy         = false
}

# Enable Cloud Build API
resource "google_project_service" "cloud_build" {
  project = var.project_id
  service = "cloudbuild.googleapis.com"

  disable_dependent_services = true
  disable_on_destroy         = false
}


module "cors" {
  source               = "./modules/cloud_function"
  runtime              = "python39"
  function_name        = "${var.unece_functions_prefix}_cors_handler"
  function_source_dir  = abspath("${local.python_base_path}/cors")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
}

module "login" {
  source               = "./modules/cloud_function"
  runtime              = "python39"
  function_name        = "${var.unece_functions_prefix}_login"
  function_source_dir  = abspath("${local.python_base_path}/login")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

# module "fix_wallet_public_key" {
#   source               = "./modules/cloud_function"
#   runtime              = "nodejs16"
#   function_name        = "${var.unece_functions_prefix}_fix_wallet_public_key"
#   function_source_dir  = abspath("${local.nodejs_base_path}")
#   bucket               = google_storage_bucket.unece_cloud_functions_bucket
#   invoker              = local.function_invoker
#   function_entry_point = "fixPublicKeys"
#   environment_variables = {
#         db_user: "root"
#         db_pass: data.google_secret_manager_secret_version.db_password.secret_data
#         db_name: "unece_tracking"
#         db_host: local.db_host_ip
#         project: var.project_id
#     }
# }

module "material_update" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_material_update"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "materialUpdate"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "material_store" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_material_store"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "materialStore"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "material_allow_read" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_material_allow_read"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "materialAllowRead"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "material_retrieve" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_material_retrieve"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "materialRetrieve"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "material_retrieve_all" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_material_retrieve_all"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "materialRetrieveAll"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "trade_update" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_trade_update"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "tradeUpdate"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "trade_store" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_trade_store"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "tradeStore"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "trade_allow_read" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_trade_allow_read"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "tradeAllowRead"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "trade_retrieve" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_trade_retrieve"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "tradeRetrieve"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "trade_retrieve_all" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_trade_retrieve_all"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "tradeRetrieveAll"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "transformation_update" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_transformation_update"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "transformationUpdate"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "transformation_store" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_transformation_store"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "transformationStore"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "transformation_allow_read" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_transformation_allow_read"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "transformationAllowRead"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "transformation_retrieve" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_transformation_retrieve"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "transformationRetrieve"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "transformation_retrieve_all" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_transformation_retrieve_all"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "transformationRetrieveAll"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "transformation_event_store" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_transformation_event_store"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "transformationEventStandardStore"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "transformation_event_update" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_transformation_event_update"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "transformationEventStandardUpdate"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "transformation_event_read" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_transformation_event_read"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "transformationEventStandardRead"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "object_event_store" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_object_event_store"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "objectEventStandardStore"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "object_event_update" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_object_event_update"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "objectEventStandardUpdate"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "object_event_read" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_object_event_read"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "objectEventStandardRead"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "transaction_event_store" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_transaction_event_store"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "transactionEventStandardStore"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "transaction_event_update" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_transaction_event_update"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "transactionEventStandardUpdate"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}

module "transaction_event_read" {
  source               = "./modules/cloud_function"
  runtime              = "nodejs16"
  function_name        = "${var.unece_functions_prefix}_transaction_event_read"
  function_source_dir  = abspath("${local.nodejs_base_path}")
  bucket               = google_storage_bucket.unece_cloud_functions_bucket
  invoker              = local.function_invoker
  function_entry_point = "transactionEventStandardRead"
  environment_variables = {
        db_user: "root"
        db_pass: data.google_secret_manager_secret_version.db_password.secret_data
        db_name: "unece_tracking"
        db_host: local.db_host_ip
        project: var.project_id
    }
}
