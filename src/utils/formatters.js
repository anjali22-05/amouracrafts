export function formatINR(amount) {
  const num = Number(amount) || 0;
  return '₹' + num.toLocaleString('en-IN');
}

export function calculateDiscount(price, mrp) {
  const p = Number(price) || 0;
  const m = Number(mrp) || 0;
  if (!m || m <= p) return null;
  const pct = Math.round(((m - p) / m) * 100);
  return pct > 0 ? `${pct}% OFF` : null;
}

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function cleanDate(d) {
  if (!d) return 'Recent';
  const str = String(d);
  if (str.includes('T')) return str.split('T')[0];
  return str;
}
