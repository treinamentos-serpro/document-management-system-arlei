// Persistência dos metadados de documentos em memória (fase inicial do projeto).
const documents = new Map();

function save(document) {
  documents.set(document.id, document);
  return document;
}

function findAll() {
  return Array.from(documents.values());
}

function findById(id) {
  return documents.get(id);
}

module.exports = { save, findAll, findById };