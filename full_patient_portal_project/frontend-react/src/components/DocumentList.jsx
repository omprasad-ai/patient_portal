import React from 'react';
import { downloadDocument, deleteDocument } from '../api';

export default function DocumentList({ documents = [], onDelete, onDownload, onError }) {

  const handleDownload = async (id) => {
    try {
      const { blob, filename } = await downloadDocument(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'document.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      onDownload();
    } catch (err) {
      onError('Download failed: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await deleteDocument(id);
      onDelete();
    } catch (err) {
      onError('Delete failed: ' + err.message);
    }
  };

  if (!documents.length) return <p>No documents uploaded yet.</p>;

  return (
    <table className="doc-table">
      <thead>
        <tr>
          <th>ID</th><th>Filename</th><th>Size (bytes)</th><th>Uploaded</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {documents.map(d => (
          <tr key={d.id}>
            <td>{d.id}</td>
            <td>{d.filename}</td>
            <td>{d.filesize}</td>
            <td>{new Date(d.createdAt).toLocaleString()}</td>
            <td>
              <button onClick={() => handleDownload(d.id)}>Download</button>
              <button onClick={() => handleDelete(d.id)} className="danger">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
