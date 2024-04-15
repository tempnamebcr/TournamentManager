import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

const UploadPhotoButton = ({ tournament }) => {
  const { data, setData, post, processing, errors } = useForm({
    image:''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data.image)
    post(`/tournaments/${tournament.id}/uploadPhoto`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" onChange={(e) => setData('image',e.target.files[0])} />
        <button type="submit" disabled={processing} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
          {processing ? 'Processing...' : 'Upload photo'}
        </button>
      </form>
    </div>
  );
};

export default UploadPhotoButton;
