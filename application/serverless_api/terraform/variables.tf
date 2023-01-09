variable "project_id" {
  default = "adroit-nimbus-275214"
}
variable "region" {
  default = "europe-west6"
}
variable "secondary_region" {
  default = "europe-west1" # if some functionality are not available on the primary
}
variable "zone" {
  default = "europe-west6-a"
}
variable "bucket_name" {
  default = "unece_decentralized_terraform_state_bucket"
}

variable "unece_functions_prefix" {
  default = "unece"
}