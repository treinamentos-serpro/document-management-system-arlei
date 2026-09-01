import DownloadButton from './DownloadButton.jsx';

function formatBytes(size) {
  if (size < 1024) {
    return `${size} bytes`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentList({ documents }) {
  if (documents.length === 0) {
    return (
      <div className="px-5 py-10 text-center sm:px-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-500">
          0
        </div>
        <p className="mt-4 text-base font-semibold text-slate-900">Nenhum documento enviado ainda.</p>
        <p className="mt-2 text-sm text-slate-600">Use o formulario ao lado para cadastrar o primeiro arquivo.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-3 sm:px-6" scope="col">Nome</th>
            <th className="px-5 py-3 sm:px-6" scope="col">Dono</th>
            <th className="px-5 py-3 sm:px-6" scope="col">Tamanho</th>
            <th className="px-5 py-3 sm:px-6" scope="col">Enviado em</th>
            <th className="px-5 py-3 text-right sm:px-6" scope="col">Acao</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {documents.map((document) => (
            <tr className="transition hover:bg-emerald-50/60" key={document.id}>
              <td className="max-w-[260px] px-5 py-4 font-semibold text-slate-950 sm:px-6">
                <span className="block truncate" title={document.originalName}>{document.originalName}</span>
              </td>
              <td className="px-5 py-4 text-slate-700 sm:px-6">{document.owner}</td>
              <td className="whitespace-nowrap px-5 py-4 text-slate-700 sm:px-6">{formatBytes(document.size)}</td>
              <td className="whitespace-nowrap px-5 py-4 text-slate-700 sm:px-6">
                {new Date(document.uploadedAt).toLocaleString('pt-BR')}
              </td>
              <td className="px-5 py-4 text-right sm:px-6">
                <DownloadButton documentId={document.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
