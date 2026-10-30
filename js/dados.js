// Catálogo (somente leitura) + dados do usuário (histórico, veículo, lembretes) salvos no navegador.
import { LEMBRETES_PADRAO } from './zonas.js';
import * as Anexos from './anexos.js';

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
    apelido: 'Meu Lancer GT', versao: 'GT', placa: '', chassi: '', anoFab: '', anoModelo: '', producao: '', km: 0, kmData: hoje(), cor: '#8d9399',
    // campos do documento (CRLV), digitados pelo usuário
    renavam: '', proprietario: '', municipio: '', uf: '', combustivel: 'GASOLINA', motorNum: '', categoria: 'PARTICULAR', exercicio: '',
  },
  registros: [],        // registro.anexos = ids das fotos (ficam no IndexedDB, ver anexos.js)
  // { id, data, combustivel: etanol | gasolina | premium, total, preco, litros, km, posto, cheio }
  // cheio = tanque completado (base do cálculo de consumo); lançamentos antigos sem o campo contam como cheio
  abastecimentos: [],
  ganhos: [],           // ganhos como motorista de app: { id, inicio, fim, valor }
  lembretes: {}, // overrides { id: { km, meses } }
  // vencimentos (data aaaa-mm-dd vazia = não cadastrado)
  documentos: { ipva: { venc: '', valor: '' }, licenciamento: { venc: '' }, seguro: { venc: '', seguradora: '' }, cnh: { venc: '' } },
  // tema: sistema | claro | escuro · odometro: moderno | classico · corRodas: null = original
  // backupDias: lembrete de backup (0 = nunca) · ultimoBackup: data do último backup feito
  // placaDianteira: original (centro) | lado (lado do motorista)
  config: { tema: 'sistema', documento: 'branco', pinos: true, odometro: 'moderno', aerofolio: true, corRodas: null, placaDianteira: 'original', backupDias: 15, ultimoBackup: '' },
});

let estado = padrao();
const ouvintes = new Set();

// Junta o salvo com o padrão (campos novos de versões mais recentes do app ganham o valor padrão)
function completar(d) {
  const p = padrao();
  const e = { ...p, ...d, veiculo: { ...p.veiculo, ...d.veiculo }, config: { ...p.config, ...d.config }, documentos: { ...p.documentos } };
  for (const k of Object.keys(p.documentos)) e.documentos[k] = { ...p.documentos[k], ...d.documentos?.[k] };
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
const novoId = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
// km informado num lançamento mais alto que o hodômetro atualiza o hodômetro
function subirHodometro(km, data) {
  if (+km > +estado.veiculo.km) { estado.veiculo.km = +km; estado.veiculo.kmData = data || hoje(); }
}

// ── Abastecimentos e ganhos ─────────────────────────────────
export function salvarAbastecimento(a) {
  a.id ||= novoId('a');
  const i = estado.abastecimentos.findIndex(x => x.id === a.id);
  if (i >= 0) estado.abastecimentos[i] = a; else estado.abastecimentos.push(a);
  subirHodometro(a.km, a.data);
  salvar();
  return a;
}
export function excluirAbastecimento(id) {
  estado.abastecimentos = estado.abastecimentos.filter(a => a.id !== id);
  salvar();
}
export function salvarGanho(g) {
  g.id ||= novoId('g');
  const i = estado.ganhos.findIndex(x => x.id === g.id);
  if (i >= 0) estado.ganhos[i] = g; else estado.ganhos.push(g);
  salvar();
  return g;
}
export function excluirGanho(id) {
  estado.ganhos = estado.ganhos.filter(g => g.id !== id);
  salvar();
}
export const abastecimentosOrdenados = () => [...estado.abastecimentos].sort((a, b) => (b.data || '').localeCompare(a.data || '') || (+b.km - +a.km));

// Consumo pelo método do tanque cheio: entre dois abastecimentos com tanque cheio (e km informado),
// km rodados ÷ litros colocados depois do primeiro (incluindo o segundo). Abastecimento parcial só soma litros.
// Retorna { porId: { id: km/L }, media, kmRodados, litros, gasto } (media = null sem dados suficientes).
export function consumo() {
  const lista = [...estado.abastecimentos].sort((a, b) => (a.data || '').localeCompare(b.data || '') || (+a.km || 0) - (+b.km || 0));
  const porId = {}; let base = null, litros = 0, gastoTrecho = 0, kmTot = 0, litTot = 0, gasto = 0;
  for (const a of lista) {
    const cheio = a.cheio !== false;
    if (!base) { if (cheio && +a.km) base = a; continue; }
    litros += +a.litros || 0; gastoTrecho += +a.total || 0;
    if (!cheio) continue;
    if (+a.km > +base.km && litros > 0) {
      porId[a.id] = (+a.km - +base.km) / litros;
      kmTot += +a.km - +base.km; litTot += litros; gasto += gastoTrecho;
    }
    base = +a.km ? a : null; litros = 0; gastoTrecho = 0;   // tanque cheio sem km quebra a sequência
  }
  return { porId, media: litTot ? kmTot / litTot : null, kmRodados: kmTot, litros: litTot, gasto, custoKm: kmTot ? gasto / kmTot : null };
}

// ── Documentos com vencimento ───────────────────────────────
export function atualizarDocumento(k, campos) {
  Object.assign(estado.documentos[k], campos);
  salvar();
}
export const ganhosOrdenados = () => [...estado.ganhos].sort((a, b) => (b.fim || '').localeCompare(a.fim || ''));

export function salvarRegistro(reg) {
  reg.id ||= novoId('r');
  const i = estado.registros.findIndex(r => r.id === reg.id);
  if (i >= 0) estado.registros[i] = reg; else estado.registros.push(reg);
  subirHodometro(reg.km, reg.data);
  salvar();
  return reg;
}
export function excluirRegistro(id) {
  const r = estado.registros.find(x => x.id === id);
  if (r?.anexos?.length) Anexos.excluir(r.anexos).catch(() => {});
  estado.registros = estado.registros.filter(x => x.id !== id);
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
// Um único arquivo com tudo, inclusive as fotos (em texto). Backups antigos (sem fotos) continuam sendo aceitos.
export async function exportarJSON() {
  const ids = estado.registros.flatMap(r => r.anexos || []);
  const anexos = ids.length ? await Anexos.exportar(ids) : {};
  return new Blob([JSON.stringify({ app: 'lancer-garagem', versao: 2, exportado: new Date().toISOString(), ...estado, anexos })], { type: 'application/json' });
}
export async function importarJSON(texto) {
  const d = JSON.parse(texto);
  if (!d || !Array.isArray(d.registros)) throw new Error('Arquivo não parece um backup do Lancer Club 67.');
  if (d.anexos) await Anexos.importar(d.anexos);
  estado = completar({ veiculo: d.veiculo, registros: d.registros, abastecimentos: d.abastecimentos || [], ganhos: d.ganhos || [],
    documentos: d.documentos, lembretes: d.lembretes || {}, config: { ...(d.config || estado.config), ultimoBackup: hoje() } });
  salvar();
}
export function exportarCSV() {
  const linhas = [['data', 'km', 'tipo', 'titulo', 'zona', 'pecas', 'valor_pecas', 'mao_de_obra', 'total', 'oficina', 'obs']];
  for (const r of registrosOrdenados()) {
    const vp = (r.pecas || []).reduce((s, p) => s + (+p.preco || 0) * (+p.qtd || 1), 0);
    linhas.push([r.data, r.km, r.tipo, r.titulo, r.zona, (r.pecas || []).map(p => `${p.oem} ${p.desc || ''} x${p.qtd || 1}`).join(' | '), vp.toFixed(2), (+r.maoDeObra || 0).toFixed(2), totalRegistro(r).toFixed(2), r.oficina || '', r.obs || '']);
  }
  for (const a of abastecimentosOrdenados()) {
    linhas.push([a.data, a.km || '', 'abastecimento', `Abastecimento ${a.combustivel}`, '', `${(+a.litros || 0).toFixed(3)} L a R$ ${(+a.preco || 0).toFixed(3)}/L`, (+a.total || 0).toFixed(2), '0.00', (+a.total || 0).toFixed(2), a.posto || '', '']);
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
