const { test } = require('node:test');
const assert = require('node:assert');
const { createDocumentMetadata, createDocumentsService } = require('../src/services/documentsService');

function buildUploadedFile(overrides = {}) {
  return {
    originalname: 'contrato.txt',
    filename: 'arquivo-gerado.txt',
    size: 42,
    mimetype: 'text/plain',
    ...overrides,
  };
}

test('createDocumentMetadata monta os metadados a partir do arquivo enviado', () => {
  const document = createDocumentMetadata({
    file: buildUploadedFile(),
    owner: 'usuario-1',
    id: 'documento-1',
    uploadedAt: '2026-09-01T19:00:00.000Z',
  });

  assert.deepStrictEqual(document, {
    id: 'documento-1',
    originalName: 'contrato.txt',
    storedName: 'arquivo-gerado.txt',
    size: 42,
    mimeType: 'text/plain',
    uploadedAt: '2026-09-01T19:00:00.000Z',
    owner: 'usuario-1',
  });
});

test('registerDocument cria metadados e delega a persistencia ao repositorio', () => {
  let savedDocument;
  const repository = {
    save: (document) => {
      savedDocument = document;
      return document;
    },
    findAll: () => [],
    findById: () => undefined,
  };
  const service = createDocumentsService({ repository });

  const document = service.registerDocument({ file: buildUploadedFile(), owner: 'usuario-1' });

  assert.strictEqual(document, savedDocument);
  assert.strictEqual(document.originalName, 'contrato.txt');
  assert.strictEqual(document.storedName, 'arquivo-gerado.txt');
  assert.strictEqual(document.owner, 'usuario-1');
  assert.ok(document.id);
  assert.ok(document.uploadedAt);
});

test('listDocuments e getDocumentById delegam consultas ao repositorio', () => {
  const expectedDocuments = [{ id: 'documento-1' }];
  const repository = {
    save: (document) => document,
    findAll: () => expectedDocuments,
    findById: (id) => expectedDocuments.find((document) => document.id === id),
  };
  const service = createDocumentsService({ repository });

  assert.strictEqual(service.listDocuments(), expectedDocuments);
  assert.strictEqual(service.getDocumentById('documento-1'), expectedDocuments[0]);
  assert.strictEqual(service.getDocumentById('inexistente'), undefined);
});