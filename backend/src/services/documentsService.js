const crypto = require('node:crypto');
const documentsRepository = require('../repositories/documentsRepository');

function createDocumentMetadata({ file, owner, id = crypto.randomUUID(), uploadedAt = new Date().toISOString() }) {
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

function createDocumentsService({ repository = documentsRepository } = {}) {
  function registerDocument({ file, owner }) {
    const document = createDocumentMetadata({ file, owner });
    return repository.save(document);
  }

  function listDocuments() {
    return repository.findAll();
  }

  function getDocumentById(id) {
    return repository.findById(id);
  }

  return { registerDocument, listDocuments, getDocumentById };
}

module.exports = {
  ...createDocumentsService(),
  createDocumentMetadata,
  createDocumentsService,
};
