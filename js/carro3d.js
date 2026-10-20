// Lancer GT (CY4A) procedural em three.js. Medidas do manual (10-2): 4570 × 1760 × 1490 mm, entre-eixos 2635, bitola 1530.
// Eixos: x = frente, y = cima, z = lado direito. Cada malha tem userData.zona; zonas têm "movers" (abre/explode ao selecionar).
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const V3 = THREE.Vector3;
const L = 2.285, A = 0.88;                   // meio comprimento, meia largura
const AXF = 1.33, AXR = -1.305;              // eixos dianteiro / traseiro
const WR = 0.325, TRK = 0.765;               // raio do pneu 215/45R18, meia bitola
const XCF = 1.80, XCR = -1.83;               // início das curvas da dianteira / traseira (vista de cima)
const AF = L - XCF, AR = L + XCR, NP = 2.7;   // superelipse da planta
const R_OMBRO = 0.07, KTOP = 1 - R_OMBRO / A;
const ARCO_R = 0.405, ARCO_Y = 0.33;

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const cosMap = v => 0.5 - 0.5 * Math.cos(Math.PI * v);   // concentra amostras nas bordas

// Interpolação cúbica monotônica (Fritsch–Carlson) por pontos [x, y]
function curva(pts) {
  const n = pts.length, xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const d = [], m = new Array(n);
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  return x => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0; while (x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
}

// Perfil lateral
const topo = curva([[-2.29, 0.95], [-2.24, 1.045], [-2.05, 1.072], [-1.55, 1.07], [-1.0, 1.04], [0.0, 1.0], [0.95, 0.985], [1.5, 0.885], [2.0, 0.785], [2.2, 0.72], [2.29, 0.66]]);
const baseInf = curva([[-2.29, 0.36], [-2.22, 0.25], [-2.05, 0.215], [-1.85, 0.205], [1.85, 0.2], [2.1, 0.215], [2.29, 0.27]]);
const tetoLinha = curva([[-1.55, 1.07], [-1.25, 1.27], [-0.85, 1.435], [-0.35, 1.49], [0.02, 1.462], [0.45, 1.24], [0.95, 0.985]]);
const coroa = curva([[-2.3, 0.02], [-1.55, 0.03], [-0.85, 0.05], [0.02, 0.05], [0.95, 0.035], [2.3, 0.02]]);
function baseLateral(x) {
  let y = baseInf(x);
  for (const ax of [AXF, AXR]) {
    const dx = x - ax;
    if (Math.abs(dx) < ARCO_R) y = Math.max(y, ARCO_Y + Math.sqrt(ARCO_R * ARCO_R - dx * dx));
  }
  return y;
}
// Seção: ombro arredondado no topo e "tuck" na base
function kSec(y, T, B) {
  let k = 1;
  if (y > T - R_OMBRO) { const q = clamp((y - (T - R_OMBRO)) / R_OMBRO, 0, 1); k -= (R_OMBRO / A) * (1 - Math.sqrt(1 - q * q)); }
  const tk = 0.14; if (y < B + tk) { const q = (B + tk - y) / tk; k -= 0.045 * q * q; }
  return k;
}
const inclinaFrente = y => 1 - 0.22 * sstep(0, 1, (0.58 - y) / 0.34);   // "shark nose": parte de baixo recua
const inclinaTras = y => 1 - 0.06 * sstep(0, 1, (0.42 - y) / 0.2);
// meia largura do topo (superelipse da planta, escalada pelo ombro)
function larguraTopo(x) {
  const k = KTOP;
  if (x > XCF) { const u = clamp((x - XCF) / (AF * k), 0, 1); return A * k * Math.pow(1 - Math.pow(u, NP), 1 / NP); }
  if (x < XCR) { const u = clamp((XCR - x) / (AR * k), 0, 1); return A * k * Math.pow(1 - Math.pow(u, NP), 1 / NP); }
  return A * k;
}
const tumble = h => 1 - 0.2 * Math.pow(clamp(h / 0.47, 0, 1.2), 1.25);   // vidros inclinados para dentro
const larguraEstufa = (x, y) => A * KTOP * tumble(y - topo(x));

// ── Geometria paramétrica ──────────────────────────────────
function superficie(nu, nv, fn, fora) {
  const pos = new Float32Array((nu + 1) * (nv + 1) * 3), uvs = new Float32Array((nu + 1) * (nv + 1) * 2), p = new V3();
  let k = 0, m = 0;
  for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
    fn(i / nu, j / nv, p); pos[k++] = p.x; pos[k++] = p.y; pos[k++] = p.z; uvs[m++] = i / nu; uvs[m++] = j / nv;
  }
  const idx = [];
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1; idx.push(a, b, d, a, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  g.setIndex(idx); g.computeVertexNormals();
  if (fora) { // garante normais para fora
    const n = g.attributes.normal, P = g.attributes.position; let s = 0;
    for (let i = 0; i < n.count; i += 7) { const c = new V3().fromBufferAttribute(P, i); s += new V3().fromBufferAttribute(n, i).dot(fora(c)); }
    if (s < 0) { for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; } g.setIndex(idx); g.computeVertexNormals(); }
  }
  return g;
}

// Painel lateral entre x0..x1 (s = +1 direito, -1 esquerdo). yLo/yHi limitam a faixa; off desloca para fora.
function painelLateral(x0, x1, s, { yLo = -9, yHi = 9, off = 0, nu = 40, nv = 22, loFn, hiFn } = {}) {
  return superficie(nu, nv, (u, v, p) => {
    const x = lerp(x0, x1, u), T = topo(x), B = baseLateral(x);
    const lo = Math.max(B, loFn ? loFn(x) : yLo), hi = Math.max(lo, Math.min(T, hiFn ? hiFn(x) : yHi));
    const y = lerp(lo, hi, cosMap(v));
    p.set(x, y, s * (A * kSec(y, T, B) + off));
  }, () => new V3(0, 0, s));
}
// Ponto das tampas curvas (frente/traseira) em ângulo phi ∈ [-π/2, π/2]
function pontoTampa(frente, phi, y, off = 0, alvo = new V3()) {
  const xc = frente ? XCF : XCR, a = frente ? AF : AR, dir = frente ? 1 : -1;
  const c = Math.cos(phi), sn = Math.sin(phi);
  const ex = a * Math.pow(Math.abs(c), 2 / NP), zp = A * Math.sign(sn) * Math.pow(Math.abs(sn), 2 / NP);
  const T = topo(xc + dir * ex * KTOP), B = baseInf(xc + dir * ex);
  const k = kSec(y, T, B), inc = frente ? inclinaFrente(y) : inclinaTras(y);
  const nx = Math.pow(Math.abs(c), 1), nz = Math.abs(sn);   // aproximação da normal para o deslocamento
  return alvo.set(xc + dir * (ex * k * inc + off * nx), y, zp * k + Math.sign(sn) * off * nz);
}
function faixaTampa(frente, phi) {
  const xc = frente ? XCF : XCR, a = frente ? AF : AR, dir = frente ? 1 : -1;
  const ex = a * Math.pow(Math.abs(Math.cos(phi)), 2 / NP);
  return [baseInf(xc + dir * ex), topo(xc + dir * ex * KTOP)];
}
function painelTampa(frente, phi0, phi1, { yLo = -9, yHi = 9, off = 0, phiFn, nu = 44, nv = 22, loFn, hiFn } = {}) {
  const xc = frente ? XCF : XCR;
  return superficie(nu, nv, (u, v, p) => {
    const phi = phiFn ? phiFn(u, v) : lerp(phi0, phi1, u);
    const [B, T] = faixaTampa(frente, phi);
    const lo = Math.max(B, loFn ? loFn(phi) : yLo), hi = Math.max(lo, Math.min(T, hiFn ? hiFn(phi) : yHi));
    pontoTampa(frente, phi, lerp(lo, hi, cosMap(v)), off, p);
  }, c => new V3(c.x - xc, 0, c.z));
}
// Superfície superior (capô, teto, tampa) com coroa
function painelTopo(x0, x1, yFn, hwFn, { t0 = -1, t1 = 1, off = 0, nu = 40, nv = 24, ease } = {}) {
  return superficie(nu, nv, (u, v, p) => {
    const uu = ease === 'fim' ? Math.sin(u * Math.PI / 2) : ease === 'inicio' ? 1 - Math.cos(u * Math.PI / 2) : u;
    const x = lerp(x0, x1, uu), t = lerp(t0, t1, v);
    p.set(x, yFn(x) + coroa(x) * (1 - t * t) + off, t * hwFn(x));
  }, () => new V3(0, 1, 0));
}
// Lateral da estufa (colunas/vidros) entre topo(x) e tetoLinha(x)
function painelEstufa(x0, x1, s, { insetBaixo = 0, insetCima = 0, off = 0, nu = 36, nv = 16 } = {}) {
  return superficie(nu, nv, (u, v, p) => {
    const x = lerp(x0, x1, u), b = topo(x) + insetBaixo, t = Math.max(b, tetoLinha(x) - insetCima);
    const y = lerp(b, t, v);
    p.set(x, y, s * (larguraEstufa(x, y) + off));
  }, () => new V3(0, 0, s));
}

// ── Materiais ──────────────────────────────────────────────
function materiais(cor) {
  const pintura = new THREE.MeshPhysicalMaterial({ color: cor, metalness: 0.55, roughness: 0.33, clearcoat: 1, clearcoatRoughness: 0.06 });
  return {
    pintura,
    preto: new THREE.MeshStandardMaterial({ color: 0x121315, roughness: 0.55, metalness: 0.1 }),
    pretoBrilho: new THREE.MeshPhysicalMaterial({ color: 0x0a0a0b, roughness: 0.2, metalness: 0.2, clearcoat: 0.6 }),
    vidro: new THREE.MeshPhysicalMaterial({ color: 0x0c1218, roughness: 0.04, metalness: 0.3, transparent: true, opacity: 0.62 }),
    lente: new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.04, metalness: 0.1, transparent: true, opacity: 0.32 }),
    pisca: new THREE.MeshPhysicalMaterial({ color: 0xd9800f, roughness: 0.15, transparent: true, opacity: 0.8 }),
    espelho: new THREE.MeshStandardMaterial({ color: 0xd5dbe0, metalness: 1, roughness: 0.04 }),
    placa: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.45, side: THREE.DoubleSide }),
    cromo: new THREE.MeshStandardMaterial({ color: 0xe6e8ea, metalness: 1, roughness: 0.12 }),
    farol: new THREE.MeshPhysicalMaterial({ color: 0xc9d3dd, metalness: 0.9, roughness: 0.12, clearcoat: 1, emissive: 0x2a3a4c }),
    lanterna: new THREE.MeshPhysicalMaterial({ color: 0x8c0a10, roughness: 0.12, metalness: 0.1, clearcoat: 1, emissive: 0x2a0004 }),
    pneu: new THREE.MeshStandardMaterial({ color: 0x161616, roughness: 0.9 }),
    roda: new THREE.MeshStandardMaterial({ color: 0xa3a9b0, metalness: 0.9, roughness: 0.26 }),
    disco: new THREE.MeshStandardMaterial({ color: 0x7c7f83, metalness: 0.85, roughness: 0.42 }),
    pinca: new THREE.MeshStandardMaterial({ color: 0x3b3e42, metalness: 0.5, roughness: 0.5 }),
    aluminio: new THREE.MeshStandardMaterial({ color: 0x9aa1a8, metalness: 0.75, roughness: 0.42 }),
    ferro: new THREE.MeshStandardMaterial({ color: 0x4a4d52, metalness: 0.7, roughness: 0.55 }),
    tampaValv: new THREE.MeshStandardMaterial({ color: 0x24272b, metalness: 0.4, roughness: 0.45 }),
    radiador: new THREE.MeshStandardMaterial({ color: 0x2e3236, metalness: 0.6, roughness: 0.5 }),
    escape: new THREE.MeshStandardMaterial({ color: 0x77695e, metalness: 0.8, roughness: 0.5 }),
    mola: new THREE.MeshStandardMaterial({ color: 0x2c5f8a, metalness: 0.5, roughness: 0.45 }),
    amortecedor: new THREE.MeshStandardMaterial({ color: 0xb0b5bb, metalness: 0.9, roughness: 0.3 }),
    tanque: new THREE.MeshStandardMaterial({ color: 0x25282c, roughness: 0.6, metalness: 0.2 }),
    tecido: new THREE.MeshStandardMaterial({ color: 0x2b2d31, roughness: 0.92 }),
    painelInt: new THREE.MeshStandardMaterial({ color: 0x1d1f22, roughness: 0.7 }),
    bateria: new THREE.MeshStandardMaterial({ color: 0x1f2a36, roughness: 0.5 }),
    vermelho: new THREE.MeshStandardMaterial({ color: 0xc8102e, roughness: 0.4 }),
    mangueira: new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.8 }),
    interior: new THREE.MeshStandardMaterial({ color: 0x17181a, roughness: 0.9, side: THREE.BackSide }),
  };
}

export class Carro3D {
  constructor(container, { cor = '#8d9399', aoSelecionar, aoPassar } = {}) {
    this.container = container;
    this.aoSelecionar = aoSelecionar || (() => {});
    this.aoPassar = aoPassar || (() => {});
    this.zonas = {};          // id → { meshes: [], movers: [], centro: V3 }
    this.selecionada = null; this.instSel = null; this.hover = null; this.raioX = false;
    this.anim = [];           // { obj, base: {pos, rot}, alvo: 0..1, t }
    this.M = materiais(cor);
    this._init();
    this.visaoGeral(true);
    this._loop = this._loop.bind(this);
    this.pronto = this._construir();   // carrega o modelo (assíncrono)
    this.pronto.then(() => { if (!this._rodando && !this.pausado) requestAnimationFrame(this._loop); });
  }

  _init() {
    const r = this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));   // acima disso o celular só gasta bateria
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.08;
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(r.domElement);
    const cena = this.cena = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(r);
    cena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    const cam = this.camera = new THREE.PerspectiveCamera(32, 1, 0.05, 100);
    cam.position.set(5.6, 2.4, 5.2);
    const c = this.controles = new OrbitControls(cam, r.domElement);
    c.target.set(0, 0.6, 0); c.enableDamping = true; c.dampingFactor = 0.08;
    c.minDistance = 1.2; c.maxDistance = 16; c.maxPolarAngle = Math.PI * 0.53; c.enablePan = true;
    c.addEventListener('start', () => { this._tween = null; });   // usuário assumiu a câmera
    const sol = new THREE.DirectionalLight(0xffffff, 1.6);
    sol.position.set(3, 7, 4); sol.castShadow = true;
    sol.shadow.mapSize.set(1024, 1024); Object.assign(sol.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 20 });
    sol.shadow.radius = 6; sol.shadow.bias = -0.0005;
    cena.add(sol, new THREE.HemisphereLight(0xffffff, 0x8a8f96, 0.95));   // estúdio claro
    // chão: sombra + disco suave
    const chao = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.2 }));
    chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; cena.add(chao);
    const cv = document.createElement('canvas'); cv.width = cv.height = 256;
    const g = cv.getContext('2d'), grad = g.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, 'rgba(0,0,0,0.38)'); grad.addColorStop(0.55, 'rgba(0,0,0,0.12)'); grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
    const ao = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 3.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false }));
    ao.rotation.x = -Math.PI / 2; ao.position.y = 0.002; cena.add(ao);

    this.raycaster = new THREE.Raycaster();
    this.ponteiro = new THREE.Vector2();
    const el = r.domElement;
    let baixo = null;
    el.addEventListener('pointerdown', e => { baixo = { x: e.clientX, y: e.clientY, t: performance.now() }; });
    el.addEventListener('pointerup', e => {
      if (!baixo) return;
      const mov = Math.hypot(e.clientX - baixo.x, e.clientY - baixo.y), dt = performance.now() - baixo.t;
      baixo = null;
      if (mov < 6 && dt < 600 && this.zonas) { const p = this._escolher(this._pickLista(e)); this.selecionar(p?.zona ?? null, true, p?.inst ?? null); }
    });
    el.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' || e.buttons || !this.raiz) return;
      const lista = this._pickLista(e), p = this._escolher(lista);
      if (p?.k !== this.hover?.k) { this.hover = p; el.style.cursor = p ? 'pointer' : ''; this._aplicarMateriais(); }
      // o que um clique aqui selecionaria + quantas peças há atrás
      const atravessa = lista[0] && lista[0].zona === this.selecionada && lista[0].inst === this.instSel && lista.length > 1;
      this.aoPassar(p?.zona ?? null, e, { atras: Math.max(0, lista.length - 1), atravessa });
    });
    el.addEventListener('pointerleave', () => { if (this.hover) { this.hover = null; this._aplicarMateriais(); } this.aoPassar(null); });
    new ResizeObserver(() => this._resize()).observe(this.container);
    this._resize();
  }

  _resize() {
    const w = this.container.clientWidth, h = this.container.clientHeight;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = w + 'px'; this.renderer.domElement.style.height = h + 'px';
    this.camera.aspect = w / Math.max(h, 1);
    this.camera.fov = this.camera.aspect < 0.8 ? 48 : 32;   // celular em pé: campo mais aberto
    this._aplicarOffset();
  }
  // Área coberta pelo painel (px à direita / embaixo): o enquadramento desliza para a área livre
  // `topo` = altura ocupada pela barra e pelo menu de regiões (empurra o carro um pouco para baixo)
  setMargem(direita = 0, baixo = 0, topo = 0) {
    this._offAlvo = { x: direita / 2, y: (baixo - topo) / 2 };
    if (!this._off) { this._off = { ...this._offAlvo }; this._aplicarOffset(); }   // primeira vez: sem animação
  }
  _aplicarOffset() {
    const o = this._off || { x: 0, y: 0 }, w = this.container.clientWidth, h = this.container.clientHeight;
    if (Math.abs(o.x) < 0.5 && Math.abs(o.y) < 0.5) this.camera.clearViewOffset();
    else this.camera.setViewOffset(w, h, o.x, o.y, w, h);
    this.camera.updateProjectionMatrix();
  }

  // Cria malha, clona material (destaque independente) e registra na zona
  _m(geo, mat, zona, { corpo = false, sombra = true, pai, forro = false } = {}) {
    const mesh = new THREE.Mesh(geo, zona ? mat.clone() : mat);
    mesh.castShadow = sombra; mesh.receiveShadow = false;
    mesh.userData = { zona, corpo, sombra, matBase: { opacity: mesh.material.opacity, transparent: mesh.material.transparent } };
    (pai || this.raiz).add(mesh);
    if (forro) {
      // forro interno: cópia encolhida com material escuro de face traseira (vira o "interior" visto pelos vidros)
      const g = geo.clone(); g.translate(0, -0.75, 0); g.scale(0.985, 0.975, 0.968); g.translate(0, 0.75, 0);
      const f = new THREE.Mesh(g, this.M.interior.clone());
      f.userData = { corpo: true, forro: true, matBase: { opacity: 1, transparent: false } };
      mesh.add(f); this.corpo.push(f);
    }
    if (zona) { const z = (this.zonas[zona] ||= { meshes: [], movers: [] }); z.meshes.push(mesh); }
    if (corpo) this.corpo.push(mesh);
    return mesh;
  }
  // Agrupa objetos em um pivô (dobradiça) para animar
  _pivo(objs, pivo) {
    const g = new THREE.Group(); g.position.copy(pivo); this.raiz.add(g);
    for (const o of objs) { o.parent.remove(o); o.position.sub(pivo); g.add(o); }
    return g;
  }
  // inst = qual peça da zona (ex.: roda "FE" = frente-esquerda); sem inst o movimento vale para a zona inteira
  _mover(zona, obj, { pos = [0, 0, 0], eixo, ang = 0, inst = null } = {}) {
    (this.zonas[zona] ||= { meshes: [], movers: [] }).movers.push({ obj, pos: new V3(...pos), eixo, ang, inst });
    if (inst) obj.traverse(o => { if (o.isMesh && o.userData.zona === zona) o.userData.inst ??= inst; });
    if (!this.anim.find(a => a.obj === obj)) this.anim.push({ obj, basePos: obj.position.clone(), baseRot: obj.rotation.clone(), t: 0, alvo: 0, mv: null });
  }

  // Monta o carro: modelo real (modelo/lancer.glb, gerado por ferramentas/preparar-modelo.html) ou, sem ele, o procedural.
  async _construir() {
    this.raiz = new THREE.Group(); this.cena.add(this.raiz);
    this.corpo = [];
    let gltf = null;
    try { gltf = await new GLTFLoader().loadAsync('modelo/lancer.glb'); } catch { /* sem arquivo: carro procedural */ }
    this.modeloReal = !!gltf;
    if (gltf) this._corpoGLB(gltf);
    else { this._corpoProcedural(); this._rodas(); this._interior(); }
    this._mecanica();
    this._calcularCentros();
    this.setPlaca(this._placaTexto || '');
    this._aplicarMateriais();
  }

  // Peças do GLB: o nome de cada malha é "zona|instância|material"
  _corpoGLB(gltf) {
    const M = this.M;
    const MAT = { carpaint: M.pintura, black: M.preto, chrome: M.cromo, clearglass: M.lente, windowglass: M.vidro, redglass: M.lanterna,
      orangeglass: M.pisca, mirror: M.espelho, interior: M.tecido, tire: M.pneu, material: M.roda, brakedisk: M.disco, mattemetal: M.aluminio, placa: M.placa };
    const CORPO = new Set(['capo', 'parachoque_d', 'farois', 'paralamas', 'porta_d', 'porta_t', 'retrovisores', 'parabrisa', 'teto', 'vidro_t', 'porta_malas', 'lanternas', 'parachoque_t', 'lateral_t']);
    const porChave = {};   // "zona|inst" → malhas
    const fontes = [];
    gltf.scene.traverse(o => { if (o.isMesh) fontes.push(o); });
    for (const o of fontes) {
      const [zona, inst, mat] = o.name.split('|');
      if (zona === 'placa') {   // placa vai junto com o para-choque
        const z = inst === 'frente' ? 'parachoque_d' : 'parachoque_t';
        const p = this._m(o.geometry, M.placa, z, { corpo: true, sombra: false });
        (this.placas ||= []).push(p); (porChave[z + '|'] ||= []).push(p); continue;
      }
      const m = this._m(o.geometry, MAT[mat] || M.preto, zona, { corpo: CORPO.has(zona), sombra: mat !== 'windowglass' && mat !== 'clearglass' });
      m.userData.inst = inst || null;
      m.material.side = THREE.DoubleSide;   // painéis do modelo são cascas finas (capô aberto mostra o lado de baixo)
      (porChave[zona + '|' + inst] ||= []).push(m);
    }
    const caixa = ms => ms.reduce((b, m) => b.expandByObject(m), new THREE.Box3());
    const sinal = inst => (inst.endsWith('E') ? -1 : 1);
    for (const [k, ms] of Object.entries(porChave)) {
      const [zona, inst] = k.split('|'), b = caixa(ms), c = b.getCenter(new V3()), s = sinal(inst);
      const pivo = (p, cfg) => this._mover(zona, this._pivo(ms, p), { ...cfg, inst: inst || null });
      switch (zona) {
        case 'capo': pivo(new V3(b.min.x + 0.03, b.max.y - 0.02, 0), { eixo: 'z', ang: 0.95 }); break;
        case 'porta_malas': pivo(new V3(b.max.x - 0.02, 1.16, 0), { eixo: 'z', ang: -1.1 }); break;
        case 'porta_d': case 'porta_t': pivo(new V3(b.max.x - 0.02, 0.6, s * (Math.max(Math.abs(b.min.z), Math.abs(b.max.z)) - 0.04)), { eixo: 'y', ang: s * 1.05 }); break;
        case 'parachoque_d': pivo(new V3(), { pos: [0.45, 0, 0] }); break;
        case 'parachoque_t': pivo(new V3(), { pos: [-0.45, 0, 0] }); break;
        case 'farois': pivo(new V3(), { pos: [0.3, 0.12, s * 0.08] }); break;
        case 'lanternas': pivo(new V3(), { pos: [-0.3, 0.12, s * 0.08] }); break;
        case 'paralamas': case 'lateral_t': pivo(new V3(), { pos: [0, 0.05, s * 0.32] }); break;
        case 'retrovisores': pivo(new V3(), { pos: [0, 0.15, s * 0.3] }); break;
        case 'parabrisa': pivo(new V3(), { pos: [0.18, 0.3, 0] }); break;
        case 'vidro_t': pivo(new V3(), { pos: [-0.2, 0.3, 0] }); break;
        case 'teto': pivo(new V3(), { pos: [0, 0.32, 0] }); break;
        case 'bancos': pivo(new V3(), { pos: [0, 0.9, 0] }); break;
        case 'painel': pivo(new V3(), { pos: [0, 0.75, 0] }); break;
        case 'escapamento': break;   // ponteira: vai junto com o escapamento genérico
        case 'direcao': this._volanteGLB = ms; break;
        case 'rodas': {
          // cada roda vira um grupo centrado no cubo; os freios e suspensões também a afastam
          const g = this._pivo(ms, new V3(c.x, 0.345, c.z));
          (this._rodasGLB ||= {})[inst] = { grupo: g, centro: new V3(c.x, 0.345, c.z) };
          this._mover('rodas', g, { pos: [0, 0, s * 0.5], inst });
          break;
        }
        case 'freios': {
          const g = this._pivo(ms, new V3(c.x, 0.345, c.z));
          // pinça genérica (o modelo só tem o disco)
          const p = this._m(new RoundedBoxGeometry(0.1, 0.12, 0.07, 2, 0.02), M.pinca, 'freios', { pai: g });
          p.position.set(c.x > 0 ? -0.12 : 0.12, 0.08, 0); p.userData.inst = inst;
          (this._freiosGLB ||= {})[inst] = g;
          break;
        }
      }
    }
    // freios/suspensões afastam a roda correspondente
    for (const [inst, r] of Object.entries(this._rodasGLB || {})) {
      const s = sinal(inst), g = this._freiosGLB?.[inst];
      this._mover('freios', r.grupo, { pos: [0, 0, s * 0.55], inst });
      if (g) this._mover('freios', g, { pos: [0, 0.1, s * 0.18], inst });
      this._mover(inst[0] === 'F' ? 'susp_d' : 'susp_t', r.grupo, { pos: [0, 0, s * 0.5], inst });
    }
  }

  _corpoProcedural() {
    const M = this.M;
    const P = M.pintura;
    const lados = [1, -1];

    this._m(superficie(40, 4, (u, v, p) => { const x = lerp(-L + 0.06, L - 0.1, u); p.set(x, 0.205, lerp(-1, 1, v) * larguraTopo(x) / KTOP * 0.96); }, () => new V3(0, -1, 0)), M.preto, null, { corpo: true, sombra: false });

    // Capô (pivô na dobradiça junto ao para-brisa)
    const capo = this._m(painelTopo(0.958, XCF + AF * KTOP, topo, larguraTopo, { ease: 'fim', nu: 44 }), P, 'capo', { corpo: true, forro: true });
    const pCapo = this._pivo([capo], new V3(0.958, topo(0.958), 0));
    this._mover('capo', pCapo, { eixo: 'z', ang: 0.95 });

    // Para-choque dianteiro (tampa curva inteira) + grade + faróis
    const pcD = this._m(painelTampa(true, -Math.PI / 2, Math.PI / 2, { nu: 64, nv: 26 }), P, 'parachoque_d', { corpo: true, forro: true });
    const grade = this._m(painelTampa(true, 0, 0, { off: 0.006, yLo: 0.29, yHi: 0.6, nu: 24, nv: 10,
      phiFn: (u, v) => lerp(-1, 1, u) * lerp(0.4, 0.6, v) }), M.pretoBrilho, 'parachoque_d', { corpo: true });
    // grade: linhas cromadas horizontais
    const frisos = [];
    for (const y of [0.42, 0.52]) {
      const f = this._m(painelTampa(true, 0, 0, { off: 0.011, yLo: y, yHi: y + 0.012, nu: 20, nv: 1,
        phiFn: u => lerp(-1, 1, u) * lerp(0.4, 0.6, (y - 0.29) / 0.31) * 0.96 }), M.cromo, 'parachoque_d', { corpo: true });
      frisos.push(f);
    }
    const tomadas = lados.map(s => this._m(painelTampa(true, 0, 0, { off: 0.005, yLo: 0.27, yHi: 0.38, nu: 10, nv: 6,
      phiFn: u => s * lerp(0.72, 1.12, u) }), M.preto, 'parachoque_d', { corpo: true }));
    const placaD = this._m(new RoundedBoxGeometry(0.02, 0.13, 0.4, 2, 0.008), M.placa, 'parachoque_d');
    placaD.position.copy(pontoTampa(true, 0, 0.345, 0.03));
    (this.placas ||= []).push(placaD);
    // Logo: três diamantes
    const logo = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const d = new THREE.Mesh(new THREE.OctahedronGeometry(0.028, 0), M.vermelho);
      d.scale.set(0.25, 1, 0.6); const a = i * Math.PI * 2 / 3 + Math.PI / 2;
      d.position.set(0, Math.sin(a) * 0.026, Math.cos(a) * 0.026); d.rotation.x = -a + Math.PI / 2; logo.add(d);
    }
    logo.position.copy(pontoTampa(true, 0, 0.635, 0.012)); this.raiz.add(logo);
    (this.zonas.parachoque_d.meshes).push(...logo.children);
    logo.children.forEach(m => { m.userData = { zona: 'parachoque_d', corpo: true, matBase: { opacity: 1, transparent: false } }; m.material = M.vermelho.clone(); this.corpo.push(m); });
    const pPcD = this._pivo([pcD, grade, ...frisos, ...tomadas, placaD, logo], new V3(0, 0, 0));
    this._mover('parachoque_d', pPcD, { pos: [0.45, 0, 0] });

    // Faróis: parte frontal (tampa) + parte que avança sobre o para-lama
    const farois = [];
    for (const s of lados) {
      // carcaça escura + lente clara por cima (farol "olhar bravo" do Lancer)
      farois.push(this._m(painelTampa(true, 0, 0, { off: 0.006, nu: 22, nv: 8,
        phiFn: (u, v) => s * lerp(0.6, Math.PI / 2, u),
        loFn: phi => lerp(0.57, 0.63, (Math.abs(phi) - 0.6) / (Math.PI / 2 - 0.6)), hiFn: phi => faixaTampa(true, phi)[1] - 0.012 }), M.pretoBrilho, 'farois', { corpo: true }));
      farois.push(this._m(painelLateral(1.52, XCF, s, { off: 0.006, nu: 12, nv: 8,
        loFn: x => lerp(0.8, 0.63, (x - 1.52) / (XCF - 1.52)), hiFn: x => topo(x) - 0.012 }), M.pretoBrilho, 'farois', { corpo: true }));
      farois.push(this._m(painelTampa(true, 0, 0, { off: 0.009, nu: 18, nv: 6,
        phiFn: (u, v) => s * lerp(0.72, Math.PI / 2, u),
        loFn: phi => lerp(0.6, 0.66, (Math.abs(phi) - 0.72) / (Math.PI / 2 - 0.72)), hiFn: phi => faixaTampa(true, phi)[1] - 0.03 }), M.farol, 'farois', { corpo: true }));
      farois.push(this._m(painelLateral(1.6, XCF, s, { off: 0.009, nu: 10, nv: 6,
        loFn: x => lerp(0.8, 0.66, (x - 1.6) / (XCF - 1.6)), hiFn: x => topo(x) - 0.03 }), M.farol, 'farois', { corpo: true }));
    }
    const pFar = this._pivo(farois, new V3(0, 0, 0));
    this._mover('farois', pFar, { pos: [0.3, 0.12, 0] });

    // Para-lamas
    const paralamas = lados.map(s => this._m(painelLateral(0.968, XCF, s, { nu: 36 }), P, 'paralamas', { corpo: true, forro: true }));
    lados.forEach((s, i) => this._mover('paralamas', this._pivo([paralamas[i]], new V3(0, 0, 0)), { pos: [0, 0.05, s * 0.32] }));

    // Portas (pele lateral + vidro + maçaneta) com dobradiça na borda dianteira
    const portas = [
      { zona: 'porta_d', x0: -0.142, x1: 0.958, vid: [-0.11, 0.93], hx: 0.12 },
      { zona: 'porta_t', x0: -1.135, x1: -0.152, vid: [-0.82, -0.19], vid2: [-1.30, -0.875], hx: -0.92 },
    ];
    for (const pt of portas) for (const s of lados) {
      const pele = this._m(painelLateral(pt.x0, pt.x1, s, { nu: 40 }), P, pt.zona, { corpo: true, forro: true });
      const vidros = [this._m(painelEstufa(pt.vid[0], pt.vid[1], s, { insetBaixo: 0.028, insetCima: 0.045, off: 0.004 }), M.vidro, pt.zona, { corpo: true, sombra: false })];
      if (pt.vid2) vidros.push(this._m(painelEstufa(pt.vid2[0], pt.vid2[1], s, { insetBaixo: 0.028, insetCima: 0.045, off: 0.004 }), M.vidro, pt.zona, { corpo: true, sombra: false }));
      const mac = this._m(new RoundedBoxGeometry(0.14, 0.03, 0.025, 2, 0.01), M.cromo, pt.zona, { corpo: true });
      mac.position.set(pt.hx, 0.865, s * (A * kSec(0.865, topo(pt.hx), 0.2) + 0.008));
      const piv = this._pivo([pele, ...vidros, mac], new V3(pt.x1, 0.6, s * A * 0.97));
      this._mover(pt.zona, piv, { eixo: 'y', ang: s * 1.05 });
    }

    // Retrovisores
    for (const s of lados) {
      const g = new THREE.Group();
      const casca = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.12, 0.17, 3, 0.04), P.clone());
      casca.position.set(0, 0, s * 0.1); casca.rotation.y = s * 0.12;
      const esp = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.095, 0.14), M.cromo.clone());
      esp.position.set(-0.1, 0, s * 0.1);
      const braco = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.06), M.preto.clone());
      braco.position.set(0.02, -0.03, s * 0.02);
      g.add(casca, esp, braco); g.position.set(0.82, 1.06, s * (A * KTOP + 0.02)); this.raiz.add(g);
      for (const m of g.children) { m.castShadow = true; m.userData = { zona: 'retrovisores', corpo: true, matBase: { opacity: 1, transparent: false } }; (this.zonas.retrovisores ||= { meshes: [], movers: [] }).meshes.push(m); this.corpo.push(m); }
      this._mover('retrovisores', g, { pos: [0, 0.15, s * 0.3] });
    }

    // Estufa: colunas/teto (estrutura), para-brisa, vidro traseiro
    const estrutura = [];
    for (const s of lados) estrutura.push(this._m(painelEstufa(-1.55, 0.955, s, { nu: 60 }), P, 'teto', { corpo: true }));
    for (const s of lados) estrutura.push(this._m(painelEstufa(-0.19, -0.11, s, { insetBaixo: 0.02, insetCima: 0.04, off: 0.003, nu: 2, nv: 6 }), M.preto, 'teto', { corpo: true }));
    estrutura.push(this._m(painelTopo(-1.555, 0.958, tetoLinha, x => larguraEstufa(x, tetoLinha(x)), { nu: 70 }), P, 'teto', { corpo: true, forro: true }));
    // antena
    const antena = this._m(new THREE.CylinderGeometry(0.004, 0.006, 0.35, 6), M.preto, 'teto', { corpo: true });
    antena.position.set(-0.95, tetoLinha(-0.95) + 0.17, 0); antena.rotation.z = 0.9;
    this._mover('teto', this._pivo([...estrutura, antena], new V3(0, 0, 0)), { pos: [0, 0.32, 0] });

    const pb = this._m(painelTopo(0.07, 0.94, tetoLinha, x => larguraEstufa(x, tetoLinha(x)), { t0: -0.9, t1: 0.9, off: 0.005 }), M.vidro, 'parabrisa', { corpo: true, sombra: false });
    const limp = [];
    for (const z of [-0.42, 0.18]) {
      const l = this._m(new THREE.BoxGeometry(0.02, 0.012, 0.55), M.preto, 'parabrisa', { corpo: true });
      l.position.set(0.9, topo(0.9) + coroa(0.9) + 0.03, z); l.rotation.y = -0.12; limp.push(l);
    }
    this._mover('parabrisa', this._pivo([pb, ...limp], new V3(0, 0, 0)), { pos: [0.18, 0.3, 0] });
    const vt = this._m(painelTopo(-1.53, -0.87, tetoLinha, x => larguraEstufa(x, tetoLinha(x)), { t0: -0.88, t1: 0.88, off: 0.005 }), M.vidro, 'vidro_t', { corpo: true, sombra: false });
    this._mover('vidro_t', this._pivo([vt], new V3(0, 0, 0)), { pos: [-0.2, 0.3, 0] });

    // Porta-malas: tampa superior + face traseira superior + placa; dobradiça junto ao vidro
    const tampa = this._m(painelTopo(XCR - AR * KTOP, -1.552, topo, larguraTopo, { ease: 'inicio', nu: 34 }), P, 'porta_malas', { corpo: true, forro: true });
    const faceT = this._m(painelTampa(false, -Math.PI / 2, Math.PI / 2, { yLo: 0.64, nu: 56, nv: 14 }), P, 'porta_malas', { corpo: true, forro: true });
    const placaT = this._m(new RoundedBoxGeometry(0.02, 0.13, 0.4, 2, 0.008), M.placa, 'porta_malas');
    placaT.position.copy(pontoTampa(false, 0, 0.8, 0.012));
    this.placas.push(placaT);
    const aerofolio = this._m(new RoundedBoxGeometry(0.12, 0.022, 1.1, 2, 0.01), P, 'porta_malas', { corpo: true });
    aerofolio.position.set(-2.17, topo(-2.17) + coroa(-2.17) + 0.006, 0);
    const pTampa = this._pivo([tampa, faceT, placaT, aerofolio], new V3(-1.552, topo(-1.552) + coroa(-1.552), 0));
    this._mover('porta_malas', pTampa, { eixo: 'z', ang: -1.15 });

    // Para-choque traseiro
    const pcT = this._m(painelTampa(false, -Math.PI / 2, Math.PI / 2, { yHi: 0.64, nu: 56, nv: 16 }), P, 'parachoque_t', { corpo: true, forro: true });
    const difusor = this._m(painelTampa(false, -1.2, 1.2, { yHi: 0.31, off: 0.004, nu: 30, nv: 6 }), M.preto, 'parachoque_t', { corpo: true });
    this._mover('parachoque_t', this._pivo([pcT, difusor], new V3(0, 0, 0)), { pos: [-0.45, 0, 0] });

    // Lanternas traseiras (canto da tampa + lateral)
    const lant = [];
    for (const s of lados) {
      lant.push(this._m(painelTampa(false, 0, 0, { off: 0.006, nu: 22, nv: 8, phiFn: u => s * lerp(0.42, Math.PI / 2, u),
        loFn: phi => lerp(0.86, 0.82, (Math.abs(phi) - 0.42) / 1.15), hiFn: phi => faixaTampa(false, phi)[1] - 0.035 }), M.lanterna, 'lanternas', { corpo: true }));
      lant.push(this._m(painelLateral(XCR, -1.68, s, { off: 0.006, nu: 8, nv: 8, loFn: x => lerp(0.84, 0.92, (x - XCR) / 0.15), hiFn: x => topo(x) - 0.03 }), M.lanterna, 'lanternas', { corpo: true }));
    }
    this._mover('lanternas', this._pivo(lant, new V3(0, 0, 0)), { pos: [-0.3, 0.12, 0] });

    // Laterais traseiras
    for (const s of lados) {
      const q = this._m(painelLateral(XCR, -1.145, s, { nu: 30 }), P, 'lateral_t', { corpo: true, forro: true });
      const tampaTanque = s > 0 ? this._m(painelLateral(-1.62, -1.47, s, { off: 0.003, yLo: 0.82, yHi: 0.95, nu: 4, nv: 4 }), P, 'lateral_t', { corpo: true }) : null;
      this._mover('lateral_t', this._pivo([q, tampaTanque].filter(Boolean), new V3(0, 0, 0)), { pos: [0, 0.04, s * 0.3] });
    }
    // Saias (soleira) — parte da estrutura lateral
    for (const s of lados) {
      const saia = this._m(painelLateral(-0.9, 0.93, s, { yHi: 0.27, off: 0.008, nu: 20, nv: 4 }), M.preto, 'teto', { corpo: true });
      saia.userData.corpo = true;
    }

    // Caixas de roda (pretas)
    for (const ax of [AXF, AXR]) for (const s of lados) {
      this._m(superficie(20, 4, (u, v, p) => { const a = lerp(0, Math.PI, u); p.set(ax + Math.cos(a) * (ARCO_R - 0.01), ARCO_Y + Math.sin(a) * (ARCO_R - 0.01), s * lerp(0.42, A * 0.985, v)); }, c => new V3(ax - c.x, ARCO_Y - c.y, 0)), M.preto, null, { corpo: true, sombra: false });
    }

  }

  // centros das zonas (para pinos e foco)
  _calcularCentros() {
    this.raiz.updateMatrixWorld(true);
    for (const [id, z] of Object.entries(this.zonas)) {
      const box = new THREE.Box3(); z.meshes.forEach(m => box.expandByObject(m));
      z.centro = box.getCenter(new V3()); z.caixa = box;
      // âncoras dos pinos: um ponto por peça separada (ex.: cada roda); usa-se a mais voltada para a câmera
      z.ancoras = [];
      for (const m of z.meshes) {
        const c = new THREE.Box3().setFromObject(m).getCenter(new V3());
        if (!z.ancoras.some(p => p.distanceTo(c) < 0.5)) z.ancoras.push(c);
      }
    }
  }

  _rodas() {
    const M = this.M;
    // pneu por torno (perfil do pneu)
    const perfil = [];
    const rr = 0.2286, w = 0.108;
    perfil.push(new THREE.Vector2(rr - 0.01, -w + 0.012));
    for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + i / 10 * Math.PI / 2; perfil.push(new THREE.Vector2(WR - 0.035 + Math.cos(a) * 0.035, -w + 0.035 + Math.sin(a) * 0.035 * 0.98)); }
    for (let i = 0; i <= 10; i++) { const a = i / 10 * Math.PI / 2; perfil.push(new THREE.Vector2(WR - 0.035 + Math.cos(a) * 0.035, w - 0.035 + Math.sin(a) * 0.035)); }
    perfil.push(new THREE.Vector2(rr - 0.01, w - 0.012));
    const geoPneu = new THREE.LatheGeometry(perfil, 56); geoPneu.rotateX(Math.PI / 2);
    const geoAro = new THREE.CylinderGeometry(rr, rr, 0.19, 40, 1, true); geoAro.rotateX(Math.PI / 2);
    const geoLabio = new THREE.TorusGeometry(rr - 0.004, 0.009, 8, 48);
    const geoRaio = new RoundedBoxGeometry(0.17, 0.026, 0.026, 2, 0.008);
    const geoCubo = new THREE.CylinderGeometry(0.06, 0.07, 0.04, 24); geoCubo.rotateX(Math.PI / 2);
    const geoDisco = new THREE.CylinderGeometry(0.15, 0.15, 0.026, 40); geoDisco.rotateX(Math.PI / 2);
    const geoPinca = new RoundedBoxGeometry(0.1, 0.12, 0.07, 2, 0.02);
    for (const ax of [AXF, AXR]) for (const s of [1, -1]) {
      const roda = new THREE.Group(); roda.position.set(ax, WR, s * TRK); this.raiz.add(roda);
      const add = (geo, mat, zona, cfg) => { const m = this._m(geo, mat, zona, { pai: roda }); cfg && cfg(m); return m; };
      add(geoPneu, M.pneu, 'rodas');
      add(geoAro, M.roda, 'rodas');
      add(geoLabio, M.roda, 'rodas', m => m.position.z = s * 0.088);
      add(geoCubo, M.roda, 'rodas', m => m.position.z = s * 0.07);
      for (let i = 0; i < 10; i++) {
        const a = (Math.floor(i / 2) * 2 * Math.PI / 5) + (i % 2 ? 0.17 : -0.17);
        add(geoRaio, M.roda, 'rodas', m => { m.position.set(Math.cos(a) * 0.13, Math.sin(a) * 0.13, s * 0.075); m.rotation.z = a; });
      }
      const inst = (ax > 0 ? 'F' : 'T') + (s < 0 ? 'E' : 'D');
      this._mover('rodas', roda, { pos: [0, 0, s * 0.5], inst });
      // freio (fica no lugar; rodas se afastam quando "freios" é selecionado)
      const freio = new THREE.Group(); freio.position.set(ax, WR, s * (TRK - 0.03)); this.raiz.add(freio);
      this._m(geoDisco, M.disco, 'freios', { pai: freio });
      const p = this._m(geoPinca, M.pinca, 'freios', { pai: freio });
      p.position.set(ax > 0 ? -0.11 : 0.11, 0.07, s * 0.0);
      this._mover('freios', roda, { pos: [0, 0, s * 0.55], inst });
      this._mover('freios', freio, { pos: [0, 0.1, s * 0.18], inst });
      this._mover(ax > 0 ? 'susp_d' : 'susp_t', roda, { pos: [0, 0, s * 0.5], inst });
    }
  }

  _mecanica() {
    const M = this.M, R = (w, h, d, r = 0.02) => new RoundedBoxGeometry(w, h, d, 2, r);
    const tubo = (pts, r, mat, zona) => this._m(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => new V3(...p))), 48, r, 10, false), mat, zona);
    const cil = (r, h, mat, zona, pos, rot = [0, 0, 0]) => { const m = this._m(new THREE.CylinderGeometry(r, r, h, 24), mat, zona); m.position.set(...pos); m.rotation.set(...rot); return m; };
    const caixa = (w, h, d, mat, zona, pos, r) => { const m = this._m(R(w, h, d, r), mat, zona); m.position.set(...pos); return m; };
    const grupo = (zona, objs, pos) => this._mover(zona, this._pivo(objs, new V3(0, 0, 0)), { pos });
    const grupoInst = (zona, inst, objs, pos) => this._mover(zona, this._pivo(objs, new V3(0, 0, 0)), { pos, inst });

    // Motor 4B11 (transversal, à direita)
    // altura útil do cofre: o capô fica em ~0,83 (frente) a ~0,97 (para-brisa)
    const mz = 0.12, my = -0.15;
    grupo('motor', [
      caixa(0.36, 0.34, 0.52, M.aluminio, 'motor', [1.48, 0.55 + my, mz]),
      caixa(0.34, 0.13, 0.5, M.aluminio, 'motor', [1.48, 0.78 + my, mz]),
      caixa(0.3, 0.07, 0.46, M.tampaValv, 'motor', [1.48, 0.88 + my, mz]),
      caixa(0.32, 0.08, 0.46, M.ferro, 'motor', [1.48, 0.35 + my, mz]),
      caixa(0.3, 0.42, 0.05, M.ferro, 'motor', [1.48, 0.58 + my, mz + 0.29]),
      cil(0.075, 0.04, M.ferro, 'motor', [1.54, 0.42 + my, mz + 0.33], [Math.PI / 2, 0, 0]),
      ...[-0.17, -0.06, 0.06, 0.17].map(dz => cil(0.022, 0.07, M.preto, 'motor', [1.48, 0.94 + my, mz + dz])),
    ], [0, 1.0, 0]);
    // Admissão
    grupo('admissao', [
      caixa(0.11, 0.24, 0.46, M.preto, 'admissao', [1.25, 0.72 + my, mz], 0.04),
      caixa(0.32, 0.15, 0.27, M.preto, 'admissao', [1.52, 0.7, -0.43], 0.04),
      tubo([[1.4, 0.71, -0.32], [1.3, 0.68, -0.18], [1.24, 0.64, -0.1]], 0.04, M.mangueira, 'admissao'),
      cil(0.04, 0.06, M.aluminio, 'admissao', [1.24, 0.63, -0.12], [Math.PI / 2, 0, 0]),
    ], [0, 0.85, -0.2]);
    // Arrefecimento
    grupo('arrefecimento', [
      caixa(0.05, 0.42, 1.12, M.radiador, 'arrefecimento', [2.0, 0.5, 0], 0.01),
      cil(0.17, 0.04, M.preto, 'arrefecimento', [1.95, 0.5, 0.2], [0, 0, Math.PI / 2]),
      cil(0.06, 0.12, M.mangueira, 'arrefecimento', [1.8, 0.68, 0.58]),
      tubo([[1.98, 0.66, 0.35], [1.85, 0.62, 0.32], [1.7, 0.6, 0.3]], 0.022, M.mangueira, 'arrefecimento'),
      tubo([[1.98, 0.34, -0.3], [1.8, 0.32, -0.1], [1.62, 0.3, 0.02]], 0.022, M.mangueira, 'arrefecimento'),
      cil(0.05, 0.05, M.aluminio, 'arrefecimento', [1.66, 0.38, mz + 0.33], [Math.PI / 2, 0, 0]),
    ], [0.55, 0.45, 0]);
    // Climatização: condensador, compressor e caixa evaporadora
    grupo('climatizacao', [
      caixa(0.02, 0.4, 1.08, M.ferro, 'climatizacao', [2.05, 0.5, 0], 0.005),
      cil(0.06, 0.16, M.aluminio, 'climatizacao', [1.72, 0.38, 0.3], [Math.PI / 2, 0, 0]),
      caixa(0.24, 0.24, 0.62, M.preto, 'climatizacao', [0.82, 0.72, 0.1], 0.03),
      tubo([[1.72, 0.42, 0.38], [1.9, 0.45, 0.45], [2.04, 0.5, 0.5]], 0.012, M.aluminio, 'climatizacao'),
    ], [0.4, 0.75, 0]);
    // Elétrica: bateria, alternador, motor de partida, caixa de fusíveis
    grupo('eletrica', [
      caixa(0.23, 0.2, 0.17, M.bateria, 'eletrica', [1.72, 0.62, -0.58]),
      cil(0.018, 0.03, M.vermelho, 'eletrica', [1.78, 0.735, -0.54]),
      cil(0.018, 0.03, M.preto, 'eletrica', [1.66, 0.735, -0.54]),
      cil(0.065, 0.13, M.aluminio, 'eletrica', [1.66, 0.58, mz + 0.22], [Math.PI / 2, 0, 0]),
      cil(0.045, 0.16, M.ferro, 'eletrica', [1.28, 0.38, -0.22], [Math.PI / 2, 0, 0]),
      caixa(0.16, 0.1, 0.12, M.preto, 'eletrica', [1.38, 0.74, -0.66]),
    ], [0.1, 0.9, -0.3]);
    // Transmissão: câmbio, embreagem, semieixos, alavanca
    const tr = [
      cil(0.17, 0.18, M.aluminio, 'transmissao', [1.46, 0.42, -0.23], [Math.PI / 2, 0, 0]),
      caixa(0.34, 0.3, 0.26, M.aluminio, 'transmissao', [1.42, 0.42, -0.44]),
      cil(0.022, 0.6, M.ferro, 'transmissao', [AXF + 0.02, 0.34, 0.5], [Math.PI / 2, 0, 0]),
      cil(0.022, 0.18, M.ferro, 'transmissao', [AXF + 0.02, 0.34, -0.62], [Math.PI / 2, 0, 0]),
      cil(0.012, 0.22, M.cromo, 'transmissao', [0.3, 0.62, 0], [0, 0, -0.25]),
    ];
    const bola = this._m(new THREE.SphereGeometry(0.035, 16, 12), M.preto, 'transmissao'); bola.position.set(0.27, 0.74, 0); tr.push(bola);
    tubo([[1.35, 0.48, -0.4], [0.9, 0.3, -0.1], [0.32, 0.5, 0]], 0.008, M.preto, 'transmissao');
    grupo('transmissao', tr, [0, 0.8, -0.35]);
    // Escapamento
    grupo('escapamento', [
      caixa(0.08, 0.16, 0.42, M.escape, 'escapamento', [1.69, 0.48, mz]),
      tubo([[1.72, 0.42, 0.12], [1.72, 0.3, 0.1], [1.4, 0.22, 0.05], [1.0, 0.22, 0.02]], 0.026, M.escape, 'escapamento'),
      cil(0.075, 0.32, M.escape, 'escapamento', [0.8, 0.23, 0.02], [0, 0, Math.PI / 2]),
      tubo([[0.62, 0.23, 0.02], [0, 0.23, 0.04], [-0.35, 0.23, 0.06]], 0.026, M.escape, 'escapamento'),
      cil(0.085, 0.36, M.escape, 'escapamento', [-0.55, 0.23, 0.06], [0, 0, Math.PI / 2]),
      tubo([[-0.75, 0.23, 0.06], [-1.1, 0.24, 0.12], [-1.35, 0.32, 0.25], [-1.7, 0.29, 0.38]], 0.026, M.escape, 'escapamento'),
      caixa(0.36, 0.17, 0.4, M.escape, 'escapamento', [-1.9, 0.28, 0.32], 0.05),
      // ponteira: a do modelo real, se houver
      ...(this.modeloReal ? (this.zonas.escapamento?.meshes || []).filter(m => m.userData.inst !== undefined && m.parent === this.raiz)
        : [cil(0.045, 0.14, M.cromo, 'escapamento', [-2.18, 0.27, 0.42], [0, 0, Math.PI / 2])]),
    ], [0, -0.05, 0.75]);
    // Tanque e linha de combustível
    grupo('tanque', [
      caixa(0.55, 0.22, 1.0, M.tanque, 'tanque', [-0.95, 0.33, -0.05], 0.05),
      tubo([[-1.0, 0.42, 0.4], [-1.3, 0.6, 0.65], [-1.55, 0.86, 0.8]], 0.025, M.preto, 'tanque'),
      tubo([[-0.7, 0.24, -0.25], [0.5, 0.22, -0.3], [1.2, 0.4, -0.05]], 0.007, M.ferro, 'tanque'),
    ], [0, -0.05, -0.85]);
    // Suspensão dianteira
    // cada lado é uma peça (FE/FD); barra estabilizadora e agregado ficam como peça comum
    for (const s of [1, -1]) {
      const sd = [];
      sd.push(cil(0.034, 0.48, M.amortecedor, 'susp_d', [AXF - 0.03, 0.6, s * 0.6], [s * 0.1, 0, 0]));
      sd.push(this._m(new THREE.TubeGeometry(new HelixCurve(0.075, 0.22, 5.5), 120, 0.011, 8, false), M.mola, 'susp_d'));
      sd[sd.length - 1].position.set(AXF - 0.03, 0.58, s * 0.6); sd[sd.length - 1].rotation.x = s * 0.1;
      sd.push(cil(0.09, 0.03, M.ferro, 'susp_d', [AXF - 0.03, 0.83, s * 0.58]));
      sd.push(tubo([[AXF, 0.26, s * 0.62], [AXF + 0.1, 0.27, s * 0.36], [AXF + 0.18, 0.27, s * 0.26]], 0.022, M.ferro, 'susp_d'));
      sd.push(tubo([[AXF, 0.26, s * 0.62], [AXF - 0.2, 0.27, s * 0.34], [AXF - 0.3, 0.28, s * 0.27]], 0.022, M.ferro, 'susp_d'));
      this._mover('susp_d', this._pivo(sd, new V3()), { pos: [0, 0.45, s * 0.2], inst: 'F' + (s < 0 ? 'E' : 'D') });
    }
    tubo([[1.08, 0.33, -0.62], [1.12, 0.32, -0.3], [1.12, 0.32, 0.3], [1.08, 0.33, 0.62]], 0.012, M.ferro, 'susp_d');
    caixa(0.4, 0.06, 0.6, M.ferro, 'susp_d', [AXF - 0.05, 0.25, 0], 0.02);
    // Suspensão traseira (multilink)
    for (const s of [1, -1]) {
      const st = [];
      st.push(cil(0.026, 0.42, M.amortecedor, 'susp_t', [AXR - 0.12, 0.52, s * 0.6], [0, 0, 0.12]));
      const mola = this._m(new THREE.TubeGeometry(new HelixCurve(0.065, 0.2, 5), 100, 0.01, 8, false), M.mola, 'susp_t');
      mola.position.set(AXR + 0.1, 0.3, s * 0.5); st.push(mola);
      st.push(tubo([[-0.82, 0.32, s * 0.6], [-1.1, 0.3, s * 0.64], [AXR, 0.3, s * 0.66]], 0.02, M.ferro, 'susp_t'));
      st.push(tubo([[AXR, 0.28, s * 0.64], [AXR, 0.27, s * 0.2]], 0.016, M.ferro, 'susp_t'));
      st.push(tubo([[AXR + 0.05, 0.42, s * 0.6], [AXR + 0.05, 0.42, s * 0.22]], 0.014, M.ferro, 'susp_t'));
      this._mover('susp_t', this._pivo(st, new V3()), { pos: [0, 0.45, s * 0.2], inst: 'T' + (s < 0 ? 'E' : 'D') });
    }
    caixa(0.18, 0.08, 0.9, M.ferro, 'susp_t', [AXR, 0.3, 0], 0.02);
    // Freios: servo-freio, cilindro-mestre e ABS
    grupoInst('freios', 'servo', [
      cil(0.12, 0.14, M.ferro, 'freios', [1.06, 0.78, -0.45], [0, 0, Math.PI / 2]),
      cil(0.03, 0.16, M.aluminio, 'freios', [1.19, 0.79, -0.45], [0, 0, Math.PI / 2]),
      caixa(0.12, 0.1, 0.14, M.aluminio, 'freios', [1.8, 0.62, 0.5]),
      tubo([[1.2, 0.78, -0.4], [1.4, 0.7, -0.6], [AXF, 0.45, -0.7]], 0.005, M.ferro, 'freios'),
      tubo([[1.2, 0.78, -0.4], [1.0, 0.5, 0], [AXR, 0.4, 0.6]], 0.005, M.ferro, 'freios'),
    ], [0, 0.6, 0]);
    // Direção: caixa, coluna, volante, bomba
    const dir = [
      cil(0.035, 1.0, M.ferro, 'direcao', [1.16, 0.38, 0], [Math.PI / 2, 0, 0]),
      tubo([[1.16, 0.4, -0.38], [0.95, 0.62, -0.38], [0.66, 0.9, -0.38]], 0.022, M.ferro, 'direcao'),
      cil(0.05, 0.08, M.aluminio, 'direcao', [1.6, 0.55, mz + 0.34], [Math.PI / 2, 0, 0]),
      cil(0.04, 0.08, M.preto, 'direcao', [1.35, 0.76, 0.55]),
    ];
    if (this._volanteGLB) dir.push(...this._volanteGLB);   // volante do modelo real
    else {
      const geoVol = new THREE.TorusGeometry(0.18, 0.022, 12, 40); geoVol.rotateY(Math.PI / 2); geoVol.rotateZ(-0.45);
      const volante = this._m(geoVol, M.painelInt, 'direcao');
      volante.position.set(0.6, 0.95, -0.38);
      const cuboV = this._m(new THREE.CylinderGeometry(0.065, 0.07, 0.06, 20), M.painelInt, 'direcao');
      cuboV.position.copy(volante.position); cuboV.rotation.z = Math.PI / 2 - 0.45;
      dir.push(volante, cuboV);
    }
    grupo('direcao', dir, [0, 0.5, 0]);
  }

  _interior() {
    const M = this.M, R = (w, h, d, r = 0.03) => new RoundedBoxGeometry(w, h, d, 3, r);
    const add = (geo, mat, zona, pos, rotZ = 0) => { const m = this._m(geo, mat, zona); m.position.set(...pos); m.rotation.z = rotZ; return m; };
    // Painel
    const painel = [
      add(R(0.42, 0.24, 1.5, 0.06), M.painelInt, 'painel', [0.74, 0.86, 0]),
      add(R(0.2, 0.1, 0.36, 0.04), M.painelInt, 'painel', [0.6, 1.0, -0.38]),
      add(R(0.02, 0.14, 0.2, 0.01), M.preto, 'painel', [0.53, 0.88, 0]),
      add(R(0.8, 0.16, 0.24, 0.04), M.painelInt, 'painel', [0.15, 0.52, 0]),
    ];
    this._mover('painel', this._pivo(painel, new V3()), { pos: [0, 0.75, 0] });
    // Bancos
    const bancos = [];
    for (const z of [-0.38, 0.38]) {
      bancos.push(add(R(0.5, 0.12, 0.48), M.tecido, 'bancos', [0.02, 0.48, z]));
      bancos.push(add(R(0.13, 0.6, 0.46, 0.05), M.tecido, 'bancos', [-0.27, 0.8, z], 0.22));
      bancos.push(add(R(0.1, 0.16, 0.26, 0.04), M.tecido, 'bancos', [-0.36, 1.18, z], 0.22));
    }
    bancos.push(add(R(0.5, 0.13, 1.32), M.tecido, 'bancos', [-0.86, 0.5, 0]));
    bancos.push(add(R(0.13, 0.56, 1.32, 0.05), M.tecido, 'bancos', [-1.17, 0.82, 0], 0.3));
    this._mover('bancos', this._pivo(bancos, new V3()), { pos: [0, 0.9, 0] });
  }

  // ── Interação ────────────────────────────────────────────
  // Peças sob o ponteiro (zona + instância, ex.: rodas/FE), da mais próxima para a mais distante, sem repetir.
  // No raio X a carroceria não bloqueia; com uma região ativa, as peças dela vêm primeiro.
  _pickLista(e) {
    const r = this.renderer.domElement.getBoundingClientRect();
    this.ponteiro.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.raycaster.setFromCamera(this.ponteiro, this.camera);
    const alvos = [];
    this.raiz.traverse(o => {
      const ud = o.userData;
      if (!o.isMesh || !ud.zona) return;
      if (this.raioX && ud.corpo && ud.zona !== this.selecionada) return;
      alvos.push(o);
    });
    const lista = [];
    for (const h of this.raycaster.intersectObjects(alvos, false)) {
      const ud = h.object.userData, inst = ud.inst ?? null, k = ud.zona + '|' + (inst ?? '');
      if (!lista.some(x => x.k === k)) lista.push({ k, zona: ud.zona, inst });
    }
    if (this.raioX && this.regiao) lista.sort((a, b) => this.regiao.has(b.zona) - this.regiao.has(a.zona));
    return lista;
  }
  // Clicar de novo sobre a peça selecionada "atravessa" para a próxima que está atrás
  _escolher(lista) {
    if (!lista.length) return null;
    const i = lista.findIndex(x => x.zona === this.selecionada && x.inst === this.instSel);
    return i >= 0 ? lista[(i + 1) % lista.length] : lista[0];
  }
  _malhasDe(id, inst) {
    return (this.zonas[id]?.meshes || []).filter(m => !inst || m.userData.inst === inst);
  }
  // Sem clique (lista, botões, pinos): a peça da zona mais próxima da câmera
  _instPadrao(id) {
    const insts = [...new Set(this._malhasDe(id).map(m => m.userData.inst).filter(Boolean))];
    if (insts.length < 2) return insts[0] || null;
    const cam = this.camera.position;
    let melhor = null, dm = Infinity;
    for (const i of insts) {
      const b = new THREE.Box3(); this._malhasDe(id, i).forEach(m => b.expandByObject(m));
      const d = b.getCenter(new V3()).distanceTo(cam);
      if (d < dm) { dm = d; melhor = i; }
    }
    return melhor;
  }

  // inst: qual peça da zona (undefined = escolher a mais próxima da câmera; null = zona inteira)
  selecionar(id, doClique = false, inst) {
    const z = id && this.zonas[id];
    if (z && inst === undefined) inst = this._instPadrao(id);
    inst = id ? inst ?? null : null;
    if (id === this.selecionada && inst === this.instSel) { if (doClique && id) this.aoSelecionar(id); return; }
    this.selecionada = id; this.instSel = inst;
    for (const a of this.anim) a.alvo = 0;
    if (z) for (const mv of z.movers) {
      if (inst && mv.inst && mv.inst !== inst) continue;   // só a peça clicada se mexe
      const a = this.anim.find(x => x.obj === mv.obj); a.alvo = 1; a.mv = mv;
    }
    this._aplicarMateriais();
    if (doClique || id) this.aoSelecionar(id);   // a interface ajusta a margem antes do enquadramento
    if (z) this._focar(id, inst);
  }

  // fator de distância para caber na área livre (painel aberto, celular em pé)
  _fatorDist() {
    const oa = this._offAlvo || { x: 0, y: 0 }, w = this.container.clientWidth, h = this.container.clientHeight;
    const aspLivre = Math.max(0.3, (w - 2 * oa.x) / Math.max(1, h - 2 * Math.abs(oa.y)));
    // compara a abertura horizontal livre com a de referência (PC 16:9, fov 32°)
    const ref = Math.tan(THREE.MathUtils.degToRad(16)) * 1.7;
    const atual = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * aspLivre;
    return Math.pow(clamp(ref / atual, 1, 2.6), 0.8);
  }
  // Enquadra a peça clicada (não o meio da zona): roda dianteira esquerda → câmera na frente-esquerda
  _focar(id, inst) {
    const z = this.zonas[id]; if (!z) return;
    const b = new THREE.Box3(); this._malhasDe(id, inst).forEach(m => b.expandByObject(m));
    if (b.isEmpty()) return;
    const c = b.getCenter(new V3()), tam = b.getSize(new V3()).length();
    const dir = new V3(...(this.vistas?.[id] || [1, 0.6, 1]));
    if (Math.abs(c.z) > 0.25) dir.z = Math.sign(c.z) * Math.max(Math.abs(dir.z), 0.5);
    if (z.caixa.getSize(new V3()).x > 2 && Math.abs(c.x) > 0.6) dir.x = Math.sign(c.x) * Math.max(Math.abs(dir.x), 0.4);
    const alvo = c.clone(); alvo.y = Math.max(alvo.y, 0.35);
    this.irPara(alvo, dir, clamp(tam * 1.5 + 1.7, 2.4, 8) * this._fatorDist());
  }
  // Move a câmera orbitando (coordenadas esféricas): o carro "gira" até a vista pedida
  irPara(alvo, dir, dist, { duracao = 0.9, imediato = false } = {}) {
    alvo = alvo.isVector3 ? alvo.clone() : new V3(...alvo);
    const s1 = new THREE.Spherical().setFromVector3(new V3(...(dir.isVector3 ? dir.toArray() : dir)).normalize().multiplyScalar(dist));
    s1.phi = clamp(s1.phi, 0.12, this.controles.maxPolarAngle);
    if (imediato) { this.controles.target.copy(alvo); this.camera.position.setFromSpherical(s1).add(alvo); this._tween = null; return; }
    const s0 = new THREE.Spherical().setFromVector3(this.camera.position.clone().sub(this.controles.target));
    let dth = s1.theta - s0.theta;
    while (dth > Math.PI) dth -= 2 * Math.PI;
    while (dth < -Math.PI) dth += 2 * Math.PI;
    this._tween = { de: this.controles.target.clone(), ate: alvo, s0, s1, dth, t: 0, duracao };
  }
  visaoGeral(imediato = false) {
    this.irPara([0, 0.6, 0], [5.6, 2.4, 5.2], 7.98 * Math.min(this._fatorDist(), 1.45), { imediato });
  }
  // Região pré-definida (menu deslizante): destaca as zonas e enquadra a vista
  setRegiao(zonas, vista) {
    this.regiao = zonas && zonas.length ? new Set(zonas) : null;
    this._aplicarMateriais();
    if (vista) this.irPara(vista.alvo, vista.dir, vista.dist * this._fatorDist(), { duracao: 1.1 });
  }

  setRaioX(on) {
    this.raioX = on;
    this._aplicarMateriais();
  }

  // Placa Mercosul desenhada num canvas (texto vem dos dados do veículo)
  setPlaca(texto) {
    this._placaTexto = texto;
    if (!this.placas) return;
    const cv = document.createElement('canvas'); cv.width = 512; cv.height = 166;
    const g = cv.getContext('2d');
    g.fillStyle = '#f7f8f9'; g.fillRect(0, 0, 512, 166);
    g.fillStyle = '#1f3f99'; g.fillRect(0, 0, 512, 34);
    g.fillStyle = '#fff'; g.font = 'bold 22px Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('BRASIL', 256, 18);
    g.fillStyle = '#2e9e4f'; g.fillRect(468, 7, 30, 20); g.fillStyle = '#f4d000';   // bandeira simplificada
    g.beginPath(); g.moveTo(483, 9); g.lineTo(496, 17); g.lineTo(483, 25); g.lineTo(470, 17); g.fill();
    g.fillStyle = '#1f3f99'; g.beginPath(); g.arc(483, 17, 4, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#222'; g.lineWidth = 6; g.strokeRect(3, 3, 506, 160);
    const t = (texto || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
    g.fillStyle = '#111'; g.font = 'bold 104px "Arial Narrow", "Roboto Condensed", Arial, sans-serif';
    g.fillText(t ? t.slice(0, 3) + ' ' + t.slice(3) : '', 256, 104, 470);
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    for (const p of this.placas) { p.material.map = tex; p.material.color.set(0xffffff); p.material.needsUpdate = true; }
  }

  setCor(cor) {
    this.M.pintura.color.set(cor);
    this.raiz.traverse(o => { if (o.isMesh && o.material.isMeshPhysicalMaterial && o.material.clearcoat === 1 && o.material.metalness === 0.55) o.material.color.set(cor); });
  }

  // Estado visual de cada malha. Com algo selecionado: a peça fica sólida e todo o resto translúcido.
  // Sem seleção: raio X (mecânica) deixa a carroceria fantasma; a região do menu fica destacada.
  _aplicarMateriais() {
    const sel = this.selecionada, isel = this.instSel, hov = this.hover, reg = this.regiao;
    const casa = (zona, inst, z, i) => z && zona === z && (!i || !inst || inst === i);
    if (!this.raiz) return;
    this.raiz.traverse(o => {
      const ud = o.userData;
      if (!o.isMesh || !ud.matBase) return;
      const m = o.material, pai = ud.forro ? o.parent.userData : null;
      const zona = ud.zona ?? pai?.zona ?? null, inst = ud.inst ?? pai?.inst ?? null;
      const ehSel = casa(zona, inst, sel, isel);
      let op = ud.matBase.opacity ?? 1, tr = ud.matBase.transparent;
      if (sel) { if (!ehSel) { op = ud.corpo ? 0.1 : 0.2; tr = true; } }
      else if (this.raioX && ud.corpo) { op = 0.08; tr = true; }
      else if (this.raioX && reg && zona && !reg.has(zona)) { op = 0.22; tr = true; }   // mecânica fora da região: fantasma
      if (m.transparent !== tr) { m.transparent = tr; m.needsUpdate = true; }
      m.opacity = op; m.depthWrite = op > 0.95;
      o.castShadow = ud.sombra !== false && op > 0.6;
      if (!m.emissive || ud.forro || !zona) return;
      ud.emBase ??= m.emissive.getHex();
      if (ehSel) { m.emissive.setHex(0x2f7dff); m.emissiveIntensity = 0.28; }
      else if (hov && casa(zona, inst, hov.zona, hov.inst)) { m.emissive.setHex(0x2f7dff); m.emissiveIntensity = 0.32; }
      else if (!sel && reg && reg.has(zona)) { m.emissive.setHex(0x2f7dff); m.emissiveIntensity = 0.12; }
      else { m.emissive.setHex(ud.emBase); m.emissiveIntensity = 1; }
    });
  }

  // Pausa o render (ex.: livrete aberto por cima) para economizar bateria
  pausar(p) {
    this.pausado = p;
    if (!p && !this._rodando) { this._t = null; requestAnimationFrame(this._loop); }
  }

  // posição na tela (px) do centro de cada zona — para os pinos
  posicoesTela() {
    const w = this.container.clientWidth, h = this.container.clientHeight, out = {};
    const camDir = this.camera.position.clone().sub(this.controles.target).normalize();
    const meio = new V3(0, 0.6, 0);
    for (const [id, z] of Object.entries(this.zonas)) {
      let melhor = z.centro, fm = -Infinity;
      for (const a of z.ancoras) { const f = a.clone().sub(meio).dot(camDir); if (f > fm) { fm = f; melhor = a; } }
      const p = melhor.clone().project(this.camera);
      const frente = melhor.clone().sub(meio).normalize().dot(camDir);
      out[id] = { x: (p.x + 1) / 2 * w, y: (1 - p.y) / 2 * h, visivel: p.z < 1, frente };
    }
    return out;
  }

  _loop(t) {
    if (this.pausado) { this._rodando = false; return; }
    this._rodando = true;
    requestAnimationFrame(this._loop);
    const dt = Math.min(0.05, (t - (this._t || t)) / 1000); this._t = t;
    this.quadro(dt);
  }
  // Um quadro de animação + render (separado do rAF para permitir testes passo a passo)
  quadro(dt) {
    // animações de abrir/explodir
    for (const a of this.anim) {
      a.t += (a.alvo - a.t) * Math.min(1, dt * 7);
      if (Math.abs(a.alvo - a.t) < 0.001) a.t = a.alvo;
      const mv = a.mv; if (!mv) continue;
      const e = a.t;
      a.obj.position.copy(a.basePos).addScaledVector(mv.pos, e);
      a.obj.rotation.copy(a.baseRot);
      if (mv.eixo) a.obj.rotation[mv.eixo] += mv.ang * e;
      if (a.alvo === 0 && a.t === 0) a.mv = null;
    }
    const oa = this._offAlvo || { x: 0, y: 0 }; this._off ||= { x: 0, y: 0 };
    if (Math.abs(oa.x - this._off.x) > 0.5 || Math.abs(oa.y - this._off.y) > 0.5) {
      const k = Math.min(1, dt * 6);
      this._off.x += (oa.x - this._off.x) * k; this._off.y += (oa.y - this._off.y) * k;
      this._aplicarOffset();
    }
    if (this._tween) {
      const tw = this._tween; tw.t = Math.min(1, tw.t + dt / tw.duracao);
      const k = sstep(0, 1, tw.t);
      this.controles.target.lerpVectors(tw.de, tw.ate, k);
      const s = new THREE.Spherical(lerp(tw.s0.radius, tw.s1.radius, k), lerp(tw.s0.phi, tw.s1.phi, k), tw.s0.theta + tw.dth * k);
      this.camera.position.setFromSpherical(s).add(this.controles.target);
      if (tw.t >= 1) this._tween = null;
    }
    this.controles.update();
    this.renderer.render(this.cena, this.camera);
    this.aoQuadro && this.aoQuadro();
  }
}

class HelixCurve extends THREE.Curve {
  constructor(r, h, voltas) { super(); this.r = r; this.h = h; this.v = voltas; }
  getPoint(t, alvo = new V3()) { const a = t * this.v * Math.PI * 2; return alvo.set(Math.cos(a) * this.r, t * this.h, Math.sin(a) * this.r); }
}
