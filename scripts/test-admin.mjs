import 'dotenv/config';
import fetch from 'node-fetch';

async function run() {
  const base = process.env.API_BASE || 'http://localhost:3000';
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const code = process.env.ADMIN_CODE;

  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  console.log('Calling admin login...');
  const loginRes = await fetch(`${base}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  console.log('login status', loginRes.status);
  const loginData = await loginRes.text();
  try { console.log('login json:', JSON.parse(loginData)); } catch { console.log('login text:', loginData); }

  if (loginRes.status !== 200) {
    console.error('Admin login failed; check credentials and server logs');
    process.exit(2);
  }

  console.log('Calling admin verify...');
  const verifyRes = await fetch(`${base}/api/admin/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  console.log('verify status', verifyRes.status);
  const verifyJson = await verifyRes.json().catch(() => null);
  console.log('verify json:', verifyJson);

  if (verifyRes.status !== 200) {
    console.error('Verify failed; check ADMIN_CODE and server logs');
    process.exit(3);
  }

  const token = verifyJson?.token;
  if (!token) {
    console.error('No token returned from verify');
    process.exit(4);
  }

  console.log('Calling protected endpoint /api/admin/me with token...');
  const meRes = await fetch(`${base}/api/admin/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('me status', meRes.status);
  const meJson = await meRes.json().catch(() => null);
  console.log('me json:', meJson);

  process.exit(0);
}

run().catch((err) => {
  console.error('Error in test-admin script:', err);
  process.exit(10);
});
