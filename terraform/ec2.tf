# AMI Amazon Linux 2023
data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

# Key Pair SSH
resource "aws_key_pair" "hsee_key" {
  key_name   = "leoni-hsee-key"
  public_key = file("${path.module}/leoni-hsee-key.pub")
}

# Security Group
resource "aws_security_group" "hsee_sg" {
  name        = "leoni-hsee-sg"
  description = "HSEE LEONI security group"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH"
  }
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP Frontend React"
  }
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Backend NestJS"
  }
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "PostgreSQL"
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = { Name = "leoni-hsee-sg", Project = var.project_name }
}

# Instance EC2
resource "aws_instance" "hsee_server" {
  ami                    = data.aws_ami.al2023.id
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.hsee_key.key_name
  vpc_security_group_ids = [aws_security_group.hsee_sg.id]

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  # Installation automatique Docker + AWS CLI
  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install docker -y
    service docker start
    systemctl enable docker
    usermod -aG docker ec2-user
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)"       -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip
    unzip awscliv2.zip && ./aws/install
    mkdir -p /home/ec2-user/leoni-hsee
    chown ec2-user:ec2-user /home/ec2-user/leoni-hsee
  EOF

  tags = { Name = "leoni-hsee-server", Project = var.project_name }
}

# Elastic IP (IP fixe)
resource "aws_eip" "hsee_eip" {
  instance = aws_instance.hsee_server.id
  domain   = "vpc"
  tags     = { Name = "leoni-hsee-eip" }
}

# Outputs
output "ec2_public_ip" {
  value       = aws_eip.hsee_eip.public_ip
  description = "→ copier dans GitHub Secret EC2_HOST"
}
output "ssh_command" {
  value = "ssh -i leoni-hsee-key.pem ec2-user@${aws_eip.hsee_eip.public_ip}"
}
