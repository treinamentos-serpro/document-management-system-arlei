import { useState } from 'react';

export default function UploadComponent({ onUpload }) {
  const [file, setFile] = useState(null);
  const [owner, setOwner] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!file || !owner) {
      setError('Selecione um arquivo e informe o usuário dono');
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpload({ file, owner });
      setFile(null);
      setOwner('');
      event.target.reset();
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="owner">Usuário</label>
        <input id="owner" type="text" value={owner} onChange={(event) => setOwner(event.target.value)} />
      </div>
      <div>
        <label htmlFor="file">Arquivo</label>
        <input id="file" type="file" onChange={(event) => setFile(event.target.files[0])} />
      </div>
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar documento'}
      </button>
    </form>
  );
}
