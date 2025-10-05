# Local Deals Speckit Constitution

## Core Principles

### I. Code Quality & Review Discipline
All code MUST adhere to strict linting, formatting, and peer review before merge. Automated checks are enforced. No code is deployed without passing all reviews and tests.
Rationale: Ensures maintainability, reduces bugs, and enforces team accountability.

### II. Cross-Platform Consistency
Features and UI/UX MUST be consistent across iOS, Android, and web. Shared logic and design systems are preferred. Platform-specific deviations require explicit justification.
Rationale: Delivers a unified experience and reduces fragmentation.

### III. Performance & Responsiveness
App MUST meet defined performance SLAs: fast load times (<2s), smooth interactions, and minimal resource usage. Performance regressions are blocked from release.
Rationale: User retention and satisfaction depend on speed and responsiveness.

### IV. Security & Privacy
All user data MUST be protected using industry-standard encryption and privacy practices. Regular security audits and compliance checks are mandatory.
Rationale: Protects users and meets legal/regulatory requirements.

### V. Accessibility & Inclusivity
App MUST be usable by people of all abilities. WCAG 2.1 AA compliance is required for web; mobile accessibility guidelines for iOS/Android. Accessibility testing is part of CI.
Rationale: Expands user base and fulfills ethical/social responsibility.

### VI. Testing & Continuous Integration
Test coverage MUST include unit, integration, and end-to-end tests. CI/CD pipelines enforce test pass before deploy. TDD is strongly encouraged for new features.
Rationale: Prevents regressions and ensures reliability.

### VII. Versioning & Backward Compatibility
Semantic versioning (MAJOR.MINOR.PATCH) is enforced. Breaking changes require major version bump and migration plan. Backward compatibility is maintained unless explicitly deprecated.
Rationale: Enables safe upgrades and predictable releases.

### VIII. Documentation & Developer Experience
All public APIs, components, and workflows MUST be documented. Developer onboarding guides and code comments are required. Documentation is reviewed with each release.
Rationale: Accelerates onboarding and reduces support burden.

### IX. Observability & Monitoring
Structured logging, error tracking, and performance monitoring are mandatory. Incidents are triaged and resolved per defined SLAs.
Rationale: Enables rapid issue detection and resolution.

### X. SLA & Support
Service Level Agreements for uptime, response time, and bug fixes are defined and tracked. Support channels and escalation procedures are documented.
Rationale: Builds trust and sets clear expectations for users and stakeholders.

## Security, Compliance, Performance Standards
All code and infrastructure MUST comply with relevant data protection laws (GDPR, CCPA, etc.).
Performance budgets are set for all major features. Third-party dependencies are regularly audited for vulnerabilities.
Deployment policies require rollback plans and disaster recovery procedures.

## Development Workflow, Review Process, Quality Gates
All changes follow a defined workflow: feature branch → pull request → automated tests → peer review → merge.
Quality gates include code coverage thresholds, performance checks, and accessibility validation.
Deployment approval requires sign-off from product and engineering leads.

## Governance
This constitution supersedes all other development practices. Amendments require documentation, team approval, and a migration plan for affected features. All PRs and reviews MUST verify compliance with principles. Complexity must be justified. Compliance reviews are scheduled quarterly. Runtime guidance is maintained in developer docs and onboarding materials. All changes delivered MUST be recorded in a project CHANGELOG.md, detailing version, date, and summary of changes for traceability and audit purposes.

<!--
Sync Impact Report
Version change: 2.1.1 → 3.0.0
Modified principles: All replaced with new industry-standard set
Added sections: Accessibility & Inclusivity, SLA & Support
Removed sections: None (template expanded)
Templates requiring updates:
	✅ .specify/templates/plan-template.md (Constitution Check section aligns)
	✅ .specify/templates/spec-template.md (Requirements/testability enforced)
	✅ .specify/templates/tasks-template.md (Task categories match principles)
Follow-up TODOs:
		None
-->
**Version**: 3.0.0 | **Ratified**: 2025-10-05 | **Last Amended**: 2025-10-05