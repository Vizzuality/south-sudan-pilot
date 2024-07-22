aws_region         = "af-south-1" //il-central is much closer geographically but separated by sea, af-south-1 is on the same continent but on the far south
allowed_account_id = "533267347591"
project_name       = "wims-ss"
repo_name          = "wims-south-sudan"

staging_domain                      = "staging.wims-south-sudan.dev-vizzuality.com"
staging_ec2_instance_type           = "t3a.small"
staging_rds_backup_retention_period = 3

production_domain                      = "wims-south-sudan.com"
production_ec2_instance_type           = "t3a.small"
production_rds_backup_retention_period = 7

beanstalk_platform = "64bit Amazon Linux 2023 v4.1.0 running Docker"
beanstalk_tier     = "WebServer"
//ec2_instance_type  = "t3a.small"
rds_engine_version = "15.4"
rds_instance_class = "db.t3.micro"
