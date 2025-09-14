#!/usr/bin/env node

const https = require('https');

const REVALIDATE_URL = 'https://sergalgos.vercel.app/api/revalidate';
const SECRET = process.env.REVALIDATE_SECRET;

if (!SECRET) {
  console.error('❌ Error: REVALIDATE_SECRET no está configurado');
  console.log('Usa: REVALIDATE_SECRET=tu_secret node scripts/revalidate-products.js');
  process.exit(1);
}

const payload = JSON.stringify({
  secret: SECRET,
  tags: ['products']
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': payload.length
  }
};

console.log('🔄 Revalidando productos...');

const req = https.request(REVALIDATE_URL, options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      const response = JSON.parse(data);
      console.log('✅ Revalidación exitosa:', response);
    } else {
      console.error('❌ Error en revalidación:', res.statusCode, data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error de conexión:', error);
});

req.write(payload);
req.end();
