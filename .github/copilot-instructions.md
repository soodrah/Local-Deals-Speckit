# GitHub Copilot Instructions for NearbyPerks

## Purpose
This file guides Copilot and contributors to follow best industry standards for code quality, security, and maintainability in the NearbyPerks project.

## General Principles
- Write clean, readable, and well-documented code
- Use descriptive variable, function, and class names
- Prefer composition over inheritance
- Avoid code duplication; refactor shared logic
- Follow project linting and formatting rules
- Write modular, testable functions and components
- Use semantic versioning for releases

## Security & Privacy
- Never commit secrets, API keys, or credentials
- Validate all user input and sanitize outputs
- Use HTTPS for all network communication
- Apply least privilege for roles and permissions
- Encrypt sensitive data at rest and in transit
- Follow GDPR/CCPA compliance for user data

## Testing & CI
- Write unit, integration, and end-to-end tests for all features
- Maintain high code coverage (target >80%)
- Use TDD for new features when possible
- Ensure all tests pass before merging
- Use CI/CD pipelines for automated builds and deployments

## Documentation
- Document all public APIs, components, and workflows
- Update README.md and relevant docs with every major change
- Add code comments for complex logic
- Provide onboarding guides for new contributors

## Mobile & Web Best Practices
- Ensure cross-platform consistency (iOS, Android, Web)
- Optimize for performance (fast load, smooth UI)
- Use accessibility guidelines (WCAG 2.1 AA, mobile standards)
- Integrate AdMob and AI features securely and efficiently

## Admin Portal
- Restrict access to admin features by role
- Log all admin actions for auditability
- Validate merchant onboarding and deal approval workflows

## Observability & Monitoring
- Use structured logging and error tracking
- Monitor performance and uptime (SLAs)
- Respond to incidents per defined escalation procedures

## Code Review & Collaboration
- All changes require peer review before merge
- Justify complexity and major design decisions
- Use pull requests with clear descriptions and linked issues
- Record all changes in CHANGELOG.md

## Release & Maintenance
- Tag releases with semantic versioning
- Deprecate features with migration plans
- Schedule regular compliance and security reviews

---
For questions, see the constitution or contact project maintainers.
