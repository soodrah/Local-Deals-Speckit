# Phase 0 Research: NearbyPerks

## Goals
- Validate technology choices for cross-platform mobile, backend, and admin portal
- Assess feasibility of AI-powered recommendations and AdMob integration
- Identify best practices for merchant onboarding and deal approval workflows
- Review scalability, security, and compliance requirements

## Technology Feasibility
- **Mobile:** React Native and Flutter both support iOS/Android, large communities, fast prototyping
- **Backend:** Node.js/Express and FastAPI are modern, scalable, and support REST/GraphQL APIs
- **Database:** PostgreSQL is robust for geo queries and merchant/deal data; Firebase is optional for real-time features
- **Admin Portal:** React/Next.js enables fast web development and easy role-based access
- **AI Recommendations:** OpenAI API and Google Vertex AI are suitable for personalized suggestions
- **Ad Integration:** Google AdMob SDK is industry standard for mobile ads

## Merchant Onboarding & Admin Workflow
- Admin portal must support secure login, merchant CRUD, deal approval, and audit logging
- Role-based access control required (admin vs. merchant vs. user)
- Admins can invite merchants, review submitted deals, and approve/reject for app display

## Scalability & Compliance
- Target: 10k+ users, 100+ merchants, 50+ screens/features
- GDPR/CCPA compliance for user data
- Security: encrypted data at rest and in transit, regular audits
- Performance: App load <2s, API <300ms, 60 fps UI

## Risks & Mitigations
- **AI recommendations:** Start with rule-based, upgrade to ML as data grows
- **AdMob:** Ensure fallback for ad failures, monitor revenue impact
- **Merchant onboarding:** Manual review for first launch, automate as process matures
- **Cross-platform bugs:** Use shared logic, automated tests, CI/CD

## References
- React Native docs, Flutter docs, Node.js/Express docs, FastAPI docs
- Google AdMob SDK, OpenAI API, PostgreSQL, Firebase
- GDPR/CCPA guidelines

## Next Steps
- Design data model and contracts
- Draft quickstart and onboarding guides
- Prepare for Phase 1: data-model.md, contracts/, quickstart.md
