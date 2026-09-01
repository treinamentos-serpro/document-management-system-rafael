# Especificação - Document Management System (DMS)

> Especificação completa para orientar o desenvolvimento guiado por
> especificação (Spec Driven Development). Base para as etapas seguintes do
> projeto. A implementação de código de backend e frontend não faz parte
> deste documento.

## 1. Objetivo

Entregar uma aplicação web que permita a um usuário enviar, listar e baixar
documentos, com armazenamento dos arquivos no filesystem local da aplicação.

## 2. Escopo

### Dentro do escopo

- Upload de documentos
- Listagem de documentos
- Download de documentos
- Gestão simples por usuário (associação de dono ao documento)
- Armazenamento dos arquivos no filesystem local (`backend/storage`)
- Metadados dos documentos mantidos em memória nesta fase

### Fora do escopo

- Armazenamento externo ou em nuvem
- Versionamento de documentos
- Autenticação e autorização robustas
- Persistência dos metadados em banco de dados
- Exclusão e edição de documentos

## 3. Requisitos funcionais

| ID    | Requisito                                                   |
| ----- | ----------------------------------------------------------- |
| RF-01 | O usuário pode enviar um documento                          |
| RF-02 | O usuário pode listar os documentos enviados                |
| RF-03 | O usuário pode baixar um documento pelo identificador       |
| RF-04 | Cada documento é associado a um usuário dono no upload      |
| RF-05 | O sistema retorna os metadados do documento após o upload   |

## 4. Requisitos não funcionais

| ID     | Requisito                                                        |
| ------ | --------------------------------------------------------------- |
| RNF-01 | Arquivos gravados no filesystem local via multer diskStorage    |
| RNF-02 | Metadados mantidos em memória nesta fase                        |
| RNF-03 | Configuração via variáveis de ambiente (12-Factor)              |
| RNF-04 | Backend em Node.js + Express (CommonJS)                         |
| RNF-05 | Frontend em React + Vite (ESM), consumindo a API via `/api`     |
| RNF-06 | Tratamento de erros nos limites do sistema (HTTP e filesystem)  |
| RNF-07 | Testes de backend com o runner nativo do Node (`node:test`)     |
| RNF-08 | Sem provedores de armazenamento externos                        |

## 5. Modelo de dados (metadados do documento)

| Campo        | Tipo   | Descrição                                       |
| ------------ | ------ | ----------------------------------------------- |
| id           | string | Identificador único do documento                |
| originalName | string | Nome original do arquivo enviado                |
| storedName   | string | Nome do arquivo gravado em `backend/storage`    |
| size         | number | Tamanho em bytes                                |
| uploadedAt   | string | Data/hora do upload (ISO 8601)                  |
| owner        | string | Identificador do usuário dono                   |

> Observação: `storedName` distingue o nome físico gravado no disco do nome
> original informado pelo usuário, evitando colisões e travessia de caminho.

## 6. Contratos de API

Prefixo base no frontend: `/api` (proxy do Vite para o backend local).

### POST /upload

- Entrada: arquivo em `multipart/form-data` (campo `file`); identificador do
  dono informado via campo do formulário ou cabeçalho.
- Saída (201): metadados do documento criado.
- Erros: 400 quando o arquivo está ausente ou inválido.

Exemplo de resposta:

```json
{
  "id": "a1b2c3",
  "originalName": "contrato.pdf",
  "storedName": "a1b2c3-contrato.pdf",
  "size": 20480,
  "uploadedAt": "2026-09-01T12:00:00.000Z",
  "owner": "user-1"
}
```

### GET /documents

- Saída (200): lista de metadados de documentos.

Exemplo de resposta:

```json
[
  {
    "id": "a1b2c3",
    "originalName": "contrato.pdf",
    "size": 20480,
    "uploadedAt": "2026-09-01T12:00:00.000Z",
    "owner": "user-1"
  }
]
```

### GET /documents/:id/download

- Saída (200): conteúdo binário do arquivo, com cabeçalhos
  `Content-Disposition` e `Content-Type` apropriados.
- Erros: 404 quando o documento não é encontrado.

### GET /health

- Saída (200): status de disponibilidade do serviço (`{ "status": "ok" }`).

## 7. Decisões arquiteturais

- Backend em Clean Architecture simples com fluxo de dependência
  `routes -> controllers -> services -> repositories`. Camadas internas não
  conhecem camadas externas.
  - `routes/`: definem os endpoints e delegam para os controllers.
  - `controllers/`: tratam entrada/saída HTTP e validação básica.
  - `services/`: concentram as regras de negócio.
  - `repositories/`: cuidam da persistência (arquivos locais + metadados em
    memória).
- Upload tratado por `multer` com `diskStorage`, gravando em `backend/storage`.
- Metadados em memória por meio de um repositório dedicado, isolando a
  estratégia de persistência para evolução futura.
- Frontend baseado em componentes React (`components/`, `pages/`, `services/`),
  com comunicação via `fetch` no prefixo `/api`.
- Configuração via variáveis de ambiente (ex.: `PORT`), seguindo 12-Factor.

## 8. Riscos e mitigações

| Risco                                             | Mitigação                                               |
| ------------------------------------------------- | ------------------------------------------------------- |
| Perda de metadados ao reiniciar (memória)         | Aceito nesta fase; isolar repositório para troca futura |
| Travessia de caminho no download (path traversal) | Validar `id` e resolver caminho dentro de `storage`     |
| Colisão de nomes de arquivos                      | Gerar `storedName` único no upload                      |
| Uploads muito grandes                             | Definir limite de tamanho no multer                     |

## 9. Plano de execução (fase de especificação)

> Esta fase cobre apenas a preparação e a especificação. A implementação dos
> arquivos de backend e frontend será tratada em etapas posteriores, fora
> deste documento.

### Etapa 1 - Consolidar a especificação

- Arquivos: `docs/specs/dms-spec.md`
- Descrição: revisar objetivo, escopo, requisitos, modelo de dados e contratos
  de API com os envolvidos.
- Critérios de aceite:
  - Todos os requisitos funcionais e não funcionais estão descritos.
  - Contratos de API definidos com entradas, saídas e erros.
  - Modelo de dados aprovado.

### Etapa 2 - Validar decisões arquiteturais

- Arquivos: `docs/specs/dms-spec.md`
- Descrição: confirmar o fluxo de camadas e a restrição de armazenamento local
  com multer diskStorage.
- Critérios de aceite:
  - Fluxo `routes -> controllers -> services -> repositories` acordado.
  - Restrição de armazenamento local documentada e aceita.

### Etapa 3 - Mapear riscos e critérios de aceite

- Arquivos: `docs/specs/dms-spec.md`
- Descrição: registrar riscos, mitigações e critérios de aceite por requisito.
- Critérios de aceite:
  - Riscos priorizados com mitigação correspondente.
  - Cada requisito funcional possui critério de aceite verificável.

### Etapa 4 - Aprovação da especificação

- Arquivos: `docs/specs/dms-spec.md`
- Descrição: obter validação final da spec como base para o desenvolvimento.
- Critérios de aceite:
  - Especificação revisada e aprovada.
  - Próximas etapas de implementação identificadas (fora deste documento).
