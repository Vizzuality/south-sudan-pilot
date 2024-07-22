output "postgresql_host" {
  value = module.postgresql.host
}

output "postgresql_port" {
  value = module.postgresql.port
}

output "postgresql_username" {
  value = module.postgresql.username
}

output "postgresql_password" {
  value = module.postgresql.password
}

output "postgresql_db_name" {
  value = module.postgresql.db_name
}

output "beanstalk_environment_settings" {
  value = module.beanstalk.environment_settings
}

output "beanstalk_environment_cname" {
  value = module.beanstalk.environment_cname
}

output "acm_certificate_domain_validation_options" {
  description = "A list of attributes to feed into other resources to complete certificate validation. Can have more than one element, e.g. if SANs are defined. Only set if DNS-validation was used."
  value       = flatten(aws_acm_certificate.acm_certificate[*].domain_validation_options)
}

output "acm_certificate_arn" {
  description = "The ARN of the ACM certificate"
  value       = aws_acm_certificate.acm_certificate.arn
}

output "dkim_tokens" {
  value = module.email.dkim_tokens
}

output "smtp_server_address" {
  value = module.email.smtp_server_address
}

output "mx_record_name" {
  value = module.email.mx_record_name
}

output "mx_record_value" {
  value = module.email.mx_record_value
}

output "txt_record_name" {
  value = module.email.txt_record_name
}

output "txt_record_value" {
  value = module.email.txt_record_value
}

output "email_iam_user_access_key_id" {
  value = aws_iam_access_key.email_user_access_key.id
}

output "email_iam_user_access_key_secret" {
  value = aws_iam_access_key.email_user_access_key.secret
}
