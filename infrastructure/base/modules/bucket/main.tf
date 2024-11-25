resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name

  # Prevents Terraform from destroying or replacing this object - a great safety mechanism
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "asset_bucket_encryption" {
  bucket = aws_s3_bucket.bucket.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_versioning" "asset_bucket_versioning" {
  bucket = aws_s3_bucket.bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

// this is commented, because we want to extend the policy it outside of the module
// if we declare the aws_s3_bucket_policy both here and outside the module, they will overwrite each other
// alternating every time the TF config is applied.
/*
resource "aws_s3_bucket_policy" "allow_access_from_another_account" {
  bucket = aws_s3_bucket.bucket.id
  policy = data.aws_iam_policy_document.base_bucket_policy.json
}
*/

resource "aws_s3_bucket_cors_configuration" "bucket_cors_configuration" {
  bucket = aws_s3_bucket.bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["https://${var.domain}", "http://localhost:3000"]
    expose_headers  = []
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_ownership_controls" "s3_object_ownership_owner_preferred" {
  bucket = aws_s3_bucket.bucket.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "s3_bucket_public_access" {
  bucket = aws_s3_bucket.bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

data "aws_caller_identity" "current" {}

// Base bucket policy with access from all identities in the account
data "aws_iam_policy_document" "base_bucket_policy" {
  statement {
    sid = "accountAccess"

    principals {
      type        = "AWS"
      identifiers = [data.aws_caller_identity.current.account_id]
    }

    actions = [
      "s3:PutObject",
      "s3:GetObject*",
      "s3:ListBucket",
      "s3:DeleteObject",
      "s3:PutObjectAcl",
      "s3:PutObjectTagging"
    ]

    resources = [
      aws_s3_bucket.bucket.arn,
      "${aws_s3_bucket.bucket.arn}/*",
    ]
  }
}
