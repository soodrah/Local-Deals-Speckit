# API Contract Tests

This directory contains contract tests for the NearbyPerks API based on the OpenAPI specification.

## Structure
- `api.yaml` - OpenAPI 3.0 specification
- Tests will be generated from the OpenAPI spec using tools like Dredd or Postman Newman

## Test Coverage
Each endpoint defined in `api.yaml` should have corresponding tests that verify:
- Request/response schema validation
- Authentication requirements
- Error response handling
- Rate limiting behavior

## Usage
Contract tests should be run before integration tests to ensure API compliance.

```bash
# Install dependencies
npm install -g dredd

# Run contract tests
dredd api.yaml http://localhost:3000/api/v1
```

## Endpoints Covered
- Authentication: `/auth/login`, `/auth/register`
- Users: `/users/profile`
- Deals: `/deals`, `/deals/{dealId}`, `/deals/recommendations`
- Redemptions: `/redemptions`
- Ratings: `/ratings`
- Admin: `/admin/merchants`, `/admin/merchants/{merchantId}/approve`, `/admin/deals/{dealId}/approve`
- Invites: `/invites`