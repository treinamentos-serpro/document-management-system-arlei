import { useCallback, useEffect, useState } from 'react';
import UploadComponent from '../components/UploadComponent.jsx';
import DocumentList from '../components/DocumentList.jsx';
import { listDocuments, uploadDocument } from '../services/documentsApi.js';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');

  const refreshDocuments = useCallback(async () => {
    try {
      const data = await listDocuments();
      setDocuments(data);
    } catch (listError) {
      setError(listError.message);
    }
  }, []);

  useEffect(() => {
    refreshDocuments();
  }, [refreshDocuments]);

  async function handleUpload({ file, owner }) {
    await uploadDocument({ file, owner });
    await refreshDocuments();
  }

  return (
    <section>
      <h2>Documentos</h2>
      <UploadComponent onUpload={handleUpload} />
      {error && <p role="alert">{error}</p>}
      <DocumentList documents={documents} />
    </section>
  );
}
