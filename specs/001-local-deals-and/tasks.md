# Tasks: NearbyPerks

**Input**: Design documents from `/specs/001-local-deals-and/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
   → quickstart.md: Extract onboarding/testing tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Task List

### Setup
- T001 Initialize repository and set up monorepo structure (`/`)
- T002 Install dependencies: React Native (mobile), Node.js/Express (API), Next.js (admin)
- T003 Configure PostgreSQL and Firebase (optional)
- T004 Set up environment variables for API keys (OpenAI, AdMob, etc.) with secure secret storage
- T005 Set up linting, formatting, commit hooks; create CI pipeline (lint, tests, coverage >=80%)
- T006 Define API contracts in OpenAPI for deals, merchants, redemptions, ratings, auth; scaffold files under `specs/001-local-deals-and/contracts/`
- T007 Generate initial contract tests from OpenAPI (one per endpoint)

### Tests
- T008 Write integration tests for user stories (location-based deals, redemption, rating, admin onboarding)
- T009 Write unit tests for models and services
- T010 Write end-to-end tests for mobile app (Detox)
- T011 Add negative tests: expired deals, duplicate redemption attempt, invalid rating, AdMob failure path

### Core
- T012 Implement User model and authentication logic (`data-model.md`)
- T013 Implement Merchant model and onboarding logic (with audit log fields)
- T014 Implement Deal model and approval workflow (approved status, validity, limits)
- T015 Implement Redemption model and QR/barcode logic (enforce time window)
- T016 Implement Notification model and geo-fenced logic (permission handling)
- T017 Implement Ad model and AdMob integration (failure hooks)
- T018 Implement Rating model and AI-based fraud detection (flag + review queue)
- T019 Implement Recommendation service abstraction with provider (OpenAI) behind interface
- T020 Implement Invite/Share service with deep links

### Integration
- T021 Integrate backend API with PostgreSQL (migrations, connection pooling)
- T022 Integrate mobile app with backend API (typed client)
- T023 Integrate admin portal with backend API
- T024 Integrate AdMob SDK in mobile app
- T025 Integrate OpenAI API for recommendations
- T026 Implement role-based access control (admin, merchant, user) and route guards
- T027 Implement logging, metrics (deals_fetched_count, redemption_success_rate, fraud_flag_rate, ad_fail_count), tracing, and alerting
- T028 Implement rate limiting for redemption and invites; add cache for discovery
- T029 Implement data retention (1-year) and deletion workflows; backup/restore runbook

### Polish
- T030 Optimize app performance (load time, API response, UI fps); add performance tests and budgets
- T031 Ensure accessibility compliance (WCAG 2.1 AA on web; mobile a11y labels and tests)
- T032 Write and update documentation (README.md, API reference from OpenAPI, onboarding guides)
- T033 Define SLA doc (99% uptime) and incident response runbook; set SLO dashboards
- T034 Prepare release notes and update CHANGELOG.md; set up semantic-release/versioning

## Parallel Execution Examples
- Setup: T001–T005 can run in parallel; T006 → T007 sequential
- Tests: T008–T011 can run in parallel
- Core: T012–T020 can run in parallel where data model boundaries allow
- Integration: T021–T029 mostly sequential (DB, RBAC before rate limiting; logging before alerting)
- Polish: T030–T034 can run in parallel after Integration

## Dependency Notes
- Setup tasks must be completed before core, integration, and polish tasks
- Contracts and contract tests (T006–T007) precede endpoint implementation
- Tests should be written before implementation (TDD)
- Models must be implemented before services and endpoints
- Integration tasks depend on core models/services
- Polish tasks depend on all previous phases
