const { test } = require('node:test');
const assert = require('node:assert');

const app = require('../src/app');
const documentsRepository = require('../src/repositories/documents.repository');

async function withServer(callback) {
  const server = app.listen(0);

  await new Promise((resolve) => {
    server.once('listening', resolve);
  });

  const { port } = server.address();

  try {
    await callback(port);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
}

test('deve fazer upload, listar e baixar um documento via API', async () => {
  await withServer(async (port) => {
    for (const prefix of ['', '/api']) {
      documentsRepository.reset();

      const formData = new FormData();
      formData.append('file', new Blob(['conteudo de teste'], { type: 'text/plain' }), 'documento.txt');

      const uploadResponse = await fetch(`http://127.0.0.1:${port}${prefix}/upload`, {
        method: 'POST',
        body: formData,
      });

      assert.strictEqual(uploadResponse.status, 201, `o upload em ${prefix || '/'} deve criar um documento`);

      const uploadedDocument = await uploadResponse.json();
      assert.strictEqual(uploadedDocument.originalName, 'documento.txt');
      assert.ok(uploadedDocument.id, 'o documento deve ter um id');

      const listResponse = await fetch(`http://127.0.0.1:${port}${prefix}/documents`);
      assert.strictEqual(listResponse.status, 200, `a listagem em ${prefix || '/'} deve responder com sucesso`);

      const documents = await listResponse.json();
      assert.ok(documents.some((document) => document.id === uploadedDocument.id));

      const downloadResponse = await fetch(`http://127.0.0.1:${port}${prefix}/documents/${uploadedDocument.id}/download`);
      assert.strictEqual(downloadResponse.status, 200, `o download em ${prefix || '/'} deve responder com sucesso`);
      assert.strictEqual(await downloadResponse.text(), 'conteudo de teste');
    }
  });
});
