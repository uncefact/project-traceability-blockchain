locals{
  filename = "function-${var.function_name}-${formatdate("YYMMDDhhmmss", timestamp())}.zip"
}

data "archive_file" "source" {
  type        = "zip"
  source_dir  = var.function_source_dir
  output_path = "/tmp/${local.filename}"
}

resource "google_storage_bucket_object" "zip_file" {
  # Append file MD5 to force bucket to be recreated
  name   = "${local.filename}#${data.archive_file.source.output_md5}"
  bucket = var.bucket.name
  source = data.archive_file.source.output_path
}

# Create Cloud Function
resource "google_cloudfunctions_function" "function" {
  name    = var.function_name
  runtime = var.runtime

  available_memory_mb   = 128
  source_archive_bucket = var.bucket.name
  source_archive_object = google_storage_bucket_object.zip_file.name
  trigger_http          = true
  entry_point           = var.function_entry_point
  timeout               = 120
  environment_variables = {
    DB_USER = var.environment_variables.db_user
    DB_PASS = var.environment_variables.db_pass
    DB_NAME = var.environment_variables.db_name
    DB_HOST = var.environment_variables.db_host
    PROJECT = var.environment_variables.project
  }

  timeouts {
    create = "60m"
    update = "60m"
  }
}

# Create IAM entry so only a defined invoker (a google service account) can invoke the function
resource "google_cloudfunctions_function_iam_member" "invoker" {
  project        = google_cloudfunctions_function.function.project
  region         = google_cloudfunctions_function.function.region
  cloud_function = google_cloudfunctions_function.function.name

  role   = "roles/cloudfunctions.invoker"
  member = var.invoker
}