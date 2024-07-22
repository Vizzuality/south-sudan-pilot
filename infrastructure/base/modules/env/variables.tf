variable "aws_region" {
  type        = string
  description = "AWS region"
}

variable "domain" {
  type = string
}

variable "project" {
  type        = string
  description = "Short name of the project, will be used to prefix created resources"
}

variable "environment" {
  type        = string
  description = "Name of the environment, will be used to prefix created resources"
}

variable "vpc" {
}

variable "tags" {
  default     = {}
  description = "Additional tags to add to resources"
}

variable "subnet_ids" {
}

variable "availability_zones" {
  type = list(string)
}

variable "beanstalk_platform" {
  type        = string
  description = "The Elastic Beanstalk platform to use"
}

variable "beanstalk_tier" {
  type        = string
  description = "The Elastic Beanstalk tier to use"
}

variable "ec2_instance_type" {
  type        = string
  description = "EC2 instance type for the server"
}

variable "rds_backup_retention_period" {
  type        = number
  description = "Number of days to retain backup for the database"
}

variable "rds_log_retention_period" {
  type        = number
  description = "Number of days to retain logs in Cloud Watch"
  default     = 30
}

variable "rds_engine_version" {
  type        = string
  description = "RDS Database engine version"
}

variable "rds_instance_count" {
  type        = number
  description = "Number of permanent RDS instances"
  default     = 1
}

variable "rds_instance_class" {
  type        = string
  description = "RDS instance type class"
}

variable "elasticbeanstalk_iam_service_linked_role_name" {
  type        = string
  description = "The IAM service linked role to use for the environment"
}

variable "repo_name" {
  type        = string
  description = "Name of the Github repository where the code is hosted"
}