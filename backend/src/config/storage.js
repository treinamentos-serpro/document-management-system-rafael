const path = require('node:path');

const STORAGE_ROOT = process.env.STORAGE_ROOT || path.join(__dirname, '..', '..', 'storage');

module.exports = {
  STORAGE_ROOT,
};
