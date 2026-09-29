terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
  # Pas de backend S3 avec Vocareum
}
provider "aws" { region = var.aws_region }
data "aws_caller_identity" "current" {}
