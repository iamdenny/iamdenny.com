import { access, readFile } from 'node:fs/promises';

const requiredFiles = ['index.html', 'immersive.css', 'immersive.js', 'analytics.js'];
await Promise.all(requiredFiles.map((file) => access(file)));

const html = await readFile('index.html', 'utf8');
if (!html.includes('./immersive.js')) throw new Error('index.html must load immersive.js');

const entry = await readFile('immersive.js', 'utf8');
if (!entry.includes("'./analytics.js'")) throw new Error('immersive.js must initialize analytics');

console.log('Static site build validation passed.');
