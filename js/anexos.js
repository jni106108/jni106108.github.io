// Fotos e notas fiscais dos registros. Imagens não cabem no localStorage (limite ~5 MB),
// por isso ficam no IndexedDB do navegador; o registro guarda só os ids (registro.anexos = ['f…']).
const BANCO = 'lancer-garagem-anexos', LOJA = 'anexos';
let conexao = null;

function abrir() {
  return conexao ||= new Promise((ok, erro) => {
    const r = indexedDB.open(BANCO, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(LOJA);
    r.onsuccess = () => ok(r.result);
    r.onerror = () => erro(r.error);
  });
}
async function loja(modo, fn) {
  const db = await abrir();
  return new Promise((ok, erro) => {
    const tx = db.transaction(LOJA, modo), req = fn(tx.objectStore(LOJA));
    tx.oncomplete = () => ok(req?.result);
    tx.onerror = tx.onabort = () => erro(tx.error);
  });
}

export const salvarBlob = (id, blob) => loja('readwrite', s => s.put(blob, id));
export const lerBlob = id => loja('readonly', s => s.get(id));
export const excluir = ids => loja('readwrite', s => { for (const id of [].concat(ids)) s.delete(id); });

// Reduz a foto (lado maior até 1600 px, JPEG) antes de guardar: nota fiscal continua legível e o arquivo fica pequeno
export async function adicionarFoto(arquivo) {
  const id = 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  let blob = arquivo;
  if (arquivo.type.startsWith('image/')) {
    try {
      const img = await createImageBitmap(arquivo);
      const k = Math.min(1, 1600 / Math.max(img.width, img.height));
      const cv = document.createElement('canvas'); cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      blob = await new Promise(ok => cv.toBlob(ok, 'image/jpeg', 0.8)) || arquivo;
    } catch { /* formato que o navegador não decodifica: guarda o original */ }
  }
  await salvarBlob(id, blob);
  return id;
}

// URLs temporárias para exibir as miniaturas (uma por id, reaproveitadas)
const urls = new Map();
export async function url(id) {
  if (urls.has(id)) return urls.get(id);
  const blob = await lerBlob(id);
  if (!blob) return null;
  const u = URL.createObjectURL(blob); urls.set(id, u);
  return u;
}
// Preenche as <img data-anexo="id"> que acabaram de ser desenhadas
export function hidratar(raiz = document) {
  raiz.querySelectorAll('img[data-anexo]:not([src])').forEach(async img => {
    const u = await url(img.dataset.anexo).catch(() => null);
    if (u) img.src = u; else img.closest('.anexo')?.classList.add('perdido');
  });
}

// Backup: anexos viram texto (data URL) dentro do JSON, e voltam para o IndexedDB na restauração
const paraTexto = blob => new Promise(ok => { const f = new FileReader(); f.onload = () => ok(f.result); f.readAsDataURL(blob); });
export async function exportar(ids) {
  const out = {};
  for (const id of ids) { const b = await lerBlob(id).catch(() => null); if (b) out[id] = await paraTexto(b); }
  return out;
}
export async function importar(mapa = {}) {
  for (const [id, dataUrl] of Object.entries(mapa)) await salvarBlob(id, await (await fetch(dataUrl)).blob());
}
