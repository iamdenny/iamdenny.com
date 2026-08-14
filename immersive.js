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
if (canvas && !reduceMotion) initWorld(canvas);
const heroCoreCanvas = document.querySelector('#hero-core');
if (heroCoreCanvas) initHeroCore(heroCoreCanvas);

function initWorld(canvas) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'high-performance' });
  if (!gl) { canvas.hidden = true; return; }
  const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
  const fragment = `
    precision highp float;
    uniform vec2 r,m;
    uniform float t,v,s;
    mat2 turn(float a){float c=cos(a),q=sin(a);return mat2(c,-q,q,c);}
    float hash31(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
    void main(){
      vec2 uv=(gl_FragCoord.xy*2.-r)/min(r.x,r.y);
      vec2 mm=(m*2.-r)/min(r.x,r.y);
      vec3 ray=normalize(vec3(uv+mm*.018,1.58));
      vec3 origin=vec3(mm*.06,-4.2+s*.32);
      vec3 color=vec3(.006,.008,.026);
      float travel=.15;
      for(int i=0;i<34;i++){
        vec3 position=origin+ray*travel;
        position.xy*=turn(position.z*.065+t*.022);
        vec3 id=floor(position*1.18);
        vec3 cell=fract(position*1.18)-.5;
        float seed=hash31(id);
        float node=exp(-44.*dot(cell,cell));
        float lineX=exp(-75.*(cell.y*cell.y+cell.z*cell.z));
        float lineY=exp(-75.*(cell.x*cell.x+cell.z*cell.z));
        float lineZ=exp(-75.*(cell.x*cell.x+cell.y*cell.y));
        float links=(lineX+lineY+lineZ)*.28;
        float pulse=.55+.45*sin(t*1.65-travel*2.15+seed*6.283);
        float fade=exp(-travel*.105)*(1.-smoothstep(9.,14.,travel));
        vec3 tone=mix(vec3(.12,.70,1.),vec3(.82,.08,.86),seed);
        color+=tone*(node*.065+links*.015)*pulse*fade;
        travel+=.22;
      }
      vec2 cursorDelta=uv-mm;
      float cursorEnergy=exp(-16.*dot(cursorDelta,cursorDelta));
      float shock=(sin(length(cursorDelta)*42.-t*5.4)*.5+.5)*exp(-7.*length(cursorDelta))*v;
      color+=vec3(.12,.68,1.)*cursorEnergy*(.04+v*.28)+vec3(.75,.08,.72)*shock*.20;
      float vignette=smoothstep(1.55,.18,length(uv*.72));
      color*=vignette;
      float alpha=clamp(.14+dot(color,vec3(.333))*.92,0.,.68);
      gl_FragColor=vec4(color,alpha);
    }`;
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  };
  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch (error) {
    console.warn('WebGL world unavailable', error);
    canvas.hidden = true;
    return;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(program, 'p'); gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  const res = gl.getUniformLocation(program, 'r'); const mouse = gl.getUniformLocation(program, 'm'); const time = gl.getUniformLocation(program, 't'); const velocity = gl.getUniformLocation(program, 'v'); const scroll = gl.getUniformLocation(program, 's');
  const frameInterval = 1000 / 30;
  const pixelBudget = 1200000;
  let raf = 0;
  let lastFrame = 0;
  let contextAvailable = true;
  const resize = () => {
    if (!contextAvailable) return;
    const budgetDpr = Math.sqrt(pixelBudget / Math.max(innerWidth * innerHeight, 1));
    const dpr = Math.min(devicePixelRatio || 1, 1.2, budgetDpr);
    canvas.width = Math.max(1, Math.round(innerWidth * dpr));
    canvas.height = Math.max(1, Math.round(innerHeight * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  new ResizeObserver(resize).observe(document.documentElement); resize();
  const render = now => {
    raf = 0;
    if (!contextAvailable || document.hidden) return;
    if (lastFrame && now - lastFrame < frameInterval) { raf = requestAnimationFrame(render); return; }
    lastFrame = now;
    gl.uniform2f(res, canvas.width, canvas.height);
    const dpr = canvas.width / innerWidth;
    gl.uniform2f(mouse, pointerState.x * dpr, (innerHeight - pointerState.y) * dpr);
    gl.uniform1f(time, now * .001);
    gl.uniform1f(velocity, pointerState.speed);
    gl.uniform1f(scroll, scrollY / Math.max(innerHeight, 1));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(render);
  };
  const schedule = () => { if (!raf && contextAvailable && !document.hidden) raf = requestAnimationFrame(render); };
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    contextAvailable = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    canvas.hidden = true;
  });
  canvas.addEventListener('webglcontextrestored', () => location.reload(), { once: true });
  schedule();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; }
    else schedule();
  });
}

function initHeroCore(canvas) {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance',
    premultipliedAlpha: false
  });
  if (!gl) { canvas.hidden = true; return; }

  const vertexSource = `
    attribute vec2 aPosition;
    void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
  `;
  const fragmentSource = `
    precision highp float;
    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform float uTime;
    uniform float uScroll;

    mat2 rotate2d(float angle) {
      float c = cos(angle), s = sin(angle);
      return mat2(c, -s, s, c);
    }

    float hash21(vec2 value) {
      return fract(sin(dot(value, vec2(127.1, 311.7))) * 43758.5453);
    }

    vec2 scene(vec3 point) {
      point.xz *= rotate2d(uTime * .11 + uPointer.x * .18 + uScroll * .06);
      point.yz *= rotate2d(-uTime * .075 + uPointer.y * .14);

      float pulse = sin(point.x * 5.0 + uTime) * sin(point.y * 4.0 - uTime * .8) * sin(point.z * 5.5 + uTime * .55);
      float core = length(point) - (.62 + pulse * .035);
      float shell = abs(length(point) - .88) - .018;

      vec3 ringA = point;
      ringA.xy *= rotate2d(.82);
      float torusA = length(vec2(length(ringA.xz) - 1.28, ringA.y)) - .032;

      vec3 ringB = point;
      ringB.yz *= rotate2d(1.02);
      float torusB = length(vec2(length(ringB.xy) - 1.08, ringB.z)) - .026;

      vec3 ringC = point;
      ringC.xz *= rotate2d(-.62);
      float torusC = length(vec2(length(ringC.yz) - 1.48, ringC.x)) - .018;

      vec2 result = vec2(core, 1.0);
      if (shell < result.x) result = vec2(shell, 2.0);
      if (torusA < result.x) result = vec2(torusA, 3.0);
      if (torusB < result.x) result = vec2(torusB, 4.0);
      if (torusC < result.x) result = vec2(torusC, 5.0);
      return result;
    }

    vec3 normalAt(vec3 point) {
      vec2 epsilon = vec2(.0015, 0.0);
      float center = scene(point).x;
      return normalize(vec3(
        scene(point + epsilon.xyy).x - center,
        scene(point + epsilon.yxy).x - center,
        scene(point + epsilon.yyx).x - center
      ));
    }

    vec3 palette(float material) {
      if (material < 1.5) return vec3(.18, .42, 1.0);
      if (material < 2.5) return vec3(.58, .18, 1.0);
      if (material < 3.5) return vec3(.18, .90, 1.0);
      if (material < 4.5) return vec3(1.0, .16, .78);
      return vec3(.48, .22, 1.0);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
      vec3 origin = vec3(uPointer * .16, 3.8);
      vec3 ray = normalize(vec3(uv, -1.72));
      float travel = 0.0;
      float material = 0.0;
      float glow = 0.0;
      bool hit = false;

      for (int step = 0; step < 58; step++) {
        vec3 point = origin + ray * travel;
        vec2 field = scene(point);
        glow += .0009 / (.012 + abs(field.x));
        if (field.x < .0012) {
          material = field.y;
          hit = true;
          break;
        }
        if (travel > 7.5) break;
        travel += field.x * .72;
      }

      vec3 color = mix(vec3(.02, .18, .36), vec3(.45, .04, .52), clamp(glow * .055, 0.0, 1.0)) * glow * .055;
      float alpha = clamp(glow * .075, 0.0, .46);

      if (hit) {
        vec3 point = origin + ray * travel;
        vec3 normal = normalAt(point);
        vec3 viewDirection = normalize(origin - point);
        vec3 lightA = normalize(vec3(-2.4, 3.0, 4.2) - point);
        vec3 lightB = normalize(vec3(3.1, -1.2, 2.8) - point);
        float diffuse = max(dot(normal, lightA), 0.0) + max(dot(normal, lightB), 0.0) * .34;
        float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.25);
        float specular = pow(max(dot(reflect(-lightA, normal), viewDirection), 0.0), 54.0);
        vec3 base = palette(material);
        color += base * (.12 + diffuse * .72);
        color += mix(vec3(.2, .85, 1.0), vec3(1.0, .18, .78), fresnel) * fresnel * 1.15;
        color += vec3(1.0, .88, 1.0) * specular * .9;
        alpha = max(alpha, material < 2.5 ? .83 : .72);
      }

      float star = step(.9965, hash21(floor((uv + 3.0) * 86.0)));
      star *= .55 + .45 * sin(uTime * 1.8 + hash21(uv) * 6.283);
      color += star * vec3(.42, .78, 1.0);
      alpha = max(alpha, star * .72);

      float vignette = smoothstep(1.45, .28, length(uv));
      gl_FragColor = vec4(color * vignette, alpha * vignette);
    }
  `;

  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  };

  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch (error) {
    console.warn('WebGL core unavailable', error);
    canvas.hidden = true;
    return;
  }

  gl.useProgram(program);
  const position = gl.getAttribLocation(program, 'aPosition');
  const resolution = gl.getUniformLocation(program, 'uResolution');
  const pointer = gl.getUniformLocation(program, 'uPointer');
  const time = gl.getUniformLocation(program, 'uTime');
  const scroll = gl.getUniformLocation(program, 'uScroll');
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  let raf = 0;
  let inView = true;
  let width = 1;
  let height = 1;
  let ready = false;
  let contextAvailable = true;
  let lastFrame = 0;
  const frameInterval = 1000 / 30;
  const pixelBudget = 420000;

  const resize = () => {
    if (!contextAvailable) return;
    const rect = canvas.getBoundingClientRect();
    const budgetDpr = Math.sqrt(pixelBudget / Math.max(rect.width * rect.height, 1));
    const dpr = Math.min(devicePixelRatio || 1, 1.25, budgetDpr);
    const nextWidth = Math.max(1, Math.round(rect.width * dpr));
    const nextHeight = Math.max(1, Math.round(rect.height * dpr));
    if (nextWidth === width && nextHeight === height) return;
    width = canvas.width = nextWidth;
    height = canvas.height = nextHeight;
    gl.viewport(0, 0, width, height);
  };

  const render = (now = 0) => {
    raf = 0;
    if (!contextAvailable || (!inView && !reduceMotion)) return;
    if (!reduceMotion && lastFrame && now - lastFrame < frameInterval) { raf = requestAnimationFrame(render); return; }
    lastFrame = now;
    resize();
    const px = reduceMotion ? 0 : (pointerState.x / innerWidth - .5) * 2;
    const py = reduceMotion ? 0 : (.5 - pointerState.y / innerHeight) * 2;
    gl.uniform2f(resolution, width, height);
    gl.uniform2f(pointer, px, py);
    gl.uniform1f(time, reduceMotion ? 2.4 : now * .001);
    gl.uniform1f(scroll, scrollY / Math.max(innerHeight, 1));
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (!ready) {
      ready = true;
      canvas.closest('.hero-sculpture')?.classList.add('is-webgl-core');
      canvas.closest('.hero')?.classList.add('has-webgl-core');
    }
    if (!reduceMotion && inView && !document.hidden) raf = requestAnimationFrame(render);
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    contextAvailable = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    canvas.hidden = true;
    canvas.closest('.hero-sculpture')?.classList.remove('is-webgl-core');
    canvas.closest('.hero')?.classList.remove('has-webgl-core');
  });
  canvas.addEventListener('webglcontextrestored', () => location.reload(), { once: true });
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView && !reduceMotion && !raf) raf = requestAnimationFrame(render);
  }, { rootMargin: '120px' });
  intersectionObserver.observe(canvas);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; }
    if (!document.hidden && inView && !reduceMotion && !raf) raf = requestAnimationFrame(render);
  });
  render(0);
}
