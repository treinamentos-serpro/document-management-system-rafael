---
description: gerar readme do projeto
name: gerar-readme
argument-hint: caminho do modulo (ex. backend/src/services/documents.service.js)
agent: agent
---

# Gerar README do módulo

Gere o conteúdo do arquivo `README.md` para o módulo `${input:modulo:caminho do modulo}`.

Requisitos:

- Gere no primeiro parágrafo uma descrição sucinta do módulo e suas principais funcionalidades.
- Liste as principais tecnologias, bibliotecas ou dependências utilizadas no módulo.
- Explique como fazer a build e executar o módulo e os requisitos necessários para tal
- Liste as variáveis de ambiente ou de configuração utilizadas pelo módulo e seus valores default quando aplicável.
- Liste os principais endpoints, funções ou classes exportadas pelo módulo.
- Inclua uma seção com os links para o sistema nos ambiente de desenvolvimento, homologação e produção (será preenchido posteriormente)
