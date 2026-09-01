// Configuração do diretório de armazenamento local dos arquivos.

const path = require('node:path');
const fs = require('node:fs');

const STORAGE_DIR = process.env.STORAGE_DIR
  || path.join(__dirname, '..', '..', 'storage');

// Garante que o diretório de storage exista antes de gravar arquivos.
fs.mkdirSync(STORAGE_DIR, { recursive: true });

module.exports = {
  STORAGE_DIR,
};
