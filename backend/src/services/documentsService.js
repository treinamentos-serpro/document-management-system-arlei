const crypto = require('node:crypto');
const documentsRepository = require('../repositories/documentsRepository');

function createDocumentMetadata({
  file,
  owner,
  id = crypto.randomUUID(),
  uploadedAt = new Date().toISOString(),
}) {
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

function createDocumentsService({ repository }) {
  return {
    registerDocument({ file, owner }) {
      const document = createDocumentMetadata({ file, owner });
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

const defaultDocumentsService = createDocumentsService({ repository: documentsRepository });

module.exports = {
  ...defaultDocumentsService,
  createDocumentMetadata,
  createDocumentsService,
};
