// Botão de download de um documento pelo identificador.

import { getDownloadUrl } from '../services/documentsApi';

export default function DownloadButton({ documentId, children }) {
  return (
    <a href={getDownloadUrl(documentId)} download>
      {children || 'Baixar'}
    </a>
  );
}
