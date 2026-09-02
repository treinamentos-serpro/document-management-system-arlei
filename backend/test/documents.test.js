const { test, before, after } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const app = require('../src/app');

const STORAGE_DIR = path.join(__dirname, '..', 'storage');

let server;
let baseUrl;
const uploadedStoredNames = new Set();

before(() => {
  server = app.listen(0);
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(() => {
  server.close();
  for (const storedName of uploadedStoredNames) {
    const filePath = path.join(STORAGE_DIR, storedName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

async function uploadDocument(overrides) {
  const response = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: buildUploadForm(overrides),
  });

  if (response.status === 201) {
    const document = await response.json();
    uploadedStoredNames.add(document.storedName);
    return { response, document };
  }

  return { response, document: null };
}

test('POST /upload envia um documento e retorna os metadados', async () => {
  const { response, document } = await uploadDocument();

  assert.strictEqual(response.status, 201);
  assert.ok(document.id, 'deve retornar um id gerado');
  assert.strictEqual(document.originalName, 'contrato.txt');
  assert.strictEqual(document.owner, 'usuario-1');
  assert.ok(document.size > 0, 'deve retornar o tamanho do arquivo');
  assert.ok(document.uploadedAt, 'deve retornar a data do upload');
});

test('POST /upload sem arquivo retorna 400', async () => {
  const form = new FormData();
  form.append('owner', 'usuario-1');

  const response = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: form,
  });

  assert.strictEqual(response.status, 400);
});

test('GET /documents lista os documentos enviados', async () => {
  const { document: uploaded } = await uploadDocument({ filename: 'lista.txt' });

  const listResponse = await fetch(`${baseUrl}/documents`);
  assert.strictEqual(listResponse.status, 200);
  const documents = await listResponse.json();

  assert.ok(Array.isArray(documents), 'deve retornar uma lista');
  const found = documents.find((document) => document.id === uploaded.id);
  assert.ok(found, 'o documento enviado deve estar na listagem');
});

test('GET /documents/:id/download baixa o conteúdo do documento', async () => {
  const content = 'conteudo para download';
  const { document: uploaded } = await uploadDocument({ filename: 'download.txt', content });

  const downloadResponse = await fetch(`${baseUrl}/documents/${uploaded.id}/download`);
  assert.strictEqual(downloadResponse.status, 200);
  const downloadedContent = await downloadResponse.text();
  assert.strictEqual(downloadedContent, content);
});

test('GET /documents/:id/download com id inexistente retorna 404', async () => {
  const response = await fetch(`${baseUrl}/documents/id-inexistente/download`);
  assert.strictEqual(response.status, 404);
});
function buildUploadForm({ owner = 'usuario-1', filename = 'contrato.txt', content = 'conteudo do documento' } = {}) {
  const form = new FormData();
  form.append('owner', owner);
  form.append('file', new Blob([content], { type: 'text/plain' }), filename);
  return form;
}
