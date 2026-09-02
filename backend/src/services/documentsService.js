const crypto = require('node:crypto');
const documentsRepository = require('../repositories/documentsRepository');

function createDocumentMetadata({ file, owner }) {
  return {
    id: crypto.randomUUID(),
    originalName: file.originalname,
    storedName: file.filename,
    size: file.size,
    mimeType: file.mimetype,
    uploadedAt: new Date().toISOString(),
    owner,
  };
}

function registerDocument({ file, owner }) {
  const document = createDocumentMetadata({ file, owner });
  return documentsRepository.save(document);
}

function listDocuments() {
  return documentsRepository.findAll();
}

function getDocumentById(id) {
  return documentsRepository.findById(id);
}

module.exports = { registerDocument, listDocuments, getDocumentById };
