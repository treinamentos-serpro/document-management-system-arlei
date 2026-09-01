import { getDownloadUrl } from '../services/documentsApi.js';

export default function DownloadButton({ documentId }) {
  return (
    <a href={getDownloadUrl(documentId)} download>
      Baixar
    </a>
  );
}
