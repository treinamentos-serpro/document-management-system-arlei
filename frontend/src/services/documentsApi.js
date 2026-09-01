const API_BASE_URL = '/api';

export async function uploadDocument({ file, owner }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('owner', owner);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Falha ao enviar o documento');
  }

  return response.json();
}

export async function listDocuments() {
  const response = await fetch(`${API_BASE_URL}/documents`);
  if (!response.ok) {
    throw new Error('Falha ao listar os documentos');
  }
  return response.json();
}

export function getDownloadUrl(id) {
  return `${API_BASE_URL}/documents/${id}/download`;
}
