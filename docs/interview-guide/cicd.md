# CI/CD Interview Questions

## Pipeline Overview

```
Code Push → Lint & Test → Build Packages → Docker Build → Push Registry → Deploy → Smoke Test
```

## Workflows

| Workflow | Trigger | Steps | File |
|----------|---------|-------|------|
| **CI** | PR / push to main | lint, test, docker build | `ci.yml` |
| **CD AWS** | push to main (aws path) | ECR push, ECS deploy | `cd-aws.yml` |
| **CD K8s** | push to main (k8s path) | GHCR push, Helm upgrade | `cd-kubernetes.yml` |

## CI Job Details (`ci.yml`)

1. **lint-and-test** — `npm ci`, build packages, lint, unit/integration tests
2. **build-api** — Docker build API image (after tests pass)
3. **build-web** — Docker build Web image
4. **security-scan** — placeholder for Trivy/Snyk (talking point)

## CD Patterns

### AWS Path
- Build → tag with SHA + `latest` → push ECR
- Update ECS task definition → rolling deploy
- ALB health check gates traffic
- Post-deploy smoke test (extend with `scripts/smoke-test.sh`)

### Kubernetes Path
- Build → push GHCR
- `helm upgrade --install` with image tag
- `kubectl rollout status` waits for success
- Rollback: `kubectl rollout undo`

## Runnable Demo

Trigger `cicd_pipeline` scenario at `/scenarios` — emits staged events:
`lint → test → build → deploy → smoke`

## Common Questions

### Q: How do you handle secrets?
**A:** GitHub Environments with protected secrets. AWS Secrets Manager / K8s External Secrets for runtime. Never in Dockerfile or git.

### Q: Staging vs production promotion?
**A:** Auto-deploy staging on merge. Production requires manual approval gate in GitHub Environments.

### Q: How do you rollback?
**A:** ECS deployment circuit breaker (auto). K8s: `kubectl rollout undo`. Keep previous image tags in registry.

### Q: Multi-stage Docker builds?
**A:** Builder stage compiles TypeScript. Runner stage copies only `dist/` + production `node_modules`. Smaller attack surface.

### Q: What tests run in CI?
**A:** Workspace unit tests (validation, events, db, api integration). Extend with Playwright E2E and `terraform validate`.

### Q: Monorepo CI challenges?
**A:** Larger build surface. Mitigate with affected-package detection (Nx/Turborepo — extension). This repo builds all packages for simplicity.

## Commands

```bash
npm run test          # All workspace tests
npm run test:e2e      # Playwright E2E
npm run docker:smoke  # Post-deploy verification
```

## Extension Ideas
- Terraform plan in CI (policy checks)
- Helm lint in CI
- DAST/SAST scanning
- Canary deploys with Flagger
- Slack/PagerDuty notifications on failure
