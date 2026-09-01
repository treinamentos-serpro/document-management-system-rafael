// Botão de download de um documento, estilizado com o GovBR-DS.
// Usa uma âncora nativa para acionar o download do navegador.

import { getDownloadUrl } from '../services/documentsApi';

export default function DownloadButton({ documentId, children }) {
  return (
    <a
      className="br-button secondary small"
      href={getDownloadUrl(documentId)}
      download
    >
      {children || 'Baixar'}
    </a>
  );
}
