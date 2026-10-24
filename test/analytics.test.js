import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createGoogleAnalytics,
  isProductionHostname,
  loadCloudflareWebAnalytics,
  sanitizeEventProperties,
  setupAnalyticsEvents,
  googleAnalyticsConfig
} from '../analytics.js';
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  persistAnalyticsConsent,
  readAnalyticsConsent
} from '../analytics-consent.js';

test('analytics is enabled only on the canonical production hostname', () => {
  assert.equal(isProductionHostname('iamdenny.com'), true);
  assert.equal(isProductionHostname('www.iamdenny.com'), false);
  assert.equal(isProductionHostname('localhost'), false);
});

test('event properties are allowlisted and destinations lose query data', () => {
  assert.deepEqual(sanitizeEventProperties({
    page_type: 'home',
    destination: 'https://example.com/path?email=private@example.com#fragment',
    query: 'private search',
    email: 'private@example.com',
    result_count: 2
  }), {
    page_type: 'home',
    destination: 'https://example.com/path',
    result_count: 2
  });
  assert.equal(sanitizeEventProperties({ destination: 'mailto:private@example.com' }).destination, 'email');
  assert.equal(sanitizeEventProperties({ destination: 'tel:+821012345678' }).destination, 'phone');
  assert.equal(sanitizeEventProperties({ destination: 'sms:+821012345678' }).destination, 'phone');
  assert.deepEqual(sanitizeEventProperties({ destination: 'javascript:alert(1)' }), {});
  assert.deepEqual(sanitizeEventProperties({ destination: 'http://[' }), {});
});

test('Google Analytics stays unloaded until explicitly allowed, then sends a clean page view once', () => {
  const scripts = [];
  const dataLayer = [];
  const windowObject = {
    location: {
      hostname: 'iamdenny.com',
      origin: 'https://iamdenny.com',
      pathname: '/',
      search: '?private=1',
      hash: '#section'
    },
    dataLayer
  };
  const documentObject = {
    head: { append: (script) => scripts.push(script) },
    querySelector: () => scripts.find((script) => script.dataset.googleAnalyticsId === googleAnalyticsConfig.measurementId),
    createElement: () => ({ dataset: {}, addEventListener() {} })
  };
  const analytics = createGoogleAnalytics(windowObject, documentObject);
  assert.equal(analytics.track('cta_click', { page_type: 'home' }), false);
  assert.equal(scripts.length, 0);
  assert.equal(windowObject.gtag, undefined);
  assert.equal(analytics.load(), true);
  assert.equal(analytics.load(), true);
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].src, `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsConfig.measurementId}`);
  assert.equal(scripts[0].dataset.googleAnalyticsId, googleAnalyticsConfig.measurementId);
  assert.equal(dataLayer[0][0], 'js');
  assert.equal(dataLayer[1][0], 'config');
  assert.equal(dataLayer[1][1], googleAnalyticsConfig.measurementId);
  assert.deepEqual(dataLayer[1][2], {
    page_location: 'https://iamdenny.com/',
    send_page_view: true
  });
  analytics.track('cta_click', { page_type: 'home', query: 'private' });
  assert.equal(dataLayer[2][0], 'event');
  assert.equal(dataLayer[2][1], 'cta_click');
  assert.deepEqual(dataLayer[2][2], { page_type: 'home' });
});

test('withdrawal disables future tracking and removes first-party Google Analytics cookies', () => {
  const scripts = [];
  const cookieWrites = [];
  const windowObject = {
    location: { hostname: 'iamdenny.com', origin: 'https://iamdenny.com', pathname: '/guides/example.html' },
    dataLayer: []
  };
  const documentObject = {
    get cookie() { return '_ga=visitor; _ga_7KHTY03D2F=session; other=value'; },
    set cookie(value) { cookieWrites.push(value); },
    head: { append: (script) => scripts.push(script) },
    querySelector: () => scripts.find((script) => script.dataset.googleAnalyticsId === googleAnalyticsConfig.measurementId),
    createElement: () => ({ dataset: {}, addEventListener() {} })
  };
  const analytics = createGoogleAnalytics(windowObject, documentObject);
  assert.equal(analytics.load(), true);
  assert.equal(analytics.track('content_open', { page_type: 'guide' }), true);
  assert.equal(analytics.revoke(), true);
  assert.equal(windowObject[`ga-disable-${googleAnalyticsConfig.measurementId}`], true);
  assert.equal(analytics.track('content_open', { page_type: 'guide' }), false);
  assert.equal(cookieWrites.length, 6);
  assert.ok(cookieWrites.every((cookie) => cookie.startsWith('_ga')));
  assert.equal(analytics.load(), true);
  assert.equal(windowObject[`ga-disable-${googleAnalyticsConfig.measurementId}`], false);
  assert.equal(analytics.track('content_open', { page_type: 'guide' }), true);
  assert.equal(scripts.length, 1);
});

test('non-production loader and tracking are disabled', () => {
  const documentObject = {
    head: { append: () => assert.fail('must not append') },
    querySelector: () => null,
    createElement: () => assert.fail('must not create')
  };
  const analytics = createGoogleAnalytics({ location: { hostname: 'localhost' } }, documentObject);
  assert.equal(analytics.load(), false);
  assert.equal(analytics.track('cta_click', { page_type: 'home' }), false);
});

test('Cloudflare Web Analytics is loaded only on the canonical hostname', () => {
  const scripts = [];
  const documentObject = {
    head: { append: (script) => scripts.push(script) },
    querySelector: () => null,
    createElement: () => ({ dataset: {} })
  };

  assert.equal(loadCloudflareWebAnalytics({ location: { hostname: 'localhost' } }, documentObject), false);
  assert.equal(scripts.length, 0);
  assert.equal(loadCloudflareWebAnalytics({ location: { hostname: 'iamdenny.com' } }, documentObject), true);
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].src, 'https://static.cloudflareinsights.com/beacon.min.js');
  assert.equal(scripts[0].dataset.cloudflareAnalyticsToken, '504e76923e694819b00a19e24cfbb922');
  assert.equal(scripts[0].dataset.cfBeacon, JSON.stringify({ token: '504e76923e694819b00a19e24cfbb922' }));
});

test('service navigation and guide actions map to bounded product events', () => {
  let clickHandler;
  const calls = [];
  const analytics = {
    track: (name, properties) => calls.push([name, properties])
  };
  const documentObject = {
    addEventListener: (name, handler) => {
      if (name === 'click') clickHandler = handler;
    }
  };

  setupAnalyticsEvents(documentObject, analytics);
  const click = (target) => clickHandler({ target: { closest: () => target } });
  const target = ({ id = '', href = '', text = '', dataset = {}, selectors = [], footer = false }) => ({
    id,
    href,
    dataset,
    textContent: text,
    matches: (selector) => selectors.includes(selector),
    getAttribute: (name) => name === 'href' ? href : name === 'download' ? '' : null,
    closest: (selector) => selector === 'footer' && footer ? {} : null
  });

  click(target({ href: '#mind', selectors: ['.site-header nav a, .brand, .scroll-cue, footer a'] }));
  click(target({ href: 'mailto:private@example.com', selectors: ['.contact-link'] }));
  click(target({ href: 'https://github.com/iamdenny?tab=repositories', text: 'GITHUB ↗', selectors: ['.contact-bottom div a'] }));
  click(target({ text: '대진표', dataset: { serviceId: 'bracket' }, selectors: ['.concept-cloud button[data-service-id]'] }));
  click(target({ dataset: { serviceFilter: 'work' }, selectors: ['[data-service-filter]'] }));
  click(target({ dataset: { guideId: 'tournament-format' }, selectors: ['a[data-guide-link]'] }));

  assert.deepEqual(calls, [
    ['navigation_click', { page_type: 'home', item_id: 'mind', position: 'header' }],
    ['contact_click', { page_type: 'home', item_type: 'email', destination: 'mailto:private@example.com', position: 'contact' }],
    ['external_link_click', { page_type: 'home', item_type: 'github', destination: 'https://github.com/iamdenny?tab=repositories', position: 'contact' }],
    ['content_open', { page_type: 'home', item_type: 'service_task', item_id: 'bracket' }],
    ['setting_change', { page_type: 'home', item_type: 'service_category', item_id: 'work' }],
    ['content_open', { page_type: 'home', item_type: 'guide', item_id: 'tournament-format' }]
  ]);
});

test('analytics consent accepts only an explicit stored decision and fails closed', () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  };

  assert.equal(ANALYTICS_CONSENT_STORAGE_KEY, 'iamdenny.analytics-consent.v1');
  assert.equal(readAnalyticsConsent(storage), null);
  assert.equal(persistAnalyticsConsent(storage, 'granted'), true);
  assert.equal(readAnalyticsConsent(storage), 'granted');
  assert.equal(persistAnalyticsConsent(storage, 'denied'), true);
  assert.equal(readAnalyticsConsent(storage), 'denied');
  assert.equal(persistAnalyticsConsent(storage, 'unknown'), false);
  assert.equal(readAnalyticsConsent({ getItem: () => { throw new Error('blocked'); } }), null);
  assert.equal(persistAnalyticsConsent({ setItem: () => { throw new Error('blocked'); } }, 'granted'), false);
  assert.equal(persistAnalyticsConsent(null, 'denied'), false);
});
