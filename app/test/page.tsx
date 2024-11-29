'use client';

import { UploadButton } from '@/lib/uploadthing';
import React from 'react';

const TestPage = () => {
  return (
    <div>
      <UploadButton endpoint={'imageUploader'} />
    </div>
  );
};

export default TestPage;
