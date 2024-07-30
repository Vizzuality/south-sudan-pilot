#
# DNS Management
#

# Request and validate an SSL certificate from AWS Certificate Manager (ACM)
resource "aws_acm_certificate" "acm_certificate" {
  count = var.environment != "production" ? 1 : 0
  domain_name       = var.domain
  validation_method = "DNS"

  tags = {
    Name = "${var.domain} SSL certificate"
  }

  lifecycle {
    create_before_destroy = true
  }
}

data "aws_acm_certificate" "acm_certificate" {
  count = var.environment == "production" ? 1 : 0
  domain = var.domain
}


resource "aws_acm_certificate_validation" "domain_certificate_validation" {
  certificate_arn = aws_acm_certificate.acm_certificate[0].arn
  validation_record_fqdns = [flatten(aws_acm_certificate.acm_certificate[0].domain_validation_options)[0].resource_record_name]
}

