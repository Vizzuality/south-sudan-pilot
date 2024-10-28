output "bucket_name" {
  value = aws_s3_bucket.bucket.bucket
}

output "bucket_id" {
  value = aws_s3_bucket.bucket.id
}

output "bucket_policy" {
  value = data.aws_iam_policy_document.base_bucket_policy
}

output "bucket_arn" {
  value = aws_s3_bucket.bucket.arn
}