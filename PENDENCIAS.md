# Pendências e ideias — Lancer Club 67

Lista de ideias registradas e o que implementar nas próximas versões.
Código: `L` + número sequencial (nunca reaproveitar um código, mesmo se a ideia for descartada).

**Status:** 💡 ideia · 📌 aprovada (implementar) · 🚧 em andamento · ✅ feita (versão) · ❌ descartada

| Código | Ideia | Status | Origem | Observações |
|---|---|---|---|---|
| L01 | Notificações push (lembretes de revisão, vencimento de documentos, backup) | 💡 | v6 (ideia 6) | Adiada para versão futura. No Android funciona com PWA instalado; precisa de permissão do usuário. |
| L02 | Leitura OBD2 via Bluetooth (km, códigos de falha, sensores, nível de combustível) | 💡 | v6 (ideia 7) | Adiada. Web Bluetooth no Chrome Android + adaptador ELM327 BLE. Desde a v9 a cor da bomba do painel é uma estimativa (`nivelBomba()` em `js/main.js`); com OBD2, trocar pelo nível real do tanque (PID 0x2F). |
| L03 | Versão do veículo (MT, HL, HL-T, HL-E, GT, GT AWD) alterar o modelo 3D | 💡 | v6 | Hoje o campo é só informativo. Depende de modelos/peças de cada versão do CY4A. |
| L04 | Usar logo de brasão e logo simplificada no app | 💡 | v7 | Arquivos já em `marca/` (`logo-completa.png`, `logo-simplificada.png`). Substituir pelos originais do designer quando houver. |
| L05 | Backup automático no Google Drive (sem ação do usuário) | 💡 | v6 | Requer projeto no Google Cloud com credencial OAuth. Hoje o backup é manual via compartilhamento. |
| L06 | Personalizar mais peças (além de aerofólio, rodas e placa) | 💡 | v5 | Botão já existe desabilitado com balão "em breve". |
| L07 | Identificação rápida do posto pela localização salva no abastecimento | 💡 | v8 | Desde a v8 o abastecimento guarda `geo: { lat, lng, prec }`. Ideia: sugerir o nome do posto quando a localização bater com um abastecimento anterior (sem internet) ou consultar um serviço de mapas. |
| L08 | Biblioteca de peças 3D (para-choques, capôs, para-lamas, aerofólios, saias, teto solar, Sportback, Evo) ligada às versões | ❌ adiada | v10 (teste) | Testada em `lancer-garagem-teste` (10/11/2026) e **não aprovada**; nada desses 3D vai para o app hospedado. Problemas: (a) Sportback e Evo só apareciam na Personalização, não em Veículo → Editar; (b) emendas desalinhadas entre peças de modelos diferentes; para-choque GT (derivado do Evo) fora do carro e capô do Evo mais baixo, o que exige ajuste manual ou modelagem refinada sobre uma base única; (c) "sem saia" foi tratado como remover a peça, mas no carro real é um spoiler/extensão: a soleira/caixa de ar continua lá (o mesmo vale para os spoilers do para-choque). Se voltar: modelar as variações sobre a mesma malha do Lancer do app. A cópia de teste e os originais (`../lancer-garagem-originais`) ficam guardados para referência. |
| L09 | Rodas por versão (3 desenhos vendidos no Brasil 2011–2019: dois aros 18" e um 16") na Personalização | 💡 | v10 (teste) | Foi a parte que funcionou bem no teste: aro trocado por desenho, escalado para a medida e pneu gerado pela medida (ex.: 205/60 R16), na posição certa. A roda atual do modelo é uma das três (Enkei). As outras duas precisam ser modeladas a partir de fotos. Ver a discussão de 10/11/2026. |
| L10 | Aviso de calibragem dos pneus no painel (cartão flutuante com a tabela do manual e "marcar como calibrado") | ✅ v10 | v9.1 (uso) | Âmbar 2 dias antes do fim do intervalo (padrão 15 dias: dias 13–15), vermelho depois. Guarda só a última calibragem (`config.calibragem`). O manual (pág. 9-11) traz um valor só para qualquer carga: 32 psi (215/45 R18) e 60 psi no estepe. Para medidas fora do manual, o cartão pede para conferir a etiqueta da porta. |
| L11 | Personalizar → Pneus (largura, perfil e aro; frente e trás, só frente ou só trás) | ✅ v10.1 | v9.1 (uso) | v10: listas fechadas em ±3%. v10.1: qualquer combinação (largura 185–265, perfil 30–65, aro 16–20), com aviso para confirmar quando o diâmetro passa de ±3% do original (650,7 mm); medidas por eixo (`config.pneu` e `config.pneuTras`). O 3D deforma o próprio pneu do modelo (mantém a banda de rodagem e o talão no aro) e escala o aro Enkei atual; o desenho das outras rodas continua na L09. |
| L12 | Aerofólios Duckbill e Evolution em Personalizar → Aerofólio | 💡 | v10.1.1 | Já aparecem no menu como "em breve" (só Sem e GT funcionam). Precisam de modelagem sobre a tampa do porta-malas do modelo atual (ver lições da L08). |
| L13 | Fundo de placa personalizado em Personalizar → Placa | 💡 | v10.1.1 | Já aparece como "em breve". "Sem placa" (v10.1.1) tira a placa da frente e a de trás. |

## Como usar

- Nova ideia: adicionar linha com o próximo código e status 💡.
- Para implementar: mudar para 📌 e indicar a versão alvo nas observações.
- Ao entregar: ✅ com a versão (ex.: `✅ v8`) e registrar também em `NOVIDADES` no `js/main.js`.
