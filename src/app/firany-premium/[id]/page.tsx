'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchCalculatorProducts, CalcProduct } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import SimplifiedOrderForm from '@/components/SimplifiedOrderForm';

export default function FiranyPremiumDetailPage() {
  const params = useParams();
  const productId = params?.id ? (params.id as string) : '';
  const decodedProductId = decodeURIComponent(productId);

  const [product, setProduct] = useState<CalcProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const productsData = await fetchCalculatorProducts();

        // Znajdź produkt po slug lub nazwie
        const foundProduct = productsData.find(
          (p) => p.slug === decodedProductId || p.name === decodedProductId,
        );

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Produkt nie został znaleziony');
        }
      } catch (err) {
        console.error('Błąd podczas ładowania produktu:', err);
        setError('Nie udało się załadować produktu. Spróbuj ponownie później.');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [decodedProductId]);

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-16'>
        <div className='flex justify-center items-center min-h-[50vh]'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className='container mx-auto px-4 py-16'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-red-600'>Błąd</h2>
          <p className='mt-2'>{error || 'Produkt nie został znaleziony'}</p>
          <Link
            href='/firany-premium'
            className='mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800'
          >
            <ChevronLeftIcon className='h-5 w-5 mr-1' />
            Powrót do listy produktów
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-16'>
      <Link
        href='/firany-premium'
        className='inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8'
      >
        <ChevronLeftIcon className='h-5 w-5 mr-1' />
        Powrót do listy produktów
      </Link>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
        {/* Lewy panel z informacjami o produkcie */}
        <div>
          <div className='relative h-[500px] w-full mb-6 rounded-lg overflow-hidden'>
            <Image
              src={
                product.imagePath ||
                product.image_path ||
                '/images/placeholder.jpg'
              }
              alt={product.name}
              fill
              sizes='(max-width: 1024px) 100vw, 50vw'
              className='object-cover'
              priority
            />
          </div>

          {/* Galeria miniatur */}
          {product.images && product.images.length > 0 && (
            <div className='grid grid-cols-4 gap-3'>
              {product.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className='relative h-24 rounded-md overflow-hidden border-2 border-transparent hover:border-indigo-500 cursor-pointer'
                >
                  <Image
                    src={image}
                    alt={`${product.name} - zdjęcie ${index + 1}`}
                    fill
                    sizes='25vw'
                    className='object-cover'
                  />
                </div>
              ))}
            </div>
          )}

          <div className='mt-8'>
            <h1 className='text-3xl font-bold text-gray-900'>{product.name}</h1>
            <div className='mt-4 prose max-w-none'>
              <p>{product.description || 'Wysokiej jakości firany premium'}</p>

              {product.material && (
                <div className='mt-4'>
                  <h3 className='text-lg font-semibold'>Materiał</h3>
                  <p>{product.material}</p>
                </div>
              )}

              {product.composition && (
                <div className='mt-4'>
                  <h3 className='text-lg font-semibold'>Skład</h3>
                  <p>{product.composition}</p>
                </div>
              )}

              {product.maintenance && (
                <div className='mt-4'>
                  <h3 className='text-lg font-semibold'>Pielęgnacja</h3>
                  <p>{product.maintenance}</p>
                </div>
              )}

              <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
                <h3 className='text-lg font-semibold text-blue-800'>
                  Cena materiału
                </h3>
                <p className='text-2xl font-bold text-blue-900'>
                  {(
                    product.fabricPricePerMB ||
                    product.fabric_price_per_mb ||
                    0
                  ).toFixed(2)}{' '}
                  zł/mb
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Prawy panel z formularzem zamówienia */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-2xl font-semibold mb-6'>Złóż zamówienie</h2>
          <SimplifiedOrderForm productName={product.name} />
        </div>
      </div>
    </div>
  );
}
