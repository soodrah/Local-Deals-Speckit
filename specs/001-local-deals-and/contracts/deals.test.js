const supertest = require('supertest');
const app = require('../../../src/app');
const request = supertest(app);

describe('Deals Endpoints', () => {
  let authToken;
  let testUserId;

  beforeAll(async () => {
    // Login to get auth token
    const loginResponse = await request
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    authToken = loginResponse.body.token;
    testUserId = loginResponse.body.user.id;
  });

  describe('GET /deals', () => {
    it('should return nearby deals for authenticated user', async () => {
      const response = await request
        .get('/api/v1/deals')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          lat: 37.7749,
          lng: -122.4194,
          radius: 5000
        })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        const deal = response.body[0];
        expect(deal).toHaveProperty('id');
        expect(deal).toHaveProperty('title');
        expect(deal).toHaveProperty('description');
        expect(deal).toHaveProperty('merchantId');
        expect(deal).toHaveProperty('approved', true);
      }
    });

    it('should require authentication', async () => {
      await request
        .get('/api/v1/deals')
        .expect(401);
    });

    it('should filter by category', async () => {
      const response = await request
        .get('/api/v1/deals')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          lat: 37.7749,
          lng: -122.4194,
          category: 'restaurant'
        })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /deals/:dealId', () => {
    it('should return deal details for valid ID', async () => {
      // First get a deal to test with
      const dealsResponse = await request
        .get('/api/v1/deals')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ lat: 37.7749, lng: -122.4194 });

      if (dealsResponse.body.length === 0) {
        return; // Skip if no deals available
      }

      const dealId = dealsResponse.body[0].id;
      
      const response = await request
        .get(`/api/v1/deals/${dealId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', dealId);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('validity');
    });

    it('should return 404 for non-existent deal', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await request
        .get(`/api/v1/deals/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('GET /deals/recommendations', () => {
    it('should return personalized recommendations', async () => {
      const response = await request
        .get('/api/v1/deals/recommendations')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // Recommendations may be empty for new users
    });
  });
});