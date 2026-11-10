# Lancer Club 67

> Antes chamado "Lancer Garagem". A identidade visual (ícones, escudo da abertura, logos) fica em `marca/` — veja `marca/LEIA-ME.md`.
> O que mudou em cada versão está em Configurações → **Novidades da versão** (lista `NOVIDADES` no início de `js/main.js`).

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
> Ao publicar uma versão nova, troque `CODIGO` em `sw.js` para o celular buscar os arquivos atualizados. O cache `PESADO` (modelo 3D, three.js, diagramas, PDFs) é mantido entre versões; troque-o só se esses arquivos mudarem.
> Se o app ficar preso na abertura, a própria tela de carregamento mostra o motivo e os botões "Tentar de novo" e "Limpar cache e recarregar" (os dados não são apagados).

## O que já funciona

- **Carro 3D real** (`modelo/lancer.glb`, 383 mil triângulos, 12,7 MB) dividido em peças. Mecânica interna (motor, câmbio, suspensões, direção, escapamento, tanque, A/C) é **genérica**, posicionada dentro do carro e destacada por cor.
  - Cada zona tem **marcações ocultas** de sistema (`FILTROS` em `js/zonas.js`), usadas pelo **filtro de camadas**.
  - **A peça clicada fica sólida e o resto do carro translúcido.** Só a peça clicada se mexe (ex.: só a roda dianteira esquerda sai) e a câmera enquadra **essa peça**, não o meio da zona. Ao fechar o painel, a câmera volta ao enquadramento padrão da região.
  - **Clicar de novo no mesmo ponto atravessa** para o que está atrás (roda → disco de freio → suspensão).
  - A **placa** cadastrada em *Meu veículo* aparece no carro (padrão Mercosul) e a **cor** da pintura pode ser trocada.
- **Aba Peças**: os 122 grupos e 194 diagramas do catálogo EPC. Zoom e arrasto no diagrama, tabela com nº OEM, supersessão, período, quantidade e preço de referência. Busca por nome, OEM ou referência.
- **Aba Histórico**: registro de troca/serviço com data, km, peças (OEM, quantidade, preço), mão de obra, oficina e observações.
- **Aba Reparos**: manutenção programada (intervalos do manual), especificações, problemas conhecidos, páginas do manual (abre o PDF na página certa) e buscas de vídeo no YouTube.
- **Livro de bordo** com abas: Veículo (ficha no visual do CRLV verde ou branco), Histórico (linha do tempo por ano; o selo do ano abre/fecha os serviços), Revisões (carimbos de em dia / vencido / atenção; tocar num item abre o texto completo e o último serviço feito), Despesas (gráfico de pizza grande no topo com a legenda embaixo, depois período, "Filtrar por" e "Ordenar por", que grudam no topo ao rolar; tocar na fatia de combustível mostra o consumo) e Ganhos. Cabeçalho e botões ficam fixos.
  - O caderno é montado uma vez ao abrir; trocar de aba ou tocar num item só redesenha a folha (sem o piscar escuro).
  - Abre sempre na última aba vista (guardada em `lancer-club-67.ui`, separada dos dados).
  - Tocar num serviço do Histórico ou de Despesas abre um menu com **Ver mais**, **Editar** e **Excluir**.
  - Tocar num item do painel de Alertas abre o registro **só daquele serviço** (os outros serviços programados não aparecem para marcar). Para anotar vários juntos, use “Anotar serviço” (botão com carimbo).
  - Registrar serviço: tipo com botão "i" explicando cada um (inclui **Estética**: lavagem, polimento, funilaria…), título opcionalmente gerado a partir das outras informações, e serviços programados com os mesmos ícones das revisões.
- **Configurações** (engrenagem, canto superior direito): tema claro, escuro ou do sistema (vale para o fundo do 3D), visual do documento, pontos no carro, backup, restauração e planilha.

- **Painel superior** (visual de painel de instrumentos):
  - **Hodômetro** moderno (visor digital) ou clássico (tambores). Toque e segure nele para editar o km e trocar o estilo; o estilo também fica em Configurações.
  - **Bomba**: registra um abastecimento numa tela com visual de bomba. Você digita o total e o preço do litro no visor, os litros são calculados, e os bicos escolhem o combustível (verde = etanol, amarelo = gasolina comum, vermelho = premium). Também dá para informar km, data, posto e salvar a **localização do posto** (GPS).
  - **Cor da bomba** (estimativa do tanque): verde = abastecido há pouco, amarelo = já usou entre 40% e 75% da autonomia, vermelho = mais de 75%, apagada = nenhum abastecimento. Autonomia = 59 L (tanque cheio; parcial = só os litros colocados) × consumo médio (sem medição: 10 km/L gasolina, 7 km/L etanol). Km rodados = hodômetro atualizado depois do abastecimento + ritmo de uso (km por dia dos lançamentos dos últimos 12 meses; sem histórico, 30 km/dia) nos dias seguintes. A tela da bomba mostra a conta. Depois será trocada pela leitura OBD2 (PENDENCIAS L02).
  - **Luzes de alerta**: vermelha = vencido, âmbar = vence em breve ou km desatualizado, cinza = sem registro. Se não couberem, descem para uma linha própria. Tocar abre o painel de alertas.
  - **Consumo médio (km/L)** ao lado da bomba, no mesmo visual do hodômetro.
- **Barra de navegação inferior**: Catálogo de peças (com busca), Livro de bordo (abre direto na última aba vista) e Manual do proprietário (pede confirmação antes de abrir). No canto direito, o **botão +** abre para cima os lançamentos rápidos, com fundo escurecido: Abastecimento, Anotar serviço e Lançar ganhos (cores das abas Despesas, Histórico e Ganhos). O + gira e vira ×.
- **Acima da barra, à esquerda**: botão para **enquadrar o carro inteiro** (qualquer que seja o filtro) e, embaixo dele, o **filtro** (mostra o nome por alguns segundos e depois só o ícone; azul = filtro ativo).
- **Personalizar**: toque e segure o carro (ou clique direito no PC) → "Personalizar veículo". O carrossel aparece na parte de baixo (aerofólio, placa dianteira, cor das rodas; "mais peças" em breve). As mudanças aparecem no carro na hora; ✓ salva e ✕ desfaz. Também fica em Configurações → Personalizar.
- **Fundo do 3D**: grade de engenharia sutil e vinheta escura no topo e nas bordas (só CSS, atrás do carro).
- **Consumo (km/L)**: marque "Completei o tanque" e informe o km ao abastecer. Entre dois tanques cheios, o app divide os km rodados pelos litros colocados (abastecimentos parciais no meio só somam litros). Aparece na bomba e em Despesas, com o custo do combustível por km.
- **Fotos e notas fiscais** nos registros de serviço: ficam no próprio aparelho (IndexedDB, `js/anexos.js`), reduzidas para cerca de 1600 px, e entram no backup.
- **Vencimentos** (aba Veículo do livro): IPVA (com opção "isento"), licenciamento, seguro (com opção "não tenho seguro") e CNH. Acendem no painel 30 dias antes (âmbar) e depois de vencidos (vermelho). O painel superior cresce em linhas quando há muitas luzes, para nenhum alerta ficar escondido.
  - **Pagamentos** de IPVA, licenciamento e seguro: na janela de cada um, "Anotar pagamento / renovação" (exercício, data paga e valor; cotas ou parcelas = um lançamento cada). O valor entra em **Despesas** (categoria Documentos) **na data em que foi pago**, e o vencimento pode avançar 1 ano no mesmo passo. Ex.: IPVA 2025 de R$ 1.000 e IPVA 2026 de R$ 800 aparecem cada um no mês em que foram pagos.
- **Backup**: Configurações → "Fazer backup agora". No celular abre o compartilhamento do Android (escolha Google Drive, e-mail…); no PC baixa o arquivo. Uma luz lembra de refazer o backup a cada 7, 15 ou 30 dias. Para backup automático direto no Google Drive, sem tocar em nada, seria preciso criar um projeto no Google Cloud (credencial OAuth); fica para uma próxima versão.
- **Relatório para revenda (PDF)**: Configurações ou aba Histórico. Abre a impressão do navegador; escolha "Salvar como PDF". Dá para ocultar valores, placa/chassi e o nome do proprietário.
- **Versão do carro**: no campo "Marca / Modelo / Versão" da ficha (lista com MT, HL, HL-T, HL-E, GT, GT AWD). Por enquanto o 3D é o mesmo para todas.
- **Valores em dinheiro** (bomba, ganhos, mão de obra, preço das peças e pagamentos de documentos) são digitados da direita para a esquerda, como na maquininha: 5-0-0-0 = R$ 50,00. O preço do litro tem 3 casas, como no visor da bomba (5-8-9-9 = R$ 5,899).
- **Placa no 3D**: Personalizar → "Placa dianteira" Original (centro) ou Lado (lado do motorista, entre o farol e o farol de neblina, como no Evo). O modelo da placa é automático: ABC1D23 = Mercosul; ABC1234 = antiga cinza (com UF e município da ficha); carro com 30 anos ou mais de fabricação = placa preta.
- **Lançar ganhos** (botão +; aplicativo, caronas, ajudas…): data inicial, data final e valor. A aba Ganhos do livro mostra os períodos e o saldo (ganhos − gastos com o carro).

### Navegação

- **3D**: arraste para girar em volta do carro e use roda/pinça para aproximar. Não há pan: o carro fica no lugar.
- **Menu deslizante** (topo central): arraste para os lados, use as setas ‹ › ou as setas do teclado. O carro gira até a região escolhida e ela fica destacada. A lista é circular e mostra só as regiões do filtro atual.
- **Filtro** (canto inferior esquerdo, acima da barra de navegação): abre para cima com Geral, Carroceria, Vidros e luzes, Mecânica, Motor, Transmissão, Suspensão, Freios, Direção, Elétrica e Interior. As peças do sistema escolhido ficam sólidas e o resto translúcido; Geral mostra o carro sem realce. Clicar numa peça fora do filtro troca para o sistema dela. No celular, o botão sobe junto com a gaveta de detalhes.
- **Tocar numa peça** abre a gaveta sempre na aba Peças, sem abrir o teclado (o "clique fantasma" que o celular gera logo depois do toque é ignorado). Os diagramas abrem do topo, o botão "voltar" fica preso no alto ao rolar e, ao voltar, a lista de grupos retorna ao ponto onde estava.
- **Livro de bordo** (barra de navegação): abre na última aba vista; as abas levam a Veículo, Histórico, Revisões, Despesas e Ganhos. O 3D fica pausado e desfocado enquanto o livro está aberto. (O menu do veículo do canto superior esquerdo saiu na v9.)

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
