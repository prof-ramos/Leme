# Google Agenda em um aplicativo pessoal local

Pesquisa de 12/10/2026 para [Pesquisar os limites do Google Agenda para integração local](https://github.com/prof-ramos/Leme/issues/13), parte de [Estudos no Leme: mapa de decisões para a especificação](https://github.com/prof-ramos/Leme/issues/11). Evidências para uma decisão posterior; não é uma especificação aprovada. Nenhuma conta, projeto Cloud, credencial ou evento foi criado. Fontes primárias consultadas ao vivo; quotas, políticas e custos precisam ser conferidos novamente antes da implementação.

## Limite do projeto

O [glossário](../../GLOSSARY.md) descreve uso de uma pessoa na própria máquina. Os ADRs [0001](../adr/0001-sqlite-local-dois-processos.md), [0002](../adr/0002-sem-usuario-na-v1.md), [0004](../adr/0004-chave-so-na-api-http.md) e [0005](../adr/0005-dia-civil-sao-paulo.md) estabelecem SQLite local compartilhado por Next.js/MCP, ausência de usuário, chave somente na API HTTP e dia civil em America/Sao_Paulo. A autorização Google é uma conexão externa, não substitui `LEME_API_KEY`, não cria login do Leme e não muda como tela/MCP acessam o domínio. Esta última frase é uma delimitação do mapa, não uma regra imposta pelo Google.

## OAuth e tokens

Google documenta cliente **Desktop app**, navegador para consentimento e retorno loopback em macOS/Linux/Windows: `http://127.0.0.1:<porta>` ou IPv6, com listener local e porta disponível. Exige previamente projeto/API habilitada e cliente OAuth registrado. PKCE e `state` pertencem ao fluxo. O redirecionamento OOB de copiar/colar foi descontinuado. Portanto, o uso local é tecnicamente compatível com autorização Google sem hospedar o Leme; a configuração concreta continua pendente. Access token expira, refresh token permite renovar, e a resposta informa duração e escopos concedidos. Revogar pelo endpoint Google invalida concessões do projeto, potencialmente de outros clientes nele; não é somente apagar um arquivo local. [OAuth para aplicativos instalados](https://developers.google.com/identity/protocols/oauth2/native-app), [continuidade do loopback desktop](https://developers.google.com/identity/protocols/oauth2/resources/loopback-migration).

Google recomenda PKCE para desktop, armazenamento protegido dos tokens — cita Keychain no macOS —, exclusão/revogação quando desnecessários, ausência de credenciais no Git e validação de `state`. Pode haver consentimento parcial: conferir escopos retornados. Cliente OAuth é configurado manualmente no Console. **Inferência de engenharia:** manter tokens fora de texto de notas, respostas API/MCP, logs e banco comum não protegido, permitindo aos dois processos locais usarem um mecanismo protegido. A escolha desse mecanismo ainda não foi implementada. [Boas práticas OAuth](https://developers.google.com/identity/protocols/oauth2/resources/best-practices).

Refresh token não é permanente: revogação, seis meses sem uso, limites de tokens e certas políticas administrativas podem invalidá-lo. Para consentimento externo em **Testing**, expira em sete dias, pois Calendar não pertence à exceção dos escopos básicos de identidade. Há limite de 100 refresh tokens por conta/cliente; emitir além dele invalida o mais antigo. Sair de Testing evita essa causa específica, não elimina as demais. [Expiração de refresh tokens](https://developers.google.com/identity/protocols/oauth2#expiration).

## Escopos e escolha de agenda

As alternativas documentadas têm consequências diferentes; nenhuma foi escolhida nesta pesquisa:

| Escopo, omitindo o prefixo `https://www.googleapis.com/auth/` | Alcance Google |
| --- | --- |
| `calendar.events.owned` | Ler/criar/alterar/excluir eventos nas agendas próprias |
| `calendar.events` | Ler/editar eventos nas agendas acessíveis |
| `calendar.app.created` | Criar agendas secundárias e operar eventos nelas |
| `calendar.calendarlist.readonly` | Ler lista de agendas assinadas para um seletor |

O escopo amplo `calendar` também inclui edição/compartilhamento/exclusão de agendas e não é requisito mínimo universal para criar eventos: a referência de `events.insert` aceita escopos de eventos mais restritos. **Inferência:** escolher uma agenda existente na tela não restringe o token a ela; restringir operações ao `calendarId` selecionado é responsabilidade do Leme. `app.created` permite um recorte diferente, sem prometer acesso a qualquer agenda existente. O produto precisa decidir se aceita somente agendas próprias, também compartilhadas ou criadas pelo aplicativo. [Escopos Calendar](https://developers.google.com/workspace/calendar/api/auth), [escopos aceitos em insert](https://developers.google.com/workspace/calendar/api/v3/reference/events/insert).

`CalendarList` expõe `id`, título, fuso e `accessRole`. Leitura e escrita dependem do papel efetivo; a referência atual também lista `writerWithoutPrivateAccess`, além de `writer` e `owner`. Papel `owner` não é sinônimo de único proprietário dos dados. **Limitação:** não foi testada a combinação `events.owned` com agendas compartilhadas que atribuem papel `owner`; não prometer suporte por esse papel isolado. O ID deve ser preservado, não o título que pode mudar. [CalendarList resource](https://developers.google.com/workspace/calendar/api/v3/reference/calendarList).

## Eventos, fusos e identidade

`events.insert` recebe a agenda e horários; eventos com hora usam `start/end.dateTime`; dia inteiro usa `start/end.date`. ID próprio fornecido antes do envio permite reconhecer criação cuja resposta se perdeu. Não incluir convidados evita depender do fluxo de convites; adicionar participantes e `sendUpdates` pode enviar emails. [Criar eventos](https://developers.google.com/workspace/calendar/api/guides/create-events).

Horários seguem RFC3339 com offset ou fuso explícito; nomes de fuso seguem IANA. O término é exclusivo. Recorrências precisam de fuso para expansão. ID do evento aceita `0-9`, `a-v`, tamanho 5–1024, único por agenda; `iCalUID` tem semântica diferente. Propriedades privadas podem transportar identificação local. Eventos excluídos aparecem como `cancelled`, podem conter apenas ID e desaparecem posteriormente. [Events resource](https://developers.google.com/workspace/calendar/api/v3/reference/events).

**Inferências para a futura implementação:** manter associação entre identidade local, conexão, `calendarId` e `eventId`; gerar ID compatível uma vez e reutilizá-lo após falha incerta, em vez de criar outro. Não prometer transação atômica entre SQLite e Google nem entrega exatamente uma vez. A regra de dia civil dos hábitos permanece; eventos com hora exigem representar também horário/instante. Revisões definidas apenas por uma data ainda precisam de decisão de produto: dia inteiro ou horário definido. Recorrência fixa Google não deve ser confundida automaticamente com revisão relativa a estudo concluído.

## Alterações externas e falhas

`etag` com `If-Match` permite atualizar/excluir somente a versão conhecida: conflito retorna 412. Isso permite detectar uma edição externa sem importá-la para o planejamento. [Versões condicionais](https://developers.google.com/workspace/calendar/api/guides/version-resources).

Sincronização incremental fornece alterações e exclusões, com paginação e `nextSyncToken` na última página. Token inválido retorna 410 e requer refazer a cópia remota; **inferência:** isso não autoriza apagar o planejamento local. [Sync](https://developers.google.com/workspace/calendar/api/guides/sync). `syncToken` é incompatível com vários filtros, incluindo `privateExtendedProperty`; portanto não prometer sincronização incremental filtrada por marcador privado. [Events list](https://developers.google.com/workspace/calendar/api/v3/reference/events/list).

Push exige callback HTTPS acessível pelo Google com certificado válido; notificações não carregam o evento completo, podem se perder e canais precisam renovação. **Inferência:** máquina exclusivamente local não recebe esse mecanismo sem exposição/infraestrutura adicional. Consultas enquanto o processo está ativo permitem reconciliação eventual, não imediata quando a máquina dorme. Isso preserva o ADR0001 e deixa frequência para decisão posterior. [Push](https://developers.google.com/workspace/calendar/api/guides/push).

| Falha | Fato da documentação / consequência técnica |
| --- | --- |
| 400 | Pedido inválido: corrigir; repetir igual não resolve |
| 401 | Renovar access token; se falhar, pedir nova autorização |
| 403/429 com razão de rate limit | Backoff; diferenciar de proibição/permissão |
| 404 | Pode significar recurso ausente **ou** falta de acesso; não prova exclusão |
| 409 duplicate | ID já existe; consultar antes de atribuir sucesso à operação local |
| 410 | Token sync inválido ou recurso já excluído, conforme a razão |
| 412 | Recurso mudou; consultar estado atual antes de decidir conflito |
| 500 | Erro de servidor: repetir com backoff |

Fonte da classificação: [Erros Calendar](https://developers.google.com/workspace/calendar/api/guides/errors); 412 também em [versões](https://developers.google.com/workspace/calendar/api/guides/version-resources). Backoff deve ter limite e variação aleatória. Perda da resposta, reinício e offline deixam o resultado incerto; persistir uma intenção de envio e reconciliar identidade é inferência técnica, não autorização para recriar eventos excluídos pelo usuário.

## Quotas, custo e verificação

Em 12/10/2026, a página oficial informa quotas novas para projetos desde 01/05/2026: **10.000 pedidos/minuto/projeto**, **600/minuto/usuário/projeto** e limiar **1.000.000/dia/projeto**. Projetos com uso de novembro/2025 a abril/2026 conservam quotas anteriores. Há limites operacionais adicionais, incluindo escritas rápidas na mesma agenda. Uso padrão é descrito sem custo adicional; cobrança por excedentes está planejada para mais tarde em 2026, com detalhes e aviso mínimo de 90 dias. Não há preço confirmado nesta pesquisa. Não habilitar billing nem garantir gratuidade permanente. [Quotas e pricing](https://developers.google.com/workspace/calendar/api/guides/quota).

Google documenta exceção de verificação para uso pessoal de uma pessoa ou pequeno grupo conhecido, com aviso de aplicativo não verificado e limite de usuários. Testing continua sujeito a duração limitada do token. Distribuição pública com escopos sensíveis exige avaliar verificação; uso interno depende de organização Workspace, não de ser um aplicativo pessoal. A exceção não elimina políticas OAuth nem possível controle administrativo da conta. [Sensitive scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification), [políticas OAuth](https://developers.google.com/identity/protocols/oauth2/policies).

## Decisões que esta pesquisa não resolve

- Agendas permitidas e escopos compatíveis; conteúdo do evento, horário, visibilidade e lembretes.
- Exportação explícita ou automática, horizonte, exclusão/replanejamento e troca de agenda/conta.
- Ao detectar edição/exclusão externa: avisar, preservar, substituir ou recriar; não importar silenciosamente para o planejamento.
- Comportamento offline, estado exibido e reconexão; ações de desconectar e remover eventos são escolhas separadas.

Validação feita: documentação oficial e coerência com os ADRs indicados. Não houve teste OAuth/API, inspeção de Console, confirmação de escopos de uma conta real nem prova de entrega de eventos. Isso pertence à implementação posterior e exige configuração expressamente autorizada.
