# Importação de edital: extração local e conferência humana

Pesquisa de 12/10/2026 para [Pesquisar importação de edital com conferência humana e baixo custo](https://github.com/prof-ramos/Leme/issues/14), parte de [Estudos no Leme: mapa de decisões para a especificação](https://github.com/prof-ramos/Leme/issues/11). Artefato de planejamento; nenhum importador implementado ou documento privado processado.

## Resultado

**Recomendação técnica, ainda sujeita às decisões de produto:** começar com texto colado e PDF com camada textual, extração local por página e uma proposta editável que só entra no planejamento após confirmação humana. Usar PDF.js como primeira opção compatível com a base Next.js; avaliar OCR local como capacidade opcional para páginas escaneadas. O baixo custo significa ausência de cobrança por documento de fornecedor externo, não ausência de CPU, armazenamento e manutenção. Essas são conclusões desta pesquisa, não garantias das bibliotecas.

O [ADR de execução local](../adr/0001-sqlite-local-dois-processos.md), o [ADR sem usuário](../adr/0002-sem-usuario-na-v1.md) e o [ADR de autenticação](../adr/0004-chave-so-na-api-http.md) permanecem vigentes. API e MCP devem convergir no domínio como hoje; esta pesquisa não decide novos endpoints, permissões ou nomes de conceitos. `Registro` conserva o significado de marca de hábito definido no [glossário](../../GLOSSARY.md).

## Extração é diferente de interpretação

Um PDF não oferece necessariamente uma hierarquia semântica: texto pode estar posicionado individualmente, tabelas podem ser apenas coordenadas e imagens escaneadas exigem OCR. Mesmo um PDF pesquisável pode conter texto reconhecido incorretamente. pypdf distingue esses casos e recomenda não rasterizar indiscriminadamente documentos digitais. [Documentação oficial de extração](https://pypdf.readthedocs.io/en/stable/user/extract-text.html).

**Inferência para o Leme:** reconhecer caracteres ou encontrar uma sequência como `1.2` não prova que ela é um conteúdo subordinado a `1`. Também não decide quais páginas se aplicam ao cargo desejado, onde terminam os conteúdos ou quais anexos/retificações prevalecem. A biblioteca fornece evidências; a interpretação propõe a estrutura; a pessoa confere e aprova.

## Opções comparadas

| Opção | Fato verificado | Aplicação recomendada neste esforço |
| --- | --- | --- |
| Texto colado | Não exige leitura de PDF ou reconhecimento de imagem; é uma escolha de entrada proposta pela pesquisa. | Menor dependência e escape manual. Pedir referência à fonte e trecho; nunca inventar número de página ausente. |
| PDF.js | `getTextContent` retorna fragmentos com texto, transformação, dimensões e quebra de linha; também permite renderizar a página. [API oficial](https://mozilla.github.io/pdf.js/api/draft/api.js.html). | Extração e visualização por página, aproveitando JavaScript. Coordenadas ajudam a conferir, mas não são uma árvore de matérias. |
| pypdf | Extração textual e modo de layout; não reconhece texto de imagens. [Documentação oficial](https://pypdf.readthedocs.io/en/stable/user/extract-text.html). | Alternativa simples se já houver uma etapa Python; não adicionar runtime só para substituir PDF.js sem evidência. |
| pdfplumber | Extração de caracteres, posições e tabelas, com depuração visual; funciona melhor em PDFs digitais e não oferece OCR ou forte suporte a tabelas de PDFs com OCR. [Repositório oficial](https://github.com/jsvine/pdfplumber). | Investigar se amostras reais demonstrarem que tabelas exigem uma etapa especializada. |
| Tesseract direto | Reconhece imagens e produz TSV/hOCR com posições e confiança por palavra; idioma e segmentação são configuráveis. [Manual oficial](https://tesseract-ocr.github.io/tessdoc/Command-Line-Usage.html). | OCR local de páginas renderizadas; guardar posição e método. O valor de confiança é do reconhecimento, não da classificação de matérias. |
| OCRmyPDF | Aplica OCR a PDFs e oferece rotação/correção de inclinação; tratamentos de imagem podem remover conteúdo e precisam de conferência visual. [Cookbook oficial](https://ocrmypdf.readthedocs.io/en/latest/cookbook.html). | Alternativa de pipeline pronto quando PDF pesquisável derivado for útil. Mais dependências que extração textual; preservar original. |

## Colunas, tabelas, numeração e hierarquia

Tesseract oferece modos de segmentação de página e de coluna; sua documentação alerta para perda de qualidade com inclinação e dificuldades de reconhecimento de tabelas sem análise específica de layout. [Qualidade e segmentação](https://tesseract-ocr.github.io/tessdoc/ImproveQuality.html). pdfplumber oferece estratégias de tabelas baseadas em linhas ou texto, mas isso não determina a semântica do edital. [Extração de tabelas](https://github.com/jsvine/pdfplumber#extracting-tables).

**Proposta derivada:** manter fragmentos antes de normalizar; separar regiões/colunas antes de concatenar linhas; distinguir cabeçalhos repetidos do conteúdo; apresentar numeração original junto à proposta. Quebras entre páginas, células unidas e numeração reiniciada devem gerar casos de conferência, não exclusões silenciosas. Permitir juntar/dividir conteúdos e mover sua posição na estrutura. Não deduplicar conteúdos iguais de cargos diferentes automaticamente. O cargo, a profundidade útil e o tratamento de retificações pertencem à decisão posterior de produto.

## Rastreabilidade e conferência

**Contrato recomendado, derivado dos limites acima:** conservar a fonte original e seu hash, referência/URL informada, nome, intervalo de páginas escolhido, versão do extrator e método por página (`texto` ou `OCR`). Cada item proposto deve apontar para trecho literal e página física do arquivo; guardar separadamente rótulo de página impresso, quando identificado. Coordenadas PDF.js ou TSV permitem selecionar o trecho na visualização. [Campos PDF.js](https://mozilla.github.io/pdf.js/api/draft/api.js.html), [campos TSV Tesseract](https://tesseract-ocr.github.io/tessdoc/Command-Line-Usage.html).

**Fluxo proposto:** selecionar cargo e páginas; extrair; mostrar fonte, texto extraído e estrutura sugerida lado a lado; corrigir e confirmar; só então incorporar. Guardar texto extraído sem substituir o original pelas correções. Alteração humana deve ficar distinguível da saída automática. Texto colado tem trecho/offset como referência e página somente se fornecida/conferida. Uma nova versão de edital não deve apagar a anterior nem migrar progresso automaticamente; essa regra ainda necessita decisão de produto.

## Dependências e licenças

| Componente | Licença e dependências verificadas |
| --- | --- |
| PDF.js | Apache-2.0; distribuir licença/avisos conforme o arquivo oficial. [Licença](https://github.com/mozilla/pdf.js/blob/master/LICENSE). |
| pypdf | BSD-3-Clause. [Licença](https://github.com/py-pdf/pypdf/blob/main/LICENSE). |
| pdfplumber | MIT; construído sobre pdfminer.six. [Repositório e licença](https://github.com/jsvine/pdfplumber). |
| Tesseract | Apache-2.0; modelos de idioma precisam estar instalados e o idioma padrão é inglês. [Licença](https://github.com/tesseract-ocr/tesseract/blob/main/LICENSE), [uso oficial](https://tesseract-ocr.github.io/tessdoc/Command-Line-Usage.html). |
| OCRmyPDF | MPL-2.0. [Licença](https://github.com/ocrmypdf/OCRmyPDF/blob/main/LICENSE). A documentação atual exige Python 3.11+, Tesseract e rasterizador pypdfium2 ou Ghostscript; fpdf2 e uharfbuzz são dependências de camada textual. Desde 17.0 Ghostscript é opcional, embora algumas conversões PDF/A possam usá-lo. [Instalação oficial](https://ocrmypdf.readthedocs.io/en/latest/installation.html). |

**Consequência de engenharia:** fixar versões e revisar também licenças dos modelos e dependências transitivas da distribuição escolhida antes de empacotar. Não inferir que a licença do orquestrador cobre todos os binários. Nada foi instalado nesta pesquisa; compatibilidade final no macOS, tamanho do pacote e tempo de execução não foram medidos.

## Segurança de arquivos

OCRmyPDF declara que não é proteção contra malware nem sanitizador. A documentação recomenda isolamento para arquivos não confiáveis e explica que reparar PDF com QPDF não oferece garantia de segurança. [Segurança oficial](https://ocrmypdf.readthedocs.io/en/latest/pdfsecurity.html).

**Requisitos técnicos propostos:** aceitar arquivo escolhido explicitamente; não buscar URLs arbitrárias no backend; validar tipo e limites de bytes, páginas, pixels, memória e tempo antes/durante processamento; executar parser/OCR em processo restrito com temporários exclusivos e limpeza; não executar scripts, abrir anexos ou links do PDF; manter dependências atualizadas; permitir cancelar e recuperar de erro. Worker de biblioteca não deve ser apresentado como sandbox de segurança. Tratar texto como dados, incluindo quando um assistente o lê via MCP, sem obedecer instruções contidas no edital. Definir limites numéricos após medir amostras; não afrouxar as políticas atuais do Leme.

## Evidência ainda necessária

Não há amostras nem benchmark nesta pesquisa: **não é possível prometer precisão, latência ou uma taxa de importação correta**. Antes de critérios quantitativos, selecionar editais públicos representativos e comparar manualmente: PDF digital simples, duas colunas, tabela, scan, documento misto e texto colado; incluir mudança de página, subitens, anexos/cargos e retificação. Medir separadamente texto recuperado, ordem de leitura, associação/hierarquia, omissões e trabalho de correção; um bom OCR não valida a estrutura.

A rota simples está tecnicamente disponível sem serviço pago obrigatório. A decisão seguinte deve delimitar entrada inicial, cargo/páginas, conferência, persistência da fonte e comportamento diante de falha/OCR ausente. OCR automático completo e atualização de edital permanecem decisões abertas, não entregas desta pesquisa.
