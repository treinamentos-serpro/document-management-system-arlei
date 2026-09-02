# Especificação - Document Management System

## 1. Objetivo

Prover uma aplicação web simples para upload, listagem e download de documentos,
com armazenamento estritamente local e gestão básica por usuário.

## 2. Escopo

### Dentro do escopo

- Upload de documentos
- Listagem de documentos
- Download de documentos
- Gestão simples por usuário (identificação do dono do documento)

### Fora do escopo

- Armazenamento externo ou em nuvem
- Versionamento de documentos
- Autenticação/autorização robusta (login, senha, tokens)
- Edição ou exclusão de documentos

## 3. Requisitos funcionais

| ID    | Requisito                                                          |
| ----- | ------------------------------------------------------------------ |
| RF-01 | O usuário pode enviar um documento via `POST /upload`              |
| RF-02 | O usuário pode listar os documentos enviados via `GET /documents`  |
| RF-03 | O usuário pode baixar um documento pelo identificador               |
| RF-04 | O sistema associa cada documento a um `owner` informado no upload  |
| RF-05 | O sistema rejeita upload sem arquivo anexado                        |
| RF-06 | O sistema retorna erro 404 ao solicitar download de id inexistente |

## 4. Requisitos não funcionais

| ID     | Requisito                                                       |
| ------ | ---------------------------------------------------------------- |
| RNF-01 | Arquivos gravados no filesystem local via multer (`diskStorage`) |
| RNF-02 | Metadados mantidos em memória nesta fase                         |
| RNF-03 | Configuração via variáveis de ambiente (12-Factor), ex.: `PORT`  |
| RNF-04 | Backend segue Clean Architecture simples (routes -> controllers -> services -> repositories) |
| RNF-05 | Mensagens de erro e validação em português                       |

## 5. Modelo de dados (metadados do documento)

| Campo        | Tipo   | Descrição                          |
| ------------ | ------ | ----------------------------------- |
| id           | string | Identificador único do documento (ex.: UUID) |
| originalName | string | Nome original do arquivo enviado    |
| storedName   | string | Nome do arquivo no filesystem local |
| size         | number | Tamanho em bytes                    |
| mimeType     | string | Tipo MIME do arquivo                |
| uploadedAt   | string | Data/hora do upload (ISO 8601)      |
| owner        | string | Identificador do usuário dono       |

## 6. Contratos de API

### POST /upload

- Entrada: `multipart/form-data` com campo `file` e campo `owner` (string)
- Sucesso (201): metadados do documento criado (JSON, conforme seção 5)
- Erros:
  - 400: arquivo ausente ou `owner` não informado

### GET /documents

- Sucesso (200): lista de metadados de documentos (array JSON)

### GET /documents/:id/download

- Sucesso (200): conteúdo binário do arquivo (`Content-Disposition: attachment`)
- Erros:
  - 404: documento com `id` informado não existe

## 7. Decisões arquiteturais

- Backend em Clean Architecture simples: `routes/` define endpoints e delega
  para `controllers/`, que tratam entrada/saída HTTP e validação básica;
  `services/` concentram regras de negócio; `repositories/` cuidam da
  persistência (arquivo em disco + metadados em memória).
- Armazenamento local obrigatório: `multer` com `diskStorage` gravando em
  `backend/storage`; nenhum provedor externo.
- Metadados em memória (estrutura simples, ex.: array ou Map) — assume-se
  execução em processo único; não há persistência entre reinícios.
- Frontend em componentes React funcionais com Hooks, comunicando-se via
  `fetch` sob o prefixo `/api` (proxy do Vite).

### Riscos

- Perda de metadados ao reiniciar o servidor (armazenamento em memória).
- Geração de nomes de arquivo em disco deve evitar colisões e path traversal
  (validar/normalizar nomes antes de gravar).
- Sem autenticação real, o campo `owner` é apenas identificador informado
  pelo cliente, sem garantias de segurança quanto à identidade.

## 8. Plano de execução

1. Backend — camada `repositories/`: implementar repositório de metadados em
   memória e integração com `multer diskStorage` para gravação em
   `backend/storage`.
2. Backend — camada `services/`: implementar regras de negócio para upload,
   listagem e download (validações, montagem de metadados).
3. Backend — camada `controllers/`: implementar tratamento de entrada/saída
   HTTP e validação básica para os três endpoints.
4. Backend — camada `routes/`: expor `POST /upload`, `GET /documents`,
   `GET /documents/:id/download`, integradas ao `app.js`.
5. Backend — testes: cobrir os endpoints com `node:test`.
6. Frontend — `services/`: cliente HTTP para os três endpoints via `fetch`.
7. Frontend — `components/` e `pages/`: tela de upload, listagem e ação de
   download, reutilizando componentes.
8. Integração e validação manual ponta a ponta.
