'use strict';

// prepare-dist.mjs replaces these constants with a digest of the delivered app.
const VERSION = '6c08fb6e4c84d35e65d6';
const INTEGRITY = {"index.html":"394fe661365979d05d38e0ccac8fac2a3ea4f62a608bb488e35f99ab50f06f3e","pwa-client.js":"3d91f9090fd6e69b4913cde797f31e2ac26623cd5590e4115e8e2a45ea60be95","manifest.webmanifest":"e52e0a281ac587e99b9d27d7665780781360475ebb22969d8322ec1455433585","icon-192.png":"ed7448f777bd07b2bcc78f6c9f5fe515f1f00314e85e3d15ebd78cd8e4780937","icon-512.png":"ed7448f777bd07b2bcc78f6c9f5fe515f1f00314e85e3d15ebd78cd8e4780937","apple-touch-icon.png":"ed7448f777bd07b2bcc78f6c9f5fe515f1f00314e85e3d15ebd78cd8e4780937"};
const BASE = new URL('./', self.registration.scope);
const CACHE_PREFIX = 'controlling-trainer-offline-' + encodeURIComponent(BASE.pathname) + '-';
const CACHE_NAME = CACHE_PREFIX + VERSION;
const SHELL_SENTINEL = 'controlling-trainer-shell-v1';
const TYPES = {
  'index.html': ['text/html'],
  'pwa-client.js': ['text/javascript', 'application/javascript'],
  'manifest.webmanifest': ['application/manifest+json', 'application/json'],
  'icon-192.png': ['image/png'],
  'icon-512.png': ['image/png'],
  'apple-touch-icon.png': ['image/png']
};
const PATHS = Object.keys(TYPES);
const urlFor = path => new URL(path, BASE).href;
const hex = bytes => Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');

async function validate(response, path, acceptedTypes = TYPES[path]) {
  if (!response || response.status !== 200 || response.redirected || response.type === 'opaque') return false;
  const mime = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  if (!acceptedTypes.includes(mime)) return false;
  const body = await response.clone().arrayBuffer();
  if (path === 'index.html' && !new TextDecoder().decode(body).includes(SHELL_SENTINEL)) return false;
  return hex(await crypto.subtle.digest('SHA-256', body)) === INTEGRITY[path];
}

async function fetchAsset(path) {
  // The host wraps/redirects HTML routes. Transport our exact source as plain text,
  // verify those bytes, then synthesize a genuine HTML response for navigation.
  const transport = path === 'index.html' ? 'offline-shell.txt' : path;
  const response = await fetch(new Request(urlFor(transport), {cache: 'reload', credentials: 'same-origin'}));
  if (!await validate(response, path, path === 'index.html' ? ['text/plain'] : TYPES[path])) throw new Error('Offline asset validation failed: ' + path);
  if (path === 'index.html') return new Response(await response.arrayBuffer(), {status: 200, headers: {'content-type': 'text/html; charset=utf-8'}});
  return response;
}

async function precache() {
  // Validate every response before opening the new version cache. Authentication
  // redirects/pages, incomplete deploys and wrong MIME types never become a shell.
  const responses = await Promise.all(PATHS.map(fetchAsset));
  const existed = (await caches.keys()).includes(CACHE_NAME);
  const cache = await caches.open(CACHE_NAME);
  try {
    for (let index = 0; index < PATHS.length; index++) await cache.put(urlFor(PATHS[index]), responses[index]);
  } catch (error) {
    if (!existed) await caches.delete(CACHE_NAME);
    throw error;
  }
}

async function verifyCache() {
  const cache = await caches.open(CACHE_NAME);
  const present = await Promise.all(PATHS.map(async path => validate(await cache.match(urlFor(path)), path)));
  return present.every(Boolean);
}

self.addEventListener('install', event => {
  // Deliberately no skipWaiting: a new version must not replace an active quiz.
  event.waitUntil(precache());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    if (!await verifyCache()) throw new Error('The complete offline cache is not available.');
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

function offlineFailure(path) {
  if (path !== 'index.html') return new Response('This app asset is unavailable. Reconnect and reopen the trainer.', {status: 503, headers: {'content-type': 'text/plain; charset=utf-8'}});
  return new Response('<!doctype html><html lang="de"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lernraum erneut öffnen</title><style>body{font:18px/1.6 ui-rounded,system-ui,sans-serif;background:#FFF6D9;color:#30243C;padding:24px;max-width:560px;margin:8vh auto}h1{font-size:28px}</style><h1>Die Lern-App ist noch nicht offline bereit.</h1><p>Verbinde dich mit dem Internet, schließe alle Fenster dieser Lern-App und öffne sie erneut. Warte, bis „Offline bereit“ angezeigt wird.</p></html>', {status: 503, headers: {'content-type': 'text/html; charset=utf-8'}});
}

async function serve(path) {
  let cache;
  try {
    cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(urlFor(path));
    if (cached) return cached;
  } catch { /* A storage failure must not prevent ordinary online use. */ }
  try {
    const response = await fetchAsset(path);
    try {
      cache ||= await caches.open(CACHE_NAME);
      await cache.put(urlFor(path), response.clone());
    } catch { /* The client separately verifies storage before claiming offline readiness. */ }
    return response;
  } catch {
    return offlineFailure(path);
  }
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== BASE.origin) return;
  let path;
  if (event.request.mode === 'navigate' && (url.pathname === BASE.pathname || url.pathname === new URL('index.html', BASE).pathname)) path = 'index.html';
  else path = PATHS.find(candidate => new URL(candidate, BASE).pathname === url.pathname);
  // Never intercept authentication routes, APIs or arbitrary same-origin pages.
  if (path) event.respondWith(serve(path));
});

self.addEventListener('message', event => {
  const type = event.data?.type;
  if (!['CONTROLLING_CACHE_STATUS', 'CONTROLLING_CACHE_REPAIR'].includes(type) || !event.ports?.[0]) return;
  event.waitUntil((async () => {
    let verified = false;
    try {
      if (type === 'CONTROLLING_CACHE_REPAIR') await precache();
      verified = await verifyCache();
    } catch { /* report unavailable, not ready */ }
    event.ports[0].postMessage({type: 'CONTROLLING_CACHE_STATUS', verified, version: VERSION, assetCount: PATHS.length});
  })());
});
