locals {
  client_lb_url = "https://${var.domain}"
  cms_lb_url    = "https://${var.domain}/cms/"
  api_lb_url    = "https://${var.domain}/cms/api/"
  # to test while DNS not set up
  # client_lb_url = "https://${module.beanstalk.environment_cname}"
  # cms_lb_url    = "https://${module.beanstalk.environment_cname}/cms"
  # api_lb_url    = "https://${module.beanstalk.environment_cname}/cms/api/"
}

# Preparation of variable / secret maps for the github_values module
locals {
  # firstly, the variables / secrets which are used by the GH workflow itself
  action_variable_map_with_unprefixed_keys = {}
  action_secret_map_with_unprefixed_keys   = {}
  # those need to have their names prefixed with the environment name, so as to be able to differentiate between staging and production
  # could be achieved using GH environments as well, which would be a good alternative flow, but it is not available in all GH plans
  action_variable_map = {
    for key, value in local.action_variable_map_with_unprefixed_keys :
    "TF_${upper(var.environment)}_${key}" => value
  }
  action_secret_map = {
    for key, value in local.action_secret_map_with_unprefixed_keys :
    "TF_${upper(var.environment)}_${key}" => value
  }

  # secondly, the variables / secrets which are used by the client / cms and need to be provided in the .env file when building the image
  # those need to be also prefixed with the target name, so as to be able to differentiate between client and cms
  # The names for those variables / secrets should follow the template:
  # (STAGING|PRODUCTION-)[CLIENT|CMS]-VARIABLE_NAME
  # - the first part of the name (environment) can be omitted if the variable / secret is the same for both environments
  # - the middle part of the name (target) cannot be omitted, it is used to decide in which .env file the variable / secret should be placed
  # Before placing them in the .env files, the environment and target prefixes are removed.
  client_variable_map_with_unprefixed_keys = {
    NEXT_PUBLIC_URL         = local.client_lb_url
    NEXT_PUBLIC_API_URL     = local.api_lb_url
    NEXT_PUBLIC_ENVIRONMENT = "production"
    LOG_LEVEL               = "info"
  }
  client_secret_map_with_unprefixed_keys = {}
  client_variable_map = {
    for key, value in local.client_variable_map_with_unprefixed_keys :
    "TF_${upper(var.environment)}_CLIENT_ENV_${key}" => value
  }
  client_secret_map = {
    for key, value in local.client_secret_map_with_unprefixed_keys :
    "TF_${upper(var.environment)}_CLIENT_ENV_${key}" => value
  }

  cms_variable_map_with_unprefixed_keys = {
    CMS_URL = local.cms_lb_url
  }
  cms_secret_map_with_unprefixed_keys = {
    HOST = "0.0.0.0"
    PORT = 1337
    APP_KEYS = join(
      ",",
      [
        base64encode(random_password.app_key.result),
        base64encode(random_password.app_key.result)
      ]
    )
    API_TOKEN_SALT      = random_password.api_token_salt.result
    ADMIN_JWT_SECRET    = random_password.admin_jwt_secret.result
    TRANSFER_TOKEN_SALT = random_password.transfer_token_salt.result
    JWT_SECRET          = random_password.jwt_secret.result

    DATABASE_CLIENT                  = "postgres"
    DATABASE_HOST                    = module.postgresql.host
    DATABASE_PORT                    = module.postgresql.port
    DATABASE_NAME                    = module.postgresql.db_name
    DATABASE_USERNAME                = module.postgresql.username
    DATABASE_PASSWORD                = module.postgresql.password
    DATABASE_SSL                     = true
    DATABASE_SSL_REJECT_UNAUTHORIZED = false

    AWS_REGION                = var.aws_region
    AWS_SES_DOMAIN            = var.domain
    AWS_SES_ACCESS_KEY_ID     = aws_iam_access_key.email_user_access_key.id
    AWS_SES_ACCESS_KEY_SECRET = aws_iam_access_key.email_user_access_key.secret
  }

  cms_variable_map = {
    for key, value in local.cms_variable_map_with_unprefixed_keys :
    "TF_${upper(var.environment)}_CMS_ENV_${key}" => value
  }
  cms_secret_map = {
    for key, value in local.cms_secret_map_with_unprefixed_keys :
    "TF_${upper(var.environment)}_CMS_ENV_${key}" => value
  }
}

module "github_values" {
  source    = "../github_values"
  repo_name = var.repo_name
  secret_map = merge(
    local.action_secret_map,
    local.client_secret_map,
    local.cms_secret_map
  )
  variable_map = merge(
    local.action_variable_map,
    local.client_variable_map,
    local.cms_variable_map
  )
}
