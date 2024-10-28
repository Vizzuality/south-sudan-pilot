// ASSETS BUCKET
module "data_bucket" {
  source      = "../bucket"
  bucket_name = "${var.project}-${var.environment}-assets-bucket"
  domain      = var.domain
}

//Extend the bucket policy to allow for public access from non-aws users (required by the FE to access the tiles directly)
data "aws_iam_policy_document" "extended_data_bucket_policy" {
  source_policy_documents = [module.data_bucket.bucket_policy.json]

  statement {
    sid = "allowPublicAccess"
    actions = ["s3:GetObject"]
    effect = "Allow"
    principals {
      identifiers = ["*"]
      type = "AWS"
    }
    resources = [
      "${module.data_bucket.bucket_arn}",
      "${module.data_bucket.bucket_arn}/*"
    ]
  }
}

resource "aws_s3_bucket_policy" "data_bucket_policy" {
  bucket = module.data_bucket.bucket_id
  policy = data.aws_iam_policy_document.extended_data_bucket_policy.json
}


// Policy to allow access from specific roles/identities (programatic uploader, ec2, etc)
data "aws_iam_policy_document" "asset_bucket_read_write_policy_document" {
  statement {
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:ListBucket",
      "s3:DeleteObject",
      "s3:PutObjectAcl"
    ]
    effect = "Allow"
    resources = [
      "${module.data_bucket.bucket_arn}",
      "${module.data_bucket.bucket_arn}/*"
    ]
  }
}


resource "aws_iam_policy" "asset_bucket_read_write_policy" {
  name        = "${title(var.project)}${title(var.environment)}BucketReaderWriter"
  path        = "/"
  description = "Allows read access to the data layer bucket"

  policy = data.aws_iam_policy_document.asset_bucket_read_write_policy_document.json
}

resource "aws_iam_role_policy_attachment" "beanstalk_ec2_worker" {
  role      = module.beanstalk.eb_role_id
  policy_arn = aws_iam_policy.asset_bucket_read_write_policy.arn
}

// USER KEYS/SECRET FOR ASSETS BUCKET (programmatic use)
// This user is created mostly for convenience to be used by a custom script to upload large quantity of files
resource "aws_iam_user" "programmatic_asset_user" {
  name = "${replace(title(replace(var.project, "/\\W/", "")), " ","")}AssetUser"
}

resource "aws_iam_access_key" "programmatic_asset_user_access_key" {
  user = aws_iam_user.programmatic_asset_user.name
}

resource "aws_iam_user_policy_attachment" "programmatic_asset_user_policy" {
  user      = aws_iam_user.programmatic_asset_user.name
  policy_arn = aws_iam_policy.asset_bucket_read_write_policy.arn
}