// Lista os documentos usando a tabela do GovBR-DS (classe br-table do core).

import DownloadButton from './DownloadButton';

// Formata o tamanho em bytes de forma legível.
function formatSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentList({ documents }) {
  if (!documents.length) {
    return <p>Nenhum documento enviado ainda.</p>;
  }

  return (
    <div className="br-table">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tamanho</th>
            <th>Enviado em</th>
            <th>Dono</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id}>
              <td>{document.originalName}</td>
              <td>{formatSize(document.size)}</td>
              <td>{new Date(document.uploadedAt).toLocaleString('pt-BR')}</td>
              <td>{document.owner}</td>
              <td>
                <DownloadButton documentId={document.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
