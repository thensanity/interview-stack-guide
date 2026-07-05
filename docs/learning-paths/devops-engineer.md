# DevOps Engineer Learning Path

## Week 1: Containers & Local Stack
1. `docker compose up -d mongodb redis`
2. `npm run docker:full` — full containerized demo
3. `npm run docker:smoke` — verify endpoints
4. Read `docs/docker-full-demo.md`

## Week 2: CI/CD
1. Read `docs/interview-guide/cicd.md`
2. Study `.github/workflows/ci.yml`
3. Compare `cd-aws.yml` vs `cd-kubernetes.yml`
4. Trigger `cicd_pipeline` scenario — watch staged events

## Week 3: AWS
1. Read expanded `docs/interview-guide/aws.md`
2. Walk through `infrastructure/aws/` Terraform
3. Explain: VPC → ALB → ECS Fargate → DynamoDB
4. Discuss secrets: GitHub Environments, Secrets Manager

## Week 4: Kubernetes
1. Read expanded `docs/interview-guide/kubernetes.md`
2. Study manifests and Helm chart
3. Explain liveness vs readiness (`/health` vs `/ready`)
4. Study HPA in `manifests/hpa.yaml`
5. `helm upgrade --install` locally (if cluster available)

## Week 5: Observability & Incidents
1. `GET /metrics` — Prometheus format
2. Structured JSON logs in API stdout
3. Debug dashboard at `/debug`
4. Walk through Scenario 7 (zero-downtime) and Scenario 8 (debugging)

## Interview Demo Script
1. Draw architecture from `apps/web/src/app/architecture`
2. Walk CI pipeline stages (lint → test → build → deploy)
3. Show health/readiness probes in K8s manifests
4. Trigger deploy_rolling scenario
