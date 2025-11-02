const supertest = require('supertest');
const app = require('../../../src/app');
const request = supertest(app);

describe('Redemptions Endpoints', () => {
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

    // Get a deal to test redemption with
    const dealsResponse = await request
      .get('/api/v1/deals')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ lat: 37.7749, lng: -122.4194 });

    if (dealsResponse.body.length > 0) {
      testDealId = dealsResponse.body[0].id;
    }
  });

  describe('POST /redemptions', () => {
    it('should redeem a deal with valid code', async () => {
      if (!testDealId) {
        return; // Skip if no deals available
      }

      const redemptionData = {
        dealId: testDealId,
        code: 'TEST_QR_CODE_123'
      };

      const response = await request
        .post('/api/v1/redemptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(redemptionData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.dealId).toBe(testDealId);
      expect(response.body.code).toBe(redemptionData.code);
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should prevent duplicate redemption within time limit', async () => {
      if (!testDealId) {
        return; // Skip if no deals available
      }

      const redemptionData = {
        dealId: testDealId,
        code: 'DUPLICATE_TEST_CODE'
      };

      // First redemption should succeed
      await request
        .post('/api/v1/redemptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(redemptionData)
        .expect(201);

      // Second redemption should fail (within time limit)
      await request
        .post('/api/v1/redemptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(redemptionData)
        .expect(400);
    });

    it('should reject redemption of non-existent deal', async () => {
      const redemptionData = {
        dealId: '00000000-0000-0000-0000-000000000000',
        code: 'INVALID_DEAL_CODE'
      };

      await request
        .post('/api/v1/redemptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(redemptionData)
        .expect(404);
    });

    it('should require authentication', async () => {
      const redemptionData = {
        dealId: testDealId || '00000000-0000-0000-0000-000000000000',
        code: 'UNAUTH_CODE'
      };

      await request
        .post('/api/v1/redemptions')
        .send(redemptionData)
        .expect(401);
    });
  });

  describe('GET /redemptions', () => {
    it('should return user redemption history', async () => {
      const response = await request
        .get('/api/v1/redemptions')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        const redemption = response.body[0];
        expect(redemption).toHaveProperty('id');
        expect(redemption).toHaveProperty('dealId');
        expect(redemption).toHaveProperty('timestamp');
        expect(redemption).toHaveProperty('validationStatus');
      }
    });

    it('should require authentication', async () => {
      await request
        .get('/api/v1/redemptions')
        .expect(401);
    });
  });
});