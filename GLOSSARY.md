# Leme

Aplicativo de produtividade de uma pessoa, na máquina dela. Reúne um quadro de tarefas, notas e hábitos diários no mesmo lugar.

## Language

**Tarefa**:
Um item de trabalho em exatamente uma coluna, com um texto curto sem markdown.
_Avoid_: card, ticket, afazer

**Nota**:
Um texto com título, guardado em markdown, que existe por si. É o lugar do texto longo.
_Avoid_: documento, página, rascunho

**Hábito**:
Uma prática diária que a pessoa marca a cada dia.
_Avoid_: rotina, meta, sequência

**Registro**:
A marca de um hábito num dia civil. No máximo um por hábito por dia. Pode estar feito ou não feito, e a linha permanece ao desmarcar.
_Avoid_: check-in, log, pontinho
A tool MCP pode chamar-se `log_habit`; o conceito de domínio continua sendo Registro.

**Dia**:
O dia civil no fuso America/Sao_Paulo, escrito `YYYY-MM-DD`.
_Avoid_: timestamp, UTC

**Falta**:
Um dia passado, depois da criação do hábito, sem registro feito. Hoje sem marca fica em aberto.
_Avoid_: buraco, miss

**Sequência**:
Os dias civis consecutivos com registro feito, terminando hoje se hoje está feito, ou ontem se hoje ainda está em aberto.
_Avoid_: streak, ofensiva

**Recorde**:
A maior sequência do hábito desde a criação.
_Avoid_: melhor streak

**Vínculo**:
A ligação entre uma tarefa e uma nota, uma tarefa e um hábito, ou uma nota e um hábito. Um lado pode ter vários do outro; o mesmo par de ids existe no máximo uma vez.
_Avoid_: noteId, taskId, habitId nas tabelas principais (tarefa, nota, hábito). Na tabela de junção, os ids dos dois lados são necessários.

**Quadro**:
O único conjunto de colunas onde as tarefas ficam.
_Avoid_: board, projeto, kanban

**Coluna**:
Uma das três posições fixas do quadro. Gravada como `todo`, `doing` ou `done`. Rótulos na tela: A fazer, Fazendo, Feito.
_Avoid_: status, lista, raia

**Posição**:
O lugar de uma tarefa dentro da coluna dela. A coluna se ordena por posição.
_Avoid_: ordem global, prioridade

**Prioridade**:
O peso de uma tarefa. Gravada como `baixa`, `media` ou `alta` (sem acento). Rótulos na tela: baixa, média, alta. Nasce `media`.
_Avoid_: urgência, importância

**Cor**:
O nome da cor de uma tarefa ou de um hábito: sage, silver, mist, clay ou ink. Nasce sage.
_Avoid_: hex, rgb

**Painel**:
A visão que reúne a contagem das três colunas, os hábitos de hoje e as cinco notas alteradas por último.
_Avoid_: dashboard, home, início
