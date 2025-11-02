const supertest = require('supertest');
const app = require('../../../src/app'); // Adjusted path to Express app
const request = supertest(app);

describe('Authentication Endpoints', () => {
  describe('POST /auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        location: {
          city: 'San Francisco',
          zip: '94102'
        }
      };

      const response = await request
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should reject registration with invalid email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123'
      };

      await request
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400);
    });

    it('should reject registration with short password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123'
      };

      await request
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      // Assuming user exists from previous test or setup
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      };

      const response = await request
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should reject login with invalid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword'
      };

      await request
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401);
    });
  });
});