# AWS Lambda + API Gateway — serverless alternative to ECS
resource "aws_lambda_function" "health" {
  count         = var.enable_lambda ? 1 : 0
  function_name = "${var.app_name}-health"
  role          = aws_iam_role.lambda[0].arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"

  filename         = "${path.module}/lambda/health.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda/health.zip")
}

resource "aws_iam_role" "lambda" {
  count = var.enable_lambda ? 1 : 0
  name  = "${var.app_name}-lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

variable "enable_lambda" {
  type    = bool
  default = false
}
