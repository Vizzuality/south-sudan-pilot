
resource "github_actions_environment_variable" "environment_variable" {
  for_each = var.environment_variable_map
  environment       = var.github_environment
  repository = var.repo_name
  variable_name     = each.key
  value             = each.value
}

resource "github_actions_environment_secret" "environment_secret" {
  for_each = var.environment_secret_map
  environment       = var.github_environment
  repository = var.repo_name
  secret_name       = each.key
  plaintext_value   = each.value
}

resource "github_actions_secret" "global_github_secret" {
  for_each = var.global_secret_map
  repository      = var.repo_name
  secret_name     = each.key
  plaintext_value = each.value
}

resource "github_actions_variable" "global_github_variable" {
  for_each = var.global_variable_map
  repository    = var.repo_name
  variable_name = each.key
  value         = each.value
}

