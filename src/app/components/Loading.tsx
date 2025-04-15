import React from 'react';

export default function Loading() {
  return (
    <div className='flex flex-col items-center justify-center py-16'>
      <div className='w-12 h-12 border-4 border-t-[var(--gold)] border-gray-200 rounded-full animate-spin'></div>
      <p className='mt-4 text-gray-600 font-medium'>Ładowanie...</p>
    </div>
  );
}
