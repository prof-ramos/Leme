# SQLite local, dois processos

O Leme da v1 roda só na máquina da pessoa. O Next.js e o servidor MCP são dois processos e abrem o mesmo arquivo SQLite com better-sqlite3. Publicar na internet, e trocar o arquivo por libSQL ou Turso, fica para quando existir um lugar onde o arquivo precise viver fora da máquina.
