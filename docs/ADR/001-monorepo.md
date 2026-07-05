# ADR 001: Monorepo with npm Workspaces

## Status
Accepted

## Context
The interview reference covers React, Next.js, API, shared packages, infrastructure, and docs. We need atomic cross-package changes and a single CI pipeline.

## Decision
Use an npm workspaces monorepo with packages `@interview/db`, `@interview/events`, `@interview/graphql`, `@interview/validation`.

## Consequences
- **Positive:** Shared types, one `npm install`, single PR for API + schema changes
- **Negative:** Full workspace build in CI; needs discipline on package boundaries
- **Mitigation:** Clear package exports; interview answer for Nx/Turborepo at scale

## Alternatives Considered
- **Polyrepo:** rejected — too much overhead for a learning reference
- **Nx/Turborepo:** deferred — added complexity not needed at this scale
