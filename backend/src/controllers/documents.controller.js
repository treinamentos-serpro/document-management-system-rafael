// Entrada/saída HTTP e validação básica dos documentos.

const path = require('node:path');
const fs = require('node:fs');
const documentsService = require('../services/documents.service');
const { STORAGE_DIR } = require('../config/storage');

function upload(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
  }

  const owner = req.body && req.body.owner;
  const document = documentsService.createDocument(req.file, owner);
  return res.status(201).json(document);
}

function list(req, res) {
  const documents = documentsService.listDocuments();
  return res.status(200).json(documents);
}

function download(req, res) {
  const document = documentsService.getDocument(req.params.id);

  if (!document) {
    return res.status(404).json({ error: 'Documento não encontrado' });
  }

  const filePath = path.join(STORAGE_DIR, document.storedName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo não encontrado no storage' });
  }

  return res.download(filePath, document.originalName);
}

module.exports = {
  upload,
  list,
  download,
};
