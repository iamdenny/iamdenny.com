import { createGoogleAnalytics, loadCloudflareWebAnalytics, setupAnalyticsEvents } from './analytics.js';
import { initializeAnalyticsConsent } from './analytics-consent.js';
import { initSpace } from './space.js';

const analytics = createGoogleAnalytics();
setupAnalyticsEvents(document, analytics);
initializeAnalyticsConsent(window, document, analytics);
loadCloudflareWebAnalytics();

const root = document.documentElement;
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const reduceMotion = motionPreference.matches;
const reloadForMotionPreference = () => location.reload();
if (motionPreference.addEventListener) motionPreference.addEventListener('change', reloadForMotionPreference);
else motionPreference.addListener(reloadForMotionPreference);
const pointerState = {
  targetX: innerWidth / 2,
  targetY: innerHeight / 2,
  x: innerWidth / 2,
  y: innerHeight / 2,
  speed: 0,
  speedTarget: 0
};

if (!reduceMotion) {
  let scrollTarget = 0;
  let scrollMotion = 0;
  let previousScroll = scrollY;
  let motionFrame = 0;

  addEventListener('pointermove', (event) => {
    const distance = Math.hypot(event.clientX - pointerState.targetX, event.clientY - pointerState.targetY);
    pointerState.targetX = event.clientX;
    pointerState.targetY = event.clientY;
    pointerState.speedTarget = Math.min(distance / 55, 1);
  }, { passive: true });

  addEventListener('scroll', () => {
    scrollTarget = Math.max(-8, Math.min(8, (scrollY - previousScroll) * .16));
    previousScroll = scrollY;
  }, { passive: true });

  const renderMotion = () => {
    motionFrame = 0;
    if (document.hidden) return;
    pointerState.x += (pointerState.targetX - pointerState.x) * .095;
    pointerState.y += (pointerState.targetY - pointerState.y) * .095;
    pointerState.speed += (pointerState.speedTarget - pointerState.speed) * .12;
    pointerState.speedTarget *= .88;
    scrollMotion += (scrollTarget - scrollMotion) * .14;
    scrollTarget *= .86;

    const nx = (pointerState.x / innerWidth - .5) * 2;
    const ny = (pointerState.y / innerHeight - .5) * 2;
    root.style.setProperty('--cx', `${pointerState.x.toFixed(1)}px`);
    root.style.setProperty('--cy', `${pointerState.y.toFixed(1)}px`);
    root.style.setProperty('--nx', nx.toFixed(4));
    root.style.setProperty('--ny', ny.toFixed(4));
    root.style.setProperty('--velocity', pointerState.speed.toFixed(3));
    root.style.setProperty('--scroll-v', scrollMotion.toFixed(3));

    motionFrame = requestAnimationFrame(renderMotion);
  };
  const startMotion = () => {
    if (!document.hidden && !motionFrame) motionFrame = requestAnimationFrame(renderMotion);
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && motionFrame) {
      cancelAnimationFrame(motionFrame);
      motionFrame = 0;
    } else {
      startMotion();
    }
  });
  startMotion();
}

document.querySelectorAll('[data-depth]').forEach((element) => {
  element.style.setProperty('--depth', element.dataset.depth);
});

document.querySelectorAll('.kinetic-text').forEach((heading) => {
  const label = heading.innerText.replace(/\s+/g, ' ').trim();
  heading.setAttribute('aria-label', label);
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  let glyphIndex = 0;
  textNodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    [...node.nodeValue].forEach((character) => {
      const glyph = document.createElement('span');
      glyph.className = character === ' ' ? 'glyph glyph-space' : 'glyph';
      glyph.setAttribute('aria-hidden', 'true');
      glyph.style.setProperty('--gi', glyphIndex);
      glyph.style.setProperty('--gx', (((glyphIndex % 9) - 4) / 4).toFixed(2));
      glyph.textContent = character === ' ' ? '\u00a0' : character;
      fragment.append(glyph);
      glyphIndex += 1;
    });
    node.replaceWith(fragment);
  });
});

const universe = document.querySelector('#concept-universe');
const conceptButtons = [...document.querySelectorAll('.concept-cloud button')];
const conceptKicker = document.querySelector('#concept-kicker');
const conceptFocus = document.querySelector('#concept-focus');
const conceptDefinition = document.querySelector('#concept-definition');
const conceptAction = document.querySelector('#concept-action');

const groupNames = {
  work: 'EVERYDAY WORK',
  organize: 'PLAN AND ORGANIZE',
  play: 'PLAY AND CHOOSE',
  create: 'MAKE AND SHARE',
  learn: 'PRACTICE AND LEARN',
  explore: 'DATA AND SCALE',
  community: 'TABLE TENNIS'
};

function activateConcept(button) {
  const group = button.dataset.group;
  universe?.classList.add('has-active');
  conceptButtons.forEach((item) => {
    item.classList.toggle('is-active', item === button);
    item.classList.toggle('is-related', item !== button && item.dataset.group === group);
  });
  conceptKicker.textContent = groupNames[group];
  conceptFocus.textContent = button.textContent;
  conceptDefinition.textContent = button.dataset.definition;
  conceptAction.href = button.dataset.serviceUrl;
  conceptAction.textContent = `${button.dataset.serviceLabel} ↗`;
  if (!reduceMotion) {
    [conceptKicker, conceptFocus, conceptDefinition].forEach((item, index) => {
      item.animate(
        [{ opacity: 0, transform: 'translateY(8px)', filter: 'blur(5px)' }, { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' }],
        { duration: 420 + index * 80, easing: 'cubic-bezier(.2,.8,.2,1)' }
      );
    });
  }
}

function resetConcepts() {
  universe?.classList.remove('has-active');
  conceptButtons.forEach((item) => item.classList.remove('is-active', 'is-related'));
  conceptKicker.textContent = 'START WITH A TASK';
  conceptFocus.textContent = '어떤 일을 할까요?';
  conceptDefinition.textContent = '주제를 고르면 필요한 기능과 시작 방법을 보여드립니다.';
  conceptAction.href = 'https://tools.iamdenny.com/ko/';
  conceptAction.textContent = 'Everyday Tools 둘러보기 ↗';
}

conceptButtons.forEach((button) => {
  button.addEventListener('pointerenter', () => activateConcept(button));
  button.addEventListener('pointermove', (event) => {
    if (reduceMotion) return;
    const rect = button.getBoundingClientRect();
    button.style.setProperty('--pull-x', ((event.clientX - rect.left - rect.width / 2) * .22).toFixed(1));
    button.style.setProperty('--pull-y', ((event.clientY - rect.top - rect.height / 2) * .22).toFixed(1));
  });
  button.addEventListener('pointerleave', () => {
    button.style.setProperty('--pull-x', '0');
    button.style.setProperty('--pull-y', '0');
  });
  button.addEventListener('focus', () => activateConcept(button));
  button.addEventListener('click', () => activateConcept(button));
});

universe?.addEventListener('pointermove', (event) => {
  if (reduceMotion) return;
  const rect = universe.getBoundingClientRect();
  universe.style.setProperty('--ux', ((event.clientX - rect.left) / rect.width - .5).toFixed(3));
  universe.style.setProperty('--uy', ((event.clientY - rect.top) / rect.height - .5).toFixed(3));
}, { passive: true });
universe?.addEventListener('pointerleave', () => {
  universe.style.setProperty('--ux', '0');
  universe.style.setProperty('--uy', '0');
  if (!universe.contains(document.activeElement)) resetConcepts();
});
universe?.addEventListener('focusout', (event) => {
  if (!universe.contains(event.relatedTarget) && !universe.matches(':hover')) resetConcepts();
});

const filterButtons = [...document.querySelectorAll('[data-service-filter]')];
const serviceCards = [...document.querySelectorAll('[data-service-category]')];
const serviceCount = document.querySelector('#service-count');
const serviceResults = document.querySelector('#service-results');
const serviceFilters = document.querySelector('#service-filters');

if (filterButtons.length && serviceCards.length && serviceFilters) {
  serviceFilters.hidden = false;
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedCategory = button.dataset.serviceFilter;
      filterButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      let visibleCount = 0;
      serviceCards.forEach((card) => {
        const visible = selectedCategory === 'all' || card.dataset.serviceCategory === selectedCategory;
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      serviceCount.textContent = String(visibleCount);
      serviceResults.textContent = selectedCategory === 'all'
        ? `서비스 ${visibleCount}개를 소개합니다.`
        : `${button.textContent.trim()} 서비스 ${visibleCount}개를 보여줍니다.`;
    });
  });
}

const canvas = document.querySelector('#world');
if (canvas) initSpace({ canvas, pointerState, reduceMotion });
