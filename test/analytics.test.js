import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createAnalytics,
  isProductionHostname,
  sanitizeEventProperties,
  setupAnalyticsEvents,
  umamiConfig
} from '../analytics.js';

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

test('production loader inserts the Umami script once', () => {
  const scripts = [];
  const documentObject = {
    head: { append: (script) => scripts.push(script) },
    querySelector: () => scripts.find((script) => script.dataset.websiteId === umamiConfig.websiteId),
    createElement: () => ({ dataset: {}, addEventListener() {} })
  };
  const analytics = createAnalytics({ location: { hostname: 'iamdenny.com' } }, documentObject);
  assert.equal(analytics.load(), true);
  assert.equal(analytics.load(), true);
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].src, umamiConfig.scriptUrl);
  assert.equal(scripts[0].dataset.websiteId, umamiConfig.websiteId);
  assert.equal(scripts[0].dataset.domains, 'iamdenny.com');
  assert.equal(scripts[0].dataset.excludeSearch, 'true');
  assert.equal(scripts[0].dataset.excludeHash, 'true');
});

test('non-production loader and tracking are disabled', () => {
  const documentObject = {
    head: { append: () => assert.fail('must not append') },
    querySelector: () => null,
    createElement: () => assert.fail('must not create')
  };
  const analytics = createAnalytics({ location: { hostname: 'localhost' } }, documentObject);
  assert.equal(analytics.load(), false);
  assert.equal(analytics.track('cta_click', { page_type: 'home' }), false);
});

test('representative UI actions map to bounded product events', () => {
  let clickHandler;
  const calls = [];
  const analytics = {
    load: () => calls.push(['load']),
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

  click(target({ id: 'generate' }));
  click(target({ href: '#mind', selectors: ['.site-header nav a, .brand, .scroll-cue, footer a'] }));
  click(target({ href: 'mailto:private@example.com', selectors: ['.contact-link'] }));
  click(target({ href: 'https://github.com/iamdenny?tab=repositories', text: 'GITHUB ↗', selectors: ['.contact-bottom div a'] }));
  click(target({ text: 'AI AGENTS', selectors: ['.concept-cloud button'] }));
  click(target({ dataset: { prompt: 'human' }, selectors: ['[data-prompt]'] }));

  assert.deepEqual(calls, [
    ['load'],
    ['cta_click', { page_type: 'home', item_id: 'generate_idea', position: 'co_creation' }],
    ['navigation_click', { page_type: 'home', item_id: 'mind', position: 'header' }],
    ['contact_click', { page_type: 'home', item_type: 'email', destination: 'mailto:private@example.com', position: 'contact' }],
    ['external_link_click', { page_type: 'home', item_type: 'github', destination: 'https://github.com/iamdenny?tab=repositories', position: 'contact' }],
    ['content_open', { page_type: 'home', item_type: 'concept', item_id: 'ai_agents' }],
    ['setting_change', { page_type: 'home', item_type: 'idea_topic', item_id: 'human' }]
  ]);
});
