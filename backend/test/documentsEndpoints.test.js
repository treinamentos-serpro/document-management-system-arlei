const { test } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

async function createServer() {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => {
    server.once('listening', resolve);
  });

  const { port } = server.address();
  return { server, baseUrl: `http://127.0.0.1:${port}` };
}

test('POST /upload cria um documento e retorna o metadata do arquivo', async () => {
  const { server, baseUrl } = await createServer();

  try {
    const formData = new FormData();
    formData.append('file', new Blob(['conteudo do documento'], { type: 'text/plain' }), 'arquivo-de-teste.txt');
    formData.append('owner', 'usuario-1');

    const response = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      body: formData,
    });

    assert.strictEqual(response.status, 201);

    const document = await response.json();
    assert.strictEqual(document.originalName, 'arquivo-de-teste.txt');
    assert.strictEqual(document.owner, 'usuario-1');
    assert.ok(document.id);
    assert.ok(document.storedName);
    assert.ok(document.uploadedAt);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test('GET /documents lista os documentos cadastrados', async () => {
  const { server, baseUrl } = await createServer();

  try {
    const formData = new FormData();
    formData.append('file', new Blob(['lista de documentos'], { type: 'text/plain' }), 'lista.txt');
    formData.append('owner', 'usuario-2');

    const uploadResponse = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      body: formData,
    });
    const uploadedDocument = await uploadResponse.json();

    const response = await fetch(`${baseUrl}/documents`);
    assert.strictEqual(response.status, 200);

    const documents = await response.json();
    assert.ok(documents.some((document) => document.id === uploadedDocument.id));
    assert.ok(documents.some((document) => document.originalName === 'lista.txt'));
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test('GET /documents/:id/download devolve o arquivo solicitado', async () => {
  const { server, baseUrl } = await createServer();

  try {
    const formData = new FormData();
    formData.append('file', new Blob(['conteudo para download'], { type: 'text/plain' }), 'download.txt');
    formData.append('owner', 'usuario-3');

    const uploadResponse = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      body: formData,
    });
    const uploadedDocument = await uploadResponse.json();

    const response = await fetch(`${baseUrl}/documents/${uploadedDocument.id}/download`);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(await response.text(), 'conteudo para download');
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
