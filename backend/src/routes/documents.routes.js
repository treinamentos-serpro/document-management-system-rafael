const path = require('node:path');
const express = require('express');
const multer = require('multer');

const { STORAGE_ROOT } = require('../config/storage');
const documentsController = require('../controllers/documents.controller');

function sanitizeBaseName(originalName) {
  const rawName = String(originalName || 'arquivo').replace(/\\/g, '/').split('/').pop() || 'arquivo';
  const extension = path.extname(rawName);
  const baseName = path
    .basename(rawName, extension)
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .replace(/^\.+/, '')
    .replace(/^$/, 'arquivo');

  return `${baseName}-${Date.now()}${extension || ''}`;
}

const storage = multer.diskStorage({
  destination(_req, _file, callback) {
    callback(null, STORAGE_ROOT);
  },
  filename(_req, file, callback) {
    callback(null, sanitizeBaseName(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const router = express.Router();

router.post('/upload', upload.single('file'), documentsController.uploadDocument);
router.get('/documents', documentsController.listDocuments);
router.get('/documents/:id/download', documentsController.downloadDocument);

module.exports = router;
