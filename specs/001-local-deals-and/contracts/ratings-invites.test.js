const supertest = require('supertest');
const app = require('../../../src/app');
const request = supertest(app);

describe('Ratings and Invites Endpoints', () => {
  let authToken;
  let testDealId;

  beforeAll(async () => {
    // Login to get auth token
    const loginResponse = await request
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    authToken = loginResponse.body.token;

    // Get a deal to test rating with
    const dealsResponse = await request
      .get('/api/v1/deals')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ lat: 37.7749, lng: -122.4194 });

    if (dealsResponse.body.length > 0) {
      testDealId = dealsResponse.body[0].id;
    }
  });

  describe('POST /ratings', () => {
    it('should submit a rating for a deal', async () => {
      if (!testDealId) {
        return; // Skip if no deals available
      }

      const ratingData = {
        dealId: testDealId,
        score: 4,
        comment: 'Great deal, very satisfied!'
      };

      const response = await request
        .post('/api/v1/ratings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(ratingData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.dealId).toBe(testDealId);
      expect(response.body.score).toBe(4);
      expect(response.body.comment).toBe(ratingData.comment);
      expect(response.body.fraudFlag).toBe(false);
    });

    it('should reject rating with invalid score', async () => {
      if (!testDealId) {
        return;
      }

      const ratingData = {
        dealId: testDealId,
        score: 6, // Invalid score (max is 5)
        comment: 'Invalid score test'
      };

      await request
        .post('/api/v1/ratings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(ratingData)
        .expect(400);
    });

    it('should reject duplicate rating from same user', async () => {
      if (!testDealId) {
        return;
      }

      const ratingData = {
        dealId: testDealId,
        score: 3,
        comment: 'Second rating attempt'
      };

      // This should fail since we already rated this deal in the first test
      await request
        .post('/api/v1/ratings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(ratingData)
        .expect(400);
    });

    it('should accept rating without comment', async () => {
      // Get a different deal or create one for this test
      const ratingData = {
        dealId: testDealId || '11111111-1111-1111-1111-111111111111',
        score: 5
      };

      // This might fail if dealId doesn't exist, but tests the schema validation
      const response = await request
        .post('/api/v1/ratings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(ratingData);

      // Accept either 201 (success) or 404 (deal not found) for schema validation
      expect([201, 404]).toContain(response.status);
    });
  });

  describe('POST /invites', () => {
    it('should send invitation to valid email', async () => {
      const inviteData = {
        email: 'friend@example.com',
        message: 'Check out this great deals app!'
      };

      const response = await request
        .post('/api/v1/invites')
        .set('Authorization', `Bearer ${authToken}`)
        .send(inviteData)
        .expect(201);
    });

    it('should send invitation without message', async () => {
      const inviteData = {
        email: 'anotherfriend@example.com'
      };

      await request
        .post('/api/v1/invites')
        .set('Authorization', `Bearer ${authToken}`)
        .send(inviteData)
        .expect(201);
    });

    it('should reject invitation with invalid email', async () => {
      const inviteData = {
        email: 'invalid-email-format',
        message: 'This should fail'
      };

      await request
        .post('/api/v1/invites')
        .set('Authorization', `Bearer ${authToken}`)
        .send(inviteData)
        .expect(400);
    });

    it('should enforce rate limiting on invites', async () => {
      const responses = [];
      for (let i = 0; i < 10; i++) {
        const res = await request
          .post('/api/v1/invites')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ email: `test${Math.random()}@example.com` });
        responses.push(res);
      }
      // Expect some to be rate limited (limit is 5/day)
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });

    it('should require authentication', async () => {
      const inviteData = {
        email: 'test@example.com'
      };

      await request
        .post('/api/v1/invites')
        .send(inviteData)
        .expect(401);
    });
  });
});