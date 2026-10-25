import { access, readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const requiredFiles = [
  'index.html',
  'immersive.css',
  'immersive.js',
  'guides.js',
  'guide-calculations.js',
  'analytics.js',
  'analytics-consent.js',
  'space.js',
  'privacy.html',
  'guides/tournament-format.html',
  'guides/print-answer-key.html',
  'guides/daily-flags.html',
  'guides/compare-proportions.html',
  'guides/study-completion-plan.html',
  'guides/random-draw-and-teams.html',
  'guides/typing-speed-and-accuracy.html',
  'guides/browser-game-controls.html',
  'guides/paper-squishy-printing.html',
  'sitemap.xml',
  'robots.txt',
  'assets/vendor/three/three.module.min.js',
  'assets/vendor/three/three.core.min.js',
  'assets/textures/moon-color.jpg',
  'assets/textures/moon-ldem.jpg'
];
await Promise.all(requiredFiles.map((file) => access(file)));

const html = await readFile('index.html', 'utf8');
if (!html.includes('./immersive.js')) throw new Error('index.html must load immersive.js');
if (!html.includes('./privacy.html')) throw new Error('index.html must link to its privacy policy');

const sitemap = await readFile('sitemap.xml', 'utf8');
const sitemapPaths = [...sitemap.matchAll(/<loc>https:\/\/iamdenny\.com\/([^<]*)<\/loc>/g)]
  .map((match) => match[1] || 'index.html');
for (const path of sitemapPaths) await access(path);
if (!sitemap.includes('https://iamdenny.com/privacy.html')) throw new Error('sitemap.xml must include privacy.html');

const guidePaths = [...html.matchAll(/href="\.\/(guides\/[^\"]+\.html)"/g)].map((match) => match[1]);
for (const path of guidePaths) {
  if (!sitemap.includes(`https://iamdenny.com/${path}`)) throw new Error(`sitemap.xml must include ${path}`);
}
for (const path of ['index.html', ...requiredFiles.filter((file) => file.startsWith('guides/') && file.endsWith('.html')), 'privacy.html']) {
  const page = await readFile(path, 'utf8');
  if ((page.match(/<h1\b/g) || []).length !== 1) throw new Error(`${path} must have exactly one h1`);
  const idValues = [...page.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const ids = new Set(idValues);
  if (ids.size !== idValues.length) throw new Error(`${path} has duplicate element IDs`);
  for (const [, target] of page.matchAll(/<a\b[^>]*href="#([^"]+)"/g)) {
    if (!ids.has(target)) throw new Error(`${path} links to missing #${target}`);
  }
  for (const [, href, attributes] of page.matchAll(/<a\b[^>]*href="(https?:\/\/[^\"]+)"([^>]*)>/g)) {
    const rel = attributes.match(/\brel="([^"]+)"/i)?.[1]?.split(/\s+/) || [];
    if (!/\btarget="_blank"/i.test(attributes) || !rel.includes('noopener') || !rel.includes('noreferrer')) {
      throw new Error(`${path} external link must open safely in a new tab: ${href}`);
    }
  }
  for (const [, href] of page.matchAll(/<a\b[^>]*href="([^"#]+)(?:#[^"]*)?"/g)) {
    if (/^(?:https?:|mailto:|tel:|sms:|javascript:|data:)/i.test(href)) continue;
    const localPath = decodeURIComponent(href.split(/[?#]/, 1)[0]);
    const resolved = resolve(dirname(path), localPath || 'index.html');
    let targetPath = resolved;
    try {
      if ((await stat(resolved)).isDirectory()) targetPath = resolve(resolved, 'index.html');
      await access(targetPath);
    } catch {
      throw new Error(`${path} links to missing local path: ${href}`);
    }
  }
}

const guidePages = requiredFiles.filter((file) => file.startsWith('guides/') && file.endsWith('.html'));
for (const path of guidePages) {
  const page = await readFile(path, 'utf8');
  if (!page.includes('<nav class="guide-toc"')) throw new Error(`${path} must include a visible table of contents`);
  const toc = page.match(/<nav class="guide-toc"[^>]*>([\s\S]*?)<\/nav>/)?.[1] || '';
  const body = page.split('<div class="guide-body">')[1] || '';
  const text = (value) => value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const headings = new Map([...body.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)]
    .map(([, id, label]) => [id, text(label)]));
  for (const [, id, label] of toc.matchAll(/<a href="#([^"]+)">([\s\S]*?)<\/a>/g)) {
    if (headings.get(id) !== text(label)) throw new Error(`${path} table of contents must target the matching body heading: #${id}`);
  }
  if (!page.includes('<nav class="guide-related"')) throw new Error(`${path} must include related guide links`);
  if (!page.includes('data-analytics-settings')) throw new Error(`${path} must expose analytics settings`);
  if (page.includes('작성·확인 Denny Lim')) throw new Error(`${path} must not claim an unverified personal review`);
}

const privacy = await readFile('privacy.html', 'utf8');
if (/<script\b[^>]+src=["'][^"']*analytics/i.test(privacy)) throw new Error('privacy.html must not load analytics');
if (privacy.includes('localStorage 또는 sessionStorage 저장 기능이 없습니다')) throw new Error('privacy.html must describe the saved consent choice');
const robots = await readFile('robots.txt', 'utf8');
if (!robots.includes('Allow: /') || !robots.includes('https://iamdenny.com/sitemap.xml')) throw new Error('robots.txt must allow crawling and identify the sitemap');

const entry = await readFile('immersive.js', 'utf8');
if (!entry.includes("'./analytics.js'")) throw new Error('immersive.js must initialize analytics');
if (!entry.includes("'./analytics-consent.js'")) throw new Error('immersive.js must initialize analytics consent');
if (!entry.includes("'./space.js'")) throw new Error('immersive.js must initialize the space layer');

const space = await readFile('space.js', 'utf8');
if (!space.includes('./assets/vendor/three/three.module.min.js')) throw new Error('space.js must import the vendored three.js build');

console.log('Static site build validation passed.');
