// Service worker: deixa o app instalável e utilizável offline depois da primeira abertura.
// Código (html/js/css): rede primeiro, para receber atualizações. Dados pesados (modelo, diagramas, PDFs, CDN): cache primeiro.
// Dois caches: CODIGO muda a cada versão; PESADO é mantido entre versões, para o celular não baixar de novo
// o modelo 3D (12,7 MB), o three.js e os diagramas a cada atualização. Troque PESADO só se esses arquivos mudarem.
const CODIGO = 'lancer-codigo-v9.1';
const PESADO = 'lancer-pesado-v1';
const ESSENCIAL = [
  './', 'index.html', 'css/app.css', 'js/main.js', 'js/carro3d.js', 'js/zonas.js', 'js/dados.js', 'js/anexos.js',
  'data/catalogo.json', 'data/manual-paginas.json', 'manifest.webmanifest', 'marca/icone-192.png', 'marca/abertura.png',
];

self.addEventListener('install', e => {
  // um arquivo que falhe não impede a instalação (antes, um único erro deixava o app preso na versão anterior)
  e.waitUntil(caches.open(CODIGO).then(c => Promise.all(ESSENCIAL.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CODIGO && k !== PESADO).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const pesado = url => /\/(modelo|data\/diagramas|docs|icones)\//.test(url.pathname) || url.origin !== self.location.origin;

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (pesado(url)) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(resp => {
      // só guarda respostas completas (200); respostas parciais ou com erro iriam travar a próxima abertura
      if (resp.status === 200 || resp.type === 'opaque') { const copia = resp.clone(); caches.open(PESADO).then(c => c.put(req, copia)); }
      return resp;
    })));
  } else {
    // no-cache: revalida no servidor (o GitHub Pages manda guardar por 10 min, o que misturava html novo com js antigo)
    e.respondWith(fetch(req, { cache: 'no-cache' }).then(resp => {
      if (resp.ok) { const copia = resp.clone(); caches.open(CODIGO).then(c => c.put(req, copia)); }
      return resp;
    }).catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
  }
});
