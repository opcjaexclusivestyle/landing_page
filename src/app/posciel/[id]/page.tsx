'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ProductDisplay from '@/components/ProductDisplay';
import { Product } from '@/components/ProductDisplay';
import Loading from '@/app/components/Loading';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        // Pobieranie produktu z Supabase na podstawie ID
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;

        if (data) {
          setProduct(data as Product);
        } else {
          setError('Nie znaleziono produktu');
        }
      } catch (error) {
        console.error('Błąd podczas pobierania produktu:', error);
        setError(
          'Wystąpił błąd podczas ładowania produktu. Spróbuj ponownie później.',
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <Loading />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
          <h1 className='text-2xl font-bold text-red-700 mb-4'>
            Ups! Coś poszło nie tak
          </h1>
          <p className='text-red-600'>
            {error || 'Nie można załadować produktu'}
          </p>
          <a
            href='/'
            className='mt-6 inline-block px-6 py-3 bg-[var(--gold)] hover:bg-[var(--deep-gold)] text-white rounded-md transition-colors'
          >
            Powrót do strony głównej
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
      <div className='mb-6'>
        <a
          href='/posciel'
          className='text-[var(--gold)] hover:underline flex items-center'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 mr-1'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
              clipRule='evenodd'
            />
          </svg>
          Wróć do listy produktów
        </a>
      </div>

      <div className='bg-white rounded-lg shadow-lg p-6'>
        <ProductDisplay product={product} />
      </div>
    </div>
  );
}
