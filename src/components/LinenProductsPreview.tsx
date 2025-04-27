'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/app/components/Loading';
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

interface LinenProductsPreviewProps {
  title?: string;
  subtitle?: string;
  maxProducts?: number;
  maxColorsPerProduct?: number;
  className?: string;
}

export default function LinenProductsPreview({
  title = 'Pościel Premium',
  subtitle = 'Odkryj naszą kolekcję luksusowej pościeli',
  maxProducts = 2,
  maxColorsPerProduct = 4,
  className = '',
}: LinenProductsPreviewProps) {
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

        // Ograniczamy liczbę produktów
        const selectedProducts = uniqueProducts
          .slice(0, maxProducts)
          .map((product) => {
            // Ograniczamy liczbę wariantów kolorystycznych dla każdego produktu
            return {
              ...product,
              colorVariants: product.colorVariants.slice(
                0,
                maxColorsPerProduct,
              ),
            };
          });

        console.log(
          'Wybrane produkty z wariantami kolorystycznymi:',
          selectedProducts,
        );
        setProducts(selectedProducts);
      } catch (error) {
        console.error('Błąd podczas pobierania produktów:', error);
        setError('Wystąpił błąd podczas ładowania produktów.');
      } finally {
        setLoading(false);
      }
    }

    fetchProductsWithColors();
  }, [maxProducts, maxColorsPerProduct]);

  if (loading) {
    return (
      <div className={`py-8 ${className}`}>
        <div className='text-center mb-8'>
          {title && (
            <h2 className='text-2xl font-bold text-[var(--deep-navy)] mb-2'>
              {title}
            </h2>
          )}
          {subtitle && <p className='text-gray-600'>{subtitle}</p>}
        </div>
        <div className='flex justify-center'>
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-8 ${className}`}>
        <div className='text-center mb-8'>
          {title && (
            <h2 className='text-2xl font-bold text-[var(--deep-navy)] mb-2'>
              {title}
            </h2>
          )}
          {subtitle && <p className='text-gray-600'>{subtitle}</p>}
        </div>
        <div className='text-center text-red-600 p-4'>
          <p>Wystąpił błąd podczas ładowania produktów.</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`py-8 ${className}`}>
        <div className='text-center mb-8'>
          {title && (
            <h2 className='text-2xl font-bold text-[var(--deep-navy)] mb-2'>
              {title}
            </h2>
          )}
          {subtitle && <p className='text-gray-600'>{subtitle}</p>}
        </div>
        <div className='text-center text-gray-500 p-4'>
          <p>Brak produktów do wyświetlenia</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-8 ${className}`}>
      <div className='text-center mb-8'>
        {title && (
          <h2 className='text-2xl font-bold text-[var(--deep-navy)] mb-2'>
            {title}
          </h2>
        )}
        {subtitle && <p className='text-gray-600'>{subtitle}</p>}
      </div>

      <div className='space-y-12'>
        {products.map((product) => (
          <div key={product.id} className='mb-8'>
            <div className='flex justify-between items-center mb-3'>
              <h3 className='text-xl font-bold text-[var(--deep-navy)]'>
                {product.name}
              </h3>
              <Link
                href={`/posciel-premium`}
                className='text-sm text-[var(--deep-navy)] hover:underline'
              >
                Zobacz więcej
              </Link>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {product.colorVariants.map((variant) => (
                <div
                  key={`${product.id}-${variant.code}`}
                  className='bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1'
                >
                  <Link
                    href={`/posciel-premium/${product.id}?color=${variant.code}`}
                  >
                    <div className='relative h-56 w-full'>
                      <Image
                        src={variant.image}
                        alt={`${product.name} - ${variant.displayName}`}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='p-3'>
                      <div className='flex items-center mb-2'>
                        <span
                          className='inline-block w-3 h-3 rounded-full mr-2'
                          style={{ backgroundColor: variant.displayColor }}
                        ></span>
                        <span className='text-sm font-medium text-gray-700'>
                          {variant.displayName}
                        </span>
                      </div>

                      <div className='flex justify-between items-center'>
                        <span className='text-md font-bold text-[var(--deep-navy)]'>
                          {product.price.toFixed(2)} zł
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

      <div className='text-center mt-10'>
        <Link
          href='/posciel-premium'
          className='inline-block px-5 py-2 bg-[var(--deep-navy)] text-white rounded-md hover:bg-opacity-90 transition-colors'
        >
          Zobacz wszystkie produkty
        </Link>
      </div>
    </div>
  );
}
