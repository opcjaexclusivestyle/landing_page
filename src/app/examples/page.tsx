'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ExamplesPage() {
  return (
    <main className='min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto'>
      <h1 className='text-4xl md:text-5xl font-light text-center mb-12 text-gray-800'>
        Przykłady komponentów
      </h1>

      {/* Nawigacja do strony głównej */}
      <div className='mb-8 text-center'>
        <Link
          href='/'
          className='text-blue-600 hover:text-blue-800 transition-colors duration-300'
        >
          Powrót do strony głównej
        </Link>
      </div>

      {/* Informacja o przykładzie */}
      <div className='bg-blue-50 p-6 rounded-lg mb-12 max-w-3xl mx-auto'>
        <h2 className='text-xl text-blue-800 mb-2'>Informacja o przykładach</h2>
        <p className='text-gray-700'>
          Ta strona zawiera przykłady różnych komponentów używanych w aplikacji.
        </p>
      </div>

      {/* Przykładowa treść strony */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className='bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 duration-300'
          >
            <div className='h-64 bg-gray-200'></div>
            <div className='p-6'>
              <h3 className='text-xl font-medium mb-2'>Przykład {index + 1}</h3>
              <p className='text-gray-600 mb-4'>
                Opis przykładowego komponentu.
              </p>
              <button className='bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors duration-300'>
                Szczegóły
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
