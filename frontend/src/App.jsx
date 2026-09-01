// Componente raiz do Document Management System.

import { useCallback, useEffect, useState } from 'react';
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
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Document Management System</h1>

      <section>
        <h2>Enviar documento</h2>
        <UploadComponent onUploaded={loadDocuments} />
      </section>

      <section>
        <h2>Documentos</h2>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <DocumentList documents={documents} />
      </section>
    </main>
  );
}
