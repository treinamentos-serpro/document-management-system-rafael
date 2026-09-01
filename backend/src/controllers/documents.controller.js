const documentsService = require('../services/documents.service');

async function uploadDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Arquivo obrigatório.' });
    }

    const document = documentsService.registerUpload(req.file, req.body?.owner || 'anonymous');

    return res.status(201).json({
      id: document.id,
      originalName: document.originalName,
      filename: document.filename,
      size: document.size,
      mimeType: document.mimeType,
      owner: document.owner,
      uploadedAt: document.uploadedAt,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Não foi possível processar o upload.' });
  }
}

async function listDocuments(req, res) {
  try {
    const documents = documentsService.listDocuments();
    return res.json(documents);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Não foi possível listar os documentos.' });
  }
}

async function downloadDocument(req, res) {
  try {
    const document = documentsService.resolveDownloadDocument(req.params.id);
    return res.download(document.storagePath, document.originalName, (error) => {
      if (error && !res.headersSent) {
        res.status(503).json({ error: 'Arquivo não disponível para download.' });
      }
    });
  } catch (error) {
    if (error.code === 'FILE_UNAVAILABLE') {
      return res.status(503).json({ error: error.message });
    }

    if (error.code === 'DOCUMENT_NOT_FOUND') {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || 'Não foi possível processar o download.' });
  }
}

module.exports = {
  uploadDocument,
  listDocuments,
  downloadDocument,
};
