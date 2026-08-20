import { setupAnalyticsEvents } from './analytics.js';
import { initSpace } from './space.js';

setupAnalyticsEvents();

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

    requestAnimationFrame(renderMotion);
  };
  requestAnimationFrame(renderMotion);
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

const latency = document.querySelector('#latency');
if (latency && !reduceMotion) {
  setInterval(() => { latency.textContent = String(8 + Math.floor(Math.random() * 11)); }, 1800);
}

const universe = document.querySelector('#concept-universe');
const conceptButtons = [...document.querySelectorAll('.concept-cloud button')];
const conceptKicker = document.querySelector('#concept-kicker');
const conceptFocus = document.querySelector('#concept-focus');
const conceptDefinition = document.querySelector('#concept-definition');

const groupNames = {
  mind: 'COGNITIVE LAYER',
  sense: 'PERCEPTION LAYER',
  system: 'AGENTIC LAYER',
  data: 'KNOWLEDGE LAYER',
  create: 'GENERATIVE LAYER',
  world: 'PHYSICAL LAYER'
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
  conceptKicker.textContent = 'THE AI EPOCH';
  conceptFocus.textContent = 'INTELLIGENCE';
  conceptDefinition.textContent = '모든 가능성을 연결하는 새로운 인터페이스.';
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

const ideas = {
  human: [
    '“당신의 생각을 실시간으로 조각하는 AI 공간.”',
    '“회의가 끝나기 전에 프로토타입이 태어나는 워크플로.”',
    '“사람의 직관을 학습하는 두 번째 인터페이스.”'
  ],
  data: [
    '“숫자가 살아 있는 풍경으로 변하는 데이터 생태계.”',
    '“흩어진 근거가 스스로 연결되는 신뢰 네트워크.”',
    '“내일을 설명하는 실시간 데이터 조각.”'
  ],
  play: [
    '“몸짓으로 연주하는 브라우저 속 AI 악기.”',
    '“호기심을 점수로 바꾸는 끝없는 디지털 게임.”',
    '“현실의 움직임으로 진화하는 생성형 캐릭터.”'
  ]
};
let selected = 'human';
let cursor = 0;
const promptButtons = [...document.querySelectorAll('[data-prompt]')];
promptButtons[0]?.setAttribute('aria-pressed', 'true');
promptButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selected = button.dataset.prompt;
    promptButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  });
});

document.querySelector('#generate')?.addEventListener('click', () => {
  const output = document.querySelector('#idea-output');
  const meta = document.querySelector('#idea-meta');
  const button = document.querySelector('#generate');
  const list = ideas[selected];
  const nextIdea = list[cursor++ % list.length];
  const nextMeta = `CONFIDENCE ${(94 + Math.random() * 5).toFixed(1)}% · NOVELTY HIGH`;
  if (reduceMotion) {
    output.textContent = nextIdea;
    meta.textContent = nextMeta;
    return;
  }
  button.textContent = 'THINKING ···';
  output.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(8px)' }], { duration: 220, fill: 'forwards' });
  setTimeout(() => {
    output.textContent = nextIdea;
    meta.textContent = nextMeta;
    output.animate([{ opacity: 0, transform: 'translateY(12px)', filter: 'blur(6px)' }, { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' }], { duration: 600, fill: 'forwards' });
    button.innerHTML = 'GENERATE <i aria-hidden="true">↗</i>';
  }, 520);
});

const canvas = document.querySelector('#world');
if (canvas) initSpace({ canvas, pointerState, reduceMotion });
