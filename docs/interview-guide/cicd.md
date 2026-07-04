# CI/CD Interview Questions

## Files

- `.github/workflows/ci.yml` — lint, test, build
- `.github/workflows/cd-aws.yml` — ECR + ECS deploy
- `.github/workflows/cd-kubernetes.yml` — GHCR + Helm deploy

## Key Points

- Multi-stage Docker builds for smaller images
- Environment-based secrets (staging vs production)
- Post-deploy rollout verification
