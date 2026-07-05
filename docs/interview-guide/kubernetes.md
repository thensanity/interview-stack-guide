# Kubernetes Interview Questions

## Architecture (This Project)

```
Ingress → Service (web) → Deployment (web pods)
       → Service (api)  → Deployment (api pods) → MongoDB StatefulSet
                       → HPA (auto-scale on CPU)
```

## Key Objects

| Object | Purpose | File |
|--------|---------|------|
| **Namespace** | Environment isolation | `manifests/namespace.yaml` |
| **Deployment** | Stateless app (API, Web) | `manifests/api-deployment.yaml` |
| **StatefulSet** | MongoDB with persistent volume | `manifests/mongodb-statefulset.yaml` |
| **Service** | ClusterIP load balancing | Deployment files |
| **Ingress** | External HTTP routing | `manifests/ingress.yaml` |
| **ConfigMap** | Non-secret config | `manifests/configmap.yaml` |
| **HPA** | Horizontal Pod Autoscaler | `manifests/hpa.yaml` |
| **Helm Chart** | Parameterized deploy | `helm/interview-stack/` |

## Common Questions

### Q: Deployment vs StatefulSet?
**A:** Deployment for stateless (API, web). StatefulSet for stateful workloads needing stable network IDs and persistent volumes (MongoDB).

### Q: Liveness vs Readiness probes?
**A:** Liveness: is the process alive? Restart if fails. Readiness: can it serve traffic? Remove from Service endpoints if fails. This project uses `/health` (liveness) and `/ready` (readiness with DB check).

### Q: How does HPA work?
**A:** Watches CPU/memory metrics. Scales Deployment replicas between min/max. See `hpa.yaml` — interview tie-in with traffic_spike scenario.

### Q: Helm vs raw manifests?
**A:** Helm templatizes values (image tag, replicas, env) for multi-environment deploy. `helm upgrade --install` with `values.yaml`.

### Q: Secrets in K8s?
**A:** K8s Secrets for non-production. Production: External Secrets Operator syncing from AWS Secrets Manager or Vault.

### Q: How does CI/CD deploy to K8s?
**A:** `.github/workflows/cd-kubernetes.yml` — build → push GHCR → `helm upgrade` → `kubectl rollout status`.

### Q: AWS ECS vs Kubernetes?
**A:** See [DECISION-MATRIX.md](../DECISION-MATRIX.md). Same Docker images — orchestrator differs.

## Commands

```bash
# Helm deploy
helm upgrade --install interview-stack \
  infrastructure/kubernetes/helm/interview-stack \
  --namespace staging --create-namespace

# Check rollout
kubectl rollout status deployment/interview-api -n staging

# Debug pod
kubectl describe pod <name> -n staging
kubectl logs <name> -n staging
```

## Network & Security
- **NetworkPolicy**: restrict pod-to-pod traffic (extension)
- **Ingress TLS**: cert-manager + Let's Encrypt
- **OAuth2 Proxy**: auth at ingress layer
- **Service mesh**: Istio/Linkerd for mTLS and observability (mention)

## Observability
- Prometheus scrapes `/metrics` endpoint
- Structured logs via `kubectl logs` or Loki
- Readiness failures visible in `kubectl describe pod`
