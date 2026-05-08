const assert = require('assert');

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

try {
  assert.strictEqual(formatPrice(12.5), '$12.50');
  assert.strictEqual(formatPrice(0), '$0.00');
  console.log('formatPrice tests passed');
  process.exit(0);
} catch (err) {
  console.error('formatPrice tests failed', err);
  process.exit(1);
}
