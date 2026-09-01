// Definição dos endpoints de documentos. Delega para o controller.

const express = require('express');
const multer = require('multer');
const crypto = require('node:crypto');
const path = require('node:path');
const documentsController = require('../controllers/documents.controller');
const { STORAGE_DIR } = require('../config/storage');

// Grava os arquivos no filesystem local com nome único, preservando a extensão.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, STORAGE_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/upload', upload.single('file'), documentsController.upload);
router.get('/documents', documentsController.list);
router.get('/documents/:id/download', documentsController.download);

module.exports = router;
