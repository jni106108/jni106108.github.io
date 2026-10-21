// Catálogo (somente leitura) + dados do usuário (histórico, veículo, lembretes) salvos no navegador.
import { LEMBRETES_PADRAO } from './zonas.js';

const CHAVE = 'lancer-garagem.v1';

export const catalogo = { sections: [], groups: [], diagrams: [], grupo: {}, diagramasDo: {}, porOem: {}, paginasManual: {} };

export async function carregarCatalogo() {
  const [cat, pags] = await Promise.all([
    fetch('data/catalogo.json').then(r => r.json()),
    fetch('data/manual-paginas.json').then(r => r.json()).catch(() => ({})),
  ]);
  Object.assign(catalogo, cat, { paginasManual: pags });
  for (const g of cat.groups) catalogo.grupo[g.id] = g;
  for (const d of cat.diagrams) {
    (catalogo.diagramasDo[d.group] ||= []).push(d);
    for (const p of d.parts) {
      p.group = d.group; p.esq = d.n;
      (catalogo.porOem[p.oem] ||= []).push(p);
    }
  }
  return catalogo;
}

export function pecasDoGrupo(gid) {
  return (catalogo.diagramasDo[gid] || []).flatMap(d => d.parts);
}

// ── Estado do usuário ───────────────────────────────────────
const padrao = () => ({
  veiculo: {
    apelido: 'Meu Lancer GT', placa: '', chassi: '', anoFab: '', anoModelo: '', producao: '', km: 0, kmData: hoje(), cor: '#8d9399',
    // campos do documento (CRLV), digitados pelo usuário
    renavam: '', proprietario: '', municipio: '', uf: '', combustivel: 'GASOLINA', motorNum: '', categoria: 'PARTICULAR', exercicio: '',
  },
  registros: [],
  lembretes: {}, // overrides { id: { km, meses } }
  config: { tema: 'sistema', documento: 'branco', pinos: true },   // tema: sistema | claro | escuro
});

let estado = padrao();
const ouvintes = new Set();

// Junta o salvo com o padrão (campos novos de versões mais recentes do app ganham o valor padrão)
function completar(d) {
  const p = padrao();
  const e = { ...p, ...d, veiculo: { ...p.veiculo, ...d.veiculo }, config: { ...p.config, ...d.config } };
  // versões antigas guardavam "2012/2013" em anoModelo
  const m = String(e.veiculo.anoModelo || '').match(/^(\d{4})\s*\/\s*(\d{4})$/);
  if (m && !e.veiculo.anoFab) { e.veiculo.anoFab = m[1]; e.veiculo.anoModelo = m[2]; }
  return e;
}

export function carregarEstado() {
  try {
    const raw = localStorage.getItem(CHAVE);
    if (raw) estado = completar(JSON.parse(raw));
  } catch { /* armazenamento indisponível: segue em memória */ }
  return estado;
}
function salvar() {
  try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch { /* idem */ }
  ouvintes.forEach(f => f(estado));
}
export const aoMudar = f => ouvintes.add(f);
export const getEstado = () => estado;

export function atualizarVeiculo(campos) {
  Object.assign(estado.veiculo, campos);
  salvar();
}
export function atualizarConfig(campos) {
  Object.assign(estado.config, campos);
  salvar();
}

export function salvarRegistro(reg) {
  reg.id ||= 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const i = estado.registros.findIndex(r => r.id === reg.id);
  if (i >= 0) estado.registros[i] = reg; else estado.registros.push(reg);
  // quilometragem mais alta registrada atualiza o hodômetro
  if (+reg.km > +estado.veiculo.km) { estado.veiculo.km = +reg.km; estado.veiculo.kmData = reg.data; }
  salvar();
  return reg;
}
export function excluirRegistro(id) {
  estado.registros = estado.registros.filter(r => r.id !== id);
  salvar();
}
export const registrosOrdenados = filtro =>
  estado.registros.filter(filtro || (() => true)).sort((a, b) => (b.data || '').localeCompare(a.data || '') || (+b.km - +a.km));

export const totalRegistro = r => (r.pecas || []).reduce((s, p) => s + (+p.preco || 0) * (+p.qtd || 1), 0) + (+r.maoDeObra || 0);

export function historicoDaPeca(oem) {
  return registrosOrdenados(r => (r.pecas || []).some(p => p.oem === oem));
}

// ── Lembretes ───────────────────────────────────────────────
export function lembretes() {
  const v = estado.veiculo;
  return LEMBRETES_PADRAO.map(l => {
    const o = estado.lembretes[l.id] || {};
    const km = o.km !== undefined ? o.km : l.km, meses = o.meses !== undefined ? o.meses : l.meses;
    const feitos = registrosOrdenados(r => (r.servicos || []).includes(l.id));
    const ult = feitos[0];
    let status = 'sem-intervalo', faltaKm = null, faltaDias = null, proxKm = null, proxData = null;
    if (km || meses) {
      if (!ult) status = 'sem-registro';
      else {
        if (km) { proxKm = +ult.km + km; faltaKm = proxKm - +v.km; }
        if (meses) { const d = new Date(ult.data + 'T12:00'); d.setMonth(d.getMonth() + meses); proxData = d.toISOString().slice(0, 10); faltaDias = Math.round((d - new Date(hoje() + 'T12:00')) / 864e5); }
        const venc = (faltaKm !== null && faltaKm <= 0) || (faltaDias !== null && faltaDias <= 0);
        const perto = (faltaKm !== null && faltaKm <= 1000) || (faltaDias !== null && faltaDias <= 30);
        status = venc ? 'vencido' : perto ? 'proximo' : 'ok';
      }
    }
    return { ...l, km, meses, ultimo: ult, status, faltaKm, faltaDias, proxKm, proxData };
  });
}
export function ajustarLembrete(id, km, meses) {
  estado.lembretes[id] = { km: km || null, meses: meses || null };
  salvar();
}

// ── Backup ──────────────────────────────────────────────────
export function exportarJSON() {
  return new Blob([JSON.stringify({ app: 'lancer-garagem', versao: 1, exportado: new Date().toISOString(), ...estado }, null, 2)], { type: 'application/json' });
}
export function importarJSON(texto) {
  const d = JSON.parse(texto);
  if (!d || !Array.isArray(d.registros)) throw new Error('Arquivo não parece um backup do Lancer Garagem.');
  estado = completar({ veiculo: d.veiculo, registros: d.registros, lembretes: d.lembretes || {}, config: d.config || estado.config });
  salvar();
}
export function exportarCSV() {
  const linhas = [['data', 'km', 'tipo', 'titulo', 'zona', 'pecas', 'valor_pecas', 'mao_de_obra', 'total', 'oficina', 'obs']];
  for (const r of registrosOrdenados()) {
    const vp = (r.pecas || []).reduce((s, p) => s + (+p.preco || 0) * (+p.qtd || 1), 0);
    linhas.push([r.data, r.km, r.tipo, r.titulo, r.zona, (r.pecas || []).map(p => `${p.oem} ${p.desc || ''} x${p.qtd || 1}`).join(' | '), vp.toFixed(2), (+r.maoDeObra || 0).toFixed(2), totalRegistro(r).toFixed(2), r.oficina || '', r.obs || '']);
  }
  const csv = linhas.map(l => l.map(c => '"' + String(c ?? '').replace(/"/g, '""') + '"').join(';')).join('\r\n');
  return new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
}

// ── Utilidades ──────────────────────────────────────────────
export function hoje() { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); }
export const brl = v => (+v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const km = v => (+v || 0).toLocaleString('pt-BR') + ' km';
export const dataBR = s => s ? s.split('-').reverse().join('/') : '';

// Período "2011.09 - 2014.06" aplica-se à data de produção "aaaa.mm"?
export function aplicavel(per, producao) {
  if (!producao || !per) return true;
  const m = per.match(/(\d{4}\.\d{2})\s*-\s*(\d{4}\.\d{2})?/);
  if (!m) return true;
  return producao >= m[1] && (!m[2] || producao <= m[2]);
}
