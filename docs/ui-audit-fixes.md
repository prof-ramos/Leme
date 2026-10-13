# Correções da auditoria do quadro — 12/10/2026

Escopo: os seis pontos da auditoria de interface do quadro básico, sobre a base `a012ede`. Mantidas as fontes Instrument Serif e Outfit, os tokens da paleta e as três colunas fixas. Sem novos módulos ou alterações de armazenamento/autenticação.

## Decisões

- Títulos continuam completos, com `overflow-wrap: anywhere` e colunas com largura mínima zero. Não há limite artificial nem corte do conteúdo.
- O formulário usa `dialog.showModal()`: o fundo fica inerte, Escape fecha e o foco retorna a Nova tarefa. Tab e Shift+Tab circulam explicitamente pelos controles disponíveis, inclusive enquanto o envio está pendente.
- Durante criação, o título fica somente para leitura e os botões ficam desabilitados; Escape não fecha até o resultado chegar. Isso evita abandonar um envio que não pode ser cancelado. Criação e exclusão mostram andamento, bloqueiam envios repetidos e permitem nova tentativa após erro.
- Erros são anunciados com `role="alert"`. O erro de título se associa ao campo por `aria-describedby`, com `aria-invalid` para título vazio. Falhas de transporte preservam o título. A exclusão retorna um resultado estruturado ao componente, incluindo erros de domínio.
- Controles têm ao menos 44px de altura. Texto de apoio usa 14px; títulos de tarefas, 16px. O foco de teclado permanece visível.
- No telefone, colunas vazias têm altura do conteúdo. A fazer explica como criar a primeira tarefa; as outras duas descrevem seu estado. No desktop, as três colunas permanecem lado a lado.
- A serif permanece como assinatura do quadro e do diálogo. Rótulos usam caixa de frase, com menos contornos. Prioridade média e o nome interno da cor deixam de se repetir visualmente em toda tarefa; prioridades baixa/alta continuam explícitas. Os valores armazenados permanecem iguais.

## Verificação

Os quatro testes iniciais falharam na implementação anterior por ausência de diálogo, associação do erro, andamento e tratamento de falha de exclusão. Outro teste reproduziu a fuga de foco com Shift+Tab antes da contenção explícita.

- `npm test`: 12 testes passaram (7 de interface e 5 de domínio/HTTP).
- `npm run typecheck`: passou.
- `npm run build`: passou, incluindo a versão final dos estilos.
- `LEME_TEST_MODE=production npm run test:live`: passou com HTTP e MCP em processos independentes, 40 criações simultâneas, 20 exclusões, posições contíguas e respostas 401/400/404.
- Navegador local em produção, bancos de teste isolados: título sem espaços cabe em 320px e 390px, sem rolagem horizontal. Em 390px, a largura total passou dos 756px da auditoria para 390px. Desktop de 1280px mantém três colunas sem transbordamento.
- Botões medidos: Nova tarefa, Apagar, Cancelar e Criar com 44px de altura.
- Diálogo modal confirmado; sete Tab consecutivos e Shift+Tab mantiveram o foco dentro dele. Escape fechou e restaurou o foco ao botão Nova tarefa.
- Envio vazio retornou o erro real do servidor com os atributos de acessibilidade. Criação persistiu no SQLite. Exclusão bem-sucedida atualizou a tela. Exclusão de tarefa já removida em outro processo mostrou “Tarefa não encontrada.” sem quebrar o quadro.
- Vazio em 390 × 844: as três colunas e a orientação inicial aparecem na primeira tela.

Evidências desta sessão: `/tmp/leme-ui-desktop-fixed.jpg`, `/tmp/leme-ui-mobile-fixed.jpg`, `/tmp/leme-ui-empty-fixed.jpg` e `/tmp/leme-ui-delete-error.jpg`. São arquivos temporários, não artefatos versionados.

Validação visual e de teclado feita no Chromium do navegador integrado. Não houve teste em Safari, telefone físico ou leitor de tela. Estados lentos e falhas de transporte foram exercitados com ações simuladas nos testes de componente; o navegador verificou os resultados reais de criação, validação e exclusão. Nenhuma publicação remota nesta etapa.
