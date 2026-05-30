/**
 * AdTech Tracking SDK
 * Simulates how a retailer integrates the platform.
 * Drop this into any page — it auto-detects context and fires events.
 */

const COLLECTOR_URL = process.env.REACT_APP_COLLECTOR_URL || 'http://localhost:8080';

// One session per browser tab
const SESSION_ID = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function detectBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edg')) return 'Edge';
  return 'Other';
}

function detectOS() {
  const ua = navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Other';
}

function detectDevice() {
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return 'mobile';
  if (/Tablet|iPad/i.test(ua)) return 'tablet';
  return 'desktop';
}

// Randomly assign a country for demo purposes
const DEMO_COUNTRIES = ['US', 'IN', 'GB', 'DE', 'AU', 'CA', 'SG', 'FR'];
const DEMO_COUNTRY = DEMO_COUNTRIES[Math.floor(Math.random() * DEMO_COUNTRIES.length)];

function buildBasePayload(tenantId) {
  return {
    eventId: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    tenantId,
    userId: localStorage.getItem('adtech_user_id') || initUserId(),
    sessionId: SESSION_ID,
    timestamp: new Date().toISOString(),
    browser: detectBrowser(),
    os: detectOS(),
    deviceType: detectDevice(),
    country: DEMO_COUNTRY,
    pageUrl: window.location.href,
    referrer: document.referrer || null,
  };
}

function initUserId() {
  const id = `user-${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem('adtech_user_id', id);
  return id;
}

async function send(payload) {
  try {
    const res = await fetch(`${COLLECTOR_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log(`[AdTech SDK] ${payload.eventType} → ${res.status}`, payload);
  } catch (err) {
    console.error('[AdTech SDK] Failed to send event', err);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export function trackProductView(tenantId, productId) {
  send({ ...buildBasePayload(tenantId), eventType: 'PRODUCT_VIEW', productId });
}

export function trackAdImpression(tenantId, campaignId, adId, productId) {
  send({ ...buildBasePayload(tenantId), eventType: 'AD_IMPRESSION', campaignId, adId, productId });
}

export function trackAdClick(tenantId, campaignId, adId, productId) {
  send({ ...buildBasePayload(tenantId), eventType: 'AD_CLICK', campaignId, adId, productId });
}

export function trackAddToCart(tenantId, productId, campaignId = null) {
  send({ ...buildBasePayload(tenantId), eventType: 'ADD_TO_CART', productId, campaignId });
}

export function trackProductClick(tenantId, productId) {
  send({ ...buildBasePayload(tenantId), eventType: 'PRODUCT_CLICK', productId });
}
