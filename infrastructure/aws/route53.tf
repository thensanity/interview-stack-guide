# Route 53 — interview: DNS routing to ALB/CloudFront
resource "aws_route53_zone" "main" {
  count = var.create_route53_zone ? 1 : 0
  name  = var.domain_name
}

resource "aws_route53_record" "app" {
  count   = var.create_route53_zone ? 1 : 0
  zone_id = aws_route53_zone.main[0].zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}

variable "create_route53_zone" {
  type    = bool
  default = false
}
