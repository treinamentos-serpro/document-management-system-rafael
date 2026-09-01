// Formulário de upload usando os componentes do GovBR-DS (wrapper React).

import { useRef, useState } from 'react';
import { BrUpload, BrInput, BrButton, BrMessage } from '@govbr-ds/webcomponents-react';
import { uploadDocument } from '../services/documentsApi';

export default function UploadComponent({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const ownerRef = useRef(null);
  const uploadRef = useRef(null);

  function handleSelectedFiles(event) {
    const files = event.detail;
    setFile(files && files.length ? files[0] : null);
  }

  async function handleSubmit() {
    setError('');

    if (!file) {
      setError('Selecione um arquivo para enviar.');
      return;
    }

    setSending(true);
    try {
      const owner = ownerRef.current ? ownerRef.current.value : '';
      await uploadDocument(file, owner);
      setFile(null);
      if (ownerRef.current) {
        ownerRef.current.value = '';
      }
      if (onUploaded) {
        onUploaded();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="d-flex flex-column" style={{ gap: '1rem' }}>
      <BrUpload
        ref={uploadRef}
        label="Documento"
        onSelectedFilesChange={handleSelectedFiles}
      />
      <BrInput
        ref={ownerRef}
        label="Dono (opcional)"
        placeholder="Identificador do usuário"
      />
      <div>
        <BrButton emphasis="primary" onClick={handleSubmit} disabled={sending}>
          {sending ? 'Enviando...' : 'Enviar documento'}
        </BrButton>
      </div>
      {error && (
        <BrMessage state="danger" showIcon>
          {error}
        </BrMessage>
      )}
    </div>
  );
}
