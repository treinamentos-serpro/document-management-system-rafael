// Cliente de API que consome o backend via fetch usando o prefixo /api
// (proxy configurado no Vite para o backend local).

const API_PREFIX = '/api';

// Envia um documento para o backend (multipart/form-data).
export async function uploadDocument(file, owner) {
  const formData = new FormData();
  formData.append('file', file);
  if (owner) {
    formData.append('owner', owner);
  }

  const response = await fetch(`${API_PREFIX}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Falha ao enviar o documento');
  }

  return response.json();
}

// Lista os metadados dos documentos enviados.
export async function listDocuments() {
  const response = await fetch(`${API_PREFIX}/documents`);

  if (!response.ok) {
    throw new Error('Falha ao carregar os documentos');
  }

  return response.json();
}

// Monta a URL de download de um documento pelo identificador.
export function getDownloadUrl(id) {
  return `${API_PREFIX}/documents/${id}/download`;
}
