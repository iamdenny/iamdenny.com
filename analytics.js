const UMAMI_SCRIPT_URL = 'https://analytics.iamdenny.com/script.js';
const UMAMI_WEBSITE_ID = 'ea762dc9-a791-414e-890d-eb86e138dabd';
const PRODUCTION_HOSTNAME = 'iamdenny.com';

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

export function createAnalytics(windowObject = window, documentObject = document) {
  const enabled = isProductionHostname(windowObject.location.hostname);
  const queue = [];

  const flush = () => {
    if (!windowObject.umami?.track) return;
    queue.splice(0).forEach(([name, properties]) => windowObject.umami.track(name, properties));
  };

  const track = (name, properties) => {
    if (!enabled) return false;
    const safeProperties = sanitizeEventProperties(properties);
    if (windowObject.umami?.track) windowObject.umami.track(name, safeProperties);
    else queue.push([name, safeProperties]);
    return true;
  };

  const load = () => {
    if (!enabled) return false;
    const existingScript = documentObject.querySelector(`script[data-website-id="${UMAMI_WEBSITE_ID}"]`);
    if (existingScript) {
      if (windowObject.umami?.track) flush();
      else existingScript.addEventListener('load', flush, { once: true });
      return true;
    }
    const script = documentObject.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = UMAMI_SCRIPT_URL;
    script.dataset.websiteId = UMAMI_WEBSITE_ID;
    script.dataset.domains = PRODUCTION_HOSTNAME;
    script.dataset.excludeSearch = 'true';
    script.dataset.excludeHash = 'true';
    script.addEventListener('load', flush);
    documentObject.head.append(script);
    return true;
  };

  return { enabled, load, track };
}

export function setupAnalyticsEvents(documentObject = document, analytics = createAnalytics()) {
  documentObject.addEventListener('click', (event) => {
    const target = event.target?.closest?.('a, button');
    if (!target) return;

    if (target.matches('.concept-cloud button')) {
      analytics.track('content_open', {
        page_type: 'home', item_type: 'concept', item_id: target.textContent.trim().toLowerCase().replace(/\s+/g, '_')
      });
    } else if (target.id === 'generate') {
      analytics.track('cta_click', { page_type: 'home', item_id: 'generate_idea', position: 'co_creation' });
    } else if (target.matches('[data-prompt]')) {
      analytics.track('setting_change', { page_type: 'home', item_type: 'idea_topic', item_id: target.dataset.prompt });
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

  analytics.load();
  return analytics;
}

export const umamiConfig = Object.freeze({
  scriptUrl: UMAMI_SCRIPT_URL,
  websiteId: UMAMI_WEBSITE_ID,
  productionHostname: PRODUCTION_HOSTNAME
});
