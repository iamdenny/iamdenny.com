const GA4_MEASUREMENT_ID = 'G-7KHTY03D2F';
const PRODUCTION_HOSTNAME = 'iamdenny.com';
const CLOUDFLARE_BEACON_TOKEN = '504e76923e694819b00a19e24cfbb922';
const CLOUDFLARE_BEACON_URL = 'https://static.cloudflareinsights.com/beacon.min.js';

const ALLOWED_PROPERTIES = new Set([
  'page_type',
  'item_type',
  'item_id',
  'destination',
  'position',
  'result_count',
  'query_length',
  'has_results'
]);

export function isProductionHostname(hostname) {
  return hostname === PRODUCTION_HOSTNAME;
}

export function loadCloudflareWebAnalytics(windowObject = window, documentObject = document) {
  if (!isProductionHostname(windowObject.location.hostname)) return false;

  const existingBeacon = documentObject.querySelector(
    `script[data-cloudflare-analytics-token="${CLOUDFLARE_BEACON_TOKEN}"]`
  );
  if (existingBeacon) return true;

  const script = documentObject.createElement('script');
  script.defer = true;
  script.src = CLOUDFLARE_BEACON_URL;
  script.dataset.cloudflareAnalyticsToken = CLOUDFLARE_BEACON_TOKEN;
  script.dataset.cfBeacon = JSON.stringify({ token: CLOUDFLARE_BEACON_TOKEN });
  documentObject.head.append(script);
  return true;
}

export function sanitizeEventProperties(properties = {}) {
  return Object.fromEntries(Object.entries(properties).flatMap(([key, value]) => {
    if (!ALLOWED_PROPERTIES.has(key) || value === undefined || value === null) return [];
    if (!['string', 'number', 'boolean'].includes(typeof value)) return [];
    let safeValue = value;
    if (key === 'destination' && typeof value === 'string') {
      try {
        const url = new URL(value, 'https://iamdenny.com');
        if (url.protocol === 'mailto:') safeValue = 'email';
        else if (url.protocol === 'tel:' || url.protocol === 'sms:') safeValue = 'phone';
        else if (url.protocol === 'http:' || url.protocol === 'https:') safeValue = `${url.origin}${url.pathname}`;
        else return [];
      } catch {
        return [];
      }
    }
    if (typeof safeValue === 'string') safeValue = safeValue.slice(0, 100);
    return [[key, safeValue]];
  }));
}

export function createGoogleAnalytics(windowObject = window, documentObject = document) {
  const enabled = isProductionHostname(windowObject.location.hostname);
  const scriptUrl = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  let allowed = false;

  const pageLocation = () => `${windowObject.location.origin}${windowObject.location.pathname}`;

  const load = () => {
    if (!enabled) return false;
    if (allowed) return true;
    const existingScript = documentObject.querySelector(
      `script[data-google-analytics-id="${GA4_MEASUREMENT_ID}"]`
    );

    allowed = true;
    windowObject[`ga-disable-${GA4_MEASUREMENT_ID}`] = false;

    windowObject.dataLayer = windowObject.dataLayer || [];
    if (typeof windowObject.gtag !== 'function') {
      windowObject.gtag = function gtag() {
        windowObject.dataLayer.push(arguments);
      };
    }

    if (existingScript) {
      windowObject.gtag('config', GA4_MEASUREMENT_ID, {
        page_location: pageLocation(),
        send_page_view: true
      });
      return true;
    }

    windowObject.gtag('js', new Date());
    windowObject.gtag('config', GA4_MEASUREMENT_ID, {
      page_location: pageLocation(),
      send_page_view: true
    });

    const script = documentObject.createElement('script');
    script.async = true;
    script.src = scriptUrl;
    script.dataset.googleAnalyticsId = GA4_MEASUREMENT_ID;
    documentObject.head.append(script);
    return true;
  };

  const track = (name, properties) => {
    if (!enabled || !allowed) return false;
    const safeProperties = sanitizeEventProperties(properties);
    if (typeof windowObject.gtag === 'function') windowObject.gtag('event', name, safeProperties);
    return true;
  };

  const revoke = () => {
    allowed = false;
    windowObject[`ga-disable-${GA4_MEASUREMENT_ID}`] = true;
    if (!enabled || typeof documentObject.cookie !== 'string') return true;

    const cookieNames = documentObject.cookie.split(';')
      .map((cookie) => cookie.split('=', 1)[0].trim())
      .filter((name) => /^_ga(?:_|$)/.test(name));
    for (const name of cookieNames) {
      for (const domain of ['', windowObject.location.hostname, `.${windowObject.location.hostname}`]) {
        const domainAttribute = domain ? `; domain=${domain}` : '';
        documentObject.cookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainAttribute}; SameSite=Lax`;
      }
    }
    return true;
  };

  return { enabled, load, revoke, track };
}

export function setupAnalyticsEvents(documentObject = document, analytics = createGoogleAnalytics()) {
  documentObject.addEventListener('click', (event) => {
    const target = event.target?.closest?.('a, button');
    if (!target) return;

    if (target.matches('.concept-cloud button[data-service-id]')) {
      analytics.track('content_open', {
        page_type: 'home', item_type: 'service_task', item_id: target.dataset.serviceId
      });
    } else if (target.matches('[data-service-filter]')) {
      analytics.track('setting_change', {
        page_type: 'home', item_type: 'service_category', item_id: target.dataset.serviceFilter
      });
    } else if (target.matches('a[data-guide-link]')) {
      analytics.track('content_open', {
        page_type: 'home', item_type: 'guide', item_id: target.dataset.guideId
      });
    } else if (target.matches('.contact-link')) {
      analytics.track('contact_click', { page_type: 'home', item_type: 'email', destination: target.href, position: 'contact' });
    } else if (target.matches('.contact-bottom div a')) {
      analytics.track('external_link_click', {
        page_type: 'home',
        item_type: target.textContent.trim().split(/\s/)[0].toLowerCase(),
        destination: target.href,
        position: 'contact'
      });
    } else if (target.matches('.site-header nav a, .brand, .scroll-cue, footer a')) {
      analytics.track('navigation_click', {
        page_type: 'home',
        item_id: target.getAttribute('href')?.replace('#', '') || 'home',
        position: target.closest('footer') ? 'footer' : target.matches('.scroll-cue') ? 'hero' : 'header'
      });
    } else if (target.matches('a[download]')) {
      analytics.track('download', { page_type: 'home', item_id: target.getAttribute('download') || 'file' });
    } else if (target.matches('a[href^="http"]')) {
      analytics.track('external_link_click', { page_type: 'home', destination: target.href });
    }
  });

  return analytics;
}

export const googleAnalyticsConfig = Object.freeze({
  measurementId: GA4_MEASUREMENT_ID,
  productionHostname: PRODUCTION_HOSTNAME
});
