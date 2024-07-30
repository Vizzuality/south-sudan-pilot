variable "repo_name" {
  type = string
}

variable "environment_variable_map" {
  type    = map(string)
  default = {}
}

variable "environment_secret_map" {
    type    = map(string)
    default = {}
}

variable "global_secret_map" {
  type    = map(string)
  default = {}
}

variable "global_variable_map" {
  type    = map(string)
  default = {}
}

variable "github_environment" {
  type        = string
  description = "Environment to create in the Github repository. Must have a value if passing either environment secret/var map parameters"
  default    = null
}