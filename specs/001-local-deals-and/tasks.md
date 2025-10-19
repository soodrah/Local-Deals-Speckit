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
- T001 [P] Initialize repository and set up monorepo structure (`/`)
- T002 [P] Install dependencies for mobile (React Native/Flutter), backend (Node.js/Express or FastAPI), and admin portal (React/Next.js)
- T003 [P] Configure PostgreSQL and Firebase (optional)
- T004 [P] Set up environment variables for API keys (OpenAI, AdMob, etc.)
- T005 [P] Run database migrations
- T006 [P] Set up linting and formatting tools

### Tests
- T007 [P] Write contract/API tests for each endpoint in `contracts/`
- T008 [P] Write integration tests for user stories (location-based deals, redemption, rating, admin onboarding)
- T009 [P] Write unit tests for models and services
- T010 [P] Write end-to-end tests for mobile app (Detox)

### Core
- T011 [P] Implement User model and authentication logic (`data-model.md`)
- T012 [P] Implement Merchant model and onboarding logic
- T013 [P] Implement Deal model and approval workflow
- T014 [P] Implement Redemption model and QR/barcode logic
- T015 [P] Implement Notification model and geo-fenced logic
- T016 [P] Implement Ad model and AdMob integration
- T017 [P] Implement Rating model and AI-based fraud detection

### Integration
- T018 [P] Integrate backend API with PostgreSQL
- T019 [P] Integrate mobile app with backend API
- T020 [P] Integrate admin portal with backend API
- T021 [P] Integrate AdMob SDK in mobile app
- T022 [P] Integrate OpenAI API for recommendations
- T023 [P] Implement role-based access control (admin, merchant, user)
- T024 [P] Implement logging and error tracking

### Polish
- T025 [P] Optimize app performance (load time, API response, UI fps)
- T026 [P] Ensure accessibility compliance (WCAG 2.1 AA, mobile standards)
- T027 [P] Write and update documentation (README.md, onboarding guides)
- T028 [P] Prepare release notes and update CHANGELOG.md

## Parallel Execution Examples
- T001–T006 (Setup) can run in parallel
- T007–T010 (Tests) can run in parallel
- T011–T017 (Core models/services) can run in parallel
- T018–T024 (Integration) can run in parallel
- T025–T028 (Polish) can run in parallel

## Dependency Notes
- Setup tasks must be completed before core, integration, and polish tasks
- Tests should be written before implementation (TDD)
- Models must be implemented before services and endpoints
- Integration tasks depend on core models/services
- Polish tasks depend on all previous phases
