// Componente raiz do Document Management System.

import { useCallback, useEffect, useState } from 'react';
import { BrHeader, BrCard, BrMessage } from '@govbr-ds/webcomponents-react';
import UploadComponent from './components/UploadComponent';
import DocumentList from './components/DocumentList';
import { listDocuments } from './services/documentsApi';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');

  const loadDocuments = useCallback(async () => {
    setError('');
    try {
      const data = await listDocuments();
      setDocuments(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  return (
    <>
      <BrHeader
        title="Document Management System"
        subTitle="Gestão de documentos"
        density="small"
      />

      <main className="container-lg" style={{ paddingBlock: '2rem' }}>
        <div className="d-flex flex-column" style={{ gap: '2rem' }}>
          <BrCard>
            <h2 className="mb-3">Enviar documento</h2>
            <UploadComponent onUploaded={loadDocuments} />
          </BrCard>

          <BrCard>
            <h2 className="mb-3">Documentos</h2>
            {error && (
              <BrMessage state="danger" showIcon>
                {error}
              </BrMessage>
            )}
            <DocumentList documents={documents} />
          </BrCard>
        </div>
      </main>
    </>
  );
}
