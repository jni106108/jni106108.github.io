# Lancer Garagem — protótipo

Gêmeo digital de manutenção do **Mitsubishi Lancer GT 2.0 5MT (CY4A)**: carro 3D clicável, catálogo de peças com diagramas explodidos, histórico de trocas e conteúdo de reparo por região.

## Como abrir (PC)

Dê dois cliques em **`Iniciar Lancer Garagem.bat`**. O navegador abre em `http://localhost:8090` (porta definida no `.bat`).
Deixe a janela preta aberta enquanto usa o app; para encerrar, feche-a.

> Não há nada para instalar: o app usa three.js direto da CDN (precisa de internet na primeira abertura).

## Publicar no GitHub Pages e instalar no Android

Nenhum arquivo desta pasta passa de 25 MB (o maior é `modelo/lancer.glb`, com 12,7 MB). Os originais grandes ficam em `../lancer-garagem-originais`, fora da pasta publicada.

1. Crie um repositório no GitHub (ex.: `lancer-garagem`) e envie **o conteúdo desta pasta**: `index.html` precisa ficar na raiz do repositório. Se o upload pelo site travar com muitos arquivos, envie em lotes (por exemplo, `data/diagramas` separado).
2. No repositório, abra **Settings → Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)` e salve.
3. Em 1–2 minutos o app abre em `https://SEU-USUARIO.github.io/lancer-garagem/`.
4. No Android, abra o link no **Chrome** → menu ⋮ → **Instalar app** (ou *Adicionar à tela inicial*). Ele ganha ícone e abre em tela cheia.
5. Depois da primeira abertura com internet, o app funciona **offline** (o modelo 3D, os diagramas e as páginas do manual ficam guardados quando são abertos pela primeira vez).

**APK (opcional):** em [pwabuilder.com](https://www.pwabuilder.com), cole o link do GitHub Pages → *Package for stores* → **Android**. O site gera o APK pronto para instalar, sem nada instalado no PC.

> Atenção: no GitHub gratuito, o repositório do Pages é **público**: quem tiver o link vê o app e o catálogo. O histórico de manutenção **não** vai para o GitHub; ele fica só no celular.
> Ao publicar uma versão nova, troque `VERSAO` em `sw.js` para o celular buscar os arquivos atualizados.

## O que já funciona

- **Carro 3D real** (`modelo/lancer.glb`, 383 mil triângulos, 12,7 MB) dividido em peças. Mecânica interna (motor, câmbio, suspensões, direção, escapamento, tanque, A/C) é **genérica**, posicionada dentro do carro e destacada por cor.
  - Cada zona tem uma **camada oculta**: carroceria, periféricos, mecânica, elétrica ou interior. Clicar numa peça de mecânica (ex.: roda) passa o switch para **Mecânica** sozinho.
  - **A peça clicada fica sólida e o resto do carro translúcido.** Só a peça clicada se mexe (ex.: só a roda dianteira esquerda sai) e a câmera enquadra **essa peça**, não o meio da zona.
  - **Clicar de novo no mesmo ponto atravessa** para o que está atrás (roda → disco de freio → suspensão).
  - A **placa** cadastrada em *Meu veículo* aparece no carro (padrão Mercosul) e a **cor** da pintura pode ser trocada.
- **Aba Peças**: os 122 grupos e 194 diagramas do catálogo EPC. Zoom e arrasto no diagrama, tabela com nº OEM, supersessão, período, quantidade e preço de referência. Busca por nome, OEM ou referência.
- **Aba Histórico**: registro de troca/serviço com data, km, peças (OEM, quantidade, preço), mão de obra, oficina e observações.
- **Aba Reparos**: manutenção programada (intervalos do manual), especificações, problemas conhecidos, páginas do manual (abre o PDF na página certa) e buscas de vídeo no YouTube.
- **Livrete de manutenção**, **lembretes**, **exportação CSV** e **backup JSON**.

### Navegação

- **Menu deslizante** (topo central): arraste para os lados, use as setas ‹ › ou as setas do teclado. O carro gira até a região escolhida e ela fica destacada. A lista é circular e segue a volta em torno do carro.
  - Carroceria: carro inteiro → para-choque dianteiro → capô e faróis → lateral direita → porta-malas e aerofólio → para-choque traseiro → lateral esquerda → teto e vidros.
  - Mecânica: mecânica completa → arrefecimento e A/C → motor e elétrica → suspensão dianteira → rodas e pneus → freios → escapamento → tanque → suspensão traseira → interior → câmbio → direção.
- **Switch Carroceria/Mecânica**: canto inferior esquerdo. No celular, ele sobe junto com a gaveta de detalhes. Ideia para a próxima versão: trocar o switch por um **filtro de camadas** (só suspensão, só motor, só elétrica…), usando as camadas que já estão marcadas em `js/zonas.js`.
- **Livrete**: toque no nome/km do carro (canto superior esquerdo) ou no aviso de manutenção. O 3D fica pausado e desfocado enquanto ele está aberto.

## Modelo 3D

- Original: “Mitsubishi Lancer Sedan 2009” por **Nieve5677** ([Sketchfab](https://sketchfab.com/3d-models/mitsubishi-lancer-sedan-2009-5219adf1a62b4b7393d3c1fc451be88b)), licença **CC BY 4.0**. O crédito também aparece no menu ⋮ do app.
- O original (40 MB, 1,17 mi de triângulos, peças sem nome) está em `../lancer-garagem-originais/`. A ferramenta `ferramentas/preparar-modelo.html` (que pede o arquivo original) faz o seguinte:
  - separa as peças pela geometria e classifica cada uma numa zona do app pela posição no carro (capô, portas E/D, para-lamas, rodas FE/FD/TE/TD…);
  - simplifica a malha com meshoptimizer e grava `modelo/lancer.glb`. Cada malha recebe o nome `zona|peça|material`.
- Sem `modelo/lancer.glb`, o app volta automaticamente para o carro procedural.

## Onde ficam os dados

- O histórico fica no **armazenamento do navegador** (localStorage) do aparelho onde você usa o app. Faça backup pelo menu ⋮ → *Fazer backup*.
- Catálogo: `data/catalogo.json` (extraído do PDF) e `data/diagramas/*.jpg`.
- PDFs: `docs/catalogo.pdf` e o manual dividido em `docs/manual-1.pdf` a `manual-4.pdf` (80 páginas cada). Os links do app abrem a parte e a página certas. O manual completo fica em `../lancer-garagem-originais/manual-completo.pdf`; para refazer a divisão, use `ferramentas/dividir-manual.html`.

## Estrutura

```
index.html                     página única
css/app.css                    layout (PC: painel lateral · celular: gaveta inferior)
js/carro3d.js                  cena 3D: carrega o GLB, peças/dobradiças, mecânica genérica, seleção, câmera
js/zonas.js                    zonas → grupos do catálogo, camadas, regiões do menu, reparos, lembretes
js/dados.js                    catálogo + histórico/veículo/lembretes (localStorage)
js/main.js                     interface
modelo/lancer.glb              modelo otimizado usado pelo app
ferramentas/preparar-modelo.html  gera o lancer.glb a partir do original
ferramentas/dividir-manual.html   divide o manual em partes < 25 MB
manifest.webmanifest, sw.js    app instalável e offline (PWA)
icones/                        ícones do app
serve.ps1                      servidor local (PowerShell, sem instalação)
```

## Limitações conhecidas

- O modelo do Sketchfab não tem motor, suspensão nem direção. Essas peças são genéricas e servem para localizar e clicar, não para mostrar a forma real.
- As peças foram separadas por posição. Bordas entre zonas vizinhas podem ter pequenos recortes (ex.: lateral traseira × coluna).
- Os diagramas são imagens: o número de referência é lido na tabela, não clicando no desenho.
- "Problemas conhecidos" são relatos comuns de proprietários e oficinas, não dados do fabricante.
- O plano completo de revisões está no Livrete de Bordo (não veio nos PDFs).
