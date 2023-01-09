variable "runtime" {}
variable "function_name" {}
variable "function_entry_point" {default= "handler"}
variable "function_source_dir" {}
variable "bucket" {}
variable "invoker" {}
variable "environment_variables" {
    type = object({
        db_user: string
        db_pass: string
        db_name: string
        db_host: string
        project: string
    })
    default = {
        db_user: ""
        db_pass: ""
        db_name: ""
        db_host: ""
        project: ""
    }
}
