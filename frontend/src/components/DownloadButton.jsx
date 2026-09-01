import { getDownloadUrl } from '../services/documentsApi.js';

export default function DownloadButton({ documentId }) {
  return (
    <a
      className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-800 shadow-sm transition hover:border-emerald-600 hover:text-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
      href={getDownloadUrl(documentId)}
      download
    >
      Baixar
    </a>
  );
}
