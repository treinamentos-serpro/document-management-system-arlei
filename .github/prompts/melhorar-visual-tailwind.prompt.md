---
description: Melhora o visual do frontend React/Vite usando Tailwind CSS 3.
name: melhorar-visual-tailwind
argument-hint: foco opcional da melhoria visual (ex. dashboard de documentos, upload, responsividade)
agent: ui-tailwind
---

# Melhorar visual com Tailwind CSS 3

Melhore o visual atual da aplicacao Document Management System usando Tailwind CSS 3.

Foco solicitado: `${input:foco:foco opcional da melhoria visual}`.

## Contexto do projeto

- Frontend em React + Vite dentro de `frontend`.
- Componentes principais em `frontend/src/components` e pagina em `frontend/src/pages/DocumentsPage.jsx`.
- Comunicacao com backend por `fetch` atraves do prefixo `/api`.
- Funcionalidades atuais: upload, listagem e download de documentos.
- Mensagens ao usuario devem permanecer em portugues.

## Tarefa

Transforme a tela atual em uma experiencia visual mais moderna, organizada e responsiva, mantendo a aplicacao funcional.

Inclua, quando necessario:

- Instalacao e configuracao do Tailwind CSS 3 no frontend.
- Arquivos `tailwind.config.js`, `postcss.config.js` e CSS base com `@tailwind base`, `@tailwind components` e `@tailwind utilities`.
- Import do CSS global no ponto de entrada do React.
- Refatoracao visual de `App.jsx`, `DocumentsPage.jsx`, `UploadComponent.jsx`, `DocumentList.jsx` e `DownloadButton.jsx` quando fizer sentido.

## Requisitos de UI

- A primeira tela deve ser a area utilizavel de gestao de documentos, nao uma landing page.
- O layout deve funcionar bem em desktop e mobile.
- O formulario de upload deve ter campos, labels, estado de envio, erro e botao com estilos claros.
- A lista de documentos deve ter bom estado vazio e leitura confortavel dos metadados.
- O botao/link de download deve parecer uma acao consistente com o restante da interface.
- Use classes Tailwind diretamente nos componentes, evitando abstrair sem necessidade.
- Nao altere contratos da API nem as regras de negocio.

## Validacao obrigatoria

Ao final, execute no diretorio `frontend`:

```bash
npm run build
```

Corrija qualquer erro causado pelas mudancas antes de concluir.