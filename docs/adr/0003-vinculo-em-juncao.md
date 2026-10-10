# Vínculo em tabela de junção

Um vínculo é uma linha própria: tarefa–nota, tarefa–hábito ou nota–hábito. Cada lado pode ter zero ou vários do outro. O par de ids, dentro do tipo, é único: religar o mesmo par não cria outra linha. As colunas `noteId`, `taskId` e `habitId` nas tabelas principais foram recusadas porque os dois lados discordam e uma nota não consegue alcançar três tarefas com um único `taskId`.
