import { Carro3D } from './carro3d.js';
import { ZONAS, ZONA_POR_ID, zonaDoGrupo, traduz, videoUrl, VEICULO_BASE, REGIOES } from './zonas.js';
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
};
// O manual (320 págs) foi dividido em partes de 80 páginas para caber no limite de 25 MB por arquivo do GitHub
// (ferramentas/dividir-manual.html). Converte a página do PDF original para a parte certa.
const PAGINAS_POR_PARTE = 80;
const urlManual = pagina => {
  const parte = Math.ceil(pagina / PAGINAS_POR_PARTE);
  return `docs/manual-${parte}.pdf#page=${pagina - (parte - 1) * PAGINAS_POR_PARTE}`;
};
const TIPOS = { troca: 'Troca de peça', preventiva: 'Manutenção preventiva', reparo: 'Reparo', inspecao: 'Inspeção', outro: 'Outro' };
const CORES = [['Prata', '#8d9399'], ['Cinza grafite', '#4a4e54'], ['Preto', '#15161a'], ['Branco', '#e9eaec'], ['Vermelho', '#9b1420'], ['Azul', '#1d3d7a']];

const ui = { zona: null, aba: 'pecas', grupo: null, esq: 0, busca: '', buscaGlobal: false, modo: 'ext', pinos: true, reg: { ext: 0, int: 0 }, livrete: false };
let carro;

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
  await carro.pronto;
  criarPinos();
  carro.aoQuadro = atualizarPinos;
  D.aoMudar(() => { atualizarBarra(); if (ui.zona) renderPainel(); if (ui.livrete) renderLivrete(); });
  atualizarBarra();
  ajustarMargem();
  montarCarrossel();
  document.addEventListener('click', onClique);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!$('#modal').hidden) fecharModal();
      else if (ui.livrete) fecharLivrete();
      else if (ui.zona) carro.selecionar(null, true);
    }
    const digitando = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
    if (!digitando && $('#modal').hidden && !ui.livrete && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) passoRegiao(e.key === 'ArrowLeft' ? -1 : 1);
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
  if (!ui.pinos) return;
  const pos = carro.posicoesTela(), reg = regiaoAtual()?.zonas || [];
  for (const el of $('#pinos').children) {
    const id = el.dataset.pino, z = ZONA_POR_ID[id], p = pos[id];
    const mostrar = p && p.visivel && (ui.zona ? ui.zona === id
      : reg.length ? reg.includes(id)
      : z.modo === ui.modo && (ui.modo === 'int' || p.frente > -0.1));
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
  if (!id) { $('#painel').hidden = true; $('#painel').classList.remove('cheio'); ajustarMargem(); return; }
  const z = ZONA_POR_ID[id];
  if (z && z.modo !== ui.modo) setModo(z.modo, false);
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
        ${D.lembretes().map(l => `<label><input type="checkbox" data-serv="${l.id}" ${r.servicos.includes(l.id) ? 'checked' : ''}> ${esc(l.nome)}</label>`).join('')}</div>
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

function modalVeiculo() {
  const v = D.getEstado().veiculo;
  abrirModal(`${cab('Meu veículo')}
    <div class="cx-corpo">
      <div class="p-sub" style="margin-bottom:12px"><b style="color:var(--txt)">${VEICULO_BASE.modelo}</b> · ${VEICULO_BASE.versao}<br>${VEICULO_BASE.motor} · ${VEICULO_BASE.mercado}</div>
      <div class="form" data-veic>
        <label class="cheio">Apelido<input name="apelido" value="${esc(v.apelido)}"></label>
        <label>Placa<input name="placa" value="${esc(v.placa)}" placeholder="ABC1D23"></label>
        <label>Ano/modelo<input name="anoModelo" value="${esc(v.anoModelo)}" placeholder="2012/2013"></label>
        <label>Chassi (VIN)<input name="chassi" value="${esc(v.chassi)}" placeholder="17 caracteres"></label>
        <label>Data de produção (aaaa.mm)<input name="producao" value="${esc(v.producao)}" placeholder="2012.05" pattern="\\d{4}\\.\\d{2}"></label>
        <label>Quilometragem atual<input type="number" inputmode="numeric" name="km" value="${esc(v.km)}"></label>
        <label>Atualizado em<input type="date" name="kmData" value="${esc(v.kmData)}"></label>
        <label class="cheio">Cor da pintura<div class="cores">${CORES.map(([n, c]) => `<button type="button" title="${n}" data-cor="${c}" class="${v.cor === c ? 'ativo' : ''}" style="background:${c}"></button>`).join('')}</div></label>
      </div>
      <p class="aviso-fonte" style="margin-top:10px">A data de produção (na etiqueta do veículo) apaga no catálogo as peças de outros períodos.</p>
      <div class="secao">Dados técnicos (manual)</div>
      <dl class="spec">${VEICULO_BASE.dimensoes.map(([k, x]) => `<dt>${k}</dt><dd>${x}</dd>`).join('')}</dl>
    </div>
    <div class="cx-rodape"><button class="btn" data-acao="fechar-modal">Cancelar</button><button class="btn pri" data-acao="salvar-veiculo">Salvar</button></div>`);
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

function modalGeral() {
  const sel = modalGeral.zona || '';
  const regs = D.registrosOrdenados(r => !sel || r.zona === sel);
  const total = regs.reduce((s, r) => s + D.totalRegistro(r), 0);
  const kms = D.getEstado().registros.map(r => +r.km).filter(Boolean);
  const rodado = kms.length > 1 ? Math.max(...kms) - Math.min(...kms) : 0;
  abrirModal(`${cab('Histórico completo')}
    <div class="cx-corpo">
      <div class="resumo"><div><b>${regs.length}</b><small>registros</small></div><div><b>${D.brl(total)}</b><small>total gasto</small></div>
        <div><b>${rodado ? D.brl(total / rodado) : '—'}</b><small>custo por km</small></div></div>
      <div class="form" style="grid-template-columns:1fr"><label>Filtrar por zona<select data-filtro-zona><option value="">Todas</option>${ZONAS.map(z => `<option value="${z.id}" ${sel === z.id ? 'selected' : ''}>${esc(z.nome)}</option>`).join('')}</select></label></div>
      ${regs.length ? regs.map(r => cartaoRegistro(r).replace('<div class="reg-meta">', `<div class="reg-meta">${esc(ZONA_POR_ID[r.zona]?.nome || '')} · `)).join('') : '<div class="vazio">Nenhum registro ainda.</div>'}
    </div>
    <div class="cx-rodape"><button class="btn" data-acao="exportar-csv">${ICO.down} Planilha (CSV)</button><button class="btn pri" data-acao="novo-registro">${ICO.mais} Novo registro</button></div>`, true);
  $('[data-filtro-zona]').addEventListener('change', e => { modalGeral.zona = e.target.value; modalGeral(); });
}

function modalCatalogo() {
  abrirModal(`${cab('Catálogo completo')}
    <div class="cx-corpo">
      <p class="aviso-fonte">${D.catalogo.groups.length} grupos · ${D.catalogo.diagrams.length} diagramas · fonte: EPC Mitsubishi (Amayama), Lancer GT CY4A SNXHL1FB.</p>
      ${D.catalogo.sections.map(s => `<div class="cat-sec"><button data-sec="${s.id}"><span>${s.id} · ${esc(s.name)}</span><small>${D.catalogo.groups.filter(g => g.section === s.id).length}</small></button>
        <div class="cat-gr" hidden>${D.catalogo.groups.filter(g => g.section === s.id).map(g => `<button data-grupo="${g.id}"><span class="cod">${g.id}</span><span>${esc(g.name)}<br><small style="color:var(--txt3)">${esc(g.en)} · ${esc(zonaDoGrupo(g.id)?.nome || '')}</small></span></button>`).join('')}</div></div>`).join('')}
    </div>`);
}

function modalZonas() {
  const lista = modo => ZONAS.filter(z => z.modo === modo).map(z => `<button data-zona="${z.id}"><span>${esc(z.nome)}</span><small>${D.registrosOrdenados(r => r.zona === z.id).length || ''}</small></button>`).join('');
  abrirModal(`${cab('Zonas do carro')}<div class="cx-corpo zonas-lista"><h4>Carroceria</h4>${lista('ext')}<h4>Mecânica</h4>${lista('int')}</div>`);
}

function modalMenu() {
  const item = (acao, ico, t, s = '') => `<button data-acao="${acao}">${ico}<span>${t}</span><small>${s}</small></button>`;
  abrirModal(`${cab('Lancer Garagem')}<div class="cx-corpo menu-lista">
    ${item('livrete', ICO.livro, 'Livrete de manutenção')}
    ${item('veiculo', ICO.carro, 'Meu veículo', D.km(D.getEstado().veiculo.km))}
    ${item('lembretes', ICO.relogio, 'Manutenção programada')}
    ${item('historico-geral', ICO.lista, 'Histórico completo', D.getEstado().registros.length + ' registros')}
    ${item('catalogo', ICO.caixa, 'Catálogo completo', D.catalogo.groups.length + ' grupos')}
    ${item('pinos', ICO.busca, ui.pinos ? 'Ocultar pontos no carro' : 'Mostrar pontos no carro')}
    ${item('exportar', ICO.down, 'Fazer backup (JSON)')}
    ${item('importar', ICO.up, 'Restaurar backup')}
    <a class="btn bloco" style="margin-top:14px" href="${urlManual(6)}" target="_blank" rel="noopener">${ICO.livro} Abrir manual do proprietário (índice)</a>
    <p class="aviso-fonte" style="margin-top:12px">Os dados ficam salvos neste navegador. Faça backup regularmente.</p>
    ${carro.modeloReal ? `<p class="aviso-fonte">Modelo 3D: “Mitsubishi Lancer Sedan 2009” por <a href="https://sketchfab.com/3d-models/mitsubishi-lancer-sedan-2009-5219adf1a62b4b7393d3c1fc451be88b" target="_blank" rel="noopener">Nieve5677</a> (Sketchfab), licença <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a> — simplificado e dividido em peças para este app. Mecânica interna genérica.</p>` : ''}
  </div>`);
}

// ── Ações ─────────────────────────────────────────────────
// moverCamera = false quando a troca de modo veio de clicar numa peça (a peça é que define o enquadramento)
function setModo(m, moverCamera = true) {
  if (ui.modo === m) return;
  ui.modo = m;
  document.querySelectorAll('[data-modo]').forEach(b => b.classList.toggle('ativo', b.dataset.modo === m));
  carro.setRaioX(m === 'int');
  if (moverCamera && ui.zona && ZONA_POR_ID[ui.zona].modo !== m) carro.selecionar(null, true);
  aplicarRegiao(moverCamera, 0);
}

// ── Menu deslizante de regiões ────────────────────────────
const regioes = () => REGIOES[ui.modo];
const regiaoAtual = () => regioes()[ui.reg[ui.modo]];
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
  ui.reg[ui.modo] = (ui.reg[ui.modo] + d + n) % n;   // volta infinita
  if (ui.zona) carro.selecionar(null, true);
  aplicarRegiao(true, d);
}
function aplicarRegiao(moverCamera, dir) {
  const lista = regioes(), i = ui.reg[ui.modo], r = lista[i], n = lista.length;
  const t = $('.car-titulo');
  t.querySelector('small').textContent = ui.modo === 'ext' ? 'Carroceria' : 'Mecânica';
  t.querySelector('b').textContent = r.nome;
  $('[data-viz="-1"]').textContent = lista[(i - 1 + n) % n].nome;
  $('[data-viz="1"]').textContent = lista[(i + 1) % n].nome;
  $('[data-pontos]').innerHTML = lista.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('');
  if (dir) { t.classList.remove('de-dir', 'de-esq'); void t.offsetWidth; t.classList.add(dir > 0 ? 'de-dir' : 'de-esq'); }
  carro.setRegiao(r.zonas, moverCamera && !ui.zona ? r : null);
  renderChips();
}
function renderChips() {
  const r = regiaoAtual();
  $('#chips').innerHTML = (r?.zonas || []).map(id => `<button data-pino="${id}" class="${ui.zona === id ? 'on' : ''}">${esc(ZONA_POR_ID[id].nome)}</button>`).join('');
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
function abrirLivrete() {
  ui.livrete = true; fecharModal();
  $('#rotulo').hidden = true;
  renderLivrete();
  $('#livrete').hidden = false;
  carro.pausar(true);   // o 3D fica parado e desfocado atrás do caderno
}
function fecharLivrete() {
  ui.livrete = false; $('#livrete').hidden = true; $('#livrete').innerHTML = '';
  carro.pausar(false);
}
function renderLivrete() {
  const v = D.getEstado().veiculo, regs = D.registrosOrdenados(), ls = D.lembretes();
  const ordem = { vencido: 0, proximo: 1, ok: 2, 'sem-registro': 3, 'sem-intervalo': 4 };
  const rotulo = { vencido: 'vencido', proximo: 'em breve', ok: 'em dia', 'sem-registro': 'sem registro', 'sem-intervalo': 'a definir' };
  const total = regs.reduce((s, r) => s + D.totalRegistro(r), 0);
  const umAno = new Date(); umAno.setFullYear(umAno.getFullYear() - 1);
  const ano = regs.filter(r => new Date(r.data) >= umAno).reduce((s, r) => s + D.totalRegistro(r), 0);
  const quando = l => {
    if (l.status === 'sem-registro') return 'Registre a última vez que foi feito para calcular a próxima.';
    if (l.status === 'sem-intervalo') return l.detalhe;
    const p = [];
    if (l.proxKm) p.push(`aos ${D.km(l.proxKm)}`);
    if (l.proxData) p.push(`até ${D.dataBR(l.proxData)}`);
    return `Próxima ${p.join(' ou ')} · última em ${D.dataBR(l.ultimo.data)} (${D.km(l.ultimo.km)})`;
  };
  $('#livrete').innerHTML = `
  <div class="caderno" role="dialog" aria-modal="true" aria-label="Livrete de manutenção">
    <button class="fechar-l" data-acao="fechar-livrete" title="Fechar">${ICO.x}</button>
    <section class="pagina esq">
      <h1>Livrete de manutenção</h1>
      <p class="sub">${VEICULO_BASE.modelo} · ${VEICULO_BASE.versao} · motor ${VEICULO_BASE.motor}</p>
      <dl class="ficha">
        <dt>Veículo</dt><dd>${esc(v.apelido || '—')}</dd>
        <dt>Placa</dt><dd>${esc(v.placa || '—')}</dd>
        <dt>Chassi</dt><dd class="mono">${esc(v.chassi || '—')}</dd>
        <dt>Ano / produção</dt><dd>${esc(v.anoModelo || '—')}${v.producao ? ' · ' + esc(v.producao) : ''}</dd>
        <dt>Hodômetro</dt><dd><span class="mao">${D.km(v.km)}</span> <span style="color:#7a7266;font-weight:400">em ${D.dataBR(v.kmData)}</span></dd>
      </dl>
      <h2>Próximas manutenções</h2>
      ${[...ls].sort((a, b) => ordem[a.status] - ordem[b.status] || (a.faltaKm ?? 1e9) - (b.faltaKm ?? 1e9)).map(l => `
        <div class="linha-l"><div><b>${esc(l.nome)}</b><span class="quando">${esc(quando(l))}</span></div>
        <span class="carimbo ${l.status}">${rotulo[l.status]}</span></div>`).join('')}
      <h2>Resumo</h2>
      <div class="resumo-l">
        <div><b>${D.brl(total)}</b><small>gasto total</small></div>
        <div><b>${D.brl(ano)}</b><small>últimos 12 meses</small></div>
        <div><b>${regs.length}</b><small>serviços anotados</small></div>
      </div>
    </section>
    <section class="pagina dir">
      <h1>Registro de serviços</h1>
      <p class="sub">Toque numa linha para ver ou corrigir o lançamento.</p>
      ${regs.length ? `<table class="razao">
        <thead><tr><th>Data</th><th>Km</th><th>Serviço</th><th class="num">Valor</th></tr></thead>
        <tbody>${regs.map(r => `<tr class="reg-l" data-editar="${r.id}">
          <td>${D.dataBR(r.data)}</td><td class="num">${(+r.km || 0).toLocaleString('pt-BR')}</td>
          <td><b>${esc(r.titulo || TIPOS[r.tipo])}</b><span class="pecas-l">${esc(ZONA_POR_ID[r.zona]?.nome || '')}${(r.pecas || []).length ? ' · ' + r.pecas.map(p => esc((p.oem ? p.oem + ' ' : '') + (p.desc || ''))).join(', ') : ''}${r.oficina ? ' · ' + esc(r.oficina) : ''}</span></td>
          <td class="num">${D.brl(D.totalRegistro(r))}</td></tr>`).join('')}</tbody>
        <tfoot><tr><td colspan="3">Total</td><td class="num">${D.brl(total)}</td></tr></tfoot>
      </table>` : '<div class="mao-vazio">Nenhum serviço anotado ainda.<br>Comece pela última troca de óleo!</div>'}
      <div class="acoes-l">
        <button class="pri" data-acao="novo-registro">+ Anotar serviço</button>
        <button data-acao="veiculo">Dados do veículo</button>
        <button data-acao="lembretes">Intervalos</button>
        ${regs.length ? '<button data-acao="exportar-csv">Exportar planilha</button>' : ''}
      </div>
    </section>
  </div>`;
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
  const t = e.target.closest('[data-passo],[data-acao],[data-aba],[data-grupo],[data-esq],[data-peca],[data-modo],[data-pino],[data-zona],[data-editar],[data-trocar],[data-servico],[data-copiar],[data-rmpeca],[data-sugpeca],[data-cor],[data-sec]');
  if (!t) { if (e.target.id === 'modal') fecharModal(); return; }
  const ds = t.dataset;
  if (ds.passo) return passoRegiao(+ds.passo);
  if (ds.modo) return setModo(ds.modo);
  if (ds.pino) return carro.selecionar(ds.pino, true);
  if (ds.zona) { fecharModal(); return carro.selecionar(ds.zona, true); }
  if (ds.aba) { ui.aba = ds.aba; ui.grupo = null; return renderPainel(); }
  if (ds.grupo) { e.preventDefault(); return irParaGrupo(ds.grupo); }
  if (ds.esq) { ui.esq = +ds.esq; return renderPainel(); }
  if (ds.peca) { const [g, n, oem, ref] = JSON.parse(decodeURIComponent(ds.peca)); return modalPeca(g, n, oem, ref); }
  if (ds.editar) { const r = D.getEstado().registros.find(x => x.id === ds.editar); return r && modalRegistro(r); }
  if (ds.trocar) {
    const p = JSON.parse(decodeURIComponent(ds.trocar));
    modalRegistro(); rascunho.zona = zonaDoGrupo(p.grupo)?.id || ui.zona; rascunho.titulo = 'Troca: ' + p.desc;
    rascunho.pecas.push({ oem: p.oem, desc: p.desc, ref: p.ref, qtd: 1, preco: '' }); return renderRegistro();
  }
  if (ds.servico) {
    const l = D.lembretes().find(x => x.id === ds.servico);
    modalRegistro(); rascunho.tipo = 'preventiva'; rascunho.zona = l.zona; rascunho.titulo = l.nome; rascunho.servicos = [l.id]; return renderRegistro();
  }
  if (ds.copiar) { navigator.clipboard?.writeText(ds.copiar).then(() => toast('Nº OEM copiado'), () => toast(ds.copiar)); return; }
  if (ds.rmpeca) { rascunho.pecas.splice(+ds.rmpeca, 1); return renderRegistro(); }
  if (ds.sugpeca) { const p = JSON.parse(decodeURIComponent(ds.sugpeca)); rascunho.pecas.push({ ...p, qtd: 1, preco: '' }); return renderRegistro(); }
  if (ds.cor) { document.querySelectorAll('[data-cor]').forEach(b => b.classList.toggle('ativo', b === t)); carro.setCor(ds.cor); modalVeiculo.cor = ds.cor; return; }
  if (ds.sec) { const g = t.nextElementSibling; g.hidden = !g.hidden; return; }

  switch (ds.acao) {
    case 'fechar-zona': return carro.selecionar(null, true);
    case 'fechar-modal': if (modalVeiculo.cor) { carro.setCor(D.getEstado().veiculo.cor); modalVeiculo.cor = null; } return fecharModal();
    case 'livrete': return abrirLivrete();
    case 'fechar-livrete': return fecharLivrete();
    case 'voltar-grupos': ui.grupo = null; return renderPainel();
    case 'busca-global': ui.buscaGlobal = t.checked; return atualizarResultados(ZONA_POR_ID[ui.zona]);
    case 'novo-registro': return modalRegistro();
    case 'peca-avulsa': rascunho.pecas.push({ oem: '', desc: '', qtd: 1, preco: '' }); return renderRegistro();
    case 'salvar-registro': {
      if (!rascunho.data) return toast('Informe a data');
      if (!rascunho.titulo) rascunho.titulo = rascunho.pecas[0]?.desc ? 'Troca: ' + rascunho.pecas[0].desc : TIPOS[rascunho.tipo];
      rascunho.pecas = rascunho.pecas.filter(p => p.oem || p.desc);
      D.salvarRegistro(rascunho); fecharModal(); toast('Registro salvo');
      if (ui.zona === rascunho.zona) { ui.aba = 'historico'; renderPainel(); }
      return;
    }
    case 'excluir-registro':
      if (confirm('Excluir este registro? Esta ação não pode ser desfeita.')) { D.excluirRegistro(rascunho.id); fecharModal(); toast('Registro excluído'); }
      return;
    case 'veiculo': return modalVeiculo();
    case 'salvar-veiculo': {
      const f = $('[data-veic]'), dados = {};
      f.querySelectorAll('input[name]').forEach(i => { dados[i.name] = i.type === 'number' ? +i.value || 0 : i.value.trim(); });
      if (dados.producao && !/^\d{4}\.\d{2}$/.test(dados.producao)) return toast('Data de produção no formato aaaa.mm');
      if (modalVeiculo.cor) dados.cor = modalVeiculo.cor;
      modalVeiculo.cor = null; D.atualizarVeiculo(dados); carro.setPlaca(dados.placa); fecharModal(); toast('Veículo atualizado'); return;
    }
    case 'lembretes': return modalLembretes();
    case 'historico-geral': return modalGeral();
    case 'salvar-lembretes':
      document.querySelectorAll('[data-lkm]').forEach(i => D.ajustarLembrete(i.dataset.lkm, +i.value || null, +$(`[data-lmes="${i.dataset.lkm}"]`).value || null));
      toast('Intervalos salvos'); return modalLembretes();
    case 'zonas': return modalZonas();
    case 'menu': return modalMenu();
    case 'catalogo': return modalCatalogo();
    case 'pinos': ui.pinos = !ui.pinos; $('#pinos').hidden = !ui.pinos; return fecharModal();
    case 'exportar': baixar(D.exportarJSON(), `lancer-garagem-backup-${D.hoje()}.json`); return toast('Backup gerado');
    case 'exportar-csv': return baixar(D.exportarCSV(), `lancer-historico-${D.hoje()}.csv`);
    case 'importar': {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json';
      inp.onchange = async () => {
        try { const txt = await inp.files[0].text(); if (!confirm('Substituir os dados atuais pelos do backup?')) return; D.importarJSON(txt); carro.setCor(D.getEstado().veiculo.cor); carro.setPlaca(D.getEstado().veiculo.placa); fecharModal(); toast('Backup restaurado'); }
        catch (err) { toast(err.message); }
      };
      return inp.click();
    }
  }
}

iniciar();

// Instalável/offline (precisa de https ou localhost; no GitHub Pages funciona direto)
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
