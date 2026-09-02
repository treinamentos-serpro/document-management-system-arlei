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
    <section className="grid gap-6 lg:grid-cols-[minmax(280px,380px)_1fr] lg:items-start">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-950">Enviar documento</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Selecione um arquivo local e informe o usuario responsavel pelo documento.
          </p>
        </div>
        <UploadComponent onUpload={handleUpload} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Documentos cadastrados</h2>
            <p className="mt-1 text-sm text-slate-600">Acompanhe os arquivos enviados para armazenamento local.</p>
          </div>
          <span className="inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            {documents.length} {documents.length === 1 ? 'documento' : 'documentos'}
          </span>
        </div>

        {error && (
          <p className="mx-5 mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:mx-6" role="alert">
            {error}
          </p>
        )}

        <DocumentList documents={documents} />
      </div>
    </section>
  );
}
