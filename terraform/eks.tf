# terraform/eks.tf
/*resource "aws_eks_cluster" "main" {
  name     = var.cluster_name
  role_arn = local.lab_role_arn
  version  = "1.29"

  vpc_config {
    subnet_ids             = module.vpc.private_subnets
    endpoint_public_access = true
  }

  tags = { Project = var.project_name }

  depends_on = [module.vpc]
}

resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "main"
  node_role_arn   = local.lab_role_arn
  subnet_ids      = module.vpc.private_subnets

  instance_types = ["t3.medium"]

  scaling_config {
    min_size     = 1
    max_size     = 3
    desired_size = 2
  }

  update_config {
    max_unavailable = 1
  }

  tags = { Project = var.project_name }

  depends_on = [aws_eks_cluster.main]
}

data "aws_eks_cluster" "main" {
  name = var.cluster_name
}

output "cluster_name" { value = aws_eks_cluster.main.name }
output "cluster_endpoint" { value = aws_eks_cluster.main.endpoint }
output "cluster_ca" { value = aws_eks_cluster.main.certificate_authority[0].data }*/
