// Three.js space layer — starfield, lunar hero, mind core, contact globe.
// Renders every scene through one WebGL context on the fixed #world canvas,
// scissored to the DOM rect of each tracked element.
//
// Moon textures:
//   assets/textures/moon-color.jpg — Solar System Scope (CC BY 4.0), NASA LRO data.
//   assets/textures/moon-ldem.jpg  — NASA SVS CGI Moon Kit elevation (public domain).
import * as THREE from './assets/vendor/three/three.module.min.js';

const PIXEL_BUDGET = 9000000;
const STATIC_TIME = 14.2;

export function initSpace({ canvas, pointerState, reduceMotion }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
  } catch (error) {
    console.warn('WebGL space unavailable', error);
    canvas.hidden = true;
    return;
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.autoClear = false;

  const heroSculpture = document.querySelector('.hero-sculpture');
  const hero = document.querySelector('.hero');
  const mindObject = document.querySelector('.mind-object');
  const contactGlobe = document.querySelector('.contact-globe');

  const setWebglClasses = (active) => {
    heroSculpture?.classList.toggle('is-webgl-core', active);
    hero?.classList.toggle('has-webgl-core', active);
    mindObject?.classList.toggle('is-webgl', active);
    contactGlobe?.classList.toggle('is-webgl', active);
  };

  // ---------------------------------------------------------------- helpers
  const starVertex = `
    attribute float aSize;
    attribute float aPhase;
    attribute vec3 aTint;
    uniform float uTime;
    uniform float uScale;
    varying float vTwinkle;
    varying vec3 vTint;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      float speed = .6 + fract(aPhase * 7.31) * 1.5;
      vTwinkle = .58 + .42 * sin(uTime * speed + aPhase * 6.28318);
      vTint = aTint;
      gl_PointSize = clamp(aSize * uScale / max(-mvPosition.z, .1), 0., 34.);
      gl_Position = projectionMatrix * mvPosition;
    }`;
  const starFragment = `
    precision highp float;
    uniform float uOpacity;
    varying float vTwinkle;
    varying vec3 vTint;
    void main() {
      float d = length(gl_PointCoord - .5);
      float halo = smoothstep(.5, .04, d);
      float core = smoothstep(.18, .0, d);
      float alpha = (halo * halo * .6 + core) * vTwinkle * uOpacity;
      if (alpha < .003) discard;
      gl_FragColor = vec4(vTint, alpha);
    }`;

  const starMaterials = [];
  const makeStarMaterial = (opacity, scale) => {
    const material = new THREE.ShaderMaterial({
      vertexShader: starVertex,
      fragmentShader: starFragment,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: scale },
        uOpacity: { value: opacity }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    material.userData.baseScale = scale;
    starMaterials.push(material);
    return material;
  };

  const makeStarPoints = ({ count, spread, tints, sizeRange, opacity, scale }) => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const tintArray = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const [x, y, z] = spread(i);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      sizes[i] = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
      phases[i] = Math.random();
      const tint = tints[Math.floor(Math.random() * tints.length)];
      tintArray[i * 3] = tint[0];
      tintArray[i * 3 + 1] = tint[1];
      tintArray[i * 3 + 2] = tint[2];
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('aTint', new THREE.BufferAttribute(tintArray, 3));
    return new THREE.Points(geometry, makeStarMaterial(opacity, scale));
  };

  const fresnelMaterial = ({ inner, rim, power, alpha, additive = true }) => new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vView = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }`,
    fragmentShader: `
      precision highp float;
      uniform vec3 uInner;
      uniform vec3 uRim;
      uniform float uPower;
      uniform float uAlpha;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float facing = max(dot(normalize(vNormal), normalize(vView)), 0.0);
        float fresnel = pow(1.0 - facing, uPower);
        vec3 color = mix(uInner, uRim, fresnel);
        gl_FragColor = vec4(color, uAlpha * (.16 + fresnel));
      }`,
    uniforms: {
      uInner: { value: new THREE.Color(inner) },
      uRim: { value: new THREE.Color(rim) },
      uPower: { value: power },
      uAlpha: { value: alpha }
    },
    transparent: true,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending
  });

  // ------------------------------------------------------------- starfield
  const starScene = new THREE.Scene();
  const starCamera = new THREE.PerspectiveCamera(58, 1, .1, 480);
  const starTints = [
    [1, 1, 1], [1, 1, 1], [.76, .85, 1], [.66, .93, 1], [1, .9, .82], [.82, .74, 1]
  ];
  const shellSpread = (near, far) => () => {
    const radius = near + Math.random() * (far - near);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    return [
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    ];
  };
  const starLayerFar = makeStarPoints({ count: 1900, spread: shellSpread(150, 300), tints: starTints, sizeRange: [1.6, 3.4], opacity: .95, scale: 110 });
  const starLayerMid = makeStarPoints({ count: 950, spread: shellSpread(80, 150), tints: starTints, sizeRange: [1.8, 3.6], opacity: 1, scale: 110 });
  const starLayerNear = makeStarPoints({ count: 260, spread: shellSpread(36, 80), tints: starTints, sizeRange: [1.8, 3.2], opacity: 1, scale: 110 });
  starScene.add(starLayerFar, starLayerMid, starLayerNear);

  const meteorTexture = (() => {
    const surface = document.createElement('canvas');
    surface.width = 128;
    surface.height = 8;
    const context = surface.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 128, 0);
    gradient.addColorStop(0, 'rgba(255,255,255,0)');
    gradient.addColorStop(.72, 'rgba(190,215,255,.55)');
    gradient.addColorStop(.94, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 8);
    const texture = new THREE.CanvasTexture(surface);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  })();

  const meteors = [];
  for (let i = 0; i < 2; i += 1) {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(30, .55),
      new THREE.MeshBasicMaterial({
        map: meteorTexture,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    mesh.visible = false;
    starScene.add(mesh);
    meteors.push({ mesh, life: 0, duration: 1, delay: 4 + i * 7 + Math.random() * 6, direction: new THREE.Vector3() });
  }

  const updateMeteors = (dt) => {
    meteors.forEach((meteor) => {
      if (!meteor.mesh.visible) {
        meteor.delay -= dt;
        if (meteor.delay > 0) return;
        const angle = (196 + Math.random() * 26) * (Math.PI / 180); // toward lower-left
        meteor.direction.set(Math.cos(angle), Math.sin(angle), 0);
        meteor.mesh.position.set(20 + Math.random() * 70, 40 + Math.random() * 34, -130 - Math.random() * 50);
        meteor.mesh.rotation.z = angle;
        meteor.duration = .9 + Math.random() * .7;
        meteor.life = 0;
        meteor.mesh.visible = true;
      }
      meteor.life += dt;
      const progress = meteor.life / meteor.duration;
      if (progress >= 1) {
        meteor.mesh.visible = false;
        meteor.mesh.material.opacity = 0;
        meteor.delay = 7 + Math.random() * 11;
        return;
      }
      meteor.mesh.position.addScaledVector(meteor.direction, dt * 120);
      meteor.mesh.material.opacity = Math.sin(progress * Math.PI) * .75;
    });
  };

  // ------------------------------------------------------------------ moon
  const moonScene = new THREE.Scene();
  const moonCamera = new THREE.PerspectiveCamera(30, 1, .1, 40);
  moonCamera.position.set(0, 0, 4.35);
  const moonGroup = new THREE.Group();
  moonScene.add(moonGroup);

  const moonKeyLight = new THREE.DirectionalLight(0xfff2e0, 3.4);
  moonKeyLight.position.set(-3.2, 1.7, 2.1);
  const moonRimLight = new THREE.DirectionalLight(0x6d86ff, .5);
  moonRimLight.position.set(2.8, -.4, -2.6);
  const moonAmbient = new THREE.AmbientLight(0x1c2340, .5);
  moonScene.add(moonKeyLight, moonRimLight, moonAmbient);

  const moonDust = makeStarPoints({
    count: 120,
    spread: shellSpread(1.7, 3.4),
    tints: starTints,
    sizeRange: [.8, 1.6],
    opacity: .85,
    scale: 10
  });
  moonScene.add(moonDust);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        precision highp float;
        uniform float uOpacity;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(.62 - dot(vNormal, vec3(0., 0., 1.)), 3.4);
          gl_FragColor = vec4(vec3(.62, .72, 1.) * intensity, intensity * uOpacity);
        }`,
      uniforms: { uOpacity: { value: .9 } },
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  atmosphere.scale.setScalar(1.16);

  let moon = null;
  const textureLoader = new THREE.TextureLoader();
  const loadTexture = (url) => new Promise((resolve, reject) => {
    textureLoader.load(url, resolve, undefined, reject);
  });

  let webglReady = false;
  Promise.all([
    loadTexture('./assets/textures/moon-color.jpg'),
    loadTexture('./assets/textures/moon-ldem.jpg')
  ]).then(([colorMap, elevationMap]) => {
    if (contextLost) return;
    colorMap.colorSpace = THREE.SRGBColorSpace;
    colorMap.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    moon = new THREE.Mesh(
      new THREE.SphereGeometry(1, 160, 160),
      new THREE.MeshStandardMaterial({
        map: colorMap,
        bumpMap: elevationMap,
        bumpScale: 1.4,
        displacementMap: elevationMap,
        displacementScale: .05,
        roughness: 1,
        metalness: 0
      })
    );
    moon.rotation.y = 4.5; // near side facing the camera
    moon.rotation.x = .12;
    moonGroup.add(moon, atmosphere);
    webglReady = true;
    setWebglClasses(true);
    queueRenderOnce();
  }).catch((error) => {
    console.warn('Moon textures unavailable', error);
  });

  // ------------------------------------------------------------- mind core
  const mindScene = new THREE.Scene();
  const mindCamera = new THREE.PerspectiveCamera(34, 1, .1, 30);
  mindCamera.position.set(0, 0, 4.6);
  const mindGroup = new THREE.Group();
  mindScene.add(mindGroup);

  const mindShell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.04, 1),
    new THREE.MeshBasicMaterial({
      color: 0x8f6bff,
      wireframe: true,
      transparent: true,
      opacity: .38,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  const mindCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(.6, 5),
    fresnelMaterial({ inner: 0x140b33, rim: 0x68edff, power: 2.1, alpha: .95 })
  );
  const mindHalo = new THREE.Mesh(
    new THREE.IcosahedronGeometry(.6, 4),
    fresnelMaterial({ inner: 0x000000, rim: 0xff4fd8, power: 4.2, alpha: .5 })
  );
  mindHalo.scale.setScalar(1.12);
  mindGroup.add(mindShell, mindCore, mindHalo);

  const mindRings = [];
  [{ tilt: .52, radius: 1.28, speed: .32, tint: [[.41, .93, 1]] }, { tilt: -.38, radius: 1.46, speed: -.22, tint: [[1, .31, .85]] }].forEach((config) => {
    const ring = makeStarPoints({
      count: 240,
      spread: () => {
        const angle = Math.random() * Math.PI * 2;
        const radius = config.radius + (Math.random() - .5) * .1;
        return [Math.cos(angle) * radius, (Math.random() - .5) * .05, Math.sin(angle) * radius];
      },
      tints: config.tint,
      sizeRange: [1.2, 2.2],
      opacity: .85,
      scale: 6
    });
    ring.rotation.x = config.tilt;
    mindGroup.add(ring);
    mindRings.push({ ring, speed: config.speed });
  });

  // ----------------------------------------------------------------- globe
  const globeScene = new THREE.Scene();
  const globeCamera = new THREE.PerspectiveCamera(32, 1, .1, 30);
  globeCamera.position.set(0, 0, 4.1);
  const globeGroup = new THREE.Group();
  globeGroup.rotation.z = .18;
  globeScene.add(globeGroup);

  const globeDots = (() => {
    const count = 1800;
    const cyan = new THREE.Color(0x68edff);
    const violet = new THREE.Color(0x8f5bff);
    const spread = (i) => {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const angle = i * 2.399963229728653;
      return [Math.cos(angle) * radius, y, Math.sin(angle) * radius];
    };
    const points = makeStarPoints({ count, spread, tints: [[1, 1, 1]], sizeRange: [1.6, 2.5], opacity: 1, scale: 9 });
    const tints = points.geometry.getAttribute('aTint');
    const positions = points.geometry.getAttribute('position');
    const mixed = new THREE.Color();
    for (let i = 0; i < count; i += 1) {
      mixed.copy(cyan).lerp(violet, (positions.getY(i) + 1) / 2);
      tints.setXYZ(i, mixed.r, mixed.g, mixed.b);
    }
    tints.needsUpdate = true;
    return points;
  })();
  const globeVeil = new THREE.Mesh(
    new THREE.SphereGeometry(.985, 48, 48),
    fresnelMaterial({ inner: 0x05050e, rim: 0x5b7bff, power: 2.2, alpha: .95, additive: false })
  );
  globeVeil.renderOrder = -1; // keep the dot shell readable over the veil
  globeGroup.add(globeVeil, globeDots);

  // ------------------------------------------------------------ scheduling
  let contextLost = false;
  let raf = 0;
  let onceQueued = false;
  let lastNow = 0;
  let time = Math.random() * 40;

  const sizeState = { width: 0, height: 0, dpr: 1 };
  const resize = () => {
    const width = Math.max(innerWidth, 1);
    const height = Math.max(innerHeight, 1);
    let dpr = Math.min(devicePixelRatio || 1, 2);
    const budgetScale = Math.sqrt(PIXEL_BUDGET / (width * height * dpr * dpr));
    if (budgetScale < 1) dpr *= budgetScale;
    sizeState.width = width;
    sizeState.height = height;
    sizeState.dpr = dpr;
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    starMaterials.forEach((material) => {
      material.uniforms.uScale.value = material.userData.baseScale * dpr;
    });
  };

  const inViewport = (rect, margin) => (
    rect.width > 4 && rect.height > 4 &&
    rect.bottom > -margin && rect.top < sizeState.height + margin &&
    rect.right > -margin && rect.left < sizeState.width + margin
  );

  const renderElement = (element, scene, camera, margin = 160) => {
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    if (!inViewport(rect, margin)) return null;
    renderer.setViewport(rect.left, sizeState.height - rect.bottom, rect.width, rect.height);
    renderer.setScissor(rect.left, sizeState.height - rect.bottom, rect.width, rect.height);
    camera.aspect = rect.width / Math.max(rect.height, 1);
    camera.updateProjectionMatrix();
    renderer.clearDepth();
    renderer.render(scene, camera);
    return rect;
  };

  const renderAll = (dt) => {
    const nx = reduceMotion ? 0 : (pointerState.x / sizeState.width - .5) * 2;
    const ny = reduceMotion ? 0 : (pointerState.y / sizeState.height - .5) * 2;
    const scrollProgress = Math.min(Math.max(scrollY / Math.max(sizeState.height, 1), 0), 1);

    // full-frame stars
    starLayerFar.material.uniforms.uTime.value = time;
    starLayerMid.material.uniforms.uTime.value = time * 1.12;
    starLayerNear.material.uniforms.uTime.value = time * 1.3;
    starScene.rotation.z = time * .004;
    starScene.rotation.y = nx * .02;
    starScene.rotation.x = -ny * .014 + scrollY * .00003;
    if (!reduceMotion) updateMeteors(dt);

    renderer.setScissorTest(false);
    renderer.setViewport(0, 0, sizeState.width, sizeState.height);
    starCamera.aspect = sizeState.width / sizeState.height;
    starCamera.updateProjectionMatrix();
    renderer.clear(true, true, false);
    renderer.render(starScene, starCamera);

    renderer.setScissorTest(true);

    // hero moon
    if (webglReady && moon) {
      moon.rotation.y += dt * .008;
      moonGroup.rotation.y = nx * .1;
      moonGroup.rotation.x = ny * .07;
      moonDust.material.uniforms.uTime.value = time;
      moonKeyLight.intensity = 3.4 * (1 - .74 * scrollProgress);
      moonRimLight.intensity = .5 * (1 - .5 * scrollProgress);
      atmosphere.material.uniforms.uOpacity.value = .9 * (1 - .8 * scrollProgress);
      renderElement(heroSculpture, moonScene, moonCamera);
    }

    // mind core
    mindShell.rotation.y += dt * .16;
    mindShell.rotation.x += dt * .05;
    mindCore.scale.setScalar(1 + Math.sin(time * 1.35) * .035);
    mindHalo.scale.setScalar(1.12 + Math.sin(time * 1.35 + 1.4) * .05);
    mindRings.forEach(({ ring, speed }) => { ring.rotation.y += dt * speed; ring.material.uniforms.uTime.value = time; });
    mindGroup.rotation.y = nx * .22;
    mindGroup.rotation.x = ny * .12;
    renderElement(mindObject, mindScene, mindCamera);

    // contact globe
    globeGroup.rotation.y += dt * .1;
    globeDots.material.uniforms.uTime.value = time * .6;
    renderElement(contactGlobe, globeScene, globeCamera);
  };

  const frame = (now) => {
    raf = 0;
    if (contextLost || document.hidden) return;
    const dt = Math.min((now - lastNow) / 1000 || 0, .05);
    lastNow = now;
    time += dt;
    renderAll(dt);
    raf = requestAnimationFrame(frame);
  };
  const schedule = () => {
    if (!raf && !contextLost && !document.hidden && !reduceMotion) {
      lastNow = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };

  // Paints a single frame outside the RAF loop, so the page still shows the
  // scene while the loop is paused (reduced motion, hidden/prerendered tab).
  const queueRenderOnce = () => {
    if (onceQueued || contextLost) return;
    onceQueued = true;
    setTimeout(() => {
      onceQueued = false;
      if (contextLost) return;
      if (reduceMotion) time = STATIC_TIME;
      renderAll(0);
    }, 24);
  };

  resize();
  addEventListener('resize', () => {
    resize();
    if (reduceMotion || document.hidden) queueRenderOnce();
  });
  addEventListener('scroll', () => {
    if (reduceMotion || document.hidden) queueRenderOnce();
  }, { passive: true });

  if (!reduceMotion) {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; }
      else schedule();
    });
    schedule();
  }
  queueRenderOnce();

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    contextLost = true;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    canvas.hidden = true;
    setWebglClasses(false);
  });
  canvas.addEventListener('webglcontextrestored', () => location.reload(), { once: true });
}
