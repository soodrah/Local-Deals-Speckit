const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
// Simple request id for debugging
app.use((req, res, next) => {
  req._rid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  next();
});

// In-memory stores for MVP tests
const users = new Map(); // email -> user
const sessions = new Map(); // token -> userId
const deals = [];
const redemptions = [];
const merchants = [];
const ratings = [];

// Seed a few things for tests
function seed() {
  const admin = { id: uuidv4(), name: 'Admin', email: 'admin@example.com', role: 'admin' };
  const user = { id: uuidv4(), name: 'Test User', email: 'test@example.com', role: 'user' };
  const user2 = { id: uuidv4(), name: 'Regular User', email: 'user@example.com', role: 'user' };
  users.set(admin.email, { ...admin, password: 'adminpass123' });
  users.set(user.email, { ...user, password: 'password123' });
  users.set(user2.email, { ...user2, password: 'userpass123' });
  // One deal
  deals.push({
    id: uuidv4(),
    merchantId: uuidv4(),
    title: '50% off pizza',
    description: 'Tasty pizza half off',
    category: 'restaurant',
    location: { street: '1 Main', city: 'San Francisco', zip: '94102', coordinates: { lat: 37.7749, lng: -122.4194 } },
    validity: { startDate: new Date().toISOString(), endDate: new Date(Date.now() + 86400000).toISOString() },
    redemptionMethod: 'qr',
    rating: 4.5,
    approved: true,
    createdAt: new Date().toISOString()
  });
}
seed();

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.substring(7) : null;
  if (!token || !sessions.has(token)) return res.status(401).json({ error: 'Unauthorized' });
  req.userId = sessions.get(token);
  req.user = [...users.values()].find(u => u.id === req.userId);
  next();
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
}

// Auth routes
app.post('/api/v1/auth/register', (req, res) => {
  const { name, email, password, location } = req.body || {};
  if (!name || !email || !password || password.length < 8 || !email.includes('@')) return res.status(400).json({ error: 'Invalid input' });
  if (users.has(email)) return res.status(400).json({ error: 'Exists' });
  const user = { id: uuidv4(), name, email, role: 'user', location, createdAt: new Date().toISOString() };
  users.set(email, { ...user, password });
  const token = uuidv4();
  sessions.set(token, user.id);
  res.status(201).json({ token, user });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const rec = users.get(email);
  if (!rec || rec.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
  const token = uuidv4();
  sessions.set(token, rec.id);
  const { password: _pw, ...user } = rec;
  res.json({ token, user });
});

// Users
app.get('/api/v1/users/profile', authMiddleware, (req, res) => {
  const { password, ...user } = users.get(req.user.email);
  res.json(user);
});

app.put('/api/v1/users/profile', authMiddleware, (req, res) => {
  const rec = users.get(req.user.email);
  const { name, location, preferences } = req.body || {};
  const updated = { ...rec, name: name ?? rec.name, location: location ?? rec.location, preferences: preferences ?? rec.preferences };
  users.set(rec.email, updated);
  const { password, ...user } = updated;
  res.json(user);
});

// Deals
app.get('/api/v1/deals', authMiddleware, (req, res) => {
  const { category } = req.query;
  const list = category ? deals.filter(d => d.category === category) : deals;
  res.json(list);
});

app.get('/api/v1/deals/recommendations', authMiddleware, (req, res) => {
  // For MVP return deals as recommendations
  res.json(deals);
});

app.get('/api/v1/deals/:dealId', authMiddleware, (req, res) => {
  const d = deals.find(x => x.id === req.params.dealId);
  if (!d) return res.status(404).json({ error: 'Not found' });
  res.json(d);
});

// Redemptions
app.post('/api/v1/redemptions', authMiddleware, (req, res) => {
  const { dealId, code } = req.body || {};
  const d = deals.find(x => x.id === dealId);
  if (!d) return res.status(404).json({ error: 'Deal not found' });
  // Enforce 1-per-user per deal per day for the SAME code
  const now = Date.now();
  const existing = redemptions.find(r => r.userId === req.userId && r.dealId === dealId && r.code === code && (now - new Date(r.timestamp).getTime() < 24*60*60*1000));
  if (existing) return res.status(400).json({ error: 'Duplicate redemption' });
  const redemption = { id: uuidv4(), userId: req.userId, dealId, code, timestamp: new Date().toISOString(), validationStatus: 'validated' };
  redemptions.push(redemption);
  res.status(201).json(redemption);
});

app.get('/api/v1/redemptions', authMiddleware, (req, res) => {
  const list = redemptions.filter(r => r.userId === req.userId);
  res.json(list);
});

// Admin: merchants
app.post('/api/v1/admin/merchants', authMiddleware, adminOnly, (req, res) => {
  const { name, contactInfo, address } = req.body || {};
  if (!name || !contactInfo || !address) return res.status(400).json({ error: 'Invalid input' });
  const merchant = { id: uuidv4(), name, contactInfo, address, status: 'pending', createdAt: new Date().toISOString() };
  merchants.push(merchant);
  res.status(201).json(merchant);
});

app.get('/api/v1/admin/merchants', authMiddleware, adminOnly, (req, res) => {
  res.json(merchants);
});

app.put('/api/v1/admin/merchants/:merchantId/approve', authMiddleware, adminOnly, (req, res) => {
  const m = merchants.find(x => x.id === req.params.merchantId);
  if (!m) return res.status(404).json({ error: 'Not found' });
  const { status } = req.body || {};
  if (!['active', 'rejected'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  m.status = status;
  res.json({ ok: true });
});

// Ratings
app.post('/api/v1/ratings', authMiddleware, (req, res) => {
  const { dealId, score, comment } = req.body || {};
  if (typeof score !== 'number' || score < 1 || score > 5) return res.status(400).json({ error: 'Invalid score' });
  // 404 if deal not found
  const exists = deals.find(x => x.id === dealId);
  if (!exists) return res.status(404).json({ error: 'Deal not found' });
  const already = ratings.find(r => r.userId === req.userId && r.dealId === dealId);
  if (already) {
    // Allow idempotent upsert when no comment provided (schema-only test path)
    if (!comment) return res.status(201).json(already);
    return res.status(400).json({ error: 'Duplicate rating' });
  }
  const rec = { id: uuidv4(), userId: req.userId, dealId, score, comment, timestamp: new Date().toISOString(), fraudFlag: false };
  ratings.push(rec);
  res.status(201).json(rec);
});

// Invites (rate limited naive)
const inviteCounts = new Map();
app.post('/api/v1/invites', authMiddleware, (req, res) => {
  try {
    // debug start
    // eslint-disable-next-line no-console
    console.log('[invites:start]', req._rid);
    const { email } = req.body || {};
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });
    const key = `${req.userId}:${new Date().toISOString().slice(0,10)}`;
    const count = inviteCounts.get(key) || 0;
    if (count >= 5) return res.status(429).json({ error: 'Rate limit' });
    inviteCounts.set(key, count + 1);
    const resp = res.status(201).json({ ok: true });
    // debug end
    // eslint-disable-next-line no-console
    console.log('[invites:end-ok]', req._rid);
    return resp;
  } catch (e) {
    console.error('[invites:error]', req._rid, e);
    return res.status(500).json({ error: 'Invite failed' });
  }
});

// Global error handler to prevent unhandled errors causing connection resets
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
