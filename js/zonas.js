// Zonas clicáveis do carro → grupos do catálogo + conteúdo de manutenção/reparo.
// Fontes: Catálogo de peças Lancer GT CY4A (EPC Mitsubishi) e Manual do Proprietário Lancer 2012.
// "Problemas conhecidos" são relatos frequentes de proprietários/oficinas, não do fabricante.

const yt = q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);

export const VEICULO_BASE = {
  modelo: 'Mitsubishi Lancer GT',
  versao: '2.0 Sedan · 5MT (CY4A)',
  motor: '4B11 · 1.998 cm³ · 160 cv',
  mercado: 'Brasil · grade SNXHL1FB · produção 2009.07–2014.12',
  dimensoes: [
    ['Comprimento', '4.570 mm'], ['Largura', '1.760 mm'], ['Altura', '1.490 mm'],
    ['Entre-eixos', '2.635 mm'], ['Bitola diant./tras.', '1.530 / 1.530 mm'], ['Vão livre', '150 mm'],
    ['Peso (sem opcionais)', '1.330 kg'], ['Tanque', '59 L'], ['Velocidade máx.', '200 km/h'],
  ],
};

// Lembretes de manutenção. km/meses do manual (tabela "Especificações de fluidos e lubrificantes");
// itens com null não têm intervalo no manual — o usuário define.
export const LEMBRETES_PADRAO = [
  { id: 'oleo', nome: 'Troca de óleo e filtro', zona: 'motor', km: 10000, meses: 6,
    detalhe: '4,0 L + 0,3 L no filtro · API SG, ACEA A1/B1, SAE 10W-40 ou superior', fonte: 'Manual · Especificações de fluidos' },
  { id: 'fluido_freio', nome: 'Troca do fluido de freio (DOT 4)', zona: 'freios', km: 40000, meses: 24,
    detalhe: 'DOT 4 · verificar nível semanalmente', fonte: 'Manual · Especificações de fluidos' },
  { id: 'arrefecimento', nome: 'Inspeção do líquido de arrefecimento', zona: 'arrefecimento', km: 10000, meses: null,
    detalhe: 'Mitsubishi Super Long Life Premium Coolant', fonte: 'Manual · Especificações de fluidos' },
  { id: 'direcao', nome: 'Inspeção do fluido da direção hidráulica', zona: 'direcao', km: 20000, meses: null,
    detalhe: 'Dexron II, III ou equivalente', fonte: 'Manual · Especificações de fluidos' },
  { id: 'cambio', nome: 'Inspeção do óleo do câmbio manual', zona: 'transmissao', km: 20000, meses: null,
    detalhe: '2,5 L · API GL-3 SAE 75W-80 ou superior · trocar se necessário', fonte: 'Manual · Especificações de fluidos' },
  { id: 'velas', nome: 'Troca das velas de ignição', zona: 'eletrica', km: null, meses: null,
    detalhe: 'NGK FR6EI ou DENSO K20PSR-B8 · intervalo no Livrete de Bordo', fonte: 'Manual · Dados técnicos 10-4' },
  { id: 'filtro_ar', nome: 'Troca do filtro de ar do motor', zona: 'admissao', km: null, meses: null,
    detalhe: 'Intervalo no Livrete de Bordo', fonte: 'Defina o intervalo' },
  { id: 'filtro_cabine', nome: 'Troca do filtro de ar da cabine', zona: 'climatizacao', km: null, meses: null,
    detalhe: 'Purificador de ar — manual pág. 6-11', fonte: 'Defina o intervalo' },
  { id: 'rodizio', nome: 'Rodízio dos pneus', zona: 'rodas', km: null, meses: null,
    detalhe: 'Sempre que houver diferença de desgaste entre dianteiros e traseiros (manual 9-13)', fonte: 'Defina o intervalo' },
];

export const ZONAS = [
  // ── Externas ──────────────────────────────────────────────
  { id: 'capo', nome: 'Capô', modo: 'ext', grupos: ['16.07'], vista: [1, 0.9, 0.5],
    specs: [],
    manual: [['Capô — abrir e fechar', '9-3'], ['Cuidados nos serviços', '9-2']],
    problemas: [
      { t: 'Verniz descascando ou queimado', s: 'Manchas esbranquiçadas e perda de brilho, principalmente em carros que ficam ao sol.', c: 'Degradação do verniz por UV — relato comum em Mitsubishi dessa época.', g: 'baixa' },
      { t: 'Amortecedor/vareta do capô', s: 'Capô não fica aberto com segurança.', c: 'Vareta de sustentação ou presilha danificada.', g: 'baixa' },
    ],
    videos: [['Ajuste da fechadura do capô', 'lancer capô fechadura ajuste'], ['Polimento e vitrificação', 'lancer polimento verniz capô']] },
  { id: 'parachoque_d', nome: 'Para-choque dianteiro e grade', modo: 'ext', grupos: ['16.03', '16.12', '16.05', '18.01', '18.02'], vista: [1, 0.35, 0.25],
    problemas: [
      { t: 'Presilhas e suportes quebrados', s: 'Para-choque desalinhado, folga entre para-choque e para-lama.', c: 'Batidas em guias/lombadas — suportes plásticos (grupo 16.03) quebram.', g: 'baixa' },
      { t: 'Defletor inferior danificado', s: 'Raspa em valetas; peça solta arrastando.', c: 'Altura baixa do para-choque com rodas 18".', g: 'baixa' },
    ],
    videos: [['Remover para-choque dianteiro', 'lancer remover parachoque dianteiro']] },
  { id: 'farois', nome: 'Faróis e luzes dianteiras', modo: 'ext', grupos: ['21.04', '21.03', '21.05'], vista: [1, 0.4, 0.8],
    manual: [['Troca de lâmpadas', '9-23'], ['Nivelamento automático do farol', '4-52']],
    problemas: [
      { t: 'Lente amarelada ou opaca', s: 'Iluminação fraca à noite.', c: 'Policarbonato degradado por UV.', g: 'media' },
      { t: 'Condensação dentro do farol', s: 'Gotículas de água na lente.', c: 'Respiro ou vedação da carcaça comprometidos.', g: 'baixa' },
    ],
    videos: [['Trocar lâmpada do farol', 'lancer trocar lampada farol'], ['Restaurar farol amarelado', 'lancer restauração farol']] },
  { id: 'paralamas', nome: 'Para-lamas dianteiros', modo: 'ext', grupos: ['16.01', '16.11'], vista: [0.6, 0.4, 1],
    problemas: [{ t: 'Para-barro/protetor de caixa de roda solto', s: 'Barulho de plástico raspando no pneu.', c: 'Presilhas perdidas (grupo 16.11).', g: 'baixa' }],
    videos: [['Trocar parabarro do Lancer', 'lancer parabarro caixa de roda']] },
  { id: 'porta_d', nome: 'Portas dianteiras', modo: 'ext', grupos: ['17.01', '17.02', '17.03', '17.04', '16.08'], vista: [0.2, 0.4, 1],
    manual: [['Portas', '2-26'], ['Controles dos vidros elétricos', '2-38'], ['Chaves', '2-2']],
    problemas: [
      { t: 'Vidro elétrico lento ou travando', s: 'Vidro sobe devagar, para no meio ou desce torto.', c: 'Máquina do vidro (17.04) com cabo desgastado ou motor fraco.', g: 'media' },
      { t: 'Forro da porta com ruído', s: 'Rangidos ao passar em buracos.', c: 'Presilhas do forro (17.03) soltas.', g: 'baixa' },
    ],
    videos: [['Remover forro da porta', 'lancer remover forro porta dianteira'], ['Trocar máquina de vidro', 'lancer maquina de vidro porta']] },
  { id: 'porta_t', nome: 'Portas traseiras', modo: 'ext', grupos: ['17.05', '17.06', '17.07', '17.08'], vista: [-0.3, 0.4, 1],
    manual: [['Travas de segurança para crianças', '2-30'], ['Controles dos vidros elétricos', '2-38']],
    problemas: [{ t: 'Vidro elétrico lento ou travando', s: 'Vidro trava ou faz barulho.', c: 'Máquina do vidro (17.08).', g: 'media' }],
    videos: [['Máquina de vidro traseira', 'lancer maquina vidro porta traseira']] },
  { id: 'retrovisores', nome: 'Retrovisores externos', modo: 'ext', grupos: ['18.03'], vista: [0.6, 0.6, 1],
    manual: [['Retrovisores externos', '5-8']],
    problemas: [{ t: 'Rebatimento ou ajuste elétrico falhando', s: 'Espelho não regula ou faz ruído.', c: 'Motor de ajuste do retrovisor.', g: 'baixa' }],
    videos: [['Trocar retrovisor do Lancer', 'lancer trocar retrovisor']] },
  { id: 'parabrisa', nome: 'Para-brisa, limpadores e torpedo', modo: 'ext', grupos: ['16.19', '21.15', '16.04'], vista: [1, 1, 0.3],
    manual: [['Limpador e lavador do para-brisa', '4-58'], ['Troca das palhetas', '9-16'], ['Líquido lavador', '9-7']],
    problemas: [
      { t: 'Palhetas trepidando', s: 'Ruído e faixas no vidro.', c: 'Borracha ressecada; braço com pressão irregular.', g: 'baixa' },
      { t: 'Água no assoalho dianteiro', s: 'Carpete úmido após chuva.', c: 'Drenos do torpedo (16.04) entupidos com folhas.', g: 'media' },
    ],
    specs: [['Reservatório do lavador', '4,0 L (5,0 L com lavador de farol)']],
    videos: [['Trocar palheta do Lancer', 'lancer trocar palheta limpador'], ['Desentupir dreno do torpedo', 'lancer dreno torpedo agua']] },
  { id: 'teto', nome: 'Teto, colunas e estrutura', modo: 'ext', grupos: ['16.16', '16.17', '16.09', '19.04', '21.01'], vista: [0.2, 1.4, 0.6],
    problemas: [{ t: 'Verniz do teto descascando', s: 'Áreas foscas ou esbranquiçadas no teto.', c: 'Degradação por UV — relato comum.', g: 'baixa' }],
    videos: [['Antena do Lancer', 'lancer antena teto troca']] },
  { id: 'vidro_t', nome: 'Vidro traseiro', modo: 'ext', grupos: ['16.15'], vista: [-1, 1, 0.3],
    manual: [['Desembaçador do vidro traseiro', '4-64']],
    problemas: [{ t: 'Desembaçador sem funcionar', s: 'Uma ou mais linhas não aquecem.', c: 'Filamento interrompido ou terminal solto.', g: 'baixa' }],
    videos: [['Reparar desembaçador', 'reparo desembaçador vidro traseiro']] },
  { id: 'porta_malas', nome: 'Tampa e porta-malas', modo: 'ext', grupos: ['16.18', '18.04', '19.01', '23.01'], vista: [-1, 0.8, 0.5],
    manual: [['Tampa do porta-malas', '2-31'], ['Ferramentas e macaco', '8-6']],
    problemas: [{ t: 'Tampa não abre pelo botão', s: 'Só abre pela chave.', c: 'Atuador ou interruptor da fechadura (16.18).', g: 'baixa' }],
    videos: [['Fechadura do porta-malas', 'lancer fechadura porta malas']] },
  { id: 'lanternas', nome: 'Lanternas traseiras', modo: 'ext', grupos: ['21.10'], vista: [-1, 0.5, 0.9],
    manual: [['Troca de lâmpadas', '9-23']],
    problemas: [{ t: 'Infiltração de água na lanterna', s: 'Água acumulada; lâmpadas queimando.', c: 'Vedação da lanterna ressecada.', g: 'baixa' }],
    videos: [['Trocar lâmpada da lanterna', 'lancer lampada lanterna traseira']] },
  { id: 'parachoque_t', nome: 'Para-choque traseiro', modo: 'ext', grupos: ['16.13', '16.14', '16.10'], vista: [-1, 0.3, 0.3],
    problemas: [{ t: 'Para-choque desencaixado nas laterais', s: 'Folga perto da caixa de roda.', c: 'Guias plásticas quebradas (16.13).', g: 'baixa' }],
    videos: [['Remover para-choque traseiro', 'lancer remover parachoque traseiro']] },
  { id: 'lateral_t', nome: 'Laterais traseiras e tampa do tanque', modo: 'ext', grupos: ['16.06', '16.02', '18.05'], vista: [-0.6, 0.4, 1],
    manual: [['Abastecendo o veículo', '1-21']],
    problemas: [{ t: 'Portinhola do tanque não abre', s: 'Alavanca puxa mas a tampa não solta.', c: 'Cabo ou trava (16.06).', g: 'baixa' }],
    videos: [['Portinhola do tanque', 'lancer portinhola tanque cabo']] },
  { id: 'rodas', nome: 'Rodas, pneus e cubos', modo: 'ext', grupos: ['11.01', '09.02', '10.01'], vista: [0.5, 0.25, 1],
    specs: [['Pneu', '215/45 R18 89W'], ['Roda', '18 × 7 J · offset 46 mm'], ['Calibragem', '32 psi (220 kPa) diant. e tras.'], ['Estepe', 'T125/70 D16 · 60 psi'], ['Torque', 'Ver Livrete / oficina']],
    manual: [['Pneus — pressão', '9-11'], ['Troca e rodízio dos pneus', '9-13'], ['Como trocar um pneu', '8-7'], ['Ferramentas e macaco', '8-6']],
    problemas: [
      { t: 'Roda empenada / bolha no pneu', s: 'Vibração no volante entre 80–120 km/h.', c: 'Perfil baixo (45) é sensível a buracos.', g: 'media' },
      { t: 'Desgaste interno dos pneus traseiros', s: 'Banda interna gasta antes.', c: 'Cambagem traseira/buchas da suspensão traseira — verificar alinhamento.', g: 'media' },
      { t: 'Rolamento de roda', s: 'Ronco que aumenta com a velocidade e muda em curvas.', c: 'Cubo/rolamento (09.02 / 10.01).', g: 'alta' },
    ],
    videos: [['Rodízio de pneus', 'rodizio de pneus como fazer'], ['Trocar rolamento de roda Lancer', 'lancer rolamento roda dianteira']] },

  // ── Mecânica (raio X) ─────────────────────────────────────
  { id: 'motor', nome: 'Motor 4B11', modo: 'int', grupos: ['01.01', '01.02', '01.03', '01.04', '01.05', '01.06', '01.07', '01.08', '01.09', '01.10', '01.11', '01.12', '02.01'], vista: [0.8, 1, 0.8],
    specs: [['Motor', '4B11 · 4 cil. em linha · 16V · DOHC'], ['Cilindrada', '1.998 cm³ (86 × 86 mm)'], ['Potência', '160 cv a 6.000 rpm'], ['Torque', '20,1 kgf·m a 4.200 rpm'],
      ['Óleo', '4,0 L + 0,3 L filtro · SAE 10W-40 ou superior'], ['Troca de óleo', 'A cada 10.000 km ou 6 meses'], ['Distribuição', 'Corrente (MN183891 → 1140A073)'], ['Folga de válvulas', 'Tuchos calibrados 1032A101…147 (passo 0,015 mm)']],
    manual: [['Óleo do motor — verificação e troca', '9-4'], ['Superaquecimento do motor', '8-4'], ['Luzes de advertência', '4-42']],
    problemas: [
      { t: 'Coxim do motor gasto', s: 'Vibração em marcha lenta e tranco ao engatar/soltar embreagem.', c: 'Coxins (01.06) — o do lado da distribuição é o mais citado.', g: 'media' },
      { t: 'Vazamento na tampa de válvulas', s: 'Óleo no cabeçote, cheiro de queimado.', c: 'Junta da tampa (01.11) ressecada.', g: 'baixa' },
      { t: 'Ruído de válvulas (tic-tic)', s: 'Ruído metálico rítmico no cabeçote.', c: 'Folga de válvulas fora do especificado — tuchos mecânicos exigem regulagem por troca de tucho.', g: 'media' },
      { t: 'Retentor do virabrequim', s: 'Gotejamento de óleo na região da correia.', c: 'Retentor dianteiro 1052A809 → 1052B433.', g: 'baixa' },
    ],
    videos: [['Troca de óleo Lancer 2.0', 'lancer 2.0 troca de oleo 4b11'], ['Troca coxim do motor Lancer', 'lancer coxim motor troca'], ['Regulagem de válvulas 4B11', '4b11 valve clearance adjustment']] },
  { id: 'admissao', nome: 'Admissão, injeção e emissões', modo: 'int', grupos: ['05.01', '05.05', '03.01', '03.04', '05.02'], vista: [0.6, 1, -0.8],
    manual: [['Escolha de combustível', '1-20']],
    problemas: [
      { t: 'Corpo de borboleta sujo', s: 'Marcha lenta irregular ou alta, motor “morrendo”.', c: 'Acúmulo de carvão no corpo de borboleta (03.04).', g: 'media' },
      { t: 'Filtro de ar saturado', s: 'Perda de desempenho e consumo maior.', c: 'Elemento do filtro (05.01) vencido.', g: 'baixa' },
    ],
    videos: [['Limpeza do TBI Lancer', 'lancer limpeza corpo de borboleta'], ['Trocar filtro de ar Lancer', 'lancer filtro de ar motor troca']] },
  { id: 'arrefecimento', nome: 'Arrefecimento e radiador', modo: 'int', grupos: ['04.01', '04.02', '04.03'], vista: [1, 0.8, 0.6],
    specs: [['Capacidade', '7,0 L (inclui 0,65 L no reservatório)*'], ['Fluido', 'Mitsubishi Super Long Life Premium Coolant'], ['Inspeção', 'A cada 10.000 km · nível semanal'], ['*Obs.', 'A tabela de fluidos do manual cita 7,5 L']],
    manual: [['Líquido de arrefecimento', '9-6'], ['Superaquecimento do motor', '8-4']],
    problemas: [
      { t: 'Vazamento na bomba d’água', s: 'Nível baixando, crosta rosada perto da bomba.', c: 'Selo da bomba (04.03) — relato comum no 4B11 com quilometragem alta.', g: 'alta' },
      { t: 'Carcaça da válvula termostática', s: 'Vazamento na conexão de saída do motor.', c: 'Junta/carcaça (04.02).', g: 'media' },
      { t: 'Radiador com colmeia danificada', s: 'Temperatura sobe no trânsito.', c: 'Aletas obstruídas ou vazamento no tanque plástico (04.01).', g: 'media' },
    ],
    videos: [['Trocar bomba d’água 4B11', 'lancer 4b11 bomba dagua troca'], ['Sangria do arrefecimento', 'lancer sangria sistema arrefecimento']] },
  { id: 'eletrica', nome: 'Bateria, alternador, ignição e partida', modo: 'int', grupos: ['21.02', '06.01', '06.02', '06.03', '06.04', '21.06', '21.11', '21.16'], vista: [0.8, 1, -1],
    specs: [['Bateria', '55D23L (356 CCA) · 75D23L opcional'], ['Alternador', '105 A · 12 V'], ['Velas', 'NGK FR6EI · DENSO K20PSR-B8']],
    manual: [['Bateria', '9-8'], ['Partida de emergência', '8-2'], ['Fusíveis e ligações dos fusíveis', '9-18']],
    problemas: [
      { t: 'Bobina de ignição falhando', s: 'Motor “falhando”, luz de injeção, trepidação.', c: 'Bobina individual (06.03) — falha comum no 4B11; trocar a defeituosa após diagnóstico.', g: 'media' },
      { t: 'Bateria fraca', s: 'Partida lenta, especialmente pela manhã.', c: 'Bateria em fim de vida ou terminal oxidado.', g: 'media' },
    ],
    videos: [['Trocar velas Lancer 2.0', 'lancer 2.0 trocar velas bobinas'], ['Teste de alternador', 'como testar alternador multimetro']] },
  { id: 'transmissao', nome: 'Embreagem, câmbio e semieixos', modo: 'int', grupos: ['07.01', '07.02', '08.01', '08.02', '08.03', '08.04', '08.05', '09.01'], vista: [0.4, 0.6, -1],
    specs: [['Câmbio', 'Manual 5 marchas'], ['Óleo', '2,5 L · API GL-3 SAE 75W-80'], ['Inspeção do óleo', 'A cada 20.000 km'], ['Fluido da embreagem', 'DOT 4 (mesmo do freio)']],
    manual: [['Transmissão manual', '5-14'], ['Fluido da embreagem', '9-7']],
    problemas: [
      { t: 'Vazamento no cilindro da embreagem', s: 'Pedal baixo/esponjoso, fluido baixando.', c: 'Cilindro mestre ou auxiliar (07.02).', g: 'media' },
      { t: 'Coifa da homocinética rasgada', s: 'Graxa espalhada na roda; estalo em curvas.', c: 'Coifa (09.01) — trocar antes de danificar a junta.', g: 'media' },
      { t: 'Engates duros', s: 'Dificuldade para engatar, principalmente a frio.', c: 'Óleo vencido ou cabos/trambulador (08.02, 08.04).', g: 'baixa' },
    ],
    videos: [['Trocar óleo do câmbio Lancer', 'lancer troca oleo cambio manual'], ['Kit de embreagem Lancer', 'lancer troca kit embreagem']] },
  { id: 'escapamento', nome: 'Escapamento e catalisador', modo: 'int', grupos: ['05.03', '05.04'], vista: [-0.2, -0.4, 1],
    problemas: [
      { t: 'Coxim/borracha do escapamento', s: 'Batidas embaixo do carro em lombadas.', c: 'Suportes de borracha (05.04).', g: 'baixa' },
      { t: 'Catalisador obstruído', s: 'Perda de potência, cheiro de ovo podre.', c: 'Falha de combustão prolongada danifica o catalisador.', g: 'alta' },
    ],
    videos: [['Escapamento do Lancer', 'lancer escapamento coxim']] },
  { id: 'tanque', nome: 'Tanque e linha de combustível', modo: 'int', grupos: ['03.03', '03.02'], vista: [-0.6, -0.2, 1],
    specs: [['Capacidade', '59 L (2WD)'], ['Combustível', 'Gasolina (até o teor de etanol previsto em lei)']],
    manual: [['Escolha de combustível', '1-20'], ['Abastecendo', '1-21']],
    problemas: [{ t: 'Bomba de combustível fraca', s: 'Falha em alta rotação; demora para pegar.', c: 'Bomba/filtro no tanque (03.03).', g: 'alta' }],
    videos: [['Bomba de combustível Lancer', 'lancer bomba combustivel troca']] },
  { id: 'susp_d', nome: 'Suspensão dianteira', modo: 'int', grupos: ['12.01', '12.02'], vista: [0.7, 0.3, 1],
    problemas: [
      { t: 'Bieletas da barra estabilizadora', s: 'Batidinhas secas em pisos irregulares.', c: 'Pivôs das bieletas (12.01) com folga — muito comum.', g: 'baixa' },
      { t: 'Buchas da bandeja', s: 'Estalo ao frear/acelerar; volante puxando.', c: 'Buchas traseiras da bandeja (12.01).', g: 'media' },
      { t: 'Coxim do amortecedor', s: 'Ruído ao esterçar parado.', c: 'Coxim/rolamento superior (12.02).', g: 'media' },
    ],
    videos: [['Trocar bieleta Lancer', 'lancer bieleta dianteira troca'], ['Amortecedor dianteiro Lancer', 'lancer amortecedor dianteiro troca']] },
  { id: 'susp_t', nome: 'Suspensão traseira (multilink)', modo: 'int', grupos: ['13.01'], vista: [-0.7, 0.3, 1],
    problemas: [
      { t: 'Buchas dos braços traseiros', s: 'Desgaste irregular dos pneus, ruído em lombadas.', c: 'Buchas dos braços do multilink (13.01).', g: 'media' },
      { t: 'Amortecedores traseiros', s: 'Traseira “flutuando” em ondulações.', c: 'Amortecedores vencidos.', g: 'media' },
    ],
    videos: [['Suspensão traseira Lancer', 'lancer suspensão traseira bucha braço']] },
  { id: 'freios', nome: 'Freios e ABS', modo: 'int', grupos: ['14.05', '14.09', '14.01', '14.02', '14.03', '14.04', '14.06', '14.07', '14.08'], vista: [0.6, 0.4, 1],
    specs: [['Fluido', 'DOT 4 · troca a cada 40.000 km ou 2 anos'], ['Dianteiro', 'Disco e pinça (14.05) · disco no grupo 09.02'], ['Traseiro', 'Disco e pinça + sapatas do freio de estacionamento (14.09)']],
    manual: [['Fluido de freio', '9-7'], ['Freio de estacionamento', '5-3'], ['Freios / ABS', '5-26']],
    problemas: [
      { t: 'Pastilhas e discos', s: 'Chiado, vibração no pedal ao frear.', c: 'Desgaste ou disco empenado (14.05 / 14.09).', g: 'alta' },
      { t: 'Sensor de ABS', s: 'Luz do ABS acesa.', c: 'Sensor (14.02) sujo ou chicote danificado.', g: 'media' },
      { t: 'Freio de mão com curso longo', s: 'Alavanca sobe muitos “cliques”.', c: 'Lona/regulagem do freio de estacionamento (14.07).', g: 'media' },
    ],
    videos: [['Trocar pastilha dianteira Lancer', 'lancer troca pastilha freio dianteiro'], ['Sangria do freio', 'sangria fluido freio dot4 como fazer']] },
  { id: 'direcao', nome: 'Direção hidráulica', modo: 'int', grupos: ['15.01', '15.02', '15.03', '15.04', '15.05'], vista: [0.6, 1, -0.6],
    specs: [['Fluido', 'Dexron II, III ou equivalente'], ['Inspeção', 'A cada 20.000 km · nível semanal'], ['Raio de curva', '5,4 m (carroceria)']],
    manual: [['Fluido da direção hidráulica', '9-8'], ['Direção hidráulica', '5-31'], ['Ajuste do volante', '5-6']],
    problemas: [
      { t: 'Ruído/assobio da bomba', s: 'Chiado ao esterçar, pior a frio.', c: 'Fluido baixo ou bomba (15.02) desgastada.', g: 'media' },
      { t: 'Vazamento na caixa ou mangueiras', s: 'Manchas de fluido sob o motor.', c: 'Mangueira de pressão (15.01) ou retentores da caixa (15.04).', g: 'media' },
      { t: 'Terminal de direção com folga', s: 'Volante com folga, batida na frente.', c: 'Terminal/barra axial (15.04).', g: 'alta' },
    ],
    videos: [['Fluido da direção Lancer', 'lancer fluido direção hidraulica troca'], ['Terminal de direção Lancer', 'lancer terminal direção troca']] },
  { id: 'painel', nome: 'Painel, console e acabamento interno', modo: 'int', grupos: ['19.05', '19.02', '21.07', '21.09', '21.13', '21.14', '21.08', '21.12', '19.06', '19.07', '19.03', '19.08'], vista: [-0.4, 1.2, 0.6],
    manual: [['Painel de instrumentos', '4-2'], ['Luzes de advertência', '4-42'], ['Sistema de áudio', '6-12']],
    problemas: [
      { t: 'Ruídos no painel', s: 'Rangidos e estalos no acabamento.', c: 'Presilhas e encaixes plásticos (19.05 / 19.06).', g: 'baixa' },
      { t: 'Iluminação do quadro/botões', s: 'Lâmpadas de botões apagadas.', c: 'Lâmpadas/LEDs dos interruptores (21.14).', g: 'baixa' },
    ],
    videos: [['Desmontar painel do Lancer', 'lancer desmontar painel console']] },
  { id: 'bancos', nome: 'Bancos e cintos de segurança', modo: 'int', grupos: ['20.01', '20.02', '20.03'], vista: [-0.2, 1.4, 1],
    manual: [['Bancos', '3-2'], ['Cintos de segurança', '3-8'], ['Airbag (SRS)', '3-20']],
    problemas: [{ t: 'Cinto não recolhe', s: 'Cinto fica frouxo/lento para recolher.', c: 'Retrator (20.03) sujo ou com mola fraca.', g: 'media' }],
    videos: [['Remover banco do Lancer', 'lancer remover banco dianteiro']] },
  { id: 'climatizacao', nome: 'Ar-condicionado e ventilação', modo: 'int', grupos: ['22.01', '22.02', '22.03', '22.04', '22.05'], vista: [1, 0.6, -0.4],
    specs: [['Gás refrigerante', 'HFC-134a · 480–520 g']],
    manual: [['Ar-condicionado automático', '6-5'], ['Purificador de ar (filtro)', '6-11'], ['Ventilação', '6-2']],
    problemas: [
      { t: 'Condensador furado', s: 'Ar para de gelar aos poucos.', c: 'Condensador (22.02) exposto a pedras na frente do radiador.', g: 'media' },
      { t: 'Embreagem do compressor', s: 'Ar não gela; compressor não acopla.', c: 'Folga ou bobina da embreagem eletromagnética (22.02).', g: 'media' },
      { t: 'Cheiro de mofo', s: 'Odor ao ligar a ventilação.', c: 'Filtro de cabine vencido; evaporador sujo (22.04).', g: 'baixa' },
    ],
    videos: [['Filtro de cabine Lancer', 'lancer filtro ar condicionado cabine troca'], ['Higienização do ar-condicionado', 'higienização ar condicionado carro']] },
];

// Camada de cada zona (marcação oculta). Ela decide o modo de visualização: clicar numa peça
// mecânica (ex.: roda) passa o switch para "Mecânica" automaticamente. Base para o futuro filtro de camadas.
export const CAMADAS = {
  carroceria: { nome: 'Carroceria', modo: 'ext' },
  perifericos: { nome: 'Periféricos', modo: 'ext' },
  mecanica: { nome: 'Mecânica', modo: 'int' },
  eletrica: { nome: 'Elétrica', modo: 'int' },
  interior: { nome: 'Interior', modo: 'int' },
};
const CAMADA_DA_ZONA = {
  capo: 'carroceria', parachoque_d: 'carroceria', paralamas: 'carroceria', porta_d: 'carroceria', porta_t: 'carroceria',
  teto: 'carroceria', porta_malas: 'carroceria', parachoque_t: 'carroceria', lateral_t: 'carroceria',
  farois: 'perifericos', lanternas: 'perifericos', retrovisores: 'perifericos', parabrisa: 'perifericos', vidro_t: 'perifericos',
  rodas: 'mecanica', motor: 'mecanica', admissao: 'mecanica', arrefecimento: 'mecanica', transmissao: 'mecanica', escapamento: 'mecanica',
  tanque: 'mecanica', susp_d: 'mecanica', susp_t: 'mecanica', freios: 'mecanica', direcao: 'mecanica', climatizacao: 'mecanica',
  eletrica: 'eletrica', painel: 'interior', bancos: 'interior',
};
for (const z of ZONAS) { z.camada = CAMADA_DA_ZONA[z.id]; z.modo = CAMADAS[z.camada].modo; }

export const ZONA_POR_ID = Object.fromEntries(ZONAS.map(z => [z.id, z]));

// Regiões do menu deslizante. A ordem segue a volta em torno do carro (como na oficina de um jogo de corrida):
// a cada passo a câmera gira para o lado seguinte. dir = de onde a câmera olha; alvo = ponto enquadrado.
const LATERAL = ['porta_d', 'porta_t', 'paralamas', 'lateral_t', 'retrovisores'];
export const REGIOES = {
  ext: [
    { id: 'geral', nome: 'Carro inteiro', zonas: [], dir: [5.6, 2.4, 5.2], dist: 8, alvo: [0, 0.6, 0] },
    { id: 'frente', nome: 'Para-choque dianteiro', zonas: ['parachoque_d', 'farois'], dir: [1, 0.22, 0.12], dist: 5.2, alvo: [1.9, 0.55, 0] },
    { id: 'capo', nome: 'Capô e faróis', zonas: ['capo', 'farois'], dir: [0.8, 0.75, 0.55], dist: 5.6, alvo: [1.4, 0.8, 0] },
    { id: 'lat_d', nome: 'Lateral direita', zonas: LATERAL, dir: [0.05, 0.22, 1], dist: 6.8, alvo: [0, 0.68, 0] },
    { id: 'malas', nome: 'Porta-malas e aerofólio', zonas: ['porta_malas', 'vidro_t', 'lanternas'], dir: [-0.8, 0.75, 0.55], dist: 5.6, alvo: [-1.75, 0.9, 0] },
    { id: 'tras', nome: 'Para-choque traseiro', zonas: ['parachoque_t', 'lanternas'], dir: [-1, 0.22, 0.12], dist: 5.2, alvo: [-2.0, 0.6, 0] },
    { id: 'lat_e', nome: 'Lateral esquerda', zonas: LATERAL, dir: [0.05, 0.22, -1], dist: 6.8, alvo: [0, 0.68, 0] },
    { id: 'teto', nome: 'Teto e vidros', zonas: ['teto', 'parabrisa', 'vidro_t'], dir: [0.3, 1.25, -0.8], dist: 7.6, alvo: [-0.1, 1.0, 0] },
  ],
  int: [
    { id: 'geral', nome: 'Mecânica completa', zonas: [], dir: [5.6, 3.2, 5.2], dist: 8, alvo: [0, 0.5, 0] },
    { id: 'arref', nome: 'Arrefecimento e A/C', zonas: ['arrefecimento', 'climatizacao'], dir: [1, 0.55, 0.35], dist: 3.8, alvo: [1.8, 0.5, 0.1] },
    { id: 'motor', nome: 'Motor e elétrica', zonas: ['motor', 'admissao', 'eletrica'], dir: [0.7, 1, 0.6], dist: 3.8, alvo: [1.5, 0.55, 0] },
    { id: 'susp_d', nome: 'Suspensão dianteira', zonas: ['susp_d'], dir: [0.45, 0.3, 1], dist: 3.6, alvo: [1.3, 0.5, 0.25] },
    { id: 'rodas', nome: 'Rodas e pneus', zonas: ['rodas'], dir: [0.4, 0.2, 1], dist: 6.2, alvo: [0.1, 0.42, 0.5] },
    { id: 'freios', nome: 'Freios e ABS', zonas: ['freios'], dir: [0.12, 0.4, 1], dist: 6, alvo: [0, 0.45, 0.3] },
    { id: 'escape', nome: 'Escapamento', zonas: ['escapamento'], dir: [0, 0.16, 1], dist: 6.4, alvo: [-0.2, 0.3, 0.3] },
    { id: 'tanque', nome: 'Tanque e combustível', zonas: ['tanque'], dir: [-0.5, 0.55, 1], dist: 4.2, alvo: [-1, 0.4, 0] },
    { id: 'susp_t', nome: 'Suspensão traseira', zonas: ['susp_t'], dir: [-0.75, 0.35, 0.9], dist: 3.6, alvo: [-1.3, 0.45, 0.25] },
    { id: 'interior', nome: 'Interior e painel', zonas: ['painel', 'bancos'], dir: [-0.4, 1.4, -0.5], dist: 4.4, alvo: [-0.2, 0.8, 0] },
    { id: 'transm', nome: 'Câmbio e embreagem', zonas: ['transmissao'], dir: [0.4, 0.6, -1], dist: 3.8, alvo: [1.2, 0.45, -0.3] },
    { id: 'direcao', nome: 'Direção', zonas: ['direcao'], dir: [0.6, 0.8, -0.9], dist: 3.8, alvo: [0.95, 0.6, -0.2] },
  ],
};
export const zonaDoGrupo = gid => ZONAS.find(z => z.grupos.includes(gid));
export const videoUrl = yt;

// Glossário PT para o primeiro termo das descrições do EPC (em inglês).
const GLOSSARIO = [
  ['SHOCK ABSORBER', 'Amortecedor'], ['SPARK PLUG', 'Vela de ignição'], ['OIL SEAL', 'Retentor'], ['SEAT BELT', 'Cinto de segurança'],
  ['PAD SET', 'Jogo de pastilhas'], ['SHOE SET', 'Jogo de sapatas'], ['CALIPER KIT', 'Pinça de freio'], ['DISC', 'Disco'],
  ['BOLT', 'Parafuso'], ['SCREW', 'Parafuso'], ['NUT', 'Porca'], ['WASHER', 'Arruela'], ['GASKET', 'Junta'], ['SEAL', 'Vedador'],
  ['BRACKET', 'Suporte'], ['CLIP', 'Presilha'], ['CLAMP', 'Abraçadeira'], ['HOSE', 'Mangueira'], ['PIPE', 'Tubo'], ['TUBE', 'Tubo'],
  ['COVER', 'Tampa/capa'], ['CAP', 'Tampa'], ['SPRING', 'Mola'], ['BEARING', 'Rolamento'], ['BUSHING', 'Bucha'], ['PLUG', 'Bujão/tampão'],
  ['VALVE', 'Válvula'], ['SWITCH', 'Interruptor'], ['SENSOR', 'Sensor'], ['LAMP', 'Lanterna/luz'], ['BULB', 'Lâmpada'], ['HARNESS', 'Chicote'],
  ['RELAY', 'Relé'], ['FUSE', 'Fusível'], ['MOULDING', 'Moldura'], ['GARNISH', 'Friso/acabamento'], ['PANEL', 'Painel'], ['GLASS', 'Vidro'],
  ['MIRROR', 'Espelho/retrovisor'], ['HANDLE', 'Maçaneta/puxador'], ['LOCK', 'Trava/fechadura'], ['HINGE', 'Dobradiça'], ['STRIKER', 'Batente'],
  ['WEATHERSTRIP', 'Borracha de vedação'], ['GROMMET', 'Ilhós'], ['PAD', 'Calço/almofada'], ['ROTOR', 'Disco'],
  ['CALIPER', 'Pinça'], ['SHOE', 'Sapata'], ['DRUM', 'Tambor'], ['STRUT', 'Amortecedor'], ['ARM', 'Braço/bandeja'], ['LINK', 'Bieleta/link'],
  ['BAR', 'Barra'], ['INSULATOR', 'Isolador/coxim'], ['MOUNT', 'Coxim'], ['BELT', 'Correia'], ['PULLEY', 'Polia'], ['TENSIONER', 'Tensor'],
  ['CHAIN', 'Corrente'], ['GUIDE', 'Guia'], ['SPROCKET', 'Engrenagem'], ['CAMSHAFT', 'Comando de válvulas'], ['CRANKSHAFT', 'Virabrequim'],
  ['PISTON', 'Pistão'], ['RING', 'Anel'], ['FILTER', 'Filtro'], ['ELEMENT', 'Elemento'], ['PUMP', 'Bomba'], ['RADIATOR', 'Radiador'],
  ['FAN', 'Ventoinha'], ['MOTOR', 'Motor elétrico'], ['THERMOSTAT', 'Válvula termostática'], ['TANK', 'Tanque/reservatório'],
  ['INJECTOR', 'Injetor'], ['COIL', 'Bobina'], ['ALTERNATOR', 'Alternador'], ['STARTER', 'Motor de partida'], ['BATTERY', 'Bateria'],
  ['CABLE', 'Cabo'], ['WIRE', 'Fio'], ['CLUTCH', 'Embreagem'], ['CYLINDER', 'Cilindro'], ['MUFFLER', 'Silencioso'], ['CONVERTER', 'Catalisador'],
  ['BUMPER', 'Para-choque'], ['FENDER', 'Para-lama'], ['HOOD', 'Capô'], ['DOOR', 'Porta'], ['GRILLE', 'Grade'], ['EMBLEM', 'Emblema'],
  ['ORNAMENT', 'Emblema'], ['SEAT', 'Banco'], ['CARPET', 'Carpete'], ['MAT', 'Tapete'], ['TRIM', 'Acabamento'], ['SPEAKER', 'Alto-falante'],
  ['ANTENNA', 'Antena'], ['WIPER', 'Limpador'], ['BLADE', 'Palheta'], ['NOZZLE', 'Esguicho'], ['HORN', 'Buzina'], ['METER', 'Instrumento'],
  ['KNOB', 'Botão'], ['LEVER', 'Alavanca'], ['PEDAL', 'Pedal'], ['BOOT', 'Coifa'], ['JOINT', 'Junta/articulação'], ['SHAFT', 'Eixo'],
  ['HUB', 'Cubo'], ['WHEEL', 'Roda'], ['TIRE', 'Pneu'], ['STUD', 'Prisioneiro'], ['PIN', 'Pino'], ['RETAINER', 'Retentor/trava'],
  ['SPACER', 'Espaçador'], ['SHIM', 'Calço'], ['TAPPET', 'Tucho'], ['LABEL', 'Etiqueta'], ['PLATE', 'Placa'], ['CASE', 'Carcaça'],
  ['HOUSING', 'Carcaça'], ['ACTUATOR', 'Atuador'], ['REGULATOR', 'Máquina de vidro/regulador'], ['CONDENSER', 'Condensador'],
  ['COMPRESSOR', 'Compressor'], ['EVAPORATOR', 'Evaporador'], ['DUCT', 'Duto'], ['HEADLAMP', 'Farol'], ['HEADLINING', 'Forro do teto'],
  ['SUNVISOR', 'Para-sol'], ['GAUGE', 'Medidor'], ['MANIFOLD', 'Coletor'], ['MODULATOR', 'Modulador'], ['BOOSTER', 'Servo-freio'],
  ['MEMBER', 'Agregado/travessa'], ['STABILIZER', 'Estabilizador'], ['UNIT', 'Unidade'], ['BAND', 'Cinta'], ['KEY', 'Chave'], ['FASTENER', 'Fixador'],
  ['RIVET', 'Rebite'], ['TAPE', 'Fita'], ['SHIELD', 'Protetor'], ['PROTECTOR', 'Protetor'], ['STAY', 'Haste'], ['ROD', 'Haste/vareta'],
];
export function traduz(desc) {
  const d = (desc || '').toUpperCase();
  const first = d.split(',')[0].trim();
  for (const [en, pt] of GLOSSARIO) {
    if (first === en || first.startsWith(en + ' ') || first.endsWith(' ' + en) || first === en + 'S') return pt;
  }
  return '';
}
