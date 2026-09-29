# ─────────────────────────────────────────────
# ECR Backend
# ─────────────────────────────────────────────

resource "aws_ecr_repository" "backend" {
  name                 = "${var.project_name}-backend"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  tags = {
    Project = var.project_name
  }
}


# ─────────────────────────────────────────────
# ECR Frontend
# ─────────────────────────────────────────────

resource "aws_ecr_repository" "frontend" {
  name                 = "${var.project_name}-frontend"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  tags = {
    Project = var.project_name
  }
}


# ─────────────────────────────────────────────
# Outputs
# ─────────────────────────────────────────────

output "ecr_backend_url" {
  value = aws_ecr_repository.backend.repository_url
}

output "ecr_frontend_url" {
  value = aws_ecr_repository.frontend.repository_url
}

output "ecr_registry" {
  value = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com"
}
