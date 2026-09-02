const crypto = require('node:crypto');
const documentsRepository = require('../repositories/documentsRepository');

function buildDocumentMetadata({ file, owner, id = crypto.randomUUID(), uploadedAt = new Date().toISOString() }) {
  return {
    id,
    originalName: file.originalname,
    storedName: file.filename,
    size: file.size,
    mimeType: file.mimetype,
    uploadedAt,
    owner,
  };
}

function createDocumentMetadata({ file, owner, id, uploadedAt }) {
  return buildDocumentMetadata({ file, owner, id, uploadedAt });
}

function createRepositoryAdapter(repository) {
  return {
    saveDocument(document) {
      return repository.save(document);
    },
    listDocuments() {
      return repository.findAll();
    },
    getDocumentById(id) {
      return repository.findById(id);
    },
  };
}

function createDocumentsService({ repository = documentsRepository } = {}) {
  const repositoryAdapter = createRepositoryAdapter(repository);

  function registerDocument({ file, owner }) {
    const document = createDocumentMetadata({ file, owner });
    return repositoryAdapter.saveDocument(document);
  }

  function listDocuments() {
    return repositoryAdapter.listDocuments();
  }

  function getDocumentById(id) {
    return repositoryAdapter.getDocumentById(id);
  }

  return { registerDocument, listDocuments, getDocumentById };
}

module.exports = {
  ...createDocumentsService(),
  createDocumentMetadata,
  createDocumentsService,
};
