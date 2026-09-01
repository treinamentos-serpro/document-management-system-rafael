const documentsRepository = require('../repositories/documents.repository');

class DocumentNotFoundError extends Error {
  constructor() {
    super('Documento não encontrado.');
    this.name = 'DocumentNotFoundError';
    this.code = 'DOCUMENT_NOT_FOUND';
  }
}

class FileUnavailableError extends Error {
  constructor() {
    super('Arquivo não disponível para download.');
    this.name = 'FileUnavailableError';
    this.code = 'FILE_UNAVAILABLE';
  }
}

function toDocumentRecord(file, owner = 'anonymous') {
  if (!file) {
    throw new Error('Arquivo obrigatório.');
  }

  const originalName = file.originalname || file.filename || 'arquivo';

  return {
    originalName,
    filename: file.filename,
    path: file.path,
    size: file.size,
    mimeType: file.mimetype || 'application/octet-stream',
    owner,
    uploadedAt: new Date().toISOString(),
  };
}

function serializeDocument(document, { includePath = false } = {}) {
  return {
    id: document.id,
    originalName: document.originalName,
    filename: document.filename,
    size: document.size,
    mimeType: document.mimeType,
    owner: document.owner,
    uploadedAt: document.uploadedAt,
    ...(includePath ? { path: document.path } : {}),
  };
}

class DocumentService {
  listDocuments() {
    return documentsRepository.findAll().map((document) => serializeDocument(document));
  }

  registerUpload(file, owner) {
    const document = toDocumentRecord(file, owner);
    return serializeDocument(documentsRepository.save(document));
  }

  getDocumentById(id) {
    const document = documentsRepository.findById(id);

    if (!document) {
      throw new DocumentNotFoundError();
    }

    return serializeDocument(document, { includePath: true });
  }

  resolveDownloadDocument(id) {
    const document = this.getDocumentById(id);

    if (!document.path) {
      throw new FileUnavailableError();
    }

    return {
      id: document.id,
      originalName: document.originalName,
      storagePath: document.path,
    };
  }
}

module.exports = new DocumentService();
module.exports.DocumentService = DocumentService;
module.exports.DocumentNotFoundError = DocumentNotFoundError;
module.exports.FileUnavailableError = FileUnavailableError;
