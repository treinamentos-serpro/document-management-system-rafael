const path = require('node:path');
const crypto = require('node:crypto');
const express = require('express');
const rateLimit = require('express-rate-limit');
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

  return `${baseName}-${crypto.randomUUID()}${extension || ''}`;
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

const uploadRateLimiter = rateLimit({
  windowMs: 60_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Muitas requisições. Tente novamente em alguns segundos.',
  },
});

const router = express.Router();

router.post('/upload', uploadRateLimiter, upload.single('file'), documentsController.uploadDocument);
router.get('/documents', documentsController.listDocuments);
router.get('/documents/:id/download', documentsController.downloadDocument);

module.exports = router;
