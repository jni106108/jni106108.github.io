// Service worker: deixa o app instalável e utilizável offline depois da primeira abertura.
// Código (html/js/css): rede primeiro, para receber atualizações. Dados pesados (modelo, diagramas, PDFs, CDN): cache primeiro.
// Ao publicar uma versão nova com mudanças nos dados, troque VERSAO para descartar o cache antigo.
const VERSAO = 'lancer-garagem-v2';
const ESSENCIAL = [
  './', 'index.html', 'css/app.css', 'js/main.js', 'js/carro3d.js', 'js/zonas.js', 'js/dados.js',
  'data/catalogo.json', 'data/manual-paginas.json', 'manifest.webmanifest', 'icones/icone-192.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ESSENCIAL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const pesado = url => /\/(modelo|data\/diagramas|docs|icones)\//.test(url.pathname) || url.origin !== self.location.origin;

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (pesado(url)) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(resp => {
      if (resp.ok || resp.type === 'opaque') { const copia = resp.clone(); caches.open(VERSAO).then(c => c.put(req, copia)); }
      return resp;
    })));
  } else {
    e.respondWith(fetch(req).then(resp => {
      if (resp.ok) { const copia = resp.clone(); caches.open(VERSAO).then(c => c.put(req, copia)); }
      return resp;
    }).catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
  }
});
