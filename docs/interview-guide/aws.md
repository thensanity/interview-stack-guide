# AWS Interview Questions

## Architecture (This Project)

```
Internet → Route 53 → ALB → ECS Fargate (API + Web) → DynamoDB
                              ↓
                           ECR (images)
                           CloudWatch (logs/metrics)
                           VPC (public/private subnets)
```

## Services Used

| Service | Purpose | File |
|---------|---------|------|
| **ECS Fargate** | Serverless containers | `infrastructure/aws/ecs.tf` |
| **ECR** | Container registry | `infrastructure/aws/ecs.tf` |
| **ALB** | Load balancing + health checks | `infrastructure/aws/ecs.tf` |
| **DynamoDB** | NoSQL data store | `infrastructure/aws/dynamodb.tf` |
| **VPC** | Network isolation | `infrastructure/aws/vpc.tf` |
| **IAM** | Least-privilege roles | `infrastructure/aws/iam.tf` |
| **CloudWatch** | Logs and alarms | Referenced in ECS task defs |
| **Terraform** | Infrastructure as Code | `infrastructure/aws/` |

## Common Questions

### Q: Why ECS Fargate over EC2?
**A:** No instance management. Pay per task. Good for small teams. Tradeoff: less control over host-level tuning.

### Q: How do you deploy with zero downtime on ECS?
**A:** Rolling deployment with minimum healthy percent 100%, maximum 200%. ALB health checks on `/health`. Circuit breaker rolls back failed deploys (`ecs.tf`).

### Q: How does auth work on AWS?
**A:** Options: Cognito User Pools + JWT validation in API, or ALB authenticate action (OAuth2/OIDC) before traffic reaches containers.

### Q: Secrets management?
**A:** AWS Secrets Manager or SSM Parameter Store. Inject via ECS task definition `secrets` block — never bake into images.

### Q: When DynamoDB over MongoDB on AWS?
**A:** DynamoDB for predictable key-value access at scale, native AWS integration, on-demand capacity. MongoDB (Atlas or self-hosted) for richer queries.

### Q: How does CI/CD deploy to AWS?
**A:** `.github/workflows/cd-aws.yml` — build image → push ECR → update ECS service → smoke test against ALB.

## Commands

```bash
cd infrastructure/aws
cp terraform.tfvars.example terraform.tfvars
terraform init && terraform plan && terraform apply
```

## Cost Talking Points
- Fargate: pay per vCPU/memory per second
- DynamoDB on-demand: pay per request (good for spiky traffic)
- ALB: hourly + LCU charges
- Use tags for cost allocation per environment

## Extension Ideas
- CloudFront CDN in front of ALB for static assets
- WAF on ALB for DDoS protection
- X-Ray for distributed tracing
- Auto Scaling on ECS service CPU/memory
