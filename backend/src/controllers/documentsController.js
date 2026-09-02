const path = require('node:path');
const fs = require('node:fs');
const documentsService = require('../services/documentsService');

const STORAGE_DIR = path.join(__dirname, '..', '..', 'storage');

function upload(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'O arquivo é obrigatório' });
  }
  if (!req.body.owner) {
    return res.status(400).json({ error: 'O campo owner é obrigatório' });
  }

  const document = documentsService.registerDocument({ file: req.file, owner: req.body.owner });
  return res.status(201).json(document);
}

function list(req, res) {
  return res.json(documentsService.listDocuments());
}

function download(req, res) {
  const document = documentsService.getDocumentById(req.params.id);
  if (!document) {
    return res.status(404).json({ error: 'Documento não encontrado' });
  }

  const filePath = path.join(STORAGE_DIR, document.storedName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo do documento não encontrado no armazenamento' });
  }

  return res.download(filePath, document.originalName);
}

module.exports = { upload, list, download };
