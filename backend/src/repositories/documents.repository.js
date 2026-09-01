// Persistência dos metadados dos documentos.
// Nesta fase os metadados ficam em memória; os arquivos binários são gravados
// no filesystem local (ver configuração do multer nas rotas).

const documents = [];

function save(document) {
  documents.push(document);
  return document;
}

function findAll() {
  return documents;
}

function findById(id) {
  return documents.find((document) => document.id === id);
}

module.exports = {
  save,
  findAll,
  findById,
};
