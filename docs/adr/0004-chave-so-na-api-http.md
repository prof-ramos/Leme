# A chave fica só na API HTTP

A tela e o MCP chamam o módulo de domínio e abrem o mesmo arquivo SQLite. Só `/api/v1` exige `Authorization: Bearer` igual a `LEME_API_KEY`. A alternativa era o MCP falar HTTP com o Next, com um único escritor e a chave em todo cliente. A v1 recusa isso: o MCP funciona com o arquivo mesmo com o Next parado, e a tela não pede login.
