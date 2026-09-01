// Formulário de upload de documentos.

import { useState } from 'react';
import { uploadDocument } from '../services/documentsApi';

export default function UploadComponent({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [owner, setOwner] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!file) {
      setError('Selecione um arquivo para enviar.');
      return;
    }

    setSending(true);
    try {
      await uploadDocument(file, owner);
      setFile(null);
      setOwner('');
      event.target.reset();
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
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Arquivo:{' '}
          <input
            type="file"
            onChange={(event) => setFile(event.target.files[0] || null)}
          />
        </label>
      </div>
      <div>
        <label>
          Dono:{' '}
          <input
            type="text"
            value={owner}
            placeholder="opcional"
            onChange={(event) => setOwner(event.target.value)}
          />
        </label>
      </div>
      <button type="submit" disabled={sending}>
        {sending ? 'Enviando...' : 'Enviar documento'}
      </button>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </form>
  );
}
