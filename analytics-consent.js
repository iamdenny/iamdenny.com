import { createGoogleAnalytics } from './analytics.js';

export const ANALYTICS_CONSENT_STORAGE_KEY = 'iamdenny.analytics-consent.v1';

export function readAnalyticsConsent(storage) {
  try {
    const value = storage?.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

export function persistAnalyticsConsent(storage, value) {
  if (value !== 'granted' && value !== 'denied') return false;
  try {
    storage?.setItem(ANALYTICS_CONSENT_STORAGE_KEY, value);
    return Boolean(storage);
  } catch {
    return false;
  }
}

export function initializeAnalyticsConsent(
  windowObject = window,
  documentObject = document,
  analytics = createGoogleAnalytics(windowObject, documentObject)
) {
  if (!documentObject.body || documentObject.getElementById('analytics-settings')) return null;

  let storage;
  try {
    storage = windowObject.localStorage;
  } catch {
    storage = null;
  }

  let preference = readAnalyticsConsent(storage);
  const panel = documentObject.createElement('section');
  panel.id = 'analytics-settings';
  panel.className = 'analytics-consent';
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', 'analytics-consent-title');
  panel.setAttribute('aria-describedby', 'analytics-consent-description');

  const title = documentObject.createElement('h2');
  title.id = 'analytics-consent-title';
  title.textContent = '방문 분석 설정';

  const description = documentObject.createElement('p');
  description.id = 'analytics-consent-description';
  description.textContent = 'Google Analytics를 허용하면 이 사이트의 페이지 이용과 브라우저·기기 정보가 방문 통계에 사용됩니다. 선택하기 전에는 GA4를 불러오지 않습니다. 선택은 이 브라우저에 저장되며 언제든 바꿀 수 있습니다. 자세한 내용은 개인정보 안내를 확인하세요.';

  const policyLink = documentObject.createElement('a');
  policyLink.href = new URL('/privacy.html', windowObject.location.origin).href;
  policyLink.textContent = '개인정보 안내';
  description.append(' ');
  description.append(policyLink);

  const status = documentObject.createElement('p');
  status.className = 'analytics-consent-status analytics-consent-announcement visually-hidden';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  const currentState = documentObject.createElement('p');
  currentState.className = 'analytics-consent-status';

  const actions = documentObject.createElement('div');
  actions.className = 'analytics-consent-actions';

  const denyButton = documentObject.createElement('button');
  denyButton.type = 'button';
  denyButton.className = 'analytics-consent-choice';
  denyButton.dataset.analyticsDeny = '';
  denyButton.textContent = '분석 사용 안 함';

  const allowButton = documentObject.createElement('button');
  allowButton.type = 'button';
  allowButton.className = 'analytics-consent-choice';
  allowButton.dataset.analyticsAllow = '';
  allowButton.textContent = '분석 허용';

  actions.append(denyButton, allowButton);
  panel.append(title, description, currentState, actions);
  documentObject.body.append(status);
  documentObject.body.append(panel);

  const settingsButtons = [...documentObject.querySelectorAll('[data-analytics-settings]')];
  for (const button of settingsButtons) {
    button.setAttribute('aria-controls', panel.id);
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      panel.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      denyButton.focus();
    });
  }

  const setOpen = (open) => {
    panel.hidden = !open;
    settingsButtons.forEach((button) => button.setAttribute('aria-expanded', String(open)));
  };

  const updateStatus = () => {
    currentState.textContent = preference === 'granted'
      ? '현재 이 브라우저에서는 Google Analytics 사용을 허용한 상태입니다.'
      : preference === 'denied'
        ? '현재 이 브라우저에서는 Google Analytics를 사용하지 않습니다.'
        : '선택하기 전에는 Google Analytics를 불러오지 않습니다.';
  };

  const saveChoice = (nextPreference) => {
    const saved = persistAnalyticsConsent(storage, nextPreference);
    if (nextPreference === 'granted' && !saved) {
      currentState.textContent = '이 브라우저에 선택을 저장할 수 없어 분석을 허용하지 않았습니다. 분석은 연결되지 않았습니다.';
      status.textContent = currentState.textContent;
      return false;
    }

    preference = nextPreference;
    if (preference === 'granted') analytics.load();
    else analytics.revoke();
    updateStatus();
    status.textContent = currentState.textContent;
    if (!saved) {
      const notice = ' 브라우저 저장이 차단되어 다음 방문에 다시 선택해야 합니다.';
      currentState.textContent += notice;
      status.textContent += notice;
    }
    setOpen(false);
    return saved;
  };

  denyButton.addEventListener('click', () => saveChoice('denied'));
  allowButton.addEventListener('click', () => saveChoice('granted'));

  if (preference === 'granted') analytics.load();
  else analytics.revoke();
  updateStatus();
  setOpen(preference === null || windowObject.location.hash === `#${panel.id}`);

  windowObject.addEventListener('hashchange', () => {
    if (windowObject.location.hash === `#${panel.id}`) setOpen(true);
  });

  return {
    get preference() { return preference; },
    open: () => setOpen(true),
    saveChoice,
    panel
  };
}
