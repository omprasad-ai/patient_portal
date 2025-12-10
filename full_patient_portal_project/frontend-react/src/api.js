const BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:8080';

async function handleResp(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res;
}

export async function uploadFile(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${BASE}/documents/upload`, {
    method: 'POST',
    body: fd
  });
  return handleResp(res);
}

export async function listDocuments() {
  const res = await fetch(`${BASE}/documents`);
  return handleResp(res);
}

export async function downloadDocument(id) {
  const res = await fetch(`${BASE}/documents/${id}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  const blob = await res.blob();
  return { 
    blob, 
    filename: getFilenameFromContentDisposition(res.headers.get('content-disposition')) 
  };
}

function getFilenameFromContentDisposition(header) {
  if (!header) return 'download.pdf';
  const match = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(header);
  if (match) return match[1].replace(/['"]/g, '');
  return 'download.pdf';
}

export async function deleteDocument(id) {
  const res = await fetch(`${BASE}/documents/${id}`, { method: 'DELETE' });
  return handleResp(res);
}
