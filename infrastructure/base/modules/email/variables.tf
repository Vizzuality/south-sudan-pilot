variable "domain" {
  type        = string
  description = "Domain from which to send emails"
}

variable "region" {
  type        = string
  description = "A valid AWS region to house resources."
}

variable "project" {
  type        = string
  description = "Name of the project"
}