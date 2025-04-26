'use client';

import { useState, useEffect } from 'react';
import {
  fetchCurtainProducts,
  CalcProduct,
  generateSlug,
} from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import SimpleHeader from '../components/SimpleHeader';

const sortOptions = [
  { name: 'Najnowsze', value: 'newest' },
  { name: 'Cena: od najniższej', value: 'price-asc' },
  { name: 'Alfabetycznie: A-Z', value: 'name-asc' },
];

export default function ZaslonyPremiumPage() {
  const [products, setProducts] = useState<CalcProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const productsData = await fetchCurtainProducts();
        setProducts(productsData);
      } catch (err) {
        console.error('Błąd podczas ładowania produktów:', err);
        setError(
          'Nie udało się załadować produktów. Spróbuj ponownie później.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const sortProducts = (products: CalcProduct[]) => {
    const sortedProducts = [...products];

    switch (sortBy) {
      case 'newest':
        return sortedProducts.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
      case 'price-asc':
        return sortedProducts.sort((a, b) => {
          const priceA = a.fabricPricePerMB || a.fabric_price_per_mb || 0;
          const priceB = b.fabricPricePerMB || b.fabric_price_per_mb || 0;
          return priceA - priceB;
        });
      case 'name-asc':
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sortedProducts;
    }
  };

  const sortedProducts = sortProducts(products);

  // Paginacja
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-16'>
        <div className='flex justify-center items-center min-h-[50vh]'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-16'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-red-600'>Błąd</h2>
          <p className='mt-2'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SimpleHeader
        videoSrc='/video/curtains.mp4'
        title='Zasłony'
        subtitle='Elegancja i styl'
        description='Odkryj kolekcję luksusowych zasłon'
        height='60vh'
      />
      <div className='container mx-auto px-4 py-16'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>Zasłony Premium</h1>
          <p className='mt-2 text-gray-600'>
            Odkryj naszą ekskluzywną kolekcję zasłon premium - połączenie
            elegancji, jakości i stylu.
          </p>
        </div>

        {/* Sortowanie */}
        <div className='flex justify-end mb-6'>
          <div className='relative inline-block'>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none'
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon className='absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none' />
          </div>
        </div>

        {/* Siatka produktów */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {currentProducts.map((product) => {
            const imageSrc = product.image_path
              ? product.image_path
              : product.images && product.images.length > 0
              ? product.images[0]
              : '/images/placeholder.jpg';

            return (
              <Link
                href={`/zaslony-premium/${
                  product.slug || encodeURIComponent(product.name)
                }`}
                key={product.id}
                className='group'
              >
                <div className='bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-xl group-hover:-translate-y-1'>
                  <div className='relative h-64 overflow-hidden'>
                    <Image
                      src={imageSrc}
                      alt={product.name}
                      fill
                      className='object-cover transition-transform duration-500 group-hover:scale-105'
                      sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                    />
                  </div>
                  <div className='p-4'>
                    <h3 className='text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors'>
                      {product.name}
                    </h3>
                    <p className='mt-1 text-gray-600 line-clamp-2'>
                      {product.description ||
                        'Wysokiej jakości zasłony premium'}
                    </p>
                    <div className='mt-2 flex justify-between items-center'>
                      <span className='text-indigo-600 font-medium'>
                        {(
                          product.fabricPricePerMB ||
                          product.fabric_price_per_mb ||
                          0
                        ).toFixed(2)}{' '}
                        zł/mb
                      </span>
                      <span className='text-sm text-gray-500'>Szczegóły →</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Paginacja */}
        {totalPages > 1 && (
          <div className='mt-8 flex justify-center'>
            <nav className='inline-flex rounded-md shadow'>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 text-sm font-medium ${
                    currentPage === index + 1
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } ${index === 0 ? 'rounded-l-md' : ''} ${
                    index === totalPages - 1 ? 'rounded-r-md' : ''
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
