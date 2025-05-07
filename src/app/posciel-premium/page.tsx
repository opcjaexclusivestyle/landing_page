'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SimpleHeader from '../components/SimpleHeader';
import Loading from '@/app/components/Loading';
import { useLinenProducts } from '@/hooks/useLinenProducts';
import { supabase } from '@/lib/supabase';

// Interfejs dla kolorów produktu
interface ColorVariant {
  code: string;
  displayName: string;
  displayColor: string;
  image: string;
}

// Interfejs dla produktów z wariantami kolorów
interface ProductWithColorVariants {
  id: string;
  name: string;
  description: string;
  price: number;
  colorVariants: ColorVariant[];
}

export default function LinenProductsPage() {
  const [products, setProducts] = useState<ProductWithColorVariants[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductsWithColors() {
      setLoading(true);
      try {
        // Pobieramy wszystkie produkty z bazy
        const { data, error } = await supabase
          .from('products_linen')
          .select('*');

        if (error) throw error;

        if (!data || data.length === 0) {
          setError('Brak produktów do wyświetlenia');
          setLoading(false);
          return;
        }

        // Mapa do przechowywania unikalnych produktów i ich wariantów kolorystycznych
        const productMap = new Map<string, ProductWithColorVariants>();

        // Przetwarzamy produkty, aby wyodrębnić warianty kolorystyczne
        data.forEach((product) => {
          // Sprawdzamy, czy mamy kolory dla produktu
          if (!product.colors) return;

          // Dla każdego produktu tworzymy obiekt z wariantami kolorystycznymi
          const colorVariants: ColorVariant[] = [];

          // Przetwarzamy każdy kolor produktu
          Object.entries(product.colors).forEach(
            ([colorCode, colorData]: [string, any]) => {
              if (colorData.images && colorData.images.length > 0) {
                colorVariants.push({
                  code: colorCode,
                  displayName: colorData.displayName,
                  displayColor: colorData.displayColor,
                  image: colorData.images[0],
                });
              }
            },
          );

          // Jeśli mamy warianty kolorystyczne, dodajemy produkt do mapy
          if (colorVariants.length > 0) {
            // Obliczamy cenę produktu
            const price =
              product.variants && product.variants.length > 0
                ? product.variants[0].price
                : 0;

            productMap.set(product.id, {
              id: product.id,
              name: product.name,
              description: product.description,
              price: price,
              colorVariants: colorVariants,
            });
          }
        });

        // Konwertujemy mapę na tablicę produktów
        const uniqueProducts = Array.from(productMap.values());

        // Sortujemy produkty - najpierw te z większą liczbą wariantów kolorystycznych
        uniqueProducts.sort(
          (a, b) => b.colorVariants.length - a.colorVariants.length,
        );

        // Bierzemy tylko 4 pierwsze produkty
        const selectedProducts = uniqueProducts.slice(0, 4);

        console.log(
          'Wybrane produkty z wariantami kolorystycznymi:',
          selectedProducts,
        );
        setProducts(selectedProducts);
      } catch (error) {
        console.error('Błąd podczas pobierania produktów:', error);
        setError(
          'Wystąpił błąd podczas ładowania produktów. Spróbuj ponownie później.',
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProductsWithColors();
  }, []);

  return (
    <>
      <SimpleHeader
        videoSrc='/video/linen.mp4'
        title='Pościel i Prześcieradła'
        subtitle='Komfort i elegancja'
        description='Odkryj naszą kolekcję luksusowej pościeli'
        height='60vh'
      />
      <div className='container mx-auto py-12'>
        <div className='text-center mb-12'>
          <h1 className='text-3xl font-bold text-[var(--deep-navy)] mb-4'>
            Pościel Premium
          </h1>
          <p className='max-w-2xl mx-auto text-gray-600'>
            Nasza kolekcja luksusowej pościeli wykonanej z najwyższej jakości
            materiałów. Odkryj komfort i elegancję dla Twojej sypialni.
          </p>
        </div>

        {loading ? (
          <div className='flex justify-center py-12'>
            <Loading />
          </div>
        ) : error ? (
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
            <h2 className='text-xl font-bold text-red-700 mb-4'>
              Ups! Coś poszło nie tak
            </h2>
            <p className='text-red-600'>{error}</p>
          </div>
        ) : (
          <div className='space-y-16'>
            {products.map((product) => (
              <div key={product.id} className='mb-10'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                  {product.colorVariants.map((variant) => (
                    <div
                      key={`${product.id}-${variant.code}`}
                      className='bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1'
                    >
                      <Link
                        href={`/posciel-premium/${product.id}?color=${variant.code}`}
                      >
                        <h2 className='text-2xl font-bold text-[var(--deep-navy)] mb-4'>
                          {product.name}
                        </h2>
                        <div className='relative h-64 w-full'>
                          <Image
                            src={variant.image}
                            alt={`${product.name} - ${variant.displayName}`}
                            fill
                            className='object-cover'
                          />
                        </div>
                        <p className='text-gray-600 mb-6 max-w-3xl'>
                          {product.description}
                        </p>
                        <div className='p-4'>
                          <div className='flex items-center mb-2'>
                            <span
                              className='inline-block w-4 h-4 rounded-full mr-2'
                              style={{ backgroundColor: variant.displayColor }}
                            ></span>
                            <span className='text-sm font-medium text-gray-700'>
                              {variant.displayName}
                            </span>
                          </div>

                          <div className='mt-4 flex justify-between items-center'>
                            <span className='text-lg font-bold text-[var(--deep-navy)]'>
                              {product.price.toFixed(2)} zł
                            </span>
                            <span className='text-xs text-gray-500'>
                              Różne rozmiary
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
