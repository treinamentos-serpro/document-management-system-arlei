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
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-semibold text-slate-800" htmlFor="owner">Usuario</label>
        <input
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          id="owner"
          type="text"
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
          placeholder="Ex. arlei"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-800" htmlFor="file">Arquivo</label>
        <input
          className="mt-2 w-full cursor-pointer rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-700 shadow-sm outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-emerald-500 hover:bg-emerald-50 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          id="file"
          type="file"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
      </div>
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
      <button
        className="inline-flex w-full items-center justify-center rounded-md bg-emerald-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar documento'}
      </button>
    </form>
  );
}
