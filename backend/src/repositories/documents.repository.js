const { randomUUID } = require('node:crypto');

const documents = [];

function findAll() {
  return [...documents];
}

function findById(id) {
  return documents.find((document) => document.id === id) || null;
}

function save(document) {
  const record = {
    ...document,
    id: document.id || randomUUID(),
    uploadedAt: document.uploadedAt || new Date().toISOString(),
  };

  documents.push(record);
  return record;
}

function reset() {
  documents.length = 0;
}

module.exports = {
  findAll,
  findById,
  save,
  reset,
};
