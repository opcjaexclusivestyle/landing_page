'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/app/components/Loading';
import { Product } from '@/components/ProductDisplay';

export default function BeddingProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>(
    'newest',
  );

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*');

        // Zastosowanie sortowania
        if (sortBy === 'newest') {
          query = query.order('created_at', { ascending: false });
        } else if (sortBy === 'price-low') {
          query = query.order('current_price', { ascending: true });
        } else if (sortBy === 'price-high') {
          query = query.order('current_price', { ascending: false });
        }

        const { data, error } = await query;

        if (error) throw error;
        setProducts(data as Product[]);
      } catch (error) {
        console.error('Błąd podczas pobierania produktów:', error);
        setError(
          'Wystąpił błąd podczas ładowania produktów. Spróbuj ponownie później.',
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [sortBy]);

  return (
    <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
      <div className='text-center mb-12'>
        <h1 className='text-3xl font-bold text-[var(--deep-navy)] mb-4'>
          Pościel Premium
        </h1>
        <p className='max-w-2xl mx-auto text-gray-600'>
          Nasza kolekcja luksusowej pościeli wykonanej z najwyższej jakości
          materiałów. Odkryj komfort i elegancję dla Twojej sypialni.
        </p>
      </div>

      {/* Filtrowanie i sortowanie */}
      <div className='flex justify-end mb-8'>
        <div className='relative'>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className='block appearance-none w-full bg-white border border-gray-300 py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
          >
            <option value='newest'>Najnowsze</option>
            <option value='price-low'>Cena: od najniższej</option>
            <option value='price-high'>Cena: od najwyższej</option>
          </select>
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
            <svg
              className='fill-current h-4 w-4'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
            >
              <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
          <h2 className='text-xl font-bold text-red-700 mb-4'>
            Ups! Coś poszło nie tak
          </h2>
          <p className='text-red-600'>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-gray-500'>Brak produktów do wyświetlenia</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
          {products.map((product) => (
            <div
              key={product.id}
              className='bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1'
            >
              <Link href={`/posciel/${product.id}`}>
                <div className='relative h-64 w-full'>
                  <Image
                    src={
                      product.main_image ||
                      product.color_variants[0]?.images[0] ||
                      '/placeholder.jpg'
                    }
                    alt={product.name}
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='p-4'>
                  <h2 className='text-lg font-semibold text-gray-800 mb-2'>
                    {product.name}
                  </h2>
                  <p className='text-sm text-gray-600 line-clamp-2 mb-4'>
                    {product.description}
                  </p>

                  <div className='flex justify-between items-center'>
                    <div>
                      <span className='text-lg font-bold text-[var(--gold)]'>
                        {product.current_price.toFixed(2)} zł
                      </span>
                      {product.regular_price > product.current_price && (
                        <span className='ml-2 text-sm text-gray-400 line-through'>
                          {product.regular_price.toFixed(2)} zł
                        </span>
                      )}
                    </div>
                    <div className='flex space-x-1'>
                      {product.color_variants
                        .slice(0, 3)
                        .map((colorVariant, index) => (
                          <div
                            key={index}
                            className='w-4 h-4 rounded-full border border-gray-300'
                            style={{
                              backgroundColor: colorVariant.color.startsWith(
                                '#',
                              )
                                ? colorVariant.color
                                : '',
                            }}
                            title={colorVariant.name}
                          />
                        ))}
                      {product.color_variants.length > 3 && (
                        <div className='w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs'>
                          +{product.color_variants.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
