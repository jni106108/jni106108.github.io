import { Carro3D } from './carro3d.js';
import { ZONAS, ZONA_POR_ID, zonaDoGrupo, traduz, videoUrl, VEICULO_BASE, REGIOES, FILTROS, FILTRO_POR_ID } from './zonas.js';
import * as D from './dados.js';
import * as Anexos from './anexos.js';

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
  ok: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16.5 9"/></svg>',
  bomba: '<svg viewBox="0 0 24 24"><path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16"/><path d="M3 21h13M6.5 7h6v4h-6z"/><path d="M15 9h1.5a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8.5L18.5 5.5"/></svg>',
  carteira: '<svg viewBox="0 0 24 24"><path d="M3 7.5h15.5A2.5 2.5 0 0 1 21 10v8a2.5 2.5 0 0 1-2.5 2.5H5.5A2.5 2.5 0 0 1 3 18z"/><path d="M3 7.5l11.5-4 1.5 4"/><path d="M21 12.5h-4a1.75 1.75 0 0 0 0 3.5h4"/></svg>',
  cadeado: '<svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>',
  aerofolio: '<svg viewBox="0 0 24 24"><path d="M2.5 9.5h19l-2 2.5h-15z"/><path d="M7 12v4M17 12v4M4 18h16"/></svg>',
  roda: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3"/><path d="M12 7v3.7M12 13.3V17M7 12h3.7M13.3 12H17"/></svg>',
};
// Ícone de documento (troca do visual da ficha: branco = CRLV novo, verde = antigo)
const iconeDoc = cor => `<svg viewBox="0 0 24 24" class="doc-ico"><path d="M6 2.5h8.5L19 7v14.5H6z" fill="${cor}"/><path d="M14.5 2.5V7H19M8.8 11h7.4M8.8 14h7.4M8.8 17h4.6"/></svg>`;
const trocaDoc = atual => `<div class="doc-troca" role="radiogroup" aria-label="Visual do documento">${[['branco', '#ffffff', 'Documento branco (CRLV novo)'], ['verde', '#bfe2c4', 'Documento verde (antigo)']].map(([k, cor, t]) =>
  `<button role="radio" aria-checked="${atual === k}" data-cfg="documento:${k}" class="${atual === k ? 'ativo' : ''}" title="${t}" aria-label="${t}">${iconeDoc(cor)}</button>`).join('')}</div>`;
// Combustíveis = bicos da bomba (cor do bico)
const COMBUSTIVEIS = [['etanol', 'Etanol', '#1f9d55'], ['gasolina', 'Gasolina comum', '#f2c200'], ['premium', 'Gasolina premium', '#d62828']];
const COMB_POR_ID = Object.fromEntries(COMBUSTIVEIS.map(([k, n, c]) => [k, { nome: n, cor: c }]));
const CORES_RODAS = [[null, 'Original (prata)', '#a3a9b0'], ['#4a4e54', 'Grafite'], ['#141518', 'Preto'], ['#7a5a32', 'Bronze'], ['#e9eaec', 'Branco'], ['#b8962e', 'Dourado']];
// números digitados com vírgula ("5,89") ou ponto ("5.89")
const numero = s => { s = String(s ?? '').trim(); if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.'); return parseFloat(s) || 0; };
const fmt = (v, casas) => (+v || 0).toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
// Campo de dinheiro preenchido da direita para a esquerda (como maquininha): 5 → 0,05 · 50 → 0,50 · 5000 → 50,00.
// A vírgula se posiciona sozinha; apagar tira o último algarismo. casas = 2 (reais) ou 3 (preço do litro, como na bomba).
function mascaraMoeda(el, casas) {
  const aplicar = d => {
    d = d.replace(/^0+/, '').slice(0, 9);
    el.dataset.d = d;
    el.value = d ? fmt(+d / 10 ** casas, casas) : '';
    requestAnimationFrame(() => { try { el.setSelectionRange(el.value.length, el.value.length); } catch {} });
    el.dispatchEvent(new Event('input', { bubbles: true }));   // avisa quem calcula (ex.: litros na bomba)
  };
  el.setAttribute('inputmode', 'numeric');
  aplicar(el.value ? String(Math.round(numero(el.value) * 10 ** casas)) : '');
  el.addEventListener('beforeinput', e => {
    const t = e.inputType, d = el.dataset.d || '';
    if (t === 'insertText' || t === 'insertReplacementText' || t === 'insertFromPaste') {
      e.preventDefault(); aplicar(d + String(e.data ?? e.dataTransfer?.getData('text') ?? '').replace(/\D/g, ''));
    } else if (t.startsWith('delete')) { e.preventDefault(); aplicar(d.slice(0, -1)); }
  });
  // teclados que não mandam "beforeinput" (alguns Android): refaz a partir do que ficou no campo
  el.addEventListener('input', e => {
    if (e.isTrusted && el.value !== (el.dataset.d ? fmt(+el.dataset.d / 10 ** casas, casas) : '')) {
      let d = el.value.replace(/\D/g, '').replace(/^0+/, '');
      if (e.inputType?.startsWith('delete') && d === el.dataset.d) d = d.slice(0, -1);
      aplicar(d);
    }
  }, true);
  el.addEventListener('focus', () => requestAnimationFrame(() => { try { el.setSelectionRange(el.value.length, el.value.length); } catch {} }));
}
ICO.nuvem = '<svg viewBox="0 0 24 24"><path d="M7 18.5a4.5 4.5 0 0 1-.6-9 6 6 0 0 1 11.5 1.6A3.8 3.8 0 0 1 17.5 18.5z"/><path d="M12 16v-5.5M9.5 12.5L12 10l2.5 2.5"/></svg>';
ICO.placa = '<svg viewBox="0 0 24 24"><rect x="2.5" y="7" width="19" height="10" rx="1.5"/><path d="M2.5 9.5h19M6 13.5h3M11 13.5h7"/></svg>';
ICO.camera = '<svg viewBox="0 0 24 24"><path d="M4 8h3l1.5-2.5h7L17 8h3v11H4z"/><circle cx="12" cy="13.5" r="3.5"/></svg>';
ICO.pdfDoc = '<svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M8.5 13h7M8.5 16.5h5"/></svg>';
// Documentos com vencimento: [id, nome, ícone, campo extra]
const DOCS = [
  ['ipva', 'IPVA', '<svg viewBox="0 0 24 24"><path d="M6 2.5h12v19l-3-2-3 2-3-2-3 2z"/><path d="M14.5 7.5c-.5-.8-1.4-1.2-2.5-1.2-1.4 0-2.5.8-2.5 1.9 0 2.6 5 1.4 5 4.1 0 1.1-1.1 1.9-2.5 1.9-1.2 0-2.1-.5-2.6-1.3M12 5v1.3M12 14.2v1.3"/></svg>', 'valor'],
  ['licenciamento', 'Licenciamento', '<svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M7 9.5h6M7 13h4"/><path d="M14.5 14.5l1.8 1.8 3.2-3.6"/></svg>', null],
  ['seguro', 'Seguro', '<svg viewBox="0 0 24 24"><path d="M12 2.5l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6z"/><path d="M8.5 12l2.4 2.4 4.6-4.9"/></svg>', 'seguradora'],
  ['cnh', 'CNH', '<svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2"/><circle cx="8.5" cy="11" r="2.2"/><path d="M5.3 16c.6-1.5 1.7-2.2 3.2-2.2s2.6.7 3.2 2.2M14.5 9.5h4M14.5 12.5h4"/></svg>', null],
];
const DOCS_POR_ID = Object.fromEntries(DOCS.map(([k, nome, ico, extra]) => [k, { nome, ico, extra }]));
// Versões do Lancer de 10ª geração vendidas no Brasil (o 3D de cada uma virá depois; hoje o modelo é o mesmo)
const VERSOES = ['MT', 'HL', 'HL-T', 'HL-E', 'GT', 'GT AWD'];
const nomeVersao = (v = D.getEstado().veiculo) => `MITSUBISHI/LANCER ${v.versao || 'GT'} 2.0`;
// a placa no 3D muda sozinha: Mercosul, antiga cinza (com UF/município) ou preta (30+ anos de fabricação)
const atualizarPlaca = () => { const v = D.getEstado().veiculo; carro.setPlaca(v.placa, { anoFab: v.anoFab, uf: v.uf, municipio: v.municipio }); };
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
// Novidades de cada versão (a primeira da lista é a atual). Aparece em Configurações → Novidades e abre
// sozinha na primeira vez que o app é aberto numa versão nova. Para publicar uma versão: acrescente no topo.
const NOVIDADES = [
  { versao: '7', data: '30/10/2026', titulo: 'Lancer Club 67', itens: [
    'Novo nome: Lancer Club 67, com o ícone LC67 na tela inicial do celular.',
    'Nova tela de abertura com o escudo do clube e barra de carregamento.',
    'Novidades da versão: esta tela. Fica em Configurações e abre sozinha na primeira vez em cada versão nova.',
  ] },
  { versao: '6.2', data: '30/10/2026', titulo: 'Abertura mais rápida e segura', itens: [
    'O modelo 3D não é mais baixado de novo a cada atualização.',
    'Barra de progresso do download do modelo 3D.',
    'Se algo falhar ao abrir, a tela mostra o motivo, qual arquivo falhou e os botões “Tentar de novo” e “Limpar cache”.',
  ] },
  { versao: '6.1', data: '30/10/2026', titulo: 'Versão do carro e placa', itens: [
    'Versão do carro na ficha (MT, HL, HL-T, HL-E, GT, GT AWD).',
    'Valores em dinheiro digitados como na maquininha (5-0-0-0 = R$ 50,00).',
    'Placa dianteira no centro ou no lado do motorista (Personalizar).',
    'Placa automática no 3D: Mercosul, antiga cinza ou preta (30+ anos).',
  ] },
  { versao: '6', data: '30/10/2026', titulo: 'Consumo, fotos e vencimentos', itens: [
    'Consumo em km/L com a opção “Completei o tanque”.',
    'Backup pelo compartilhar do celular (Google Drive, e-mail…) e lembrete de backup.',
    'Fotos e notas fiscais nos registros de serviço.',
    'Vencimentos de IPVA, licenciamento, seguro e CNH no painel de alertas.',
    'Relatório em PDF para revenda.',
  ] },
  { versao: '5', data: '30/10/2026', titulo: 'Painel de instrumentos', itens: [
    'Hodômetro moderno ou clássico e luzes de alerta no painel superior.',
    'Registro de abastecimento numa tela com visual de bomba.',
    'Ganhos como motorista de aplicativo e aba Ganhos no livro.',
    'Catálogo, manual e personalização (aerofólio, cor das rodas) na barra inferior.',
  ] },
  { versao: '4', data: '21/10/2026', titulo: 'Histórico mais prático', itens: [
    'Histórico com anos que abrem e fecham.',
    'Menu Ver mais / Editar / Excluir em cada serviço.',
    'Registro de um serviço programado por vez, sem marcar outros por engano.',
  ] },
  { versao: '3', data: '21/10/2026', titulo: 'Nova organização', itens: [
    'Filtro de camadas (motor, freios, suspensão…).',
    'Menu do veículo, livro de manutenção com abas e ficha no estilo CRLV.',
    'Configurações com tema claro, escuro ou do sistema.',
  ] },
];
const VERSAO_APP = `v${NOVIDADES[0].versao} · ${NOVIDADES[0].titulo}`;
function modalNovidades() {
  fecharMenus();
  abrirModal(`${cab('Novidades')}
    <div class="cx-corpo novidades">
      ${NOVIDADES.map((n, i) => `<section class="nov-versao ${i === 0 ? 'atual' : ''}">
        <div class="nov-cab"><b>v${n.versao}</b>${i === 0 ? '<span class="novo">Nova</span>' : ''}<small>${n.data}</small></div>
        <p>${esc(n.titulo)}</p>
        ${i < 2 ? `<ul>${n.itens.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`
          : `<details><summary>Ver ${n.itens.length} mudanças</summary><ul>${n.itens.map(t => `<li>${esc(t)}</li>`).join('')}</ul></details>`}
      </section>`).join('')}
    </div>
    <div class="cx-rodape"><button class="btn pri" data-acao="fechar-modal">Entendi</button></div>`);
}   // aparece em Configurações (troque junto com VERSAO do sw.js)
const TIPOS = { troca: 'Troca de peça', preventiva: 'Manutenção preventiva', reparo: 'Reparo', inspecao: 'Inspeção', outro: 'Outro' };
const CORES = [['Prata', '#8d9399'], ['Cinza grafite', '#4a4e54'], ['Preto', '#15161a'], ['Branco', '#e9eaec'], ['Vermelho', '#9b1420'], ['Azul', '#1d3d7a']];

const ui = {
  zona: null, aba: 'pecas', grupo: null, esq: 0, busca: '', buscaGlobal: false, filtro: 'geral', reg: {}, livrete: false,
  // livro de manutenção: aba aberta, página e filtros de despesas
  livro: { aba: 'revisoes', editando: false, anos: null, desp: { periodo: '12m', cat: 'todas', valor: 'todos', ordem: 'recentes' }, ganhosPeriodo: '3m' },
};
let carro;
const cfg = () => D.getEstado().config;

// ── Inicialização ─────────────────────────────────────────
async function iniciar() {
  D.carregarEstado();
  try { await D.carregarCatalogo(); }
  catch (e) { $('#carregando-txt').textContent = 'Não foi possível carregar o catálogo (data/catalogo.json).'; window.lancerAviso?.('Verifique a internet. No PC, abra pelo "Iniciar Lancer Garagem.bat" (servidor local).'); return; }
  $('#carregando-txt').textContent = 'Carregando modelo 3D…';
  carro = new Carro3D($('#cena'), {
    cor: D.getEstado().veiculo.cor,
    aoSelecionar: id => abrirZona(id),
    aoPassar: mostrarRotulo,
    aoProgresso: progressoModelo,
  });
  carro.vistas = Object.fromEntries(ZONAS.map(z => [z.id, z.vista]));
  atualizarPlaca();
  window.lancer = { carro, ui, dados: D };   // acesso pelo console do navegador (depuração)
  aplicarTema();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', aplicarTema);
  carro.setPersonalizacao(cfg());   // aerofólio e cor das rodas (aplicados quando o modelo terminar de carregar)
  $('#link-manual').href = urlManual(6);
  montarOdometro();
  new ResizeObserver(ajustarCluster).observe($('#cluster'));
  await carro.pronto;
  $('#carregando-txt').textContent = 'Preparando…';
  // daqui em diante uma falha não deixa o app preso em "Carregando": ele abre e avisa
  try { montarInterface(); }
  catch (e) { console.error(e); setTimeout(() => toast('Parte do app não abriu: ' + (e.message || e)), 600); }
  $('#carregando').classList.add('some');
  setTimeout(() => $('#carregando').remove(), 500);
  setTimeout(() => $('#dica').classList.add('some'), 6000);
  // primeira abertura numa versão nova: mostra o que mudou (uma vez só)
  if (cfg().versaoVista !== NOVIDADES[0].versao) {
    setTimeout(() => { if ($('#modal').hidden) modalNovidades(); D.atualizarConfig({ versaoVista: NOVIDADES[0].versao }); }, 900);
  }
}
// barra da tela de abertura enquanto o modelo 3D (12,7 MB) é baixado
function progressoModelo(baixado, total) {
  const mb = v => (v / 1048576).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  const pct = total ? Math.min(100, Math.round(baixado / total * 100)) : null;
  $('#carregando-txt').textContent = pct !== null ? `Carregando modelo 3D… ${pct}% (${mb(baixado)} de ${mb(total)} MB)` : `Carregando modelo 3D… ${mb(baixado)} MB`;
  $('#carregando-barra').style.width = (pct ?? Math.min(95, baixado / 13.3e6 * 100)) + '%';
}
function montarInterface() {
  // os toques são ligados primeiro: se alguma parte abaixo falhar, o resto do app continua respondendo
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
  D.aoMudar(() => { atualizarBarra(); if (ui.zona) renderPainel(); if (ui.livrete) renderLivrete(); });
  criarPinos();
  $('#pinos').hidden = !cfg().pinos;
  carro.aoQuadro = atualizarPinos;
  renderFiltro();
  montarCarrossel();
  ajustarMargem();
  atualizarBarra();
}

// Painel superior: hodômetro + luzes de alerta (redesenhado sempre que os dados mudam)
function atualizarBarra() {
  const estilo = cfg().odometro;
  $('#cluster').classList.toggle('classico', estilo === 'classico');
  const v = D.getEstado().veiculo;
  $('#odometro').innerHTML = htmlOdometro(estilo, v.km);
  $('#odometro').setAttribute('aria-label', `Hodômetro: ${D.km(v.km)}. Toque e segure para editar.`);
  renderLuzes();
  if (!$('#veic-lista').hidden) renderMenuVeiculo();
  if (!$('#odo-pop').hidden) renderOdoPop();
}

// ── Hodômetro (moderno = visor digital de 7 segmentos; clássico = tambores mecânicos) ──
const SEG = ['abcdef', 'bc', 'abged', 'abgcd', 'fgbc', 'afgcd', 'afgedc', 'abc', 'abcdefg', 'abcdfg'];
const SEG_RET = { a: [3, 1, 6, 1.7], b: [9.3, 2.6, 1.7, 6.6], c: [9.3, 10.8, 1.7, 6.6], d: [3, 17.3, 6, 1.7], e: [1, 10.8, 1.7, 6.6], f: [1, 2.6, 1.7, 6.6], g: [3, 9.15, 6, 1.7] };
const digito7 = (d, apagado) => `<svg class="seg7 ${apagado ? 'apag' : ''}" viewBox="0 0 13 20" aria-hidden="true"><g transform="skewX(-8) translate(2 0)">${
  Object.entries(SEG_RET).map(([s, [x, y, w, h]]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx=".85" class="${SEG[d].includes(s) ? 'on' : ''}"/>`).join('')}</g></svg>`;
function htmlOdometro(estilo, km) {
  const n = String(Math.max(0, Math.round(+km || 0))), s = n.padStart(6, '0'), lider = s.length - n.length;
  if (estilo === 'classico') return `<span class="odo odo-classico" aria-hidden="true">${[...s].map((d, i) => `<i class="${i === s.length - 1 ? 'ult' : ''}">${d}</i>`).join('')}<small>km</small></span>`;
  return `<span class="odo odo-moderno" aria-hidden="true">${[...s].map((d, i) => digito7(+d, i < lider)).join('')}<small>km</small></span>`;
}
// toque curto: dica; toque longo (ou clique direito): editar km e estilo
function montarOdometro() {
  const b = $('#odometro'); let t = null, longo = false;
  const abrir = () => { longo = true; clearTimeout(t); if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(12); abrirOdoPop(); };
  b.addEventListener('pointerdown', () => { longo = false; clearTimeout(t); t = setTimeout(abrir, 550); });
  for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) b.addEventListener(ev, () => clearTimeout(t));
  b.addEventListener('contextmenu', e => { e.preventDefault(); if (!longo) abrir(); });
  b.addEventListener('click', () => { if (longo) { longo = false; return; } if ($('#odo-pop').hidden) mostrarBalao($('#odo-caixa'), 'Toque e segure para editar', true); });
}
function abrirOdoPop() {
  fecharMenus();
  renderOdoPop();
  $('#odo-pop').hidden = false;
}
function renderOdoPop() {
  const v = D.getEstado().veiculo, est = cfg().odometro;
  $('#odo-pop').innerHTML = `
    <div class="odo-pop-cab"><b>Hodômetro</b><small>${v.kmData ? 'Atualizado em ' + D.dataBR(v.kmData) : 'Sem data de leitura'}</small></div>
    <label class="odo-campo">Quilometragem atual<span><input type="number" inputmode="numeric" data-odo-km value="${esc(v.km || '')}" placeholder="0"><em>km</em></span></label>
    <button class="btn pri bloco" data-acao="salvar-odo">Salvar quilometragem</button>
    <div class="odo-estilos"><span>Estilo do hodômetro</span>
      ${[['moderno', 'Moderno'], ['classico', 'Clássico']].map(([k, t]) => `<button data-cfg="odometro:${k}" class="${est === k ? 'ativo' : ''} ${k}" aria-pressed="${est === k}">${htmlOdometro(k, 12345)}<small>${t}</small></button>`).join('')}
    </div>`;
}

// ── Luzes de alerta (como as do painel do carro): vermelho = vencido, âmbar = em breve, cinza = sem registro ──
// Sem carrossel: se não couberem ao lado do hodômetro, descem para uma linha própria e o painel cresce,
// para nenhum alerta ficar escondido.
function renderLuzes() {
  const al = alertas();
  $('#luzes').style.setProperty('--n', Math.max(1, al.length));
  $('#luzes-pista').innerHTML = al.length ? al.map(l => {
    const dica = `${l.nome}: ${textoAlerta(l)}`;
    return `<button class="luz luz-${l.status}" data-acao="alertas" role="listitem" title="${esc(dica)}" aria-label="${esc(dica)}">${iconeAlerta(l)}</button>`;
  }).join('') : `<button class="luz luz-ok" data-acao="alertas" role="listitem" title="Nenhum alerta: tudo em dia">${ICO.ok}</button>`;
  requestAnimationFrame(ajustarCluster);
}
// Painel com mais de uma linha: avisa o CSS (separador) e empurra o menu de regiões para baixo
function ajustarCluster() {
  const c = $('#cluster'), luzes = $('#luzes');
  c.classList.toggle('quebrou', luzes.offsetTop > $('#odo-caixa').offsetTop + 8);
  const extra = Math.max(0, c.offsetHeight - (celular() ? 52 : 56));
  if (extra !== ajustarCluster.extra) {
    ajustarCluster.extra = extra;
    document.documentElement.style.setProperty('--extra-topo', extra + 'px');
    if (carro?.pronto) ajustarMargem();
  }
}

// Ícone, texto, ação e carimbo de cada alerta (manutenção, documento, hodômetro, backup)
const iconeAlerta = l => ({ lembrete: SICO[l.id], doc: DOCS_POR_ID[l.doc]?.ico, km: ICO.hodometro, backup: ICO.nuvem }[l.tipo] || ICO.chave);
function textoAlerta(l) {
  const ha = d => (d > 900 ? 'muito tempo' : d === 1 ? '1 dia' : d + ' dias');
  switch (l.tipo) {
    case 'doc': return l.dias < 0 ? `venceu em ${D.dataBR(l.venc)} (há ${ha(-l.dias)})` : l.dias === 0 ? 'vence hoje' : `vence em ${D.dataBR(l.venc)} (em ${ha(l.dias)})`;
    case 'km': return `última leitura há ${ha(l.dias)} · toque para atualizar`;
    case 'backup': return l.dias === null ? 'nenhum backup feito ainda' : `último backup há ${ha(l.dias)}`;
    default: return l.status === 'sem-registro' ? 'sem registro · toque para anotar' : textoLembrete(l).replace(l.nome + ': ', '');
  }
}
const acaoAlerta = l => ({ doc: `data-doc="${l.doc}"`, km: 'data-acao="atualizar-km"', backup: 'data-acao="backup"' }[l.tipo] || `data-servico="${l.id}"`);
const carimboAlerta = l => ({ km: '<span class="carimbo proximo"><b>Atualizar</b></span>', backup: '<span class="carimbo proximo"><b>Fazer</b></span>' }[l.tipo]
  || (l.tipo === 'doc' ? carimboDoc(l.status) : carimbo(l.status)));

// Painel de alertas (fora do livro): mesmo visual do hodômetro escolhido, com luzes e carimbos
function abrirAlertas() {
  fecharMenus();
  const al = alertas(), v = D.getEstado().veiculo, est = cfg().odometro;
  const cartao = l => `<button class="pi-item" ${acaoAlerta(l)}>
      <span class="luz luz-${l.status}">${iconeAlerta(l)}</span>
      <span class="pi-txt"><b>${esc(l.nome)}</b><small>${esc(textoAlerta(l))}</small></span>${carimboAlerta(l)}</button>`;
  const semDocs = DOCS.filter(([k]) => !D.getEstado().documentos[k].venc).length;
  abrirModal(`
    <div class="pi-cab"><div class="pi-tit"><small>Painel de alertas</small><b>${al.length ? `${al.length} aviso${al.length > 1 ? 's' : ''}` : 'Tudo em dia'}</b></div>
      ${htmlOdometro(est, v.km)}<button class="fechar" data-acao="fechar-modal" title="Fechar">${ICO.x}</button></div>
    <div class="cx-corpo pi-lista">${al.length ? al.map(cartao).join('') : `<div class="pi-ok"><span class="luz luz-ok">${ICO.ok}</span><p>Nenhuma manutenção ou documento vencido ou próximo.</p></div>`}
      ${semDocs ? `<button class="pi-dica" data-livro="veiculo">${ICO.doc}<span>${semDocs} vencimento${semDocs > 1 ? 's' : ''} de documento sem data (IPVA, licenciamento, seguro, CNH) · toque para cadastrar</span></button>` : ''}</div>
    <div class="cx-rodape"><button class="btn" data-acao="lembretes">Ajustar intervalos</button><button class="btn pri" data-livro="revisoes">Ver revisões</button></div>`,
  false, `painel-instr instr-${est}`);
}
// Itens que pedem ação: manutenção vencida/próxima/sem registro, documentos vencendo, hodômetro desatualizado e backup atrasado
const diasDesde = data => (data ? Math.round((new Date(D.hoje() + 'T12:00') - new Date(data + 'T12:00')) / 864e5) : null);
function alertas() {
  const e = D.getEstado(), v = e.veiculo, c = e.config;
  const out = D.lembretes().filter(l => ['vencido', 'proximo', 'sem-registro'].includes(l.status)).map(l => ({ ...l, tipo: 'lembrete' }))
    .sort((a, b) => (a.faltaKm ?? 1e9) - (b.faltaKm ?? 1e9));
  for (const d of statusDocumentos()) if (d.status === 'vencido' || d.status === 'proximo') out.push({ ...d, id: 'doc-' + d.doc, tipo: 'doc' });
  const diasKm = diasDesde(v.kmData) ?? 999;
  if (diasKm > 30) out.push({ id: 'km', tipo: 'km', status: 'proximo', nome: 'Atualizar a quilometragem', dias: diasKm });
  const temDados = e.registros.length + e.abastecimentos.length + e.ganhos.length > 0, diasBk = diasDesde(c.ultimoBackup);
  if (c.backupDias && temDados && (diasBk === null || diasBk >= c.backupDias)) out.push({ id: 'backup', tipo: 'backup', status: 'proximo', nome: 'Fazer backup', dias: diasBk });
  const peso = { vencido: 0, proximo: 1, 'sem-registro': 2 };
  return out.sort((a, b) => peso[a.status] - peso[b.status]);   // sort estável: mantém a ordem dentro de cada cor
}

// ── Documentos com vencimento (IPVA, licenciamento, seguro, CNH) ──
function statusDocumentos() {
  const docs = D.getEstado().documentos;
  return DOCS.map(([k, nome]) => {
    const venc = docs[k].venc, dias = venc ? -diasDesde(venc) : null;
    const status = !venc ? 'sem-data' : dias < 0 ? 'vencido' : dias <= 30 ? 'proximo' : 'ok';
    return { doc: k, nome, venc, dias, status, ...docs[k] };
  });
}
function carimboDoc(status) {
  return { ok: '<span class="carimbo ok"><b>Em dia</b></span>', vencido: '<span class="carimbo vencido"><b>Vencido</b></span>',
    proximo: '<span class="carimbo proximo"><small>Vence em breve</small><b>Atenção</b></span>', 'sem-data': '<span class="carimbo neutro"><b>Cadastrar</b></span>' }[status];
}
function modalDocumento(k) {
  const d = D.getEstado().documentos[k], [, nome, ico, extra] = DOCS.find(x => x[0] === k);
  abrirModal(`${cab(`${ico} ${nome}`)}
    <div class="cx-corpo"><div class="form" data-docform="${k}">
      <label class="${extra ? '' : 'cheio'}">Data de vencimento<input type="date" name="venc" value="${esc(d.venc)}"></label>
      ${extra === 'valor' ? `<label>Valor (R$, opcional)<input name="valor" inputmode="decimal" value="${d.valor ? fmt(d.valor, 2) : ''}" placeholder="0,00"></label>` : ''}
      ${extra === 'seguradora' ? `<label>Seguradora (opcional)<input name="seguradora" value="${esc(d.seguradora || '')}" placeholder="Nome da seguradora"></label>` : ''}
    </div>
    <p class="aviso-fonte" style="margin-top:10px">O alerta acende em âmbar 30 dias antes e em vermelho depois do vencimento.${k === 'cnh' ? ' A validade da CNH depende da idade: confira a data impressa no documento.' : ''}</p></div>
    <div class="cx-rodape">${d.venc ? '<button class="btn perigo" data-acao="doc-limpar" style="margin-right:auto">Remover data</button>' : ''}
      ${d.venc && k !== 'cnh' ? '<button class="btn" data-acao="doc-renovar" title="Avança o vencimento em 1 ano">Renovado (+1 ano)</button>' : ''}
      <button class="btn pri" data-acao="doc-salvar">Salvar</button></div>`);
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
  const p = $('#painel'), topo = (celular() ? 134 : 124) + (ajustarCluster.extra || 0);   // painel superior + menu de regiões
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
function abrirModal(html, larga = false, classe = '') {
  const m = $('#modal'); m.innerHTML = `<div class="caixa ${larga ? 'larga' : ''} ${classe}" role="dialog" aria-modal="true">${html}</div>`; m.hidden = false;
}
function fecharModal() {
  if ($('#modal [data-form]')) descartarRascunho();   // registro fechado sem salvar
  $('#modal').hidden = true; $('#modal').innerHTML = '';
}
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
      <div class="fotos-form"><label>Fotos e notas fiscais</label>
        <div class="anexos" data-fotos></div>
        <label class="btn foto-add">${ICO.camera} Adicionar foto<input type="file" accept="image/*" multiple data-addfoto hidden></label>
        <small class="serv-nota">Tire uma foto da nota, da peça ou do serviço. As fotos ficam guardadas neste aparelho e entram no backup.</small>
      </div>
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
  renderFotosForm();
  f.querySelector('[data-addfoto]').addEventListener('change', async e => {
    const arqs = [...e.target.files]; e.target.value = '';
    if (!arqs.length) return;
    toast(arqs.length > 1 ? `Guardando ${arqs.length} fotos…` : 'Guardando foto…');
    for (const a of arqs) {
      try { const id = await Anexos.adicionarFoto(a); (rascunho.anexos ||= []).push(id); (rascunho._novos ||= []).push(id); }
      catch { toast('Não foi possível guardar a foto'); }
    }
    renderFotosForm(); toast('Foto adicionada');
  });
}
// miniaturas do formulário (toque = ampliar; × = remover)
function renderFotosForm() {
  const el = $('[data-fotos]'); if (!el) return;
  el.innerHTML = (rascunho.anexos || []).map(id => `<span class="anexo"><img data-anexo="${id}" data-ver-foto="${id}" alt="Foto anexada">
    <button type="button" class="anexo-rm" data-rmfoto="${id}" title="Remover foto">×</button></span>`).join('');
  Anexos.hidratar(el);
}
// Fotos novas de um registro que não foi salvo são apagadas; as removidas de um registro salvo, só ao salvar
function descartarRascunho() {
  if (!rascunho?._novos?.length) return;
  Anexos.excluir(rascunho._novos).catch(() => {});
  delete rascunho._novos;
}
// Foto em tela cheia (por cima de qualquer janela)
function verFoto(id) {
  const v = document.createElement('div');
  v.className = 'visor-foto'; v.setAttribute('role', 'dialog'); v.setAttribute('aria-label', 'Foto');
  v.innerHTML = `<img data-anexo="${id}" alt="Foto anexada"><button class="fechar" title="Fechar">${ICO.x}</button>`;
  v.addEventListener('click', () => v.remove());
  document.body.appendChild(v); Anexos.hidratar(v);
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

// ── Abastecimento: tela no visual de uma bomba (visor com total, litros e preço; bicos = combustível) ──
let bomba = null;   // rascunho do abastecimento
const BICO_SVG = `<svg viewBox="0 0 44 60" class="b-bico-svg" aria-hidden="true">
  <path class="mang" d="M22 0v9"/>
  <path class="pega" d="M10 9h22a5 5 0 0 1 5 5v13a5 5 0 0 1-5 5h-4l-3 7h-8l-2-7h-5a5 5 0 0 1-5-5V14a5 5 0 0 1 5-5z"/>
  <path class="gatilho" d="M14 32c0 6 3 9 8 9"/>
  <path class="bico" d="M18 39l-7 18"/>
</svg>`;
function abrirBomba(a) {
  fecharMenus();
  const ultimo = c => D.abastecimentosOrdenados().find(x => x.combustivel === c);
  const comb = a?.combustivel || D.abastecimentosOrdenados()[0]?.combustivel || 'gasolina';
  bomba = a ? { ...a, cheio: a.cheio !== false } : { data: D.hoje(), combustivel: comb, total: '', preco: ultimo(comb)?.preco || '', km: '', posto: ultimo(comb)?.posto || '', cheio: true };
  renderBomba();
}
function renderBomba() {
  const b = bomba, c = COMB_POR_ID[b.combustivel], novo = !D.getEstado().abastecimentos.some(x => x.id === b.id);
  abrirModal(`<div class="bomba" style="--comb:${c.cor}">
    <div class="b-cab"><span class="b-tit">${ICO.bomba}Abastecimento</span><button class="fechar" data-acao="fechar-modal" title="Fechar">${ICO.x}</button></div>
    <div class="b-faixa">${esc(c.nome)}</div>
    <div class="b-visor">
      <label class="b-lin"><span class="b-rot">Total a pagar</span><span class="b-lcd"><em>R$</em><input data-b="total" inputmode="decimal" placeholder="0,00" value="${b.total ? fmt(b.total, 2) : ''}" autocomplete="off"></span></label>
      <div class="b-lin"><span class="b-rot">Litros</span><span class="b-lcd b-auto"><output data-b-litros>${fmt(litrosBomba(), 3)}</output></span></div>
      <label class="b-lin"><span class="b-rot">Preço por litro</span><span class="b-lcd"><em>R$</em><input data-b="preco" inputmode="decimal" placeholder="0,000" value="${b.preco ? fmt(b.preco, 3) : ''}" autocomplete="off"></span></label>
    </div>
    <div class="b-bicos" role="radiogroup" aria-label="Combustível (bico)">
      ${COMBUSTIVEIS.map(([k, n, cor]) => `<button role="radio" aria-checked="${k === b.combustivel}" data-bico="${k}" class="b-bico ${k === b.combustivel ? 'ativo' : ''}" style="--cor:${cor}">${BICO_SVG}<span>${n}</span></button>`).join('')}
    </div>
    <div class="b-extra">
      <label>Hodômetro (km)<input data-b="km" type="number" inputmode="numeric" value="${esc(b.km || '')}" placeholder="${esc(D.getEstado().veiculo.km || '')}"></label>
      <label>Data<input data-b="data" type="date" value="${esc(b.data)}"></label>
      <label class="cheio">Posto (opcional)<input data-b="posto" value="${esc(b.posto || '')}" placeholder="Nome do posto" autocomplete="off"></label>
      <label class="b-cheio cheio"><input type="checkbox" data-bcheio ${b.cheio ? 'checked' : ''}><span><b>Completei o tanque</b><small>Com o tanque cheio e o km informado, o app calcula o consumo (km/L)</small></span></label>
    </div>
    ${(() => { const c = D.consumo(), ult = b.id && c.porId[b.id];
      return c.media ? `<div class="b-consumo">${ICO.hodometro}<span>Consumo médio <b>${fmt(c.media, 1)} km/L</b>${ult ? ` · neste abastecimento <b>${fmt(ult, 1)} km/L</b>` : ''}</span></div>` : ''; })()}
    <div class="b-rod">${novo ? '' : `<button class="btn perigo" data-acao="item-excluir" data-item="abast:${b.id}">Excluir</button>`}
      <button class="btn" data-acao="fechar-modal">Cancelar</button><button class="btn pri" data-acao="salvar-bomba">${ICO.ok} Salvar abastecimento</button></div>
  </div>`, false, 'caixa-bomba');
  // o visor calcula os litros enquanto se digita
  $('.bomba').addEventListener('input', e => {
    if (e.target.matches('[data-bcheio]')) { bomba.cheio = e.target.checked; return; }
    const k = e.target.dataset.b; if (!k) return;
    bomba[k] = k === 'total' || k === 'preco' ? numero(e.target.value) : e.target.value;
    $('[data-b-litros]').textContent = fmt(litrosBomba(), 3);
  });
  // valores digitados da direita para a esquerda: total em centavos, preço do litro com 3 casas (como no visor da bomba)
  mascaraMoeda($('[data-b="total"]'), 2);
  mascaraMoeda($('[data-b="preco"]'), 3);
}
const litrosBomba = () => (+bomba.preco > 0 ? +bomba.total / +bomba.preco : 0);

// ── Ganhos como motorista de app: período (normalmente uma semana) e valor recebido ──
const isoData = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
function semana(deslocamento) {   // 0 = esta semana, -1 = semana passada (segunda a domingo)
  const d = new Date(D.hoje() + 'T12:00'); d.setDate(d.getDate() - (d.getDay() + 6) % 7 + 7 * deslocamento);
  const fim = new Date(d); fim.setDate(d.getDate() + 6);
  return [isoData(d), isoData(fim)];
}
function abrirGanho(g) {
  fecharMenus();
  const [ini, fim] = semana(-1), novo = !g;
  g ||= { inicio: ini, fim, valor: '' };
  abrirModal(`${cab(`${ICO.carteira} ${novo ? 'Lançar ganhos' : 'Editar ganhos'}`)}
    <div class="cx-corpo ganho" data-ganho="${esc(g.id || '')}">
      <p class="aviso-fonte">Quanto você recebeu como motorista de aplicativo no período (os apps fecham por semana).</p>
      <div class="ganho-atalhos"><button class="btn" data-acao="ganho-semana" data-sem="-1">Semana passada</button><button class="btn" data-acao="ganho-semana" data-sem="0">Esta semana</button></div>
      <div class="form">
        <label>Data inicial<input type="date" data-g="inicio" value="${esc(g.inicio)}"></label>
        <label>Data final<input type="date" data-g="fim" value="${esc(g.fim)}"></label>
        <label class="cheio ganho-valor">Valor recebido<span><em>R$</em><input data-g="valor" inputmode="decimal" placeholder="0,00" value="${g.valor ? fmt(g.valor, 2) : ''}" autocomplete="off"></span></label>
      </div>
    </div>
    <div class="cx-rodape">${novo ? `<button class="btn" data-livro="ganhos" style="margin-right:auto">Ver lançamentos</button>` : `<button class="btn perigo" data-acao="item-excluir" data-item="ganho:${g.id}" style="margin-right:auto">Excluir</button>`}
      <button class="btn" data-acao="fechar-modal">Cancelar</button><button class="btn pri" data-acao="salvar-ganho">Salvar</button></div>`);
  mascaraMoeda($('[data-g="valor"]'), 2);   // mesmo jeito de digitar dinheiro da bomba
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
      <div class="cfg-linha"><div><b>Hodômetro</b><small>Visual do painel superior e do painel de alertas · toque e segure no hodômetro para editar o km</small></div>
        ${seg('odometro', [['moderno', 'Moderno'], ['classico', 'Clássico']])}</div>
      <div class="cfg-linha"><div><b>Documento do veículo</b><small>Branco (CRLV novo) ou verde (antigo)</small></div>
        ${trocaDoc(c.documento)}</div>
      <div class="cfg-linha"><div><b>Pontos sobre o carro</b><small>Marcadores clicáveis de cada zona</small></div>
        ${seg('pinos', [[true, 'Mostrar'], [false, 'Ocultar']])}</div>
      <div class="secao">Backup e dados</div>
      <div class="menu-lista">
        <button data-acao="backup">${ICO.nuvem}<span>Fazer backup agora<br><small style="margin:0">no celular: escolha Google Drive (ou e-mail, WhatsApp…)</small></span><small>${c.ultimoBackup ? 'último: ' + D.dataBR(c.ultimoBackup) : 'nunca feito'}</small></button>
        <button data-acao="importar">${ICO.up}<span>Restaurar backup</span></button>
        <button data-acao="relatorio">${ICO.pdfDoc}<span>Relatório para revenda (PDF)</span></button>
        <button data-acao="exportar-csv">${ICO.lista}<span>Exportar histórico (planilha CSV)</span></button>
      </div>
      <div class="cfg-linha"><div><b>Lembrete de backup</b><small>Acende uma luz no painel quando passar do prazo</small></div>
        ${seg('backupDias', [[7, '7 dias'], [15, '15 dias'], [30, '30 dias'], [0, 'Nunca']])}</div>
      <p class="aviso-fonte" style="margin-top:10px">Os dados ficam salvos só neste aparelho. O backup reúne tudo (inclusive as fotos) num único arquivo; para restaurar, use “Restaurar backup” e escolha esse arquivo.</p>
      <div class="secao">Sobre</div>
      <div class="menu-lista"><button data-acao="novidades">${ICO.sino}<span>Novidades da versão</span><small>${VERSAO_APP}</small></button></div>
      <p class="aviso-fonte" style="margin-top:10px"><b>Lancer Club 67 · versão ${NOVIDADES[0].versao}</b><br>Mitsubishi Lancer (CY4A) · ${VEICULO_BASE.motor}. Catálogo: EPC Mitsubishi (Amayama). Manual do proprietário Lancer 2012.</p>
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

// ── Backup: um arquivo com tudo. No celular abre o "compartilhar" do Android (Google Drive, e-mail, WhatsApp…);
// no PC (ou se o compartilhamento não existir) o arquivo é baixado. ──
async function fazerBackup() {
  toast('Preparando backup…');
  let blob;
  try { blob = await D.exportarJSON(); } catch (e) { return toast('Não foi possível gerar o backup'); }
  const nome = `lancer-club-67-backup-${D.hoje()}`;
  // o Android só compartilha alguns tipos de arquivo: tenta .json e, se não der, o mesmo conteúdo como .txt
  const opcoes = [new File([blob], nome + '.json', { type: 'application/json' }), new File([blob], nome + '.txt', { type: 'text/plain' })];
  const arq = navigator.canShare && opcoes.find(f => { try { return navigator.canShare({ files: [f] }); } catch { return false; } });
  if (arq && celular()) {
    try { await navigator.share({ files: [arq], title: 'Backup Lancer Club 67' }); }
    catch (e) { if (e.name === 'AbortError') return toast('Backup cancelado'); baixar(blob, nome + '.json'); }
  } else baixar(blob, nome + '.json');
  D.atualizarConfig({ ultimoBackup: D.hoje() });
  toast('Backup feito');
  if ($('#modal .cfg')) modalConfig(); else if ($('#modal .painel-instr')) abrirAlertas();
}

// ── Relatório para revenda: página de impressão → "Salvar como PDF" do navegador ──
function modalRelatorio() {
  fecharMenus();
  abrirModal(`${cab(`${ICO.pdfDoc} Relatório para revenda`)}
    <div class="cx-corpo">
      <p class="aviso-fonte">Gera um documento com os dados do carro, a manutenção programada e todo o histórico de serviços. Na janela de impressão, escolha <b>Salvar como PDF</b>.</p>
      <div class="servs rel-opcoes">
        <label><input type="checkbox" data-rel="valores" checked> Mostrar valores pagos</label>
        <label><input type="checkbox" data-rel="consumo" checked> Mostrar consumo e abastecimentos</label>
        <label><input type="checkbox" data-rel="dono"> Mostrar nome do proprietário</label>
        <label><input type="checkbox" data-rel="placa" checked> Mostrar placa e chassi</label>
      </div>
    </div>
    <div class="cx-rodape"><button class="btn" data-acao="fechar-modal">Cancelar</button><button class="btn pri" data-acao="gerar-relatorio">${ICO.pdfDoc} Gerar PDF</button></div>`);
}
function gerarRelatorio(op) {
  const e = D.getEstado(), v = e.veiculo, regs = D.registrosOrdenados().reverse(), cons = D.consumo();
  const total = regs.reduce((s, r) => s + D.totalRegistro(r), 0), combTotal = e.abastecimentos.reduce((s, a) => s + (+a.total || 0), 0);
  const linhaDado = (k, x) => x ? `<tr><th>${k}</th><td>${esc(x)}</td></tr>` : '';
  const ordem = { vencido: 0, proximo: 1, ok: 2, 'sem-registro': 3, 'sem-intervalo': 4 };
  const rotulo = { vencido: 'Vencido', proximo: 'Vence em breve', ok: 'Em dia', 'sem-registro': 'Sem registro', 'sem-intervalo': 'Intervalo não definido' };
  const el = document.createElement('div'); el.id = 'relatorio';
  el.innerHTML = `
    <header><div><h1>Histórico de manutenção</h1><p>Mitsubishi Lancer ${esc(v.versao || 'GT')} · 2.0 Sedan (CY4A) · motor ${VEICULO_BASE.motor}</p></div>
      <div class="rel-data">Emitido em ${D.dataBR(D.hoje())}</div></header>
    <section class="rel-dados"><table>
      ${op.placa ? linhaDado('Placa', v.placa) + linhaDado('Chassi', v.chassi) : ''}
      ${linhaDado('Ano fabricação / modelo', [v.anoFab, v.anoModelo].filter(Boolean).join(' / '))}
      ${linhaDado('Cor', (CORES.find(([, c]) => c === v.cor) || [])[0])}
      ${linhaDado('Quilometragem atual', `${D.km(v.km)}${v.kmData ? ' (leitura de ' + D.dataBR(v.kmData) + ')' : ''}`)}
      ${op.dono ? linhaDado('Proprietário', v.proprietario) : ''}
    </table>
    <div class="rel-resumo"><div><b>${regs.length}</b><span>serviços registrados</span></div>
      ${regs.length ? `<div><b>${D.dataBR(regs[0].data)}</b><span>primeiro registro</span></div>` : ''}
      ${op.valores ? `<div><b>${D.brl(total)}</b><span>investido em manutenção</span></div>` : ''}
      ${op.consumo && cons.media ? `<div><b>${fmt(cons.media, 1)} km/L</b><span>consumo médio medido</span></div>` : ''}</div></section>
    <h2>Manutenção programada</h2>
    <table class="rel-tab"><thead><tr><th>Item</th><th>Intervalo</th><th>Última vez</th><th>Situação</th></tr></thead><tbody>
      ${D.lembretes().sort((a, b) => ordem[a.status] - ordem[b.status]).map(l => `<tr><td>${esc(l.nome)}</td>
        <td>${[l.km ? D.km(l.km) : '', l.meses ? l.meses + ' meses' : ''].filter(Boolean).join(' ou ') || '—'}</td>
        <td>${l.ultimo ? `${D.dataBR(l.ultimo.data)} · ${D.km(l.ultimo.km)}` : '—'}</td><td class="rel-${l.status}">${rotulo[l.status]}</td></tr>`).join('')}
    </tbody></table>
    <h2>Serviços realizados</h2>
    ${regs.length ? `<table class="rel-tab"><thead><tr><th>Data</th><th>Km</th><th>Serviço</th><th>Peças (nº original)</th><th>Oficina</th>${op.valores ? '<th class="num">Valor</th>' : ''}</tr></thead><tbody>
      ${regs.map(r => `<tr><td>${D.dataBR(r.data)}</td><td class="num">${(+r.km || 0).toLocaleString('pt-BR')}</td>
        <td><b>${esc(r.titulo || TIPOS[r.tipo])}</b><br><small>${esc(ZONA_POR_ID[r.zona]?.nome || '')}${(r.anexos || []).length ? ' · com foto/nota' : ''}</small></td>
        <td><small>${(r.pecas || []).map(p => esc(`${p.oem || ''} ${p.desc || ''}`.trim())).join('<br>') || '—'}</small></td><td>${esc(r.oficina || '—')}</td>
        ${op.valores ? `<td class="num">${D.brl(D.totalRegistro(r))}</td>` : ''}</tr>`).join('')}
    </tbody>${op.valores ? `<tfoot><tr><td colspan="5">Total</td><td class="num">${D.brl(total)}</td></tr></tfoot>` : ''}</table>` : '<p>Nenhum serviço registrado.</p>'}
    ${op.consumo && e.abastecimentos.length ? `<h2>Abastecimentos</h2><p>${e.abastecimentos.length} abastecimentos registrados${op.valores ? ` · ${D.brl(combTotal)}` : ''}${cons.media ? ` · consumo médio ${fmt(cons.media, 1)} km/L em ${D.km(cons.kmRodados)} medidos` : ''}.</p>` : ''}
    <footer>Gerado pelo app Lancer Club 67 a partir dos registros feitos pelo proprietário. Não é documento oficial; notas fiscais e fotos ficam com o proprietário.</footer>`;
  document.getElementById('relatorio')?.remove();
  document.body.appendChild(el);
  document.body.classList.add('imprimindo');
  const limpar = () => { document.body.classList.remove('imprimindo'); el.remove(); window.removeEventListener('afterprint', limpar); };
  window.addEventListener('afterprint', limpar);
  setTimeout(() => window.print(), 100);
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
// (alertas: luzes no painel superior · catálogo e manual: barra inferior)
function renderMenuVeiculo() {
  const regs = D.getEstado().registros.length, gs = D.getEstado().ganhos.length;
  const item = (aba, ico, t, s) => `<button data-livro="${aba}">${ico}<span><b>${t}</b><small>${s}</small></span></button>`;
  $('#veic-lista').innerHTML = `
    ${item('revisoes', ICO.livro, 'Livro de manutenção', 'revisões programadas')}
    ${item('historico', ICO.relogio, 'Histórico', regs ? `${regs} serviço${regs > 1 ? 's' : ''} anotado${regs > 1 ? 's' : ''}` : 'linha do tempo por ano')}
    ${item('despesas', ICO.dinheiro, 'Despesas', 'manutenção e combustível')}
    ${item('veiculo', ICO.doc, 'Dados do veículo', D.getEstado().veiculo.placa || 'documento do carro')}
    <button data-acao="ganho-novo">${ICO.carteira}<span><b>Ganhos como motorista</b><small>${gs ? `${gs} período${gs > 1 ? 's' : ''} lançado${gs > 1 ? 's' : ''}` : 'Uber, 99… por semana'}</small></span></button>`;
}
// menus suspensos: veículo (para baixo), hodômetro (para baixo), filtro e personalização (para cima)
const MENUS = { veic: ['#veic-lista', '[data-acao="menu-veiculo"]'], filtro: ['#filtro-lista', '.filtro-btn'], perso: ['#perso-lista', '[data-acao="personalizar"]'], odo: ['#odo-pop', null] };
const menuAberto = () => Object.values(MENUS).some(([l]) => !$(l).hidden);
function alternarMenu(qual) {
  const [lista, botao] = MENUS[qual], abrir = $(lista).hidden;
  fecharMenus();
  if (!abrir) return;
  if (qual === 'veic') renderMenuVeiculo();
  if (qual === 'perso') renderPerso();
  $(lista).hidden = false;
  if (botao) $(botao).setAttribute('aria-expanded', 'true');
  if (qual === 'filtro' || qual === 'perso') document.body.classList.add('filtro-aberto');
}
function fecharMenus() {
  for (const [l] of Object.values(MENUS)) $(l).hidden = true;
  document.querySelectorAll('[aria-expanded]').forEach(b => b.setAttribute('aria-expanded', 'false'));
  document.body.classList.remove('filtro-aberto');
}

// ── Personalização (barra inferior): aerofólio e cor das rodas; o resto vem depois ──
function renderPerso() {
  const c = cfg();
  $('#perso-lista').innerHTML = `
    <div class="perso-cab"><b>Personalizar</b><small>Muda só o carro 3D</small></div>
    <div class="perso-linha"><span>${ICO.aerofolio}Aerofólio</span>
      <div class="seg cfg-seg">${[[true, 'Com'], [false, 'Sem']].map(([v, t]) => `<button data-cfg="aerofolio:${v}" class="${c.aerofolio === v ? 'ativo' : ''}">${t}</button>`).join('')}</div></div>
    <div class="perso-linha"><span>${ICO.placa}Placa dianteira</span>
      <div class="seg cfg-seg">${[['original', 'Original'], ['lado', 'Lado']].map(([v, t]) => `<button data-cfg="placaDianteira:${v}" class="${c.placaDianteira === v ? 'ativo' : ''}" title="${v === 'lado' ? 'Lado do motorista, entre o farol e o farol de neblina (estilo Evo)' : 'Centro do para-choque'}">${t}</button>`).join('')}</div></div>
    <div class="perso-linha col"><span>${ICO.roda}Cor das rodas</span>
      <div class="cores">${CORES_RODAS.map(([v, n, amostra]) => `<button type="button" title="${n}" aria-label="${n}" data-cfg="corRodas:${v ?? 'null'}" class="${(c.corRodas ?? null) === v ? 'ativo' : ''}" style="background:${amostra || v}"></button>`).join('')}</div></div>
    <button class="perso-mais" data-acao="perso-mais" aria-disabled="true">${ICO.cadeado}<span>Personalizar mais peças</span><small>em breve</small></button>`;
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
// (os alertas saíram do livro: ficam nas luzes do painel superior)
const ABAS_LIVRO = [['veiculo', 'Veículo'], ['historico', 'Histórico'], ['revisoes', 'Revisões'], ['despesas', 'Despesas'], ['ganhos', 'Ganhos']];
function abrirLivrete(aba) {
  if (aba === 'alertas') return abrirAlertas();
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

// Despesas (manutenção + combustível) e ganhos: período, categoria e faixa de valor
const PERIODOS = [['30d', 'Últimos 30 dias'], ['3m', 'Últimos 3 meses'], ['12m', 'Últimos 12 meses'], ['ano', 'Este ano'], ['anoPassado', 'Ano passado'], ['tudo', 'Todo o período']];
const CATEGORIAS = [['todas', 'Tudo'], ['manutencao', 'Manutenção'], ['combustivel', 'Combustível']];
const VALORES = [['todos', 'Qualquer valor'], ['ate200', 'Até R$ 200'], ['200a1000', 'R$ 200 a R$ 1.000'], ['mais1000', 'Acima de R$ 1.000']];
const ORDENS = [['recentes', 'Mais recentes'], ['antigas', 'Mais antigas'], ['maior', 'Maior valor'], ['menor', 'Menor valor']];
// a data (aaaa-mm-dd) está dentro do período escolhido?
function noPeriodo(data, periodo) {
  const hoje = new Date(D.hoje() + 'T12:00'), ano = hoje.getFullYear(), d = new Date(data + 'T12:00');
  const ini = { '30d': new Date(hoje - 30 * 864e5), '3m': new Date(new Date(hoje).setMonth(hoje.getMonth() - 3)), '12m': new Date(new Date(hoje).setFullYear(ano - 1)),
    ano: new Date(ano, 0, 1), anoPassado: new Date(ano - 1, 0, 1), tudo: null }[periodo];
  const fim = periodo === 'anoPassado' ? new Date(ano, 0, 1) : null;
  return (!ini || d >= ini) && (!fim || d < fim);
}
// manutenções e abastecimentos no mesmo formato
function itensDespesa() {
  const e = D.getEstado(), kml = D.consumo().porId;
  return [
    ...e.registros.map(r => ({ tipo: 'reg', id: r.id, data: r.data, valor: D.totalRegistro(r), km: +r.km || 0, mao: +r.maoDeObra || 0,
      titulo: r.titulo || TIPOS[r.tipo], sub: `${ZONA_POR_ID[r.zona]?.nome || ''} · ${TIPOS[r.tipo] || ''}` })),
    ...e.abastecimentos.map(a => ({ tipo: 'abast', id: a.id, data: a.data, valor: +a.total || 0, km: +a.km || 0, comb: a.combustivel,
      titulo: `Abastecimento · ${COMB_POR_ID[a.combustivel]?.nome || a.combustivel}`,
      sub: `${fmt(a.litros, 2)} L · R$ ${fmt(a.preco, 3)}/L${kml[a.id] ? ` · ${fmt(kml[a.id], 1)} km/L` : ''}${a.cheio === false ? ' · parcial' : ''}${a.posto ? ' · ' + a.posto : ''}` })),
  ];
}
function despesasFiltradas() {
  const { periodo, valor, ordem, cat } = ui.livro.desp;
  const faixa = { todos: [0, Infinity], ate200: [0, 200], '200a1000': [200, 1000], mais1000: [1000, Infinity] }[valor];
  const tipo = { manutencao: 'reg', combustivel: 'abast' }[cat];
  const lista = itensDespesa().filter(x => (!tipo || x.tipo === tipo) && noPeriodo(x.data, periodo) && x.valor >= faixa[0] && x.valor <= faixa[1]);
  const por = { recentes: (a, b) => b.data.localeCompare(a.data) || b.km - a.km, antigas: (a, b) => a.data.localeCompare(b.data) || a.km - b.km,
    maior: (a, b) => b.valor - a.valor, menor: (a, b) => a.valor - b.valor }[ordem];
  return lista.sort(por);
}

function renderLivrete() {
  const L = ui.livro, aba = L.aba;
  fecharMenuRegistro();
  const ant = $('#livrete .l-corpo'), rolagem = ant?.dataset.aba === aba ? ant.scrollTop : 0;   // mantém a posição ao redesenhar a mesma aba
  const c = conteudoLivro[aba]();
  const corpo = c.itens ? (c.itens.length ? c.itens.join('') : c.vazio) : c.corpo;
  $('#livrete').innerHTML = `
  <div class="caderno aba-${aba}" role="dialog" aria-modal="true" aria-label="Livro de manutenção">
    <nav class="l-abas" role="tablist">${ABAS_LIVRO.map(([k, t]) => `<button role="tab" aria-selected="${k === aba}" class="l-aba ab-${k} ${k === aba ? 'ativo' : ''}" data-livro="${k}">${t}</button>`).join('')}</nav>
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

// Lançamentos do livro: "reg:id" (manutenção), "abast:id" (abastecimento), "ganho:id"
function buscarItem(chave) {
  const [tipo, id] = chave.split(':'), e = D.getEstado();
  return { tipo, obj: { reg: e.registros, abast: e.abastecimentos, ganho: e.ganhos }[tipo]?.find(x => x.id === id) };
}
// Menu suspenso de um lançamento do histórico/despesas/ganhos: ver mais (manutenção), editar, excluir
function abrirMenuItem(chave, el) {
  const aberto = $('#menu-reg');
  fecharMenuRegistro();
  if (aberto?.dataset.id === chave) return;   // segundo toque no mesmo item fecha
  const { tipo, obj } = buscarItem(chave); if (!obj) return;
  const m = document.createElement('div');
  m.id = 'menu-reg'; m.className = 'menu-reg'; m.dataset.id = chave; m.setAttribute('role', 'menu');
  m.innerHTML = `${tipo === 'reg' ? `<button role="menuitem" data-acao="item-ver" data-item="${chave}">${ICO.olho}<span>Ver mais</span></button>` : ''}
    <button role="menuitem" data-acao="item-editar" data-item="${chave}">${ICO.lapis}<span>Editar</span></button>
    <button role="menuitem" class="perigo" data-acao="item-excluir" data-item="${chave}">${ICO.lixo}<span>Excluir</span></button>`;
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
      ${(r.anexos || []).length ? `<div class="secao">Fotos e notas fiscais</div><div class="anexos">${r.anexos.map(id => `<span class="anexo"><img data-anexo="${id}" data-ver-foto="${id}" alt="Foto anexada"></span>`).join('')}</div>` : ''}
    </div>
    <div class="cx-rodape"><button class="btn perigo" data-acao="item-excluir" data-item="reg:${r.id}" style="margin-right:auto">Excluir</button><button class="btn" data-acao="fechar-modal">Fechar</button><button class="btn pri" data-editar="${r.id}">Editar</button></div>`);
  Anexos.hidratar($('#modal'));
}
// Balão temporário sobre um campo (ex.: data da leitura do hodômetro)
function mostrarBalao(el, texto, abaixo = false) {
  el.querySelector('.balao')?.remove();
  const b = document.createElement('span'); b.className = 'balao' + (abaixo ? ' abaixo' : ''); b.textContent = texto; el.appendChild(b);
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
      if (aberto) rs.forEach((r, i) => itens.push(`<button class="l-evento ${i === rs.length - 1 ? 'ultimo' : ''}" data-item="reg:${r.id}" aria-haspopup="menu">
        <span class="l-data">${D.dataBR(r.data).slice(0, 5)}</span>
        <span class="l-txt"><b>${esc(r.titulo || TIPOS[r.tipo])}</b><small>${esc(ZONA_POR_ID[r.zona]?.nome || '')} · ${D.km(r.km)}${r.oficina ? ' · ' + esc(r.oficina) : ''}</small></span>
        <span class="l-valor">${D.brl(D.totalRegistro(r))}</span></button>`));
    }
    return {
      titulo: 'Histórico', sub: regs.length ? `${regs.length} serviço${regs.length > 1 ? 's' : ''} · toque no ano para abrir ou fechar · toque num serviço para ver, editar ou excluir` : 'Linha do tempo por ano',
      itens, vazio: '<div class="mao-vazio">Nenhum serviço anotado ainda.<br>Comece pela última troca de óleo!</div>',
      acoes: `${regs.length ? '<button data-acao="relatorio">Relatório PDF</button>' : ''}<button class="pri" data-acao="novo-registro">+ Anotar serviço</button>`,
    };
  },
  despesas() {
    const d = ui.livro.desp, itens = despesasFiltradas(), cons = D.consumo();
    const soma = f => itens.filter(f).reduce((s, x) => s + x.valor, 0);
    const total = soma(() => true), comb = soma(x => x.tipo === 'abast'), mao = itens.reduce((s, x) => s + (x.mao || 0), 0), pecas = total - comb - mao;
    const kms = itens.map(x => x.km).filter(Boolean), rodado = kms.length > 1 ? Math.max(...kms) - Math.min(...kms) : 0;
    const sel = (nome, ops, v) => `<label class="l-sel"><select data-desp="${nome}">${ops.map(([k, t]) => `<option value="${k}" ${k === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>`;
    const pct = v => (total ? (v / total * 100).toFixed(1) : 0);
    const temAlgo = D.getEstado().registros.length || D.getEstado().abastecimentos.length;
    return {
      titulo: 'Despesas', sub: 'Manutenção (peças e mão de obra) e combustível · toque num lançamento para editar',
      ferramentas: `<div class="l-filtros">${sel('periodo', PERIODOS, d.periodo)}${sel('cat', CATEGORIAS, d.cat)}${sel('valor', VALORES, d.valor)}${sel('ordem', ORDENS, d.ordem)}</div>`,
      topo: `<div class="l-resumo">
        <div><b>${D.brl(total)}</b><small>${itens.length} lançamento${itens.length === 1 ? '' : 's'}</small></div>
        <div><b>${rodado ? D.brl(total / rodado) : '—'}</b><small>custo por km</small></div>
        <div><b>${cons.media ? fmt(cons.media, 1) + ' km/L' : '—'}</b><small>${cons.media ? `consumo médio · ${D.brl(cons.custoKm)}/km` : 'consumo: complete o tanque 2× com km'}</small></div>
        <div class="l-barra"><span><i class="pecas" style="width:${pct(pecas)}%"></i><i class="mao" style="width:${pct(mao)}%"></i><i class="comb" style="width:${pct(comb)}%"></i></span>
          <small><i class="pecas"></i>peças ${D.brl(pecas)} · <i class="mao"></i>mão de obra ${D.brl(mao)} · <i class="comb"></i>combustível ${D.brl(comb)}</small></div></div>`,
      itens: itens.map(x => `<button class="l-desp ${x.tipo === 'abast' ? 'abast' : ''}" data-item="${x.tipo}:${x.id}" aria-haspopup="menu" ${x.comb ? `style="--cor:${COMB_POR_ID[x.comb]?.cor}"` : ''}>
        <span class="l-data">${D.dataBR(x.data)}</span>
        <span class="l-txt"><b>${esc(x.titulo)}</b><small>${esc(x.sub)}</small></span>
        <b class="l-valor">${D.brl(x.valor)}</b></button>`),
      vazio: `<div class="mao-vazio">Nenhuma despesa ${temAlgo ? 'com estes filtros' : 'anotada ainda'}.</div>`,
      acoes: `<button data-acao="abastecer">+ Abastecimento</button>${temAlgo ? '<button data-acao="exportar-csv">Exportar planilha</button>' : ''}`,
    };
  },
  ganhos() {
    const per = ui.livro.ganhosPeriodo;
    const gs = D.ganhosOrdenados().filter(g => noPeriodo(g.fim || g.inicio, per));
    const ganho = gs.reduce((s, g) => s + (+g.valor || 0), 0);
    const gasto = itensDespesa().filter(x => noPeriodo(x.data, per)).reduce((s, x) => s + x.valor, 0), saldo = ganho - gasto;
    const dias = g => Math.max(1, Math.round((new Date(g.fim) - new Date(g.inicio)) / 864e5) + 1);
    return {
      titulo: 'Ganhos', sub: 'Motorista de aplicativo · saldo = ganhos − gastos com o carro no mesmo período',
      ferramentas: `<div class="l-filtros"><label class="l-sel"><select data-ganhos="periodo">${PERIODOS.map(([k, t]) => `<option value="${k}" ${k === per ? 'selected' : ''}>${t}</option>`).join('')}</select></label></div>`,
      topo: `<div class="l-resumo ganhos">
        <div><b class="pos">${D.brl(ganho)}</b><small>ganhos · ${gs.length} período${gs.length === 1 ? '' : 's'}</small></div>
        <div><b>${D.brl(gasto)}</b><small>gastos com o carro</small></div>
        <div><b class="${saldo >= 0 ? 'pos' : 'neg'}">${D.brl(saldo)}</b><small>saldo no período</small></div></div>`,
      itens: gs.map(g => `<button class="l-ganho" data-item="ganho:${g.id}" aria-haspopup="menu">
        <span class="l-txt"><b>${D.dataBR(g.inicio).slice(0, 5)} a ${D.dataBR(g.fim)}</b><small>${dias(g)} dia${dias(g) > 1 ? 's' : ''} · ${D.brl((+g.valor || 0) / dias(g))}/dia</small></span>
        <b class="l-valor">${D.brl(g.valor)}</b></button>`),
      vazio: `<div class="mao-vazio">Nenhum ganho ${D.getEstado().ganhos.length ? 'neste período' : 'lançado ainda'}.<br>Lance o valor de cada semana.</div>`,
      acoes: `<button class="pri" data-acao="ganho-novo">+ Lançar ganhos</button>`,
    };
  },
  veiculo() {
    const v = D.getEstado().veiculo, ed = ui.livro.editando, estilo = cfg().documento;
    const corNome = (CORES.find(([, c]) => c === (ui.livro.cor || v.cor)) || ['—'])[0];
    // opcoes = lista de seleção (ex.: UF), cada uma 'valor' ou ['valor', 'texto']; vazio = sem a opção "—"
    // balao = texto mostrado ao tocar no campo fora da edição
    const campo = (rot, nome, { cls = '', valor, ph = '', tipo = 'text', opcoes, balao, vazio = true } = {}) => {
      if (ed && nome) {
        const ctl = opcoes ? `<select name="${nome}">${vazio ? '<option value="">—</option>' : ''}${opcoes.map(o => { const [val, txt] = [].concat(o, o).slice(0, 2);
          return `<option value="${esc(val)}" ${val === v[nome] ? 'selected' : ''}>${esc(txt)}</option>`; }).join('')}</select>`
          : `<input name="${nome}" type="${tipo}" value="${esc(v[nome] ?? '')}" placeholder="${ph}" autocomplete="off" ${tipo === 'number' ? 'inputmode="numeric"' : ''}>`;
        return `<label class="d-campo ${cls}"><span class="d-rot">${rot}</span>${ctl}</label>`;
      }
      return `<div class="d-campo ${cls}" ${balao ? `data-balao="${esc(balao)}" role="button" tabindex="0"` : ''}><span class="d-rot">${rot}</span><span class="d-val">${esc(valor ?? (v[nome] || '—'))}</span></div>`;
    };
    return {
      titulo: 'Veículo', sub: `Mitsubishi Lancer ${v.versao || 'GT'} · 2.0 Sedan (CY4A)`,
      ferramentas: trocaDoc(estilo),
      corpo: `<div class="doc doc-${estilo} ${ed ? 'editando' : ''}" data-doc>
        <div class="d-topo"><div><b>Ficha do veículo</b><small>Visual inspirado no CRLV · sem valor de documento</small></div><img src="marca/icone-192.png" alt=""></div>
        <div class="d-grade">
          ${campo('Código Renavam', 'renavam', { cls: 'mono', ph: '11 dígitos' })}
          ${campo('Placa', 'placa', { cls: 'mono destaque', ph: 'ABC1D23' })}
          ${campo('Exercício', 'exercicio', { ph: String(new Date().getFullYear()) })}
          ${campo('Ano fabricação', 'anoFab', { ph: '2012' })}
          ${campo('Ano modelo', 'anoModelo', { ph: '2013' })}
          ${campo('Nome', 'proprietario', { cls: 'largo', ph: 'Proprietário (opcional)' })}
          ${campo('Categoria', 'categoria')}
          ${campo('Chassi', 'chassi', { cls: 'largo mono', ph: '17 caracteres' })}
          ${campo('Marca / Modelo / Versão', 'versao', { cls: 'largo', valor: nomeVersao(v), vazio: false, opcoes: VERSOES.map(x => [x, nomeVersao({ versao: x })]) })}
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
          ${campo('Produção (aaaa.mm)', 'producao', { ph: '2012.05', valor: v.producao || '—' })}
          <div class="d-campo"><span class="d-rot">Cor no 3D</span><div class="cores">${CORES.map(([n, c]) => `<button type="button" title="${n}" ${ed ? `data-cor="${c}"` : 'disabled'} class="${(ui.livro.cor || v.cor) === c ? 'ativo' : ''}" style="background:${c}"></button>`).join('')}</div></div>
        </div>
      </div>
      <div class="venc"><div class="venc-tit">Vencimentos <small>acendem no painel de alertas 30 dias antes</small></div>
        ${statusDocumentos().map(d => `<button class="l-card venc-card st-borda-${d.status}" data-doc="${d.doc}">
          <span class="l-ico">${DOCS_POR_ID[d.doc].ico}</span>
          <span class="l-txt"><b>${d.nome}</b><small>${!d.venc ? 'toque para cadastrar o vencimento' : d.status === 'ok' ? `vence em ${D.dataBR(d.venc)}` : textoAlerta({ ...d, tipo: 'doc' })}${d.seguradora ? ' · ' + esc(d.seguradora) : ''}${d.valor ? ' · ' + D.brl(d.valor) : ''}</small></span>
          ${carimboDoc(d.status)}</button>`).join('')}
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
  if (!e.target.closest('#veic, #filtro, #odo-caixa') && menuAberto()) fecharMenus();
  if ($('#menu-reg') && !e.target.closest('#menu-reg') && !e.target.closest('[data-item]')) fecharMenuRegistro();
  const t = e.target.closest('[data-passo],[data-acao],[data-aba],[data-grupo],[data-esq],[data-peca],[data-filtro],[data-livro],[data-item],[data-ano],[data-balao],[data-cfg],[data-bico],[data-doc],[data-ver-foto],[data-rmfoto],[data-pino],[data-zona],[data-editar],[data-trocar],[data-servico],[data-copiar],[data-rmpeca],[data-sugpeca],[data-cor],[data-sec]');
  if (!t) {
    if (e.target.id === 'modal') fecharModal();
    else if (e.target.id === 'livrete') fecharLivrete();   // toque fora do caderno
    return;
  }
  const ds = t.dataset;
  if (ds.passo) return passoRegiao(+ds.passo);
  if (ds.filtro) return setFiltro(ds.filtro);
  if (ds.livro) { if (ui.livro.editando) cancelarEdicaoVeiculo(); return abrirLivrete(ds.livro); }
  if (ds.item && !ds.acao) return abrirMenuItem(ds.item, t);
  if (ds.ano) { const a = ui.livro.anos; a.has(ds.ano) ? a.delete(ds.ano) : a.add(ds.ano); return renderLivrete(); }
  if (ds.balao) return mostrarBalao(t, ds.balao);
  if (ds.cfg) {
    const [k, v] = ds.cfg.split(':'), val = v === 'true' ? true : v === 'false' ? false : v === 'null' ? null : /^\d+$/.test(v) ? +v : v;
    D.atualizarConfig({ [k]: val });
    if (k === 'tema') aplicarTema();
    if (k === 'pinos') $('#pinos').hidden = !val;
    if (['aerofolio', 'corRodas', 'placaDianteira'].includes(k)) { carro.setPersonalizacao(cfg()); renderPerso(); }
    if ($('#modal .cfg')) modalConfig();
    if ($('#modal .painel-instr')) abrirAlertas();
    return;
  }
  if (ds.bico) {   // trocar de bico = trocar de combustível (sugere o último preço pago nele)
    const ult = D.abastecimentosOrdenados().find(x => x.combustivel === ds.bico);
    if (bomba.combustivel !== ds.bico && ult && !bomba.id) { bomba.preco = ult.preco; bomba.posto ||= ult.posto || ''; }
    bomba.combustivel = ds.bico; return renderBomba();
  }
  if (ds.doc) return modalDocumento(ds.doc);
  if (ds.verFoto) return verFoto(ds.verFoto);
  if (ds.rmfoto) {
    const id = ds.rmfoto;
    rascunho.anexos = rascunho.anexos.filter(x => x !== id);
    if (rascunho._novos?.includes(id)) { Anexos.excluir(id).catch(() => {}); rascunho._novos = rascunho._novos.filter(x => x !== id); }
    else (rascunho._removidos ||= []).push(id);   // foto já salva: só some de vez quando o registro for salvo
    return renderFotosForm();
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
    case 'alertas': return abrirAlertas();
    case 'novidades': return modalNovidades();
    case 'backup': case 'exportar': return fazerBackup();
    case 'relatorio': return modalRelatorio();
    case 'gerar-relatorio': {
      const op = Object.fromEntries([...document.querySelectorAll('[data-rel]')].map(i => [i.dataset.rel, i.checked]));
      fecharModal(); return gerarRelatorio(op);
    }
    case 'doc-salvar': case 'doc-renovar': case 'doc-limpar': {
      const f = $('[data-docform]'), k = f.dataset.docform, campos = {};
      f.querySelectorAll('input[name]').forEach(i => { campos[i.name] = i.name === 'valor' ? (numero(i.value) || '') : i.value.trim(); });
      if (ds.acao === 'doc-limpar') campos.venc = '';
      if (ds.acao === 'doc-renovar') { const d = new Date(campos.venc + 'T12:00'); d.setFullYear(d.getFullYear() + 1); campos.venc = isoData(d); }
      if (ds.acao === 'doc-salvar' && !campos.venc) return toast('Informe a data de vencimento');
      D.atualizarDocumento(k, campos); fecharModal();
      return toast(ds.acao === 'doc-renovar' ? `Renovado até ${D.dataBR(campos.venc)}` : ds.acao === 'doc-limpar' ? 'Data removida' : 'Vencimento salvo');
    }
    case 'personalizar': return alternarMenu('perso');
    case 'perso-mais': return mostrarBalao(t, 'Disponível em breve');
    case 'salvar-odo': {
      const km = +$('[data-odo-km]').value;
      if (!km) return toast('Informe a quilometragem');
      D.atualizarVeiculo({ km, kmData: D.hoje() }); fecharMenus(); return toast('Hodômetro atualizado');
    }
    case 'abastecer': fecharModal(); return abrirBomba();
    case 'salvar-bomba': {
      if (!(+bomba.total > 0)) return toast('Informe o total pago');
      if (!(+bomba.preco > 0)) return toast('Informe o preço do litro');
      if (!bomba.data) return toast('Informe a data');
      bomba.litros = +litrosBomba().toFixed(3);
      bomba.km = +bomba.km || '';
      bomba.posto = (bomba.posto || '').trim();
      D.salvarAbastecimento(bomba); fecharModal();
      return toast(`Abastecimento salvo · ${fmt(bomba.litros, 2)} L`);
    }
    case 'ganho-novo': fecharModal(); return abrirGanho();
    case 'ganho-semana': {
      const [ini, fim] = semana(+ds.sem);
      $('[data-g="inicio"]').value = ini; $('[data-g="fim"]').value = fim; return;
    }
    case 'salvar-ganho': {
      const val = k => $(`[data-g="${k}"]`).value, g = { id: $('[data-ganho]').dataset.ganho || undefined, inicio: val('inicio'), fim: val('fim'), valor: numero(val('valor')) };
      if (!g.inicio || !g.fim) return toast('Informe as duas datas');
      if (g.fim < g.inicio) return toast('A data final é antes da inicial');
      if (!(g.valor > 0)) return toast('Informe o valor recebido');
      D.salvarGanho(g); fecharModal(); return toast('Ganhos salvos');
    }
    case 'item-ver': case 'item-editar': case 'item-excluir': {
      fecharMenuRegistro();
      const { tipo, obj } = buscarItem(ds.item); if (!obj) return;
      if (ds.acao === 'item-ver') return modalDetalheRegistro(obj);
      if (ds.acao === 'item-editar') return tipo === 'reg' ? modalRegistro(obj) : tipo === 'abast' ? abrirBomba(obj) : abrirGanho(obj);
      const nome = tipo === 'reg' ? `“${obj.titulo || TIPOS[obj.tipo]}” de ${D.dataBR(obj.data)}` : tipo === 'abast' ? `o abastecimento de ${D.dataBR(obj.data)}` : `os ganhos de ${D.dataBR(obj.inicio)} a ${D.dataBR(obj.fim)}`;
      if (!confirm(`Excluir ${nome}? Esta ação não pode ser desfeita.`)) return;
      ({ reg: D.excluirRegistro, abast: D.excluirAbastecimento, ganho: D.excluirGanho })[tipo](obj.id);
      fecharModal(); return toast('Lançamento excluído');
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
      const removidas = rascunho._removidos || [];
      delete rascunho.servicoFixo; delete rascunho._novos; delete rascunho._removidos;
      if (!rascunho.anexos?.length) delete rascunho.anexos;
      D.salvarRegistro(rascunho); fecharModal(); toast('Registro salvo');
      if (removidas.length) Anexos.excluir(removidas).catch(() => {});
      if (ui.zona === rascunho.zona) { ui.aba = 'historico'; renderPainel(); }
      return;
    }
    case 'excluir-registro':
      if (confirm('Excluir este registro? Esta ação não pode ser desfeita.')) { D.excluirRegistro(rascunho.id); fecharModal(); toast('Registro excluído'); }
      return;
    case 'salvar-veiculo': {
      const dados = {};
      $('[data-doc]').querySelectorAll('input[name], select[name]').forEach(i => { dados[i.name] = i.type === 'number' ? +i.value || 0 : i.value.trim(); });
      if (dados.producao && !/^\d{4}\.\d{2}$/.test(dados.producao)) return toast('Data de produção no formato aaaa.mm');
      for (const k of ['placa', 'chassi', 'combustivel', 'categoria', 'uf', 'motorNum']) if (dados[k]) dados[k] = dados[k].toUpperCase();
      if (ui.livro.cor) dados.cor = ui.livro.cor;
      ui.livro.cor = null; ui.livro.editando = false;
      D.atualizarVeiculo(dados); atualizarPlaca(); toast('Veículo atualizado'); return;
    }
    case 'lembretes': return modalLembretes();
    case 'salvar-lembretes':
      document.querySelectorAll('[data-lkm]').forEach(i => D.ajustarLembrete(i.dataset.lkm, +i.value || null, +$(`[data-lmes="${i.dataset.lkm}"]`).value || null));
      toast('Intervalos salvos'); return modalLembretes();
    case 'catalogo': fecharMenus(); return modalCatalogo();
    case 'exportar-csv': return baixar(D.exportarCSV(), `lancer-club-67-historico-${D.hoje()}.csv`);
    case 'importar': {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,.txt,application/json,text/plain';
      inp.onchange = async () => {
        try { const txt = await inp.files[0].text(); if (!confirm('Substituir os dados atuais pelos do backup?')) return; toast('Restaurando…'); await D.importarJSON(txt); carro.setCor(D.getEstado().veiculo.cor); atualizarPlaca(); carro.setPersonalizacao(cfg()); aplicarTema(); $('#pinos').hidden = !cfg().pinos; fecharModal(); toast('Backup restaurado'); }
        catch (err) { toast(err.message); }
      };
      return inp.click();
    }
  }
}
// filtros de despesas e de ganhos (selects do livro)
function onTroca(e) {
  const { desp, ganhos } = e.target.dataset;
  if (desp) ui.livro.desp[desp] = e.target.value;
  else if (ganhos) ui.livro.ganhosPeriodo = e.target.value;
  else return;
  renderLivrete();
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
