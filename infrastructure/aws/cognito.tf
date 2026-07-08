# Cognito User Pool — interview: managed auth vs custom JWT
resource "aws_cognito_user_pool" "main" {
  count = var.enable_cognito ? 1 : 0
  name  = "${var.app_name}-users"

  password_policy {
    minimum_length = 8
  }

  auto_verified_attributes = ["email"]
}

resource "aws_cognito_user_pool_client" "web" {
  count        = var.enable_cognito ? 1 : 0
  name         = "${var.app_name}-web-client"
  user_pool_id = aws_cognito_user_pool.main[0].id

  generate_secret = false
  explicit_auth_flows = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
}

variable "enable_cognito" {
  type    = bool
  default = false
}
