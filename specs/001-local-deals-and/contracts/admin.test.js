const supertest = require('supertest');
const app = require('../../../src/app');
const request = supertest(app);

describe('Admin Endpoints', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    // Login as admin
    const adminLogin = await request
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'adminpass123'
      });
    adminToken = adminLogin.body.token;

    // Login as regular user
    const userLogin = await request
      .post('/api/v1/auth/login')
      .send({
        email: 'user@example.com',
        password: 'userpass123'
      });
    userToken = userLogin.body.token;
  });

  describe('POST /admin/merchants', () => {
    it('should create merchant when authenticated as admin', async () => {
      const merchantData = {
        name: 'Test Restaurant',
        contactInfo: {
          email: 'contact@testrestaurant.com',
          phone: '+1-555-0123'
        },
        address: {
          street: '123 Main St',
          city: 'San Francisco',
          zip: '94102',
          coordinates: {
            lat: 37.7749,
            lng: -122.4194
          }
        }
      };

      const response = await request
        .post('/api/v1/admin/merchants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(merchantData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(merchantData.name);
      expect(response.body.status).toBe('pending');
    });

    it('should reject non-admin users', async () => {
      const merchantData = {
        name: 'Unauthorized Restaurant',
        contactInfo: { email: 'test@test.com' },
        address: {
          street: '456 Test St',
          city: 'Test City',
          zip: '12345'
        }
      };

      await request
        .post('/api/v1/admin/merchants')
        .set('Authorization', `Bearer ${userToken}`)
        .send(merchantData)
        .expect(403);
    });
  });

  describe('GET /admin/merchants', () => {
    it('should return all merchants for admin', async () => {
      const response = await request
        .get('/api/v1/admin/merchants')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should reject non-admin users', async () => {
      await request
        .get('/api/v1/admin/merchants')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('PUT /admin/merchants/:merchantId/approve', () => {
    it('should approve merchant status', async () => {
      // First create a merchant to approve
      const merchantData = {
        name: 'Approval Test Restaurant',
        contactInfo: { email: 'approval@test.com' },
        address: {
          street: '789 Approval St',
          city: 'Test City',
          zip: '12345'
        }
      };

      const createResponse = await request
        .post('/api/v1/admin/merchants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(merchantData);

      const merchantId = createResponse.body.id;

      const response = await request
        .put(`/api/v1/admin/merchants/${merchantId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'active' })
        .expect(200);
    });

    it('should reject merchant status', async () => {
      // First create a merchant to reject
      const merchantData = {
        name: 'Rejection Test Restaurant',
        contactInfo: { email: 'rejection@test.com' },
        address: {
          street: '999 Rejection St',
          city: 'Test City',
          zip: '12345'
        }
      };

      const createResponse = await request
        .post('/api/v1/admin/merchants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(merchantData);

      const merchantId = createResponse.body.id;

      await request
        .put(`/api/v1/admin/merchants/${merchantId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'rejected' })
        .expect(200);
    });
  });
});