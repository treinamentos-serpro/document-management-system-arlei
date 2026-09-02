import DocumentsPage from './pages/DocumentsPage.jsx';

export default function App() {
  return (
    <main className="min-h-screen bg-[#f7f8f3] text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Gestao de documentos</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
              Document Management System
            </h1>
          </div>
          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
            Upload, listagem e download em um fluxo simples.
          </div>
        </header>

        <DocumentsPage />
      </div>
    </main>
  );
}
