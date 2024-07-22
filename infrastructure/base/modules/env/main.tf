resource "random_password" "api_token_salt" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "admin_jwt_secret" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "transfer_token_salt" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "jwt_secret" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "nextauth_secret" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "app_key" {
  length           = 32
  special          = false
  numeric          = false
  override_special = "!#%&*()-_=+[]{}<>:?"
}


resource "aws_security_group" "postgresql_access" {
  vpc_id      = var.vpc.id
  description = "SG allowing access to the Postgres SG"

  tags = merge(
    {
      Name = "EC2 SG to access RDS - ${var.environment}"
    },
    var.tags
  )
}

resource "aws_security_group_rule" "port_forward_postgres" {
  type                     = "egress"
  from_port                = module.postgresql.port
  to_port                  = module.postgresql.port
  protocol                 = "-1"
  source_security_group_id = module.postgresql.security_group_id
  security_group_id        = aws_security_group.postgresql_access.id
}

module "email" {
  source = "../email"

  domain = var.domain
  region = var.aws_region
}

resource "aws_iam_access_key" "email_user_access_key" {
  user = module.email.iam_user.name
}

module "postgresql" {
  source = "../postgresql"

  log_retention_period        = var.rds_log_retention_period
  subnet_ids                  = var.subnet_ids
  project                     = var.project
  environment                 = var.environment
  rds_backup_retention_period = var.rds_backup_retention_period
  rds_user_name               = "postgres"
  rds_engine_version          = var.rds_engine_version
  rds_instance_class          = var.rds_instance_class
  rds_instance_count          = var.rds_instance_count
  tags                        = var.tags
  vpc_id                      = var.vpc.id
  rds_port                    = 5432
  vpc_cidr_block              = var.vpc.cidr_block
  availability_zones          = var.availability_zones
  database_name               = var.project
}

module "beanstalk" {
  source = "../beanstalk"

  project                                       = var.project
  environment                                   = var.environment
  region                                        = var.aws_region
  application_name                              = "${var.project}-${var.environment}"
  application_environment                       = "${var.project}-${var.environment}-environment"
  solution_stack_name                           = var.beanstalk_platform
  tier                                          = var.beanstalk_tier
  tags                                          = var.tags
  vpc                                           = var.vpc
  public_subnets                                = var.subnet_ids
  elb_public_subnets                            = var.subnet_ids
  ec2_instance_type                             = var.ec2_instance_type
  rds_security_group_id                         = aws_security_group.postgresql_access.id
  domain                                        = var.domain
  acm_certificate                               = aws_acm_certificate.acm_certificate
  elasticbeanstalk_iam_service_linked_role_name = var.elasticbeanstalk_iam_service_linked_role_name
}
