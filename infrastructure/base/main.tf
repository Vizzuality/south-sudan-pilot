data "aws_vpc" "default_vpc" {
  default = true
}

locals {
  subnets_with_ec2_instance_type_offering_ids = sort([
    for k, v in data.aws_subnets.subnets_with_ec2_instance_type_offering_map : v.ids[0]
  ])
}

module "iam" {
  source  = "./modules/iam"
  project = var.project_name
}

// CONTAINER REGISTRIES
module "cms_ecr" {
  source = "./modules/ecr"

  project_name = var.project_name
  repo_name    = "cms"
}

module "client_ecr" {
  source = "./modules/ecr"

  project_name = var.project_name
  repo_name    = "client"
}

resource "aws_iam_service_linked_role" "elasticbeanstalk" {
  aws_service_name = "elasticbeanstalk.amazonaws.com"
}

// GLOBAL GITHUB SECRETS/VARS
module "github_values" {
  source    = "./modules/github_values"
  repo_name = var.repo_name
  global_secret_map = {
    TF_AWS_REGION                      = var.aws_region
    TF_PROJECT_NAME                    = var.project_name
    TF_CMS_REPOSITORY_NAME             = module.cms_ecr.repository_name
    TF_CLIENT_REPOSITORY_NAME          = module.client_ecr.repository_name
    TF_PIPELINE_USER_ACCESS_KEY_ID     = module.iam.pipeline_user_access_key_id
    TF_PIPELINE_USER_SECRET_ACCESS_KEY = module.iam.pipeline_user_access_key_secret
  }
  variable_map = {}
}

//ENVIRONMENTS
module "staging" {
  source                                        = "./modules/env"
  domain                                        = var.staging_domain
  project                                       = var.project_name
  environment                                   = "staging"
  aws_region                                    = var.aws_region
  vpc                                           = data.aws_vpc.default_vpc
  subnet_ids                                    = local.subnets_with_ec2_instance_type_offering_ids
  availability_zones                            = data.aws_availability_zones.azs_with_ec2_instance_type_offering.names
  beanstalk_platform                            = var.beanstalk_platform
  beanstalk_tier                                = var.beanstalk_tier
  ec2_instance_type                             = var.staging_ec2_instance_type
  rds_engine_version                            = var.rds_engine_version
  rds_instance_class                            = var.rds_instance_class
  rds_backup_retention_period                   = var.staging_rds_backup_retention_period
  elasticbeanstalk_iam_service_linked_role_name = aws_iam_service_linked_role.elasticbeanstalk.name
  repo_name                                     = var.repo_name
}

# module "production" {
#   source                                        = "./modules/env"
#   domain                                        = var.production_domain
#   project                                       = var.project_name
#   environment                                   = "production"
#   aws_region                                    = var.aws_region
#   vpc                                           = data.aws_vpc.default_vpc
#   subnet_ids                                    = local.subnets_with_ec2_instance_type_offering_ids
#   availability_zones                            = data.aws_availability_zones.azs_with_ec2_instance_type_offering.names
#   beanstalk_platform                            = var.beanstalk_platform
#   beanstalk_tier                                = var.beanstalk_tier
#   ec2_instance_type                             = var.production_ec2_instance_type
#   rds_engine_version                            = var.rds_engine_version
#   rds_instance_class                            = var.rds_instance_class
#   rds_backup_retention_period                   = var.production_rds_backup_retention_period
#   elasticbeanstalk_iam_service_linked_role_name = aws_iam_service_linked_role.elasticbeanstalk.name
#   repo_name = var.repo_name
# }

