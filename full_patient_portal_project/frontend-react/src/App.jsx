import React, { useState, useEffect } from 'react';
import UploadForm from './components/UploadForm';
import DocumentList from './components/DocumentList';
import { listDocuments } from './api';

export default function App() {
  const [docs, setDocs] = useState([]);
  const [status, setStatus] = useState(null);

  const fetchDocs = async () => {
    try {
      const data = await listDocuments();
      setDocs(data);
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to load documents: ' + err.message });
    }
  };

  useEffect(() => { fetchDocs(); }, []);

  return (
    <div className="container">
      <h1>Patient Documents Portal</h1>

      <UploadForm 
        onUploaded={() => { setStatus({type:'success', message:'Upload successful'}); fetchDocs(); }} 
        onError={(m)=>setStatus({type:'error', message:m})}
      />

      {status && <div className={`status ${status.type}`}>{status.message}</div>}

      <DocumentList
        documents={docs}
        onDelete={() => { setStatus({type:'success', message:'Deleted'}); fetchDocs(); }}
        onDownload={() => setStatus({type:'success', message:'Download complete'})}
        onError={(m)=>setStatus({type:'error', message:m})}
      />
    </div>
  );
}
