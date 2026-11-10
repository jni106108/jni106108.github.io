# Pendências e ideias — Lancer Club 67

Lista de ideias registradas e o que implementar nas próximas versões.
Código: `L` + número sequencial (nunca reaproveitar um código, mesmo se a ideia for descartada).

**Status:** 💡 ideia · 📌 aprovada (implementar) · 🚧 em andamento · ✅ feita (versão) · ❌ descartada

| Código | Ideia | Status | Origem | Observações |
|---|---|---|---|---|
| L01 | Notificações push (lembretes de revisão, vencimento de documentos, backup) | 💡 | v6 (ideia 6) | Adiada para versão futura. No Android funciona com PWA instalado; precisa de permissão do usuário. |
| L02 | Leitura OBD2 via Bluetooth (km, códigos de falha, sensores) | 💡 | v6 (ideia 7) | Adiada. Web Bluetooth no Chrome Android + adaptador ELM327 BLE. |
| L03 | Versão do veículo (MT, HL, HL-T, HL-E, GT, GT AWD) alterar o modelo 3D | 💡 | v6 | Hoje o campo é só informativo. Depende de modelos/peças de cada versão do CY4A. |
| L04 | Usar logo de brasão e logo simplificada no app | 💡 | v7 | Arquivos já em `marca/` (`logo-completa.png`, `logo-simplificada.png`). Substituir pelos originais do designer quando houver. |
| L05 | Backup automático no Google Drive (sem ação do usuário) | 💡 | v6 | Requer projeto no Google Cloud com credencial OAuth. Hoje o backup é manual via compartilhamento. |
| L06 | Personalizar mais peças (além de aerofólio, rodas e placa) | 💡 | v5 | Botão já existe desabilitado com balão "em breve". |
| L07 | Identificação rápida do posto pela localização salva no abastecimento | 💡 | v8 | Desde a v8 o abastecimento guarda `geo: { lat, lng, prec }`. Ideia: sugerir o nome do posto quando a localização bater com um abastecimento anterior (sem internet) ou consultar um serviço de mapas. |

## Como usar

- Nova ideia: adicionar linha com o próximo código e status 💡.
- Para implementar: mudar para 📌 e indicar a versão alvo nas observações.
- Ao entregar: ✅ com a versão (ex.: `✅ v8`) e registrar também em `NOVIDADES` no `js/main.js`.
