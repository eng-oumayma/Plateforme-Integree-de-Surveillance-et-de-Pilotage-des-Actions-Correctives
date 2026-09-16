# terraform/variables.tf
variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-1"
}

variable "cluster_name" {
  description = "Nom du cluster EKS"
  type        = string
  default     = "leoni-hsee-cluster"
}

variable "project_name" {
  description = "Nom du projet"
  type        = string
  default     = "leoni-hsee"
}
