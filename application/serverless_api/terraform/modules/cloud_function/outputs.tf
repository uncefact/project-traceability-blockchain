output "endpoint" {
  value       = google_cloudfunctions_function.function.https_trigger_url
  description = "URL which triggers function execution. Returned only if `trigger_http` is used."
}