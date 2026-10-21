import { Carro3D } from './carro3d.js';
import { ZONAS, ZONA_POR_ID, zonaDoGrupo, traduz, videoUrl, VEICULO_BASE, REGIOES, FILTROS, FILTRO_POR_ID } from './zonas.js';
import * as D from './dados.js';

const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ICO = {
  x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  busca: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  voltar: '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>',
  mais: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
  reset: '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 15v5h-5M5 15a8 8 0 0 0 14 2M19 9A8 8 0 0 0 5 7"/></svg>',
  pdf: '<svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
  play: '<svg viewBox="0 0 24 24" class="yt"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>',
  livro: '<svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/></svg>',
  chave: '<svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8V21h3.2l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.4 2.4-2.8-.8-.8-2.8z"/></svg>',
  carro: '<svg viewBox="0 0 24 24"><path d="M5 16h14M3 13l2-5h14l2 5v4H3z"/><circle cx="7" cy="17" r="1.6"/><circle cx="17" cy="17" r="1.6"/></svg>',
  relogio: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  lista: '<svg viewBox="0 0 24 24"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
  caixa: '<svg viewBox="0 0 24 24"><path d="M3 7l9-4 9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7"/></svg>',
  down: '<svg viewBox="0 0 24 24"><path d="M12 4v12M6 10l6 6 6-6M4 20h16"/></svg>',
  up: '<svg viewBox="0 0 24 24"><path d="M12 20V8M6 14l6-6 6 6M4 4h16"/></svg>',
  dinheiro: '<svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/></svg>',
  sino: '<svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>',
  doc: '<svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="15" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M5.5 16c.6-1.4 1.6-2 3-2s2.4.6 3 2M14 9.5h4M14 12.5h4M14 15.5h2.5"/></svg>',
  hodometro: '<svg viewBox="0 0 24 24"><path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17l4-5"/><path d="M7 21h10"/></svg>',
  seta: '<svg viewBox="0 0 24 24"><path d="M6 15l6-6 6 6"/></svg>',
  lapis: '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>',
  lixo: '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>',
  olho: '<svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
};
const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
// Ícones dos filtros de camadas (simples e característicos de cada sistema)
const FICO = {
  geral: '<svg viewBox="0 0 24 24"><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12.5l9 5 9-5"/><path d="M3 16.5l9 5 9-5" opacity=".5"/></svg>',
  carroceria: '<svg viewBox="0 0 24 24"><path d="M2.5 16v-3.2l2.6-.9 3.1-3.6h6.9l3.6 3.6 2.8.9V16"/><path d="M2.5 16h2.3M9.2 16h5.6M19.2 16h2.3"/><circle cx="7" cy="16" r="2.2"/><circle cx="17" cy="16" r="2.2"/></svg>',
  vidros: '<svg viewBox="0 0 24 24"><path d="M10 5.5a6.5 6.5 0 0 0 0 13z"/><path d="M14 8h7M14 12h7M14 16h7"/></svg>',
  mecanica: ICO.chave,
  motor: '<svg viewBox="0 0 24 24"><path d="M7 9h9l2 2h2.5v6H18l-2 2H8.5L6 16.5H4V11h3z"/><path d="M9.5 9V6.5h5V9M12 6.5V4.5M2 13.5h2"/></svg>',
  transmissao: '<svg viewBox="0 0 24 24"><circle cx="6" cy="5" r="1.8"/><circle cx="12" cy="5" r="1.8"/><circle cx="18" cy="5" r="1.8"/><circle cx="6" cy="19" r="1.8"/><circle cx="12" cy="19" r="1.8"/><path d="M6 6.8v10.4M12 6.8v10.4M18 6.8V12H6"/></svg>',
  suspensao: '<svg viewBox="0 0 24 24"><path d="M6 3h12M6 21h12"/><path d="M8 5.5l8 1.7-8 1.7 8 1.7-8 1.7 8 1.7-8 1.7 8 1.7-8 1.7"/></svg>',
  freios: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="13.5" r="7.5"/><circle cx="10.5" cy="13.5" r="2.2"/><path d="M14.5 3.3a10 10 0 0 1 6.2 6.4"/><path d="M15 7.5l2.4-2.4"/></svg>',
  direcao: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.2"/><path d="M3.3 10.5l6.6 1M20.7 10.5l-6.6 1M12 14.2v6.6"/></svg>',
  eletrica: '<svg viewBox="0 0 24 24"><path d="M13.5 2.5L4.5 14h7l-1 7.5 9-11.5h-7z"/></svg>',
  interior: '<svg viewBox="0 0 24 24"><path d="M7.5 3.5h4a1 1 0 0 1 1 1.1L11.7 13H18a1 1 0 0 1 1 1.2l-.7 3.3H8L6.4 14z"/><path d="M9 17.5l-1 3.5M17 17.5l1 3.5"/></svg>',
};
// Ícones dos itens de manutenção programada (cartões do livro)
const SICO = {
  oleo: '<svg viewBox="0 0 24 24"><path d="M3.5 10h8.5l2 2h3.5l3-2v1.2L16 17H3.5z"/><path d="M6.5 10V7.5h3V10"/><path d="M20 15.5s1.2 1.5 1.2 2.3a1.2 1.2 0 0 1-2.4 0c0-.8 1.2-2.3 1.2-2.3z"/></svg>',
  fluido_freio: '<svg viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/></svg>',
  arrefecimento: '<svg viewBox="0 0 24 24"><path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"/><path d="M12 9v7.5M17 6h3M17 9.5h2"/></svg>',
  direcao: FICO.direcao,
  cambio: FICO.transmissao,
  velas: '<svg viewBox="0 0 24 24"><path d="M10 2.5h4V5h-4zM8.5 5h7v4h-7zM10 9h4v6h-4z"/><path d="M12 15v3.5M10 18.5h2.5l-1 2.5"/></svg>',
  filtro_ar: '<svg viewBox="0 0 24 24"><path d="M3 8.5h10.5a3 3 0 1 0-3-3"/><path d="M3 12.5h15a3 3 0 1 1-3 3"/><path d="M3 16.5h6.5"/></svg>',
  filtro_cabine: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"/><path d="M12 10c-.8-3.8 1-6.6 3.8-5.6 2.4.9.9 4.6-1.8 6M14 12c3.8-.8 6.6 1 5.6 3.8-.9 2.4-4.6.9-6-1.8M12 14c.8 3.8-1 6.6-3.8 5.6-2.4-.9-.9-4.6 1.8-6M10 12c-3.8.8-6.6-1-5.6-3.8.9-2.4 4.6-.9 6 1.8"/></svg>',
  rodizio: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5"/><path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5"/></svg>',
};
// O manual (320 págs) foi dividido em partes de 80 páginas para caber no limite de 25 MB por arquivo do GitHub
// (ferramentas/dividir-manual.html). Converte a página do PDF original para a parte certa.
const PAGINAS_POR_PARTE = 80;
const urlManual = pagina => {
  const parte = Math.ceil(pagina / PAGINAS_POR_PARTE);
  return `docs/manual-${parte}.pdf#page=${pagina - (parte - 1) * PAGINAS_POR_PARTE}`;
};
const VERSAO_APP = 'v4 · histórico recolhível e menu de serviço';   // aparece em Configurações (troque junto com VERSAO do sw.js)
const TIPOS = { troca: 'Troca de peça', preventiva: 'Manutenção preventiva', reparo: 'Reparo', inspecao: 'Inspeção', outro: 'Outro' };
const CORES = [['Prata', '#8d9399'], ['Cinza grafite', '#4a4e54'], ['Preto', '#15161a'], ['Branco', '#e9eaec'], ['Vermelho', '#9b1420'], ['Azul', '#1d3d7a']];

const ui = {
  zona: null, aba: 'pecas', grupo: null, esq: 0, busca: '', buscaGlobal: false, filtro: 'geral', reg: {}, livrete: false,
  // livro de manutenção: aba aberta, página e filtros de despesas
  livro: { aba: 'revisoes', editando: false, anos: null, desp: { periodo: '12m', valor: 'todos', ordem: 'recentes' } },
};
let carro;
const cfg = () => D.getEstado().config;

// ── Inicialização ─────────────────────────────────────────
async function iniciar() {
  D.carregarEstado();
  try { await D.carregarCatalogo(); }
  catch (e) { $('#carregando').textContent = 'Não foi possível carregar data/catalogo.json — abra o app pelo servidor local (Iniciar Lancer Garagem.bat).'; return; }
  carro = new Carro3D($('#cena'), {
    cor: D.getEstado().veiculo.cor,
    aoSelecionar: id => abrirZona(id),
    aoPassar: mostrarRotulo,
  });
  carro.vistas = Object.fromEntries(ZONAS.map(z => [z.id, z.vista]));
  carro.setPlaca(D.getEstado().veiculo.placa);
  window.lancer = { carro, ui, dados: D };   // acesso pelo console do navegador (depuração)
  aplicarTema();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', aplicarTema);
  await carro.pronto;
  criarPinos();
  $('#pinos').hidden = !cfg().pinos;
  carro.aoQuadro = atualizarPinos;
  D.aoMudar(() => { atualizarBarra(); if (ui.zona) renderPainel(); if (ui.livrete) renderLivrete(); });
  atualizarBarra();
  ajustarMargem();
  renderFiltro();
  montarCarrossel();
  document.addEventListener('click', onClique);
  document.addEventListener('change', onTroca);
  document.addEventListener('keydown', e => {
    const digitando = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
    if (e.key === 'Escape') {
      if (!$('#modal').hidden) fecharModal();
      else if (menuAberto()) fecharMenus();
      else if (ui.livrete) fecharLivrete();
      else if (ui.zona) carro.selecionar(null, true);
    }
    if (digitando || !$('#modal').hidden || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    const d = e.key === 'ArrowLeft' ? -1 : 1;
    if (!ui.livrete) passoRegiao(d);
  });
  $('#carregando').classList.add('some');
  setTimeout(() => $('#carregando').remove(), 500);
  setTimeout(() => $('#dica').classList.add('some'), 6000);
}

function atualizarBarra() {
  const v = D.getEstado().veiculo;
  $('#apelido').textContent = v.apelido || 'Lancer GT';
  $('#km-atual').innerHTML = esc(D.km(v.km)) + (v.placa ? `<span class="placa"> · ${esc(v.placa)}</span>` : '');
  const l = D.lembretes().filter(x => x.status === 'vencido' || x.status === 'proximo').sort((a, b) => (a.faltaKm ?? 1e9) - (b.faltaKm ?? 1e9))[0]
    || D.lembretes().find(x => x.status === 'sem-registro');
  const chip = $('#lembrete-chip');
  if (l) {
    chip.hidden = false;
    chip.innerHTML = `<span class="bola st-${l.status}"></span><span>${esc(textoLembrete(l))}</span>`;
  } else chip.hidden = true;
  const urgente = D.lembretes().find(x => x.status === 'vencido' || x.status === 'proximo');
  $('#veic-alerta').hidden = !urgente;
  $('#veic-alerta').className = urgente ? 'st-' + urgente.status : '';
  if (!$('#veic-lista').hidden) renderMenuVeiculo();
}
// Itens que pedem ação: manutenção vencida/próxima/sem registro e hodômetro desatualizado
function alertas() {
  const v = D.getEstado().veiculo, out = D.lembretes().filter(l => ['vencido', 'proximo', 'sem-registro'].includes(l.status));
  const ordem = { vencido: 0, proximo: 1, 'sem-registro': 3 };
  out.sort((a, b) => ordem[a.status] - ordem[b.status] || (a.faltaKm ?? 1e9) - (b.faltaKm ?? 1e9));
  const dias = v.kmData ? Math.round((new Date(D.hoje()) - new Date(v.kmData)) / 864e5) : 999;
  if (dias > 30) out.splice(out.filter(l => l.status !== 'sem-registro').length, 0, { id: 'km', status: 'proximo', nome: 'Atualizar a quilometragem', dias });
  return out;
}
function textoLembrete(l) {
  if (l.status === 'sem-registro') return `${l.nome}: registre a última vez que foi feito`;
  if (l.status === 'sem-intervalo') return `${l.nome}: defina o intervalo`;
  const p = [];
  if (l.faltaKm !== null) p.push(l.faltaKm <= 0 ? `vencido há ${D.km(-l.faltaKm)}` : `faltam ${D.km(l.faltaKm)}`);
  if (l.faltaDias !== null) p.push(l.faltaDias <= 0 ? `vencido há ${-l.faltaDias} dias` : `${l.faltaDias} dias`);
  return `${l.nome}: ${p.join(' · ')}`;
}

// ── Pinos ─────────────────────────────────────────────────
function criarPinos() {
  $('#pinos').innerHTML = ZONAS.map(z => `<button class="pino" data-pino="${z.id}" title="${esc(z.nome)}"><i></i><span>${esc(z.nome)}</span></button>`).join('');
}
function atualizarPinos() {
  if (!cfg().pinos) return;
  const pos = carro.posicoesTela(), reg = zonasRegiao(), f = filtroAtual();
  for (const el of $('#pinos').children) {
    const id = el.dataset.pino, z = ZONA_POR_ID[id], p = pos[id];
    const mostrar = p && p.visivel && (ui.zona ? ui.zona === id
      : reg.length ? reg.includes(id)
      : f.zonas ? f.zonas.includes(id) && (f.regioes === 'int' || p.frente > -0.1)
      : z.externa && p.frente > -0.1);
    el.classList.toggle('oculto', !mostrar);
    el.classList.toggle('on', ui.zona === id);
    if (mostrar) el.style.transform = `translate(${p.x - 9}px, ${p.y - 9}px)`;
  }
}

// ── Painel da zona ────────────────────────────────────────
function abrirZona(id) {
  ui.zona = id; ui.grupo = null; ui.busca = ''; ui.buscaGlobal = false;
  $('#dica').hidden = true;
  document.body.classList.toggle('com-painel', !!id);
  renderChips();
  if (!id) {
    // painel fechado: a câmera se afasta e volta ao enquadramento padrão da região atual
    $('#painel').hidden = true; $('#painel').classList.remove('cheio'); ajustarMargem();
    aplicarRegiao(true, 0); return;
  }
  const z = ZONA_POR_ID[id], f = filtroAtual();
  if (z && f.zonas && !f.zonas.includes(id)) setFiltro(z.filtro, false);   // peça fora do filtro: troca para o sistema dela
  renderPainel();
  $('#painel').hidden = false;
  ajustarMargem();
}
const celular = () => window.innerWidth <= 760;
function ajustarMargem() {
  const p = $('#painel'), topo = celular() ? 120 : 110;   // barra + menu de regiões
  document.body.classList.toggle('painel-cheio', !p.hidden && p.classList.contains('cheio'));
  if (p.hidden) return carro.setMargem(0, 0, topo);
  if (celular()) carro.setMargem(0, p.classList.contains('cheio') ? 0 : window.innerHeight * 0.58, topo);
  else carro.setMargem(p.offsetWidth + 12, 0, topo);
}
window.addEventListener('resize', () => carro && ajustarMargem());

function renderPainel() {
  const z = ZONA_POR_ID[ui.zona]; if (!z) return;
  const nPecas = z.grupos.reduce((s, g) => s + D.pecasDoGrupo(g).length, 0);
  const nReg = D.registrosOrdenados(r => r.zona === z.id).length;
  const p = $('#painel');
  const rolagem = p.querySelector('.p-corpo')?.scrollTop || 0;
  p.innerHTML = `
    <div class="alca" data-alca></div>
    <div class="p-topo">
      <div class="p-cab">
        <div style="flex:1;min-width:0"><h2>${esc(z.nome)}</h2>
          <div class="p-sub">${z.grupos.length} grupo${z.grupos.length > 1 ? 's' : ''} do catálogo · ${nPecas} linhas de peças</div></div>
        <button class="fechar" data-acao="fechar-zona" title="Fechar">${ICO.x}</button>
      </div>
      <nav class="abas">
        ${[['pecas', 'Peças'], ['historico', 'Histórico', nReg], ['reparos', 'Reparos']].map(([k, t, n]) =>
          `<button class="${ui.aba === k ? 'ativo' : ''}" data-aba="${k}">${t}${n ? `<span class="n">${n}</span>` : ''}</button>`).join('')}
      </nav>
    </div>
    <div class="p-corpo">${ui.aba === 'pecas' ? abaPecas(z) : ui.aba === 'historico' ? abaHistorico(z) : abaReparos(z)}</div>`;
  if (ui.aba === 'pecas' && ui.grupo) montarDiagrama();
  const busca = p.querySelector('[data-busca]');
  if (busca) busca.addEventListener('input', e => { ui.busca = e.target.value; atualizarResultados(z); });
  p.querySelector('.p-corpo').scrollTop = rolagem;
  arrastarAlca();
}

function abaPecas(z) {
  if (ui.grupo) return vistaGrupo(ui.grupo);
  return `
    <div class="busca">${ICO.busca}<input data-busca placeholder="Buscar peça, nº OEM ou referência" value="${esc(ui.busca)}" autocomplete="off"></div>
    <label class="chk"><input type="checkbox" data-acao="busca-global" ${ui.buscaGlobal ? 'checked' : ''}> Buscar no catálogo inteiro</label>
    <div data-resultados>${resultados(z)}</div>`;
}
function resultados(z) {
  const q = ui.busca.trim();
  if (!q) {
    return `<div class="grupos">${z.grupos.map(gid => {
      const g = D.catalogo.grupo[gid], ds = D.catalogo.diagramasDo[gid] || [];
      const n = D.pecasDoGrupo(gid).length;
      return `<button class="grupo-card" data-grupo="${gid}">
        <div class="thumb" style="background-image:url('data/diagramas/${ds[0]?.img}')"></div>
        <div class="gc-txt"><span class="cod">${gid}</span><b>${esc(g?.name)}</b><small>${ds.length} esquema${ds.length > 1 ? 's' : ''} · ${n} peças</small></div></button>`;
    }).join('')}</div>`;
  }
  const norm = s => (s || '').toUpperCase().replace(/[\s\-.]/g, '');
  const nq = norm(q), qq = q.toUpperCase();
  const grupos = ui.buscaGlobal ? D.catalogo.groups.map(g => g.id) : z.grupos;
  const vistos = new Set(), achados = [];
  for (const gid of grupos) for (const p of D.pecasDoGrupo(gid)) {
    const chave = p.oem + gid;
    if (vistos.has(chave)) continue;
    if (norm(p.oem).includes(nq) || norm(p.ref).includes(nq) || (p.sup || []).some(s => norm(s).includes(nq)) || p.desc.toUpperCase().includes(qq) || traduz(p.desc).toUpperCase().includes(qq)) {
      vistos.add(chave); achados.push(p);
    }
    if (achados.length >= 120) break;
  }
  if (!achados.length) return `<div class="vazio">${ICO.busca}<div>Nada encontrado para “${esc(q)}”.</div></div>`;
  return `<div class="p-sub" style="margin-bottom:4px">${achados.length}${achados.length >= 120 ? '+' : ''} resultado(s)</div>` + achados.map(p => linhaPeca(p, true)).join('');
}
function atualizarResultados(z) {
  const el = $('[data-resultados]'); if (el) el.innerHTML = resultados(z);
}

function linhaPeca(p, comGrupo = false) {
  const pt = traduz(p.desc), hist = D.historicoDaPeca(p.oem);
  const prod = D.getEstado().veiculo.producao;
  const na = !D.aplicavel(p.per, prod);
  const idx = encodeURIComponent(JSON.stringify([p.group, p.esq, p.oem, p.ref]));
  return `<div class="linha ${p.alt ? 'alt' : ''} ${na ? 'na' : ''}" data-peca="${idx}">
    <div class="ref">${esc(p.ref)}</div>
    <div class="ds"><b>${esc(pt || p.desc)}</b><small>${pt ? esc(p.desc) + ' · ' : ''}${esc(p.det)}${p.det ? ' · ' : ''}${esc(p.per)}${comGrupo ? ' · grupo ' + p.group : ''}</small>
      ${p.sup ? `<span class="tag sup">substituído por ${p.sup.map(esc).join(', ')}</span>` : ''}
      ${hist.length ? `<span class="tag troca">trocada em ${D.dataBR(hist[0].data)} · ${D.km(hist[0].km)}</span>` : ''}</div>
    <div class="oem">${esc(p.oem)}<small>${p.qty && p.qty !== 'CC' ? 'qtd ' + (+p.qty || p.qty) : ''}${p.usd ? ' · US$ ' + p.usd.toFixed(2) : ''}</small></div>
  </div>`;
}

function vistaGrupo(gid) {
  const g = D.catalogo.grupo[gid], ds = D.catalogo.diagramasDo[gid] || [];
  const d = ds[ui.esq] || ds[0];
  const prod = D.getEstado().veiculo.producao;
  return `
    <button class="voltar" data-acao="voltar-grupos">${ICO.voltar} ${esc(ZONA_POR_ID[ui.zona].nome)}</button>
    <div class="cod">${gid}</div><h3 class="g-tit">${esc(g.name)}</h3><div class="p-sub">${esc(g.en)}</div>
    ${ds.length > 1 ? `<div class="esq-tabs">${ds.map((x, i) => `<button class="${i === ui.esq ? 'ativo' : ''}" data-esq="${i}">Esquema ${x.n}/${x.total}</button>`).join('')}</div>` : '<div style="height:10px"></div>'}
    ${d.applic || d.see ? `<div class="aplic">${d.applic ? 'Aplicação: ' + esc(d.applic) : ''}${d.applic && d.see ? ' · ' : ''}${d.see ? 'Ver também: ' + esc(d.see) : ''}</div>` : ''}
    <div class="diag" data-diag>
      <img src="data/diagramas/${d.img}" alt="Diagrama ${gid} esquema ${d.n}" draggable="false">
      <span class="diag-hint">arraste · role/pinça para zoom</span>
      <div class="diag-ctl">
        <button data-zoom="1.4" title="Aproximar">${ICO.mais}</button>
        <button data-zoom="0.7" title="Afastar">${ICO.menos}</button>
        <button data-zoom="0" title="Ajustar">${ICO.reset}</button>
        <a href="docs/catalogo.pdf#page=${d.page}" target="_blank" rel="noopener" title="Abrir no PDF do catálogo (pág. ${d.page})">${ICO.pdf}</a>
      </div>
    </div>
    ${prod ? `<div class="aplic" style="margin-top:8px">Linhas apagadas não se aplicam à produção ${esc(prod)}.</div>` : ''}
    <div class="tabela">${d.parts.map(p => linhaPeca(p)).join('')}</div>`;
}

// Visualizador com zoom/arrasto (mouse, roda e pinça)
function montarDiagrama() {
  const box = $('[data-diag]'), img = box?.querySelector('img'); if (!img) return;
  const st = { s: 1, x: 0, y: 0, min: 0.2 };
  const aplica = () => { img.style.transform = `translate(${st.x}px, ${st.y}px) scale(${st.s})`; };
  const ajustar = () => {
    const w = box.clientWidth, h = box.clientHeight, iw = img.naturalWidth, ih = img.naturalHeight; if (!iw) return;
    st.s = st.min = Math.min(w / iw, h / ih); st.x = (w - iw * st.s) / 2; st.y = (h - ih * st.s) / 2; aplica();
  };
  const zoom = (f, cx, cy) => {
    const ns = Math.min(4, Math.max(st.min, st.s * f)); const k = ns / st.s;
    st.x = cx - (cx - st.x) * k; st.y = cy - (cy - st.y) * k; st.s = ns; aplica();
  };
  img.complete ? ajustar() : img.addEventListener('load', ajustar);
  box.addEventListener('wheel', e => { e.preventDefault(); const r = box.getBoundingClientRect(); zoom(e.deltaY < 0 ? 1.15 : 0.87, e.clientX - r.left, e.clientY - r.top); }, { passive: false });
  const pts = new Map(); let ultDist = 0, ultToque = 0;
  box.addEventListener('pointerdown', e => {
    if (e.target.closest('.diag-ctl')) return;
    box.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 1) { const t = performance.now(); if (t - ultToque < 300) { const r = box.getBoundingClientRect(); st.s > st.min * 1.5 ? ajustar() : zoom(2.2, e.clientX - r.left, e.clientY - r.top); } ultToque = t; }
  });
  box.addEventListener('pointermove', e => {
    if (!pts.has(e.pointerId)) return;
    const ant = pts.get(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 1) { st.x += e.clientX - ant.x; st.y += e.clientY - ant.y; aplica(); }
    else if (pts.size === 2) {
      const [a, b] = [...pts.values()], dist = Math.hypot(a.x - b.x, a.y - b.y), r = box.getBoundingClientRect();
      if (ultDist) zoom(dist / ultDist, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
      ultDist = dist;
    }
  });
  const fim = e => { pts.delete(e.pointerId); if (pts.size < 2) ultDist = 0; };
  box.addEventListener('pointerup', fim); box.addEventListener('pointercancel', fim);
  box.querySelectorAll('[data-zoom]').forEach(b => b.addEventListener('click', () => {
    const f = +b.dataset.zoom; f ? zoom(f, box.clientWidth / 2, box.clientHeight / 2) : ajustar();
  }));
}

function abaHistorico(z) {
  const regs = D.registrosOrdenados(r => r.zona === z.id);
  const total = regs.reduce((s, r) => s + D.totalRegistro(r), 0);
  return `
    <div class="resumo">
      <div><b>${regs.length}</b><small>registros</small></div>
      <div><b>${D.brl(total)}</b><small>gasto nesta zona</small></div>
      <div><b>${regs[0] ? D.dataBR(regs[0].data) : '—'}</b><small>último serviço</small></div>
    </div>
    <button class="btn pri bloco" data-acao="novo-registro">${ICO.mais} Registrar serviço ou troca</button>
    ${regs.length ? regs.map(cartaoRegistro).join('') : `<div class="vazio">${ICO.chave}<div>Nenhum serviço registrado em ${esc(z.nome.toLowerCase())}.</div><div class="p-sub">Registre trocas com data, km, peças e valores.</div></div>`}`;
}
function cartaoRegistro(r) {
  return `<div class="reg">
    <div class="reg-top"><div><b>${esc(r.titulo || TIPOS[r.tipo])}</b>
      <div class="reg-meta">${D.dataBR(r.data)} · ${D.km(r.km)} · ${esc(TIPOS[r.tipo] || '')}${r.oficina ? ' · ' + esc(r.oficina) : ''}</div></div>
      <b>${D.brl(D.totalRegistro(r))}</b></div>
    ${(r.pecas || []).length || +r.maoDeObra ? `<ul>${(r.pecas || []).map(p => `<li><span><span class="mono">${esc(p.oem || '—')}</span> ${esc(p.desc || '')} ×${p.qtd || 1}</span><span>${D.brl((+p.preco || 0) * (+p.qtd || 1))}</span></li>`).join('')}
      ${+r.maoDeObra ? `<li><span>Mão de obra</span><span>${D.brl(r.maoDeObra)}</span></li>` : ''}</ul>` : ''}
    ${(r.servicos || []).length ? `<div>${r.servicos.map(s => `<span class="tag">${esc(D.lembretes().find(l => l.id === s)?.nome || s)}</span>`).join('')}</div>` : ''}
    ${r.obs ? `<div class="obs">${esc(r.obs)}</div>` : ''}
    <div class="reg-acoes"><button data-editar="${r.id}">Editar</button></div>
  </div>`;
}

function abaReparos(z) {
  const lembs = D.lembretes().filter(l => l.zona === z.id);
  const pg = lab => D.catalogo.paginasManual[lab];
  return `
    ${lembs.length ? `<div class="secao">Manutenção programada</div>${lembs.map(l => `
      <div class="lemb"><span class="bola st-${l.status}"></span><div class="lt"><b>${esc(l.nome)}</b>
        <small>${esc(textoLembrete(l).replace(l.nome + ': ', ''))}</small>
        <small>${l.km ? 'a cada ' + D.km(l.km) : ''}${l.km && l.meses ? ' ou ' : ''}${l.meses ? l.meses + ' meses' : ''}${!l.km && !l.meses ? 'sem intervalo definido' : ''} · ${esc(l.detalhe)}</small></div>
        <button class="btn" data-servico="${l.id}" style="padding:6px 10px;font-size:12.5px">Registrar</button></div>`).join('')}` : ''}
    ${z.specs?.length ? `<div class="secao">Especificações</div><dl class="spec">${z.specs.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>` : ''}
    ${z.problemas?.length ? `<div class="secao">Problemas conhecidos</div>
      <p class="aviso-fonte">Relatos frequentes de proprietários e oficinas — confirme sempre com diagnóstico.</p>
      ${z.problemas.map(p => `<div class="prob"><b>${esc(p.t)}</b> <span class="tag ${p.g}">${{ alta: 'atenção alta', media: 'atenção média', baixa: 'atenção baixa' }[p.g]}</span>
        <p><em>Sintoma:</em> ${esc(p.s)}</p><p><em>Causa provável:</em> ${esc(p.c)}</p></div>`).join('')}` : ''}
    ${z.manual?.length ? `<div class="secao">Manual do proprietário</div><div class="lista-links">${z.manual.map(([t, lab]) =>
      `<a href="${urlManual(pg(lab) || 1)}" target="_blank" rel="noopener">${ICO.livro}<span>${esc(t)}</span><small>pág. ${lab}</small></a>`).join('')}</div>` : ''}
    ${z.videos?.length ? `<div class="secao">Vídeos (busca no YouTube)</div><div class="lista-links">${z.videos.map(([t, q]) =>
      `<a href="${videoUrl(q)}" target="_blank" rel="noopener">${ICO.play}<span>${esc(t)}</span><small>YouTube ↗</small></a>`).join('')}</div>` : ''}
    <div class="secao">Catálogo</div><div class="lista-links">${z.grupos.map(gid => `<a href="#" data-grupo="${gid}">${ICO.caixa}<span>${gid} · ${esc(D.catalogo.grupo[gid]?.name)}</span><small>${D.pecasDoGrupo(gid).length} peças</small></a>`).join('')}</div>`;
}

// Bottom sheet: arrastar a alça alterna meia altura / tela cheia
function arrastarAlca() {
  const alca = $('[data-alca]'), p = $('#painel'); if (!alca) return;
  let y0 = null;
  alca.onpointerdown = e => { y0 = e.clientY; alca.setPointerCapture(e.pointerId); };
  alca.onpointerup = e => {
    if (y0 === null) return; const dy = e.clientY - y0; y0 = null;
    if (Math.abs(dy) < 8) p.classList.toggle('cheio');
    else if (dy < 0) p.classList.add('cheio');
    else if (p.classList.contains('cheio')) p.classList.remove('cheio');
    else carro.selecionar(null, true);
    ajustarMargem();
  };
}

// ── Modais ────────────────────────────────────────────────
function abrirModal(html, larga = false) {
  const m = $('#modal'); m.innerHTML = `<div class="caixa ${larga ? 'larga' : ''}" role="dialog" aria-modal="true">${html}</div>`; m.hidden = false;
}
function fecharModal() { $('#modal').hidden = true; $('#modal').innerHTML = ''; }
const cab = t => `<div class="cx-cab"><h3>${t}</h3><button class="fechar" data-acao="fechar-modal">${ICO.x}</button></div>`;

function modalPeca(gid, esq, oem, ref) {
  const d = (D.catalogo.diagramasDo[gid] || []).find(x => x.n === esq);
  const p = d?.parts.find(x => x.oem === oem && x.ref === ref) || D.catalogo.porOem[oem]?.[0];
  if (!p) return;
  const pt = traduz(p.desc), hist = D.historicoDaPeca(p.oem);
  const outros = [...new Set((D.catalogo.porOem[p.oem] || []).map(x => x.group))].filter(g => g !== gid);
  abrirModal(`${cab(esc(pt || 'Peça'))}
    <div class="cx-corpo detalhe-peca">
      <div class="p-sub">${esc(p.desc)}</div>
      <div style="margin:12px 0 14px"><span class="big-oem">${esc(p.oem)}</span><button class="copiar" data-copiar="${esc(p.oem)}">copiar</button></div>
      <dl>
        ${p.sup ? `<dt>Substituto atual</dt><dd><span class="mono">${p.sup.map(esc).join(', ')}</span> <span class="tag sup">supersessão</span></dd>` : ''}
        <dt>Referência</dt><dd class="mono">${esc(p.ref)} (no diagrama)</dd>
        ${p.det ? `<dt>Detalhes</dt><dd>${esc(p.det)}</dd>` : ''}
        <dt>Período</dt><dd>${esc(p.per || '—')}</dd>
        <dt>Qtd. no veículo</dt><dd>${p.qty === 'CC' ? 'conforme necessário' : esc(+p.qty || p.qty || '—')}</dd>
        <dt>Preço ref.</dt><dd>${p.usd ? 'US$ ' + p.usd.toFixed(2) + ' <span class="p-sub">(Amayama, set/2026)</span>' : '—'}</dd>
        <dt>Grupo</dt><dd>${gid} · ${esc(D.catalogo.grupo[gid]?.name)} · esquema ${esq}</dd>
        ${outros.length ? `<dt>Também em</dt><dd>${outros.map(g => `<a href="#" data-grupo="${g}">${g}</a>`).join(', ')}</dd>` : ''}
      </dl>
      <div class="secao">Histórico desta peça</div>
      ${hist.length ? hist.map(cartaoRegistro).join('') : '<div class="p-sub">Nenhuma troca registrada.</div>'}
    </div>
    <div class="cx-rodape">
      <a class="btn" href="https://www.google.com/search?q=${encodeURIComponent('Mitsubishi ' + (p.sup?.[0] || p.oem))}" target="_blank" rel="noopener">${ICO.busca} Pesquisar preço</a>
      <button class="btn pri" data-trocar="${encodeURIComponent(JSON.stringify({ oem: p.sup?.[0] || p.oem, desc: pt || p.desc, ref: p.ref, grupo: gid }))}">${ICO.chave} Registrar troca</button>
    </div>`);
}

// Formulário de registro
let rascunho = null;
function modalRegistro(reg) {
  const v = D.getEstado().veiculo;
  rascunho = reg ? JSON.parse(JSON.stringify(reg)) : { tipo: 'troca', data: D.hoje(), km: v.km || '', zona: ui.zona || 'motor', pecas: [], servicos: [], maoDeObra: '', oficina: '', obs: '', titulo: '' };
  renderRegistro();
}
function renderRegistro() {
  const r = rascunho, novo = !D.getEstado().registros.some(x => x.id === r.id);
  abrirModal(`${cab(novo ? 'Registrar serviço' : 'Editar registro')}
    <div class="cx-corpo"><div class="form" data-form>
      <label>Tipo<select name="tipo">${Object.entries(TIPOS).map(([k, t]) => `<option value="${k}" ${r.tipo === k ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
      <label>Zona do carro<select name="zona">${ZONAS.map(z => `<option value="${z.id}" ${r.zona === z.id ? 'selected' : ''}>${esc(z.nome)}</option>`).join('')}</select></label>
      <label class="cheio">Título<input name="titulo" value="${esc(r.titulo)}" placeholder="Ex.: Troca de pastilhas dianteiras"></label>
      <label>Data<input type="date" name="data" value="${esc(r.data)}" required></label>
      <label>Quilometragem<input type="number" inputmode="numeric" name="km" value="${esc(r.km)}" placeholder="km no hodômetro"></label>
      <div class="pecas-form"><label>Peças</label>
        ${r.pecas.map((p, i) => `<div class="pf-linha">
          <input data-pf="${i}" data-c="desc" value="${esc((p.oem ? p.oem + ' · ' : '') + (p.desc || ''))}" placeholder="Nº OEM · descrição">
          <input data-pf="${i}" data-c="qtd" type="number" min="1" value="${esc(p.qtd || 1)}" title="Quantidade">
          <input data-pf="${i}" data-c="preco" type="number" step="0.01" inputmode="decimal" value="${esc(p.preco)}" placeholder="R$ unit." title="Preço unitário pago (R$)">
          <button class="rm" data-rmpeca="${i}" title="Remover">×</button></div>`).join('')}
        <div class="busca" style="margin:8px 0 0">${ICO.busca}<input data-addpeca placeholder="Adicionar peça do catálogo (nome ou nº OEM)…" autocomplete="off"></div>
        <div data-sugest></div>
        <button class="btn" data-acao="peca-avulsa" style="margin-top:6px;padding:6px 10px;font-size:12.5px">${ICO.mais} Peça sem código</button>
      </div>
      <label>Mão de obra (R$)<input type="number" step="0.01" inputmode="decimal" name="maoDeObra" value="${esc(r.maoDeObra)}"></label>
      <label>Oficina / loja<input name="oficina" value="${esc(r.oficina)}"></label>
      <div class="servs"><label style="background:none;padding:0;color:var(--txt2);font-weight:600;font-size:12px;width:100%">Serviços programados realizados</label>
        ${r.servicoFixo
          // registro aberto a partir de um item da manutenção programada: só aquele serviço, travado
          ? `<label class="serv-fixo"><input type="checkbox" checked disabled> ${esc(D.lembretes().find(l => l.id === r.servicoFixo)?.nome || r.servicoFixo)}</label>
             <small class="serv-nota">Registro individual deste serviço. Para anotar vários serviços juntos, use “+ Anotar serviço”.</small>`
          : D.lembretes().map(l => `<label><input type="checkbox" data-serv="${l.id}" ${r.servicos.includes(l.id) ? 'checked' : ''}> ${esc(l.nome)}</label>`).join('')}</div>
      <label class="cheio">Observações<textarea name="obs" placeholder="Marca usada, garantia, sintomas…">${esc(r.obs)}</textarea></label>
    </div></div>
    <div class="cx-rodape">
      ${novo ? '' : `<button class="btn perigo" data-acao="excluir-registro" style="margin-right:auto">Excluir</button>`}
      <b style="align-self:center;margin-right:auto">${D.brl(D.totalRegistro(r))}</b>
      <button class="btn" data-acao="fechar-modal">Cancelar</button>
      <button class="btn pri" data-acao="salvar-registro">Salvar</button>
    </div>`, true);
  const f = $('[data-form]');
  f.addEventListener('input', e => {
    const t = e.target;
    if (t.name) rascunho[t.name] = t.value;
    if (t.dataset.pf !== undefined) {
      const p = rascunho.pecas[+t.dataset.pf];
      if (t.dataset.c === 'desc') { const m = t.value.match(/^([0-9A-Z]{6,12})\s*·\s*(.*)$/); if (m) { p.oem = m[1]; p.desc = m[2]; } else { p.oem = ''; p.desc = t.value; } }
      else p[t.dataset.c] = t.value;
    }
    $('.cx-rodape b').textContent = D.brl(D.totalRegistro(rascunho));
    if (t.dataset.serv !== undefined) {
      rascunho.servicos = [...f.querySelectorAll('[data-serv]:checked')].map(x => x.dataset.serv);
    }
    if (t.matches('[data-addpeca]')) sugerirPecas(t.value);
  });
}
function sugerirPecas(q) {
  const el = $('[data-sugest]'); q = q.trim();
  if (q.length < 2) { el.innerHTML = ''; return; }
  const norm = s => s.toUpperCase().replace(/[\s\-.]/g, ''), nq = norm(q), qq = q.toUpperCase();
  const z = ZONA_POR_ID[rascunho.zona];
  const ordem = [...(z?.grupos || []), ...D.catalogo.groups.map(g => g.id).filter(g => !z?.grupos.includes(g))];
  const out = [], vistos = new Set();
  for (const gid of ordem) { for (const p of D.pecasDoGrupo(gid)) {
    if (vistos.has(p.oem)) continue;
    if (norm(p.oem).includes(nq) || p.desc.includes(qq) || traduz(p.desc).toUpperCase().includes(qq)) { vistos.add(p.oem); out.push(p); }
    if (out.length >= 30) break; } if (out.length >= 30) break; }
  el.innerHTML = out.length ? `<div class="sugest">${out.map(p => `<button data-sugpeca="${encodeURIComponent(JSON.stringify({ oem: p.sup?.[0] || p.oem, desc: traduz(p.desc) || p.desc, ref: p.ref, grupo: p.group }))}">
    <span class="mono">${esc(p.sup?.[0] || p.oem)}</span><span>${esc(traduz(p.desc) || p.desc)}<br><small style="color:var(--txt3)">${esc(p.desc)} · ${p.group}</small></span></button>`).join('')}</div>` : '';
}

// Atualização rápida do hodômetro (aviso de "quilometragem desatualizada")
function modalKm() {
  const v = D.getEstado().veiculo;
  abrirModal(`${cab('Atualizar quilometragem')}
    <div class="cx-corpo"><div class="form" data-km>
      <label>Quilometragem atual<input type="number" inputmode="numeric" name="km" value="${esc(v.km || '')}" autofocus></label>
      <label>Data da leitura<input type="date" name="kmData" value="${D.hoje()}"></label>
    </div><p class="aviso-fonte" style="margin-top:10px">Os alertas de manutenção por km são calculados a partir deste valor.</p></div>
    <div class="cx-rodape"><button class="btn" data-acao="fechar-modal">Cancelar</button><button class="btn pri" data-acao="salvar-km">Salvar</button></div>`);
}

// ── Central de configurações ──────────────────────────────
function modalConfig() {
  const c = cfg();
  const seg = (chave, opcoes) => `<div class="seg cfg-seg">${opcoes.map(([v, t]) => `<button data-cfg="${chave}:${v}" class="${c[chave] === v ? 'ativo' : ''}">${t}</button>`).join('')}</div>`;
  abrirModal(`${cab('Configurações')}
    <div class="cx-corpo cfg">
      <div class="secao">Aparência</div>
      <div class="cfg-linha"><div><b>Tema e fundo do 3D</b><small>Claro, escuro ou igual ao modo noturno do aparelho</small></div>
        ${seg('tema', [['sistema', 'Sistema'], ['claro', 'Claro'], ['escuro', 'Escuro']])}</div>
      <div class="cfg-linha"><div><b>Documento do veículo</b><small>Visual da aba Veículo no livro de manutenção</small></div>
        ${seg('documento', [['branco', 'Branco (novo)'], ['verde', 'Verde (antigo)']])}</div>
      <div class="cfg-linha"><div><b>Pontos sobre o carro</b><small>Marcadores clicáveis de cada zona</small></div>
        ${seg('pinos', [[true, 'Mostrar'], [false, 'Ocultar']])}</div>
      <div class="secao">Dados</div>
      <div class="menu-lista">
        <button data-acao="exportar">${ICO.down}<span>Fazer backup (JSON)</span><small>${D.getEstado().registros.length} registros</small></button>
        <button data-acao="importar">${ICO.up}<span>Restaurar backup</span></button>
        <button data-acao="exportar-csv">${ICO.lista}<span>Exportar histórico (planilha CSV)</span></button>
      </div>
      <p class="aviso-fonte" style="margin-top:10px">Os dados ficam salvos só neste aparelho. Faça backup regularmente.</p>
      <div class="secao">Sobre</div>
      <p class="aviso-fonte"><b>Versão do app: ${VERSAO_APP}</b><br>${VEICULO_BASE.modelo} · ${VEICULO_BASE.versao} · ${VEICULO_BASE.motor}. Catálogo: EPC Mitsubishi (Amayama). Manual do proprietário Lancer 2012.</p>
      ${carro.modeloReal ? `<p class="aviso-fonte">Modelo 3D: “Mitsubishi Lancer Sedan 2009” por <a href="https://sketchfab.com/3d-models/mitsubishi-lancer-sedan-2009-5219adf1a62b4b7393d3c1fc451be88b" target="_blank" rel="noopener">Nieve5677</a> (Sketchfab), licença <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a> — simplificado e dividido em peças para este app. Mecânica interna genérica.</p>` : ''}
    </div>`);
}
function aplicarTema() {
  const t = cfg().tema, raiz = document.documentElement;
  if (t === 'sistema') delete raiz.dataset.theme; else raiz.dataset.theme = t === 'claro' ? 'light' : 'dark';
  const escuro = t === 'escuro' || (t === 'sistema' && matchMedia('(prefers-color-scheme: dark)').matches);
  carro?.setFundoEscuro(escuro);
  document.querySelector('meta[name="theme-color"]').content = escuro ? '#121418' : '#1f2d44';
}

function modalLembretes() {
  const ls = D.lembretes();
  abrirModal(`${cab('Manutenção programada')}
    <div class="cx-corpo">
      <p class="aviso-fonte">Intervalos do manual (tabela de fluidos). Itens sem intervalo no manual ficam para você definir — o Livrete de Bordo traz o plano completo.</p>
      ${ls.map(l => `<div class="lemb"><span class="bola st-${l.status}"></span><div class="lt"><b>${esc(l.nome)}</b>
        <small>${esc(textoLembrete(l).replace(l.nome + ': ', ''))}${l.ultimo ? ' · último: ' + D.dataBR(l.ultimo.data) + ' com ' + D.km(l.ultimo.km) : ''}</small>
        <small>${esc(l.detalhe)}</small>
        <div style="display:flex;gap:6px;margin-top:6px;align-items:center;font-size:12px;color:var(--txt2)">a cada
          <input data-lkm="${l.id}" type="number" value="${l.km ?? ''}" placeholder="km" style="width:90px;padding:5px 7px;border:1px solid var(--borda);border-radius:7px;background:var(--sup2)"> km ou
          <input data-lmes="${l.id}" type="number" value="${l.meses ?? ''}" placeholder="meses" style="width:70px;padding:5px 7px;border:1px solid var(--borda);border-radius:7px;background:var(--sup2)"> meses</div></div>
        <button class="btn" data-servico="${l.id}" style="padding:6px 10px;font-size:12.5px">Registrar</button></div>`).join('')}
    </div>
    <div class="cx-rodape"><button class="btn pri" data-acao="salvar-lembretes">Salvar intervalos</button></div>`);
}

function modalCatalogo() {
  abrirModal(`${cab('Catálogo completo')}
    <div class="cx-corpo">
      <p class="aviso-fonte">${D.catalogo.groups.length} grupos · ${D.catalogo.diagrams.length} diagramas · fonte: EPC Mitsubishi (Amayama), Lancer GT CY4A SNXHL1FB.</p>
      ${D.catalogo.sections.map(s => `<div class="cat-sec"><button data-sec="${s.id}"><span>${s.id} · ${esc(s.name)}</span><small>${D.catalogo.groups.filter(g => g.section === s.id).length}</small></button>
        <div class="cat-gr" hidden>${D.catalogo.groups.filter(g => g.section === s.id).map(g => `<button data-grupo="${g.id}"><span class="cod">${g.id}</span><span>${esc(g.name)}<br><small style="color:var(--txt3)">${esc(g.en)} · ${esc(zonaDoGrupo(g.id)?.nome || '')}</small></span></button>`).join('')}</div></div>`).join('')}
    </div>`);
}

// ── Menu do veículo (canto superior esquerdo, abre para baixo) ──
function renderMenuVeiculo() {
  const n = alertas().length, regs = D.getEstado().registros.length;
  const item = (aba, ico, t, s, extra = '') => `<button data-livro="${aba}">${ico}<span><b>${t}</b><small>${s}</small></span>${extra}</button>`;
  $('#veic-lista').innerHTML = `
    ${item('revisoes', ICO.livro, 'Livro de manutenção', 'revisões programadas')}
    ${item('historico', ICO.relogio, 'Histórico', regs ? `${regs} serviço${regs > 1 ? 's' : ''} anotado${regs > 1 ? 's' : ''}` : 'linha do tempo por ano')}
    ${item('despesas', ICO.dinheiro, 'Despesas', 'filtros por data e valor')}
    ${item('alertas', ICO.sino, 'Alertas', n ? `${n} pendente${n > 1 ? 's' : ''}` : 'tudo em dia', n ? `<span class="badge">${n}</span>` : '')}
    ${item('veiculo', ICO.doc, 'Dados do veículo', D.getEstado().veiculo.placa || 'documento e hodômetro')}
    <hr>
    <button data-acao="catalogo">${ICO.caixa}<span><b>Catálogo de peças</b><small>${D.catalogo.groups.length} grupos · nº OEM</small></span></button>
    <a href="${urlManual(6)}" target="_blank" rel="noopener">${ICO.pdf}<span><b>Manual do proprietário</b><small>abre o PDF</small></span></a>`;
}
const menuAberto = () => !$('#veic-lista').hidden || !$('#filtro-lista').hidden;
function alternarMenu(qual) {
  const abrir = qual === 'veic' ? $('#veic-lista').hidden : $('#filtro-lista').hidden;
  fecharMenus();
  if (!abrir) return;
  if (qual === 'veic') { renderMenuVeiculo(); $('#veic-lista').hidden = false; $('[data-acao="menu-veiculo"]').setAttribute('aria-expanded', 'true'); }
  else { $('#filtro-lista').hidden = false; $('.filtro-btn').setAttribute('aria-expanded', 'true'); document.body.classList.add('filtro-aberto'); }
}
function fecharMenus() {
  $('#veic-lista').hidden = true; $('#filtro-lista').hidden = true;
  document.querySelectorAll('[aria-expanded]').forEach(b => b.setAttribute('aria-expanded', 'false'));
  document.body.classList.remove('filtro-aberto');
}

// ── Filtro de camadas (canto inferior esquerdo, abre para cima) ──
const filtroAtual = () => FILTRO_POR_ID[ui.filtro];
function renderFiltro() {
  const f = filtroAtual();
  const b = $('.filtro-btn');
  b.innerHTML = `${FICO[f.id]}<span><small>Filtro</small><b>${esc(f.nome)}</b></span>${ICO.seta}`;
  b.classList.toggle('com-filtro', !!f.zonas);
  $('#filtro-lista').innerHTML = FILTROS.map((x, i) => `<button role="option" aria-selected="${x.id === f.id}" data-filtro="${x.id}" class="${x.id === f.id ? 'ativo' : ''} f-${x.id}" style="--i:${FILTROS.length - i}">
    <span class="f-ico">${FICO[x.id]}</span><span><b>${esc(x.nome)}</b><small>${esc(x.sub)}</small></span></button>`).join('');
}
// moverCamera = false quando a troca veio de clicar numa peça (a peça é que define o enquadramento)
function setFiltro(id, moverCamera = true) {
  fecharMenus();
  if (ui.filtro === id) return;
  ui.filtro = id;
  const f = filtroAtual();
  carro.setFiltro(f.zonas, f.regioes === 'int');
  renderFiltro();
  if (moverCamera && ui.zona && f.zonas && !f.zonas.includes(ui.zona)) carro.selecionar(null, true);
  aplicarRegiao(moverCamera, 0);
}

// ── Menu deslizante de regiões ────────────────────────────
// Cada filtro usa a lista de vistas de fora (ext) ou da mecânica (int), só com as regiões que têm peças dele
function regioes() {
  const f = filtroAtual(), base = REGIOES[f.regioes];
  if (!f.zonas) return base;
  return [{ ...base[0], nome: 'Visão geral' }, ...base.slice(1).filter(r => r.zonas.some(z => f.zonas.includes(z)))];
}
const regiaoAtual = () => { const l = regioes(); return l[Math.min(ui.reg[ui.filtro] || 0, l.length - 1)]; };
// zonas da região atual que pertencem ao filtro (são as destacadas)
const zonasRegiao = () => { const f = filtroAtual(), zs = regiaoAtual()?.zonas || []; return f.zonas ? zs.filter(z => f.zonas.includes(z)) : zs; };
function montarCarrossel() {
  const pista = $('[data-pista]');
  let x0 = null, dx = 0;
  pista.addEventListener('pointerdown', e => { x0 = e.clientX; dx = 0; pista.setPointerCapture(e.pointerId); pista.classList.add('arrastando'); });
  pista.addEventListener('pointermove', e => {
    if (x0 === null) return;
    dx = e.clientX - x0;
    $('.car-titulo').style.transform = `translateX(calc(-50% + ${dx * 0.6}px))`;
  });
  const fim = () => {
    if (x0 === null) return;
    x0 = null; pista.classList.remove('arrastando'); $('.car-titulo').style.transform = '';
    if (Math.abs(dx) > 36) passoRegiao(dx < 0 ? 1 : -1);   // arrastar para a esquerda = próxima
    else if (Math.abs(dx) < 6) { if (ui.zona) carro.selecionar(null, true); aplicarRegiao(true, 0); }   // toque no título: reenquadra
  };
  pista.addEventListener('pointerup', fim); pista.addEventListener('pointercancel', fim);
  aplicarRegiao(false, 0);
}
function passoRegiao(d) {
  const n = regioes().length;
  ui.reg[ui.filtro] = ((ui.reg[ui.filtro] || 0) + d + n) % n;   // volta infinita
  if (ui.zona) carro.selecionar(null, true);
  aplicarRegiao(true, d);
}
function aplicarRegiao(moverCamera, dir) {
  const lista = regioes(), n = lista.length, i = ui.reg[ui.filtro] = Math.min(ui.reg[ui.filtro] || 0, n - 1), r = lista[i];
  const t = $('.car-titulo');
  t.querySelector('small').textContent = filtroAtual().nome;
  t.querySelector('b').textContent = r.nome;
  $('[data-viz="-1"]').textContent = n > 1 ? lista[(i - 1 + n) % n].nome : '';
  $('[data-viz="1"]').textContent = n > 1 ? lista[(i + 1) % n].nome : '';
  $('[data-pontos]').innerHTML = lista.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('');
  if (dir) { t.classList.remove('de-dir', 'de-esq'); void t.offsetWidth; t.classList.add(dir > 0 ? 'de-dir' : 'de-esq'); }
  carro.setRegiao(zonasRegiao(), moverCamera && !ui.zona ? r : null);
  renderChips();
}
function renderChips() {
  $('#chips').innerHTML = zonasRegiao().map(id => `<button data-pino="${id}" class="${ui.zona === id ? 'on' : ''}">${esc(ZONA_POR_ID[id].nome)}</button>`).join('');
}

// Rótulo que segue o mouse: o que o clique vai selecionar e se dá para atravessar
function mostrarRotulo(id, e, info) {
  const el = $('#rotulo');
  if (!id || !e) { el.hidden = true; return; }
  const extra = info?.atravessa ? 'clique para ver o que está atrás'
    : info?.atras ? `+${info.atras} atrás · clique de novo para atravessar` : '';
  el.innerHTML = `${esc(ZONA_POR_ID[id]?.nome || id)}${extra ? `<small>${extra}</small>` : ''}`;
  el.style.left = Math.min(e.clientX + 16, window.innerWidth - 270) + 'px';
  el.style.top = (e.clientY + 18) + 'px';
  el.hidden = false;
}

// ── Livrete de manutenção ─────────────────────────────────
// Abas do livro (cada uma com a cor da orelha). Cabeçalho e botões ficam fixos; só a lista do meio rola.
const ABAS_LIVRO = [['veiculo', 'Veículo'], ['historico', 'Histórico'], ['revisoes', 'Revisões'], ['despesas', 'Despesas'], ['alertas', 'Alertas']];
function abrirLivrete(aba) {
  fecharMenus(); fecharModal();
  if (aba && aba !== ui.livro.aba) { ui.livro.aba = aba; ui.livro.editando = false; }
  ui.livrete = true;
  $('#rotulo').hidden = true;
  $('#livrete').hidden = false;
  renderLivrete();
  carro.pausar(true);   // o 3D fica parado e desfocado atrás do caderno
}
function fecharLivrete() {
  if (ui.livro.editando) cancelarEdicaoVeiculo();
  fecharMenuRegistro();
  ui.livrete = false; $('#livrete').hidden = true; $('#livrete').innerHTML = '';
  carro.pausar(false);
}
// (o livro não é redesenhado no resize: no celular o teclado redimensiona a tela e isso apagava o campo em edição)

function carimbo(status) {
  return {
    ok: '<span class="carimbo ok"><b>Revisado</b><small>OK</small></span>',
    vencido: '<span class="carimbo vencido"><b>Vencido</b></span>',
    proximo: '<span class="carimbo proximo"><small>Vence em breve</small><b>Atenção</b></span>',
    'sem-registro': '<span class="carimbo neutro"><b>Sem registro</b></span>',
    'sem-intervalo': '<span class="carimbo neutro"><b>A definir</b></span>',
  }[status] || '';
}
function quandoLembrete(l) {
  if (l.status === 'sem-registro') return 'Registre a última vez que foi feito';
  if (l.status === 'sem-intervalo') return 'Defina o intervalo em “Ajustar intervalos”';
  const p = [];
  if (l.proxKm) p.push(`aos ${D.km(l.proxKm)}`);
  if (l.proxData) p.push(`até ${D.dataBR(l.proxData)}`);
  return `Próxima ${p.join(' ou ')} · última ${D.dataBR(l.ultimo.data)}`;
}
const cartaoLembrete = (l, sub) => `<button class="l-card st-borda-${l.status}" data-servico="${l.id}">
  <span class="l-ico">${SICO[l.id] || ICO.chave}</span>
  <span class="l-txt"><b>${esc(l.nome)}</b><small>${esc(sub ?? quandoLembrete(l))}</small></span>${carimbo(l.status)}</button>`;

// Despesas: período e faixa de valor
const PERIODOS = [['30d', 'Últimos 30 dias'], ['3m', 'Últimos 3 meses'], ['12m', 'Últimos 12 meses'], ['ano', 'Este ano'], ['anoPassado', 'Ano passado'], ['tudo', 'Todo o período']];
const VALORES = [['todos', 'Qualquer valor'], ['ate200', 'Até R$ 200'], ['200a1000', 'R$ 200 a R$ 1.000'], ['mais1000', 'Acima de R$ 1.000']];
const ORDENS = [['recentes', 'Mais recentes'], ['antigas', 'Mais antigas'], ['maior', 'Maior valor'], ['menor', 'Menor valor']];
function despesasFiltradas() {
  const { periodo, valor, ordem } = ui.livro.desp, hoje = new Date(D.hoje() + 'T12:00'), ano = hoje.getFullYear();
  const ini = { '30d': new Date(hoje - 30 * 864e5), '3m': new Date(new Date(hoje).setMonth(hoje.getMonth() - 3)), '12m': new Date(new Date(hoje).setFullYear(ano - 1)),
    ano: new Date(ano, 0, 1), anoPassado: new Date(ano - 1, 0, 1), tudo: null }[periodo];
  const fim = periodo === 'anoPassado' ? new Date(ano, 0, 1) : null;
  const faixa = { todos: [0, Infinity], ate200: [0, 200], '200a1000': [200, 1000], mais1000: [1000, Infinity] }[valor];
  const regs = D.registrosOrdenados(r => {
    const d = new Date(r.data + 'T12:00'), v = D.totalRegistro(r);
    return (!ini || d >= ini) && (!fim || d < fim) && v >= faixa[0] && v <= faixa[1];
  });
  if (ordem === 'antigas') regs.reverse();
  if (ordem === 'maior') regs.sort((a, b) => D.totalRegistro(b) - D.totalRegistro(a));
  if (ordem === 'menor') regs.sort((a, b) => D.totalRegistro(a) - D.totalRegistro(b));
  return regs;
}

function renderLivrete() {
  const L = ui.livro, aba = L.aba, nAl = alertas().length;
  fecharMenuRegistro();
  const ant = $('#livrete .l-corpo'), rolagem = ant?.dataset.aba === aba ? ant.scrollTop : 0;   // mantém a posição ao redesenhar a mesma aba
  const c = conteudoLivro[aba]();
  const corpo = c.itens ? (c.itens.length ? c.itens.join('') : c.vazio) : c.corpo;
  $('#livrete').innerHTML = `
  <div class="caderno aba-${aba}" role="dialog" aria-modal="true" aria-label="Livro de manutenção">
    <nav class="l-abas" role="tablist">${ABAS_LIVRO.map(([k, t]) => `<button role="tab" aria-selected="${k === aba}" class="l-aba ab-${k} ${k === aba ? 'ativo' : ''}" data-livro="${k}">${t}${k === 'alertas' && nAl ? `<span class="badge">${nAl}</span>` : ''}</button>`).join('')}</nav>
    <div class="folha">
      <div class="espiral" aria-hidden="true"></div>
      <button class="fechar-l" data-acao="fechar-livrete" title="Fechar">${ICO.x}</button>
      <header class="l-cab"><div class="l-tit"><h1>${c.titulo}</h1><p class="sub">${c.sub || ''}</p></div>${c.ferramentas || ''}</header>
      ${c.topo || ''}
      <div class="l-corpo" data-aba="${aba}"><div class="l-lista">${corpo}</div></div>
      <footer class="l-rod"><div class="l-acoes">${c.acoes || ''}</div></footer>
    </div>
  </div>`;
  $('#livrete .l-corpo').scrollTop = rolagem;
}

// Menu suspenso de uma manutenção do histórico/despesas: ver mais, editar, excluir
function abrirMenuRegistro(id, el) {
  const aberto = $('#menu-reg');
  fecharMenuRegistro();
  if (aberto?.dataset.id === id) return;   // segundo toque no mesmo item fecha
  const r = D.getEstado().registros.find(x => x.id === id); if (!r) return;
  const m = document.createElement('div');
  m.id = 'menu-reg'; m.className = 'menu-reg'; m.dataset.id = id; m.setAttribute('role', 'menu');
  m.innerHTML = `<button role="menuitem" data-acao="ver-reg" data-id="${id}">${ICO.olho}<span>Ver mais</span></button>
    <button role="menuitem" data-editar="${id}">${ICO.lapis}<span>Editar</span></button>
    <button role="menuitem" class="perigo" data-acao="excluir-reg" data-id="${id}">${ICO.lixo}<span>Excluir</span></button>`;
  document.body.appendChild(m);
  el.classList.add('com-menu');
  const b = el.getBoundingClientRect(), h = m.offsetHeight;
  m.style.left = Math.max(8, Math.min(b.right - m.offsetWidth - 8, window.innerWidth - m.offsetWidth - 8)) + 'px';
  m.style.top = (b.bottom + h + 8 > window.innerHeight ? b.top - h - 4 : b.bottom + 4) + 'px';
}
function fecharMenuRegistro() {
  $('#menu-reg')?.remove();
  document.querySelectorAll('.com-menu').forEach(e => e.classList.remove('com-menu'));
}
function modalDetalheRegistro(r) {
  abrirModal(`${cab(esc(r.titulo || TIPOS[r.tipo]))}
    <div class="cx-corpo detalhe-peca">
      <dl>
        <dt>Data</dt><dd>${D.dataBR(r.data)}</dd>
        <dt>Quilometragem</dt><dd>${D.km(r.km)}</dd>
        <dt>Tipo</dt><dd>${esc(TIPOS[r.tipo] || '—')}</dd>
        <dt>Zona do carro</dt><dd>${esc(ZONA_POR_ID[r.zona]?.nome || '—')}</dd>
        ${r.oficina ? `<dt>Oficina / loja</dt><dd>${esc(r.oficina)}</dd>` : ''}
        ${(r.servicos || []).length ? `<dt>Serviços programados</dt><dd>${r.servicos.map(s => esc(D.lembretes().find(l => l.id === s)?.nome || s)).join(', ')}</dd>` : ''}
      </dl>
      <div class="secao">Peças e valores</div>
      ${(r.pecas || []).length || +r.maoDeObra ? `<div class="reg" style="margin-top:0"><ul style="margin:0">${(r.pecas || []).map(p => `<li><span><span class="mono">${esc(p.oem || '—')}</span> ${esc(p.desc || '')} ×${p.qtd || 1}</span><span>${D.brl((+p.preco || 0) * (+p.qtd || 1))}</span></li>`).join('')}
        ${+r.maoDeObra ? `<li><span>Mão de obra</span><span>${D.brl(r.maoDeObra)}</span></li>` : ''}<li><b>Total</b><b>${D.brl(D.totalRegistro(r))}</b></li></ul></div>` : '<div class="p-sub">Sem peças ou valores anotados.</div>'}
      ${r.obs ? `<div class="secao">Observações</div><div class="p-sub" style="white-space:pre-wrap;color:var(--txt)">${esc(r.obs)}</div>` : ''}
    </div>
    <div class="cx-rodape"><button class="btn perigo" data-acao="excluir-reg" data-id="${r.id}" style="margin-right:auto">Excluir</button><button class="btn" data-acao="fechar-modal">Fechar</button><button class="btn pri" data-editar="${r.id}">Editar</button></div>`);
}
// Balão temporário sobre um campo (ex.: data da leitura do hodômetro)
function mostrarBalao(el, texto) {
  el.querySelector('.balao')?.remove();
  const b = document.createElement('span'); b.className = 'balao'; b.textContent = texto; el.appendChild(b);
  clearTimeout(mostrarBalao.h); mostrarBalao.h = setTimeout(() => b.remove(), 2600);
}

const conteudoLivro = {
  revisoes() {
    const ordem = { vencido: 0, proximo: 1, ok: 2, 'sem-registro': 3, 'sem-intervalo': 4 };
    const ls = D.lembretes().sort((a, b) => ordem[a.status] - ordem[b.status] || (a.faltaKm ?? 1e9) - (b.faltaKm ?? 1e9));
    const ok = ls.filter(l => l.status === 'ok').length;
    return {
      titulo: 'Revisões', sub: `Manutenção programada do manual · ${ok} de ${ls.length} em dia · toque para registrar`,
      itens: ls.map(l => cartaoLembrete(l)),
      acoes: `<button data-acao="lembretes">Ajustar intervalos</button><button class="pri" data-acao="novo-registro">+ Anotar serviço</button>`,
    };
  },
  historico() {
    const regs = D.registrosOrdenados(), anos = {};
    for (const r of regs) (anos[(r.data || '????').slice(0, 4)] ||= []).push(r);
    const itens = [], lista = Object.entries(anos).sort((a, b) => b[0].localeCompare(a[0]));
    ui.livro.anos ||= new Set(lista.slice(0, 1).map(([a]) => a));   // começa só com o ano mais recente aberto
    for (const [ano, rs] of lista) {
      const tot = rs.reduce((s, r) => s + D.totalRegistro(r), 0), aberto = ui.livro.anos.has(ano);
      // o selo do ano abre/fecha os serviços daquele ano; contagem e total ficam sempre à vista
      itens.push(`<button class="l-ano ${aberto ? 'aberto' : ''}" data-ano="${ano}" aria-expanded="${aberto}"><b>${ano}</b>
        <span>${rs.length} serviço${rs.length > 1 ? 's' : ''} · ${D.brl(tot)}</span>${ICO.seta}</button>`);
      if (aberto) rs.forEach((r, i) => itens.push(`<button class="l-evento ${i === rs.length - 1 ? 'ultimo' : ''}" data-reg="${r.id}" aria-haspopup="menu">
        <span class="l-data">${D.dataBR(r.data).slice(0, 5)}</span>
        <span class="l-txt"><b>${esc(r.titulo || TIPOS[r.tipo])}</b><small>${esc(ZONA_POR_ID[r.zona]?.nome || '')} · ${D.km(r.km)}${r.oficina ? ' · ' + esc(r.oficina) : ''}</small></span>
        <span class="l-valor">${D.brl(D.totalRegistro(r))}</span></button>`));
    }
    return {
      titulo: 'Histórico', sub: regs.length ? `${regs.length} serviço${regs.length > 1 ? 's' : ''} · toque no ano para abrir ou fechar · toque num serviço para ver, editar ou excluir` : 'Linha do tempo por ano',
      itens, vazio: '<div class="mao-vazio">Nenhum serviço anotado ainda.<br>Comece pela última troca de óleo!</div>',
      acoes: `<button class="pri" data-acao="novo-registro">+ Anotar serviço</button>`,
    };
  },
  despesas() {
    const d = ui.livro.desp, regs = despesasFiltradas();
    const total = regs.reduce((s, r) => s + D.totalRegistro(r), 0);
    const mao = regs.reduce((s, r) => s + (+r.maoDeObra || 0), 0), pecas = total - mao;
    const kms = regs.map(r => +r.km).filter(Boolean), rodado = kms.length > 1 ? Math.max(...kms) - Math.min(...kms) : 0;
    const sel = (nome, ops, v) => `<label class="l-sel"><select data-desp="${nome}">${ops.map(([k, t]) => `<option value="${k}" ${k === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>`;
    const pct = total ? Math.round(pecas / total * 100) : 0;
    return {
      titulo: 'Despesas', sub: 'Peças e mão de obra anotadas no histórico',
      ferramentas: `<div class="l-filtros">${sel('periodo', PERIODOS, d.periodo)}${sel('valor', VALORES, d.valor)}${sel('ordem', ORDENS, d.ordem)}</div>`,
      topo: `<div class="l-resumo">
        <div><b>${D.brl(total)}</b><small>${regs.length} serviço${regs.length === 1 ? '' : 's'}</small></div>
        <div><b>${rodado ? D.brl(total / rodado) : '—'}</b><small>custo por km</small></div>
        <div class="l-barra"><span><i style="width:${pct}%"></i></span><small>peças ${D.brl(pecas)} · mão de obra ${D.brl(mao)}</small></div></div>`,
      itens: regs.map(r => `<button class="l-desp" data-reg="${r.id}" aria-haspopup="menu">
        <span class="l-data">${D.dataBR(r.data)}</span>
        <span class="l-txt"><b>${esc(r.titulo || TIPOS[r.tipo])}</b><small>${esc(ZONA_POR_ID[r.zona]?.nome || '')} · ${esc(TIPOS[r.tipo] || '')}</small></span>
        <b class="l-valor">${D.brl(D.totalRegistro(r))}</b></button>`),
      vazio: `<div class="mao-vazio">Nenhuma despesa ${D.getEstado().registros.length ? 'com estes filtros' : 'anotada ainda'}.</div>`,
      acoes: D.getEstado().registros.length ? `<button data-acao="exportar-csv">Exportar planilha</button>` : '',
    };
  },
  alertas() {
    const al = alertas();
    return {
      titulo: 'Alertas', sub: al.length ? 'O que precisa de atenção agora · toque para resolver' : 'Nada pendente',
      itens: al.map(l => l.id === 'km'
        ? `<button class="l-card st-borda-proximo" data-acao="atualizar-km"><span class="l-ico">${ICO.hodometro}</span>
            <span class="l-txt"><b>${esc(l.nome)}</b><small>Última leitura há ${l.dias > 900 ? 'muito tempo' : l.dias + ' dias'} (${D.km(D.getEstado().veiculo.km)}) · toque para atualizar</small></span>
            <span class="carimbo proximo"><b>Atualizar</b></span></button>`
        : cartaoLembrete(l, l.status === 'sem-registro' ? 'Registre a última vez que foi feito para calcular a próxima' : textoLembrete(l).replace(l.nome + ': ', ''))),
      vazio: '<div class="tudo-ok"><span class="carimbo ok grande"><b>Tudo em dia</b><small>OK</small></span><p>Nenhuma manutenção vencida ou próxima.</p></div>',
      acoes: `<button data-acao="atualizar-km">Atualizar km</button>`,
    };
  },
  veiculo() {
    const v = D.getEstado().veiculo, ed = ui.livro.editando, estilo = cfg().documento;
    const corNome = (CORES.find(([, c]) => c === (ui.livro.cor || v.cor)) || ['—'])[0];
    // opcoes = lista de seleção (ex.: UF); balao = texto mostrado ao tocar no campo fora da edição
    const campo = (rot, nome, { cls = '', valor, ph = '', tipo = 'text', opcoes, balao } = {}) => {
      if (ed && nome) {
        const ctl = opcoes ? `<select name="${nome}"><option value="">—</option>${opcoes.map(o => `<option ${o === v[nome] ? 'selected' : ''}>${o}</option>`).join('')}</select>`
          : `<input name="${nome}" type="${tipo}" value="${esc(v[nome] ?? '')}" placeholder="${ph}" autocomplete="off" ${tipo === 'number' ? 'inputmode="numeric"' : ''}>`;
        return `<label class="d-campo ${cls}"><span class="d-rot">${rot}</span>${ctl}</label>`;
      }
      return `<div class="d-campo ${cls}" ${balao ? `data-balao="${esc(balao)}" role="button" tabindex="0"` : ''}><span class="d-rot">${rot}</span><span class="d-val">${esc(valor ?? (v[nome] || '—'))}</span></div>`;
    };
    return {
      titulo: 'Veículo', sub: `${VEICULO_BASE.modelo} · ${VEICULO_BASE.versao}`,
      ferramentas: `<div class="seg cfg-seg l-estilo">${[['branco', 'Branco'], ['verde', 'Verde']].map(([k, t]) => `<button data-cfg="documento:${k}" class="${estilo === k ? 'ativo' : ''}">${t}</button>`).join('')}</div>`,
      corpo: `<div class="doc doc-${estilo} ${ed ? 'editando' : ''}" data-doc>
        <div class="d-topo"><div><b>Ficha do veículo</b><small>Visual inspirado no CRLV · sem valor de documento</small></div><img src="icones/icone-192.png" alt=""></div>
        <div class="d-grade">
          ${campo('Código Renavam', 'renavam', { cls: 'mono', ph: '11 dígitos' })}
          ${campo('Placa', 'placa', { cls: 'mono destaque', ph: 'ABC1D23' })}
          ${campo('Exercício', 'exercicio', { ph: String(new Date().getFullYear()) })}
          ${campo('Ano fabricação', 'anoFab', { ph: '2012' })}
          ${campo('Ano modelo', 'anoModelo', { ph: '2013' })}
          ${campo('Nome', 'proprietario', { cls: 'largo', ph: 'Proprietário (opcional)' })}
          ${campo('Categoria', 'categoria')}
          ${campo('Chassi', 'chassi', { cls: 'largo mono', ph: '17 caracteres' })}
          ${campo('Marca / Modelo / Versão', null, { cls: 'largo', valor: 'MITSUBISHI/LANCER GT 2.0 CY4A' })}
          ${campo('Espécie / Tipo', null, { valor: 'PASSAGEIRO / AUTOMÓVEL' })}
          ${campo('Combustível', 'combustivel')}
          ${campo('Cor predominante', null, { valor: corNome })}
          ${campo('Potência / Cilindrada', null, { valor: '160CV / 1998' })}
          ${campo('Nº do motor', 'motorNum', { cls: 'mono' })}
          ${campo('Local', 'municipio', { cls: 'largo', ph: 'Município' })}
          ${campo('UF', 'uf', { opcoes: UFS })}
        </div>
        <div class="d-app">
          ${campo('Apelido no app', 'apelido')}
          ${campo('Hodômetro', 'km', { tipo: 'number', valor: D.km(v.km), cls: 'com-balao', balao: v.kmData ? 'Atualizado em ' + D.dataBR(v.kmData) : 'Data da leitura não informada' })}
          ${campo('Produção (aaaa.mm)', 'producao', { ph: '2012.05', valor: v.producao || '—' })}
          <div class="d-campo"><span class="d-rot">Cor no 3D</span><div class="cores">${CORES.map(([n, c]) => `<button type="button" title="${n}" ${ed ? `data-cor="${c}"` : 'disabled'} class="${(ui.livro.cor || v.cor) === c ? 'ativo' : ''}" style="background:${c}"></button>`).join('')}</div></div>
        </div>
      </div>`,
      acoes: ed ? `<button data-acao="cancelar-veiculo">Cancelar</button><button class="pri" data-acao="salvar-veiculo">Salvar</button>`
        : `<button class="pri" data-acao="editar-veiculo">Editar dados</button>`,
    };
  },
};
function cancelarEdicaoVeiculo() {
  ui.livro.editando = false;
  if (ui.livro.cor) { carro.setCor(D.getEstado().veiculo.cor); ui.livro.cor = null; }
}

function baixar(blob, nome) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nome; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toast.h); toast.h = setTimeout(() => { t.hidden = true; }, 2600);
}
function irParaGrupo(gid) {
  const z = zonaDoGrupo(gid); if (!z) return;
  fecharModal();
  if (ui.zona !== z.id) carro.selecionar(z.id, true);
  ui.aba = 'pecas'; ui.grupo = gid; ui.esq = 0; renderPainel();
}

function onClique(e) {
  // clique fora dos menus suspensos fecha-os
  if (!e.target.closest('#veic') && !e.target.closest('#filtro') && menuAberto()) fecharMenus();
  if ($('#menu-reg') && !e.target.closest('#menu-reg') && !e.target.closest('[data-reg]')) fecharMenuRegistro();
  const t = e.target.closest('[data-passo],[data-acao],[data-aba],[data-grupo],[data-esq],[data-peca],[data-filtro],[data-livro],[data-reg],[data-ano],[data-balao],[data-cfg],[data-pino],[data-zona],[data-editar],[data-trocar],[data-servico],[data-copiar],[data-rmpeca],[data-sugpeca],[data-cor],[data-sec]');
  if (!t) {
    if (e.target.id === 'modal') fecharModal();
    else if (e.target.id === 'livrete') fecharLivrete();   // toque fora do caderno
    return;
  }
  const ds = t.dataset;
  if (ds.passo) return passoRegiao(+ds.passo);
  if (ds.filtro) return setFiltro(ds.filtro);
  if (ds.livro) { if (ui.livro.editando) cancelarEdicaoVeiculo(); return abrirLivrete(ds.livro); }
  if (ds.reg) return abrirMenuRegistro(ds.reg, t);
  if (ds.ano) { const a = ui.livro.anos; a.has(ds.ano) ? a.delete(ds.ano) : a.add(ds.ano); return renderLivrete(); }
  if (ds.balao) return mostrarBalao(t, ds.balao);
  if (ds.cfg) {
    const [k, v] = ds.cfg.split(':'), val = v === 'true' ? true : v === 'false' ? false : v;
    D.atualizarConfig({ [k]: val });
    if (k === 'tema') aplicarTema();
    if (k === 'pinos') $('#pinos').hidden = !val;
    if (!$('#modal').hidden) modalConfig();
    return;
  }
  if (ds.pino) return carro.selecionar(ds.pino, true);
  if (ds.zona) { fecharModal(); return carro.selecionar(ds.zona, true); }
  if (ds.aba) { ui.aba = ds.aba; ui.grupo = null; return renderPainel(); }
  if (ds.grupo) { e.preventDefault(); return irParaGrupo(ds.grupo); }
  if (ds.esq) { ui.esq = +ds.esq; return renderPainel(); }
  if (ds.peca) { const [g, n, oem, ref] = JSON.parse(decodeURIComponent(ds.peca)); return modalPeca(g, n, oem, ref); }
  if (ds.editar) { fecharMenuRegistro(); const r = D.getEstado().registros.find(x => x.id === ds.editar); return r && modalRegistro(r); }
  if (ds.trocar) {
    const p = JSON.parse(decodeURIComponent(ds.trocar));
    modalRegistro(); rascunho.zona = zonaDoGrupo(p.grupo)?.id || ui.zona; rascunho.titulo = 'Troca: ' + p.desc;
    rascunho.pecas.push({ oem: p.oem, desc: p.desc, ref: p.ref, qtd: 1, preco: '' }); return renderRegistro();
  }
  if (ds.servico) {
    const l = D.lembretes().find(x => x.id === ds.servico);
    modalRegistro(); rascunho.tipo = 'preventiva'; rascunho.zona = l.zona; rascunho.titulo = l.nome; rascunho.servicos = [l.id]; rascunho.servicoFixo = l.id; return renderRegistro();
  }
  if (ds.copiar) { navigator.clipboard?.writeText(ds.copiar).then(() => toast('Nº OEM copiado'), () => toast(ds.copiar)); return; }
  if (ds.rmpeca) { rascunho.pecas.splice(+ds.rmpeca, 1); return renderRegistro(); }
  if (ds.sugpeca) { const p = JSON.parse(decodeURIComponent(ds.sugpeca)); rascunho.pecas.push({ ...p, qtd: 1, preco: '' }); return renderRegistro(); }
  if (ds.cor) { document.querySelectorAll('[data-cor]').forEach(b => b.classList.toggle('ativo', b === t)); carro.setCor(ds.cor); ui.livro.cor = ds.cor; return; }
  if (ds.sec) { const g = t.nextElementSibling; g.hidden = !g.hidden; return; }

  switch (ds.acao) {
    case 'fechar-zona': return carro.selecionar(null, true);
    case 'fechar-modal': return fecharModal();
    case 'menu-veiculo': return alternarMenu('veic');
    case 'filtro': return alternarMenu('filtro');
    case 'config': fecharMenus(); return modalConfig();
    case 'fechar-livrete': return fecharLivrete();
    case 'editar-veiculo': ui.livro.editando = true; return renderLivrete();
    case 'cancelar-veiculo': cancelarEdicaoVeiculo(); return renderLivrete();
    case 'atualizar-km': return modalKm();
    case 'ver-reg': { fecharMenuRegistro(); const r = D.getEstado().registros.find(x => x.id === ds.id); return r && modalDetalheRegistro(r); }
    case 'excluir-reg': {
      fecharMenuRegistro();
      const r = D.getEstado().registros.find(x => x.id === ds.id); if (!r) return;
      if (!confirm(`Excluir “${r.titulo || TIPOS[r.tipo]}” de ${D.dataBR(r.data)}? Esta ação não pode ser desfeita.`)) return;
      D.excluirRegistro(r.id); fecharModal(); return toast('Registro excluído');
    }
    case 'salvar-km': {
      const f = $('[data-km]'), km = +f.querySelector('[name=km]').value;
      if (!km) return toast('Informe a quilometragem');
      D.atualizarVeiculo({ km, kmData: f.querySelector('[name=kmData]').value || D.hoje() }); fecharModal(); return toast('Quilometragem atualizada');
    }
    case 'voltar-grupos': ui.grupo = null; return renderPainel();
    case 'busca-global': ui.buscaGlobal = t.checked; return atualizarResultados(ZONA_POR_ID[ui.zona]);
    case 'novo-registro': return modalRegistro();
    case 'peca-avulsa': rascunho.pecas.push({ oem: '', desc: '', qtd: 1, preco: '' }); return renderRegistro();
    case 'salvar-registro': {
      if (!rascunho.data) return toast('Informe a data');
      if (!rascunho.titulo) rascunho.titulo = rascunho.pecas[0]?.desc ? 'Troca: ' + rascunho.pecas[0].desc : TIPOS[rascunho.tipo];
      rascunho.pecas = rascunho.pecas.filter(p => p.oem || p.desc);
      if (rascunho.servicoFixo) rascunho.servicos = [rascunho.servicoFixo];
      delete rascunho.servicoFixo;
      D.salvarRegistro(rascunho); fecharModal(); toast('Registro salvo');
      if (ui.zona === rascunho.zona) { ui.aba = 'historico'; renderPainel(); }
      return;
    }
    case 'excluir-registro':
      if (confirm('Excluir este registro? Esta ação não pode ser desfeita.')) { D.excluirRegistro(rascunho.id); fecharModal(); toast('Registro excluído'); }
      return;
    case 'salvar-veiculo': {
      const dados = {}, v = D.getEstado().veiculo;
      $('[data-doc]').querySelectorAll('input[name], select[name]').forEach(i => { dados[i.name] = i.type === 'number' ? +i.value || 0 : i.value.trim(); });
      if (dados.producao && !/^\d{4}\.\d{2}$/.test(dados.producao)) return toast('Data de produção no formato aaaa.mm');
      if (dados.km !== +v.km) dados.kmData = D.hoje();
      for (const k of ['placa', 'chassi', 'combustivel', 'categoria', 'uf', 'motorNum']) if (dados[k]) dados[k] = dados[k].toUpperCase();
      if (ui.livro.cor) dados.cor = ui.livro.cor;
      ui.livro.cor = null; ui.livro.editando = false;
      D.atualizarVeiculo(dados); carro.setPlaca(dados.placa); toast('Veículo atualizado'); return;
    }
    case 'lembretes': return modalLembretes();
    case 'salvar-lembretes':
      document.querySelectorAll('[data-lkm]').forEach(i => D.ajustarLembrete(i.dataset.lkm, +i.value || null, +$(`[data-lmes="${i.dataset.lkm}"]`).value || null));
      toast('Intervalos salvos'); return modalLembretes();
    case 'catalogo': fecharMenus(); return modalCatalogo();
    case 'exportar': baixar(D.exportarJSON(), `lancer-garagem-backup-${D.hoje()}.json`); return toast('Backup gerado');
    case 'exportar-csv': return baixar(D.exportarCSV(), `lancer-historico-${D.hoje()}.csv`);
    case 'importar': {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json';
      inp.onchange = async () => {
        try { const txt = await inp.files[0].text(); if (!confirm('Substituir os dados atuais pelos do backup?')) return; D.importarJSON(txt); carro.setCor(D.getEstado().veiculo.cor); carro.setPlaca(D.getEstado().veiculo.placa); aplicarTema(); $('#pinos').hidden = !cfg().pinos; fecharModal(); toast('Backup restaurado'); }
        catch (err) { toast(err.message); }
      };
      return inp.click();
    }
  }
}
// filtros de despesas (selects do livro)
function onTroca(e) {
  const k = e.target.dataset.desp;
  if (!k) return;
  ui.livro.desp[k] = e.target.value; renderLivrete();
}

iniciar();

// Instalável/offline (precisa de https ou localhost; no GitHub Pages funciona direto)
// Quando uma versão nova do service worker assume, recarrega uma vez para não ficar com arquivos de versões diferentes.
if ('serviceWorker' in navigator) {
  const tinha = !!navigator.serviceWorker.controller;
  let recarregou = false;
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(r => r.update()).catch(() => {});
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (tinha && !recarregou) { recarregou = true; location.reload(); } });
}
