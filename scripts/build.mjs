import { access, readFile } from 'node:fs/promises';

const requiredFiles = [
  'index.html',
  'immersive.css',
  'immersive.js',
  'analytics.js',
  'space.js',
  'assets/vendor/three/three.module.min.js',
  'assets/vendor/three/three.core.min.js',
  'assets/textures/moon-color.jpg',
  'assets/textures/moon-ldem.jpg'
];
await Promise.all(requiredFiles.map((file) => access(file)));

const html = await readFile('index.html', 'utf8');
if (!html.includes('./immersive.js')) throw new Error('index.html must load immersive.js');

const entry = await readFile('immersive.js', 'utf8');
if (!entry.includes("'./analytics.js'")) throw new Error('immersive.js must initialize analytics');
if (!entry.includes("'./space.js'")) throw new Error('immersive.js must initialize the space layer');

const space = await readFile('space.js', 'utf8');
if (!space.includes('./assets/vendor/three/three.module.min.js')) throw new Error('space.js must import the vendored three.js build');

console.log('Static site build validation passed.');
