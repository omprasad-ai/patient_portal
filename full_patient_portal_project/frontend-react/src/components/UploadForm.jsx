import React, { useRef } from 'react';
import { uploadFile } from '../api';

export default function UploadForm({ onUploaded, onError }) {
  const fileRef = useRef();

  const onSubmit = async (e) => {
    e.preventDefault();
    const file = fileRef.current.files[0];
    if (!file) return onError('Please choose a file');
    if (file.type !== 'application/pdf') return onError('Only PDF files allowed');

    try {
      await uploadFile(file);
      fileRef.current.value = null;
      onUploaded();
    } catch (err) {
      onError('Upload failed: ' + err.message);
    }
  };

  return (
    <form onSubmit={onSubmit} className="upload-form">
      <input ref={fileRef} type="file" accept="application/pdf" />
      <button type="submit">Upload PDF</button>
    </form>
  );
}
