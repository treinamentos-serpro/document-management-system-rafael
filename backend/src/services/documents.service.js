// Regras de negócio dos documentos.

const crypto = require('node:crypto');
const documentsRepository = require('../repositories/documents.repository');

const DEFAULT_OWNER = 'anonymous';

// Cria os metadados de um documento a partir do arquivo recebido pelo multer.
function createDocument(file, owner) {
  if (!file) {
    throw new Error('Arquivo não enviado');
  }

  const document = {
    id: crypto.randomUUID(),
    originalName: file.originalname,
    storedName: file.filename,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner: owner || DEFAULT_OWNER,
  };

  return documentsRepository.save(document);
}

function listDocuments() {
  return documentsRepository.findAll();
}

function getDocument(id) {
  return documentsRepository.findById(id);
}

module.exports = {
  createDocument,
  listDocuments,
  getDocument,
};
