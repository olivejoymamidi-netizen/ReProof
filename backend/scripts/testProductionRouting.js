const http = require('http');

function checkRoute(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:4173${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          path,
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          isHtml: data.includes('<div id="root"') && data.includes('<!doctype html>'),
          contentLength: data.length,
        });
      });
    }).on('error', reject);
  });
}

async function verifyAllRoutes() {
  const routesToTest = [
    '/',
    '/dashboard',
    '/dashboard?__clerk_status=verified',
    '/login',
    '/project',
    '/technical-interview',
    '/evidence-analysis',
    '/skill-proof',
  ];

  console.log('TESTING PRODUCTION SPA ROUTING ON VITE PREVIEW (PORT 4173):');
  let passed = true;

  for (const route of routesToTest) {
    const res = await checkRoute(route);
    if (res.statusCode === 200 && res.isHtml) {
      console.log(`  ✓ ${route.padEnd(40)} -> HTTP ${res.statusCode} (SPA index.html served, ${res.contentLength} bytes)`);
    } else {
      console.error(`  ✗ ${route.padEnd(40)} -> HTTP ${res.statusCode} (isHtml: ${res.isHtml})`);
      passed = false;
    }
  }

  // Also verify static assets don't return HTML
  const assetRes = await checkRoute('/assets/index-CMjLpe-L.css');
  if (assetRes.statusCode === 200 && !assetRes.isHtml) {
    console.log(`  ✓ Static asset /assets/index-CMjLpe-L.css  -> HTTP 200 (Proper CSS file served)`);
  } else {
    console.error(`  ✗ Static asset failed:`, assetRes);
    passed = false;
  }

  if (passed) {
    console.log('\n✓ ALL CLIENT-SIDE SPA ROUTES DIRECTLY ACCESSIBLE IN PRODUCTION PREVIEW WITHOUT 404!');
  } else {
    process.exit(1);
  }
}

verifyAllRoutes().catch((err) => {
  console.error('Routing check failed:', err);
  process.exit(1);
});
