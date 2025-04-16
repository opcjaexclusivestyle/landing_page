'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/app/components/Loading';

// Interfejs dla kolorów produktu
export interface LinenProductColor {
  code: string;
  images: string[];
  displayName: string;
  displayColor: string;
}

// Interfejs dla wariantów produktu
export interface LinenProductVariant {
  id: number;
  size: string;
  label: string;
  price: number;
  additionalInfo: string;
}

// Interfejs dla opcji dodatkowych
export interface LinenProductOption {
  name: string;
  label: string;
  sizes: { [key: string]: number };
  pricingKey: string;
}

// Interfejs dla produktów z tabeli products_linen
export interface LinenProduct {
  id: string;
  name: string;
  description: string;
  base_product: string;
  default_color: string;
  default_variant: string;
  colors: { [key: string]: LinenProductColor };
  variants: LinenProductVariant[];
  additional_options: LinenProductOption[];
  features: string[];
  main_image?: string; // Dodane dla kompatybilności z wcześniejszym kodem
  regular_price?: number; // Dodane dla kompatybilności z wcześniejszym kodem
  current_price?: number; // Dodane dla kompatybilności z wcześniejszym kodem
}

export default function LinenProductsList() {
  const [products, setProducts] = useState<LinenProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>(
    'price-low',
  );

  useEffect(() => {
    async function fetchLinenProducts() {
      setLoading(true);
      try {
        // Budujemy zapytanie do Supabase
        let query = supabase.from('products_linen').select('*');

        // Zastosowanie sortowania - sortujemy po ID, ponieważ nie mamy created_at
        if (sortBy === 'newest') {
          query = query.order('id', { ascending: false });
        } else if (sortBy === 'price-low' || sortBy === 'price-high') {
          // Pobieramy dane bez sortowania ceny, bo cena jest teraz w tablicy variant
          const { data, error } = await query;

          if (error) throw error;

          // Sortujemy ręcznie na podstawie ceny pierwszego wariantu (najniższego)
          const sortedData = [...(data as LinenProduct[])].sort((a, b) => {
            const priceA =
              a.variants && a.variants.length > 0 ? a.variants[0].price : 0;
            const priceB =
              b.variants && b.variants.length > 0 ? b.variants[0].price : 0;

            return sortBy === 'price-low' ? priceA - priceB : priceB - priceA;
          });

          console.log('Pobrane produkty z pościeli:', sortedData);
          setProducts(sortedData);
          setLoading(false);
          return;
        }

        // Jeśli nie ma sortowania po cenie, wykonujemy standardowe zapytanie
        const { data, error } = await query;

        if (error) throw error;

        console.log('Pobrane produkty z pościeli:', data);
        setProducts(data as LinenProduct[]);
      } catch (error) {
        console.error('Błąd podczas pobierania produktów pościeli:', error);
        setError(
          'Wystąpił błąd podczas ładowania produktów. Spróbuj ponownie później.',
        );
      } finally {
        setLoading(false);
      }
    }

    fetchLinenProducts();
  }, [sortBy]);

  // Funkcja pomocnicza do pobierania głównego obrazu produktu
  const getMainImage = (product: LinenProduct): string => {
    // Jeśli produkt ma ustawiony main_image, użyj go
    if (product.main_image) return product.main_image;

    // W przeciwnym razie pobierz pierwszy obraz z domyślnego koloru
    const defaultColor = product.default_color;
    if (
      product.colors &&
      product.colors[defaultColor] &&
      product.colors[defaultColor].images.length > 0
    ) {
      return product.colors[defaultColor].images[0];
    }

    // Jeśli nie ma domyślnego koloru, pobierz pierwszy obraz z pierwszego dostępnego koloru
    const firstColorKey = product.colors
      ? Object.keys(product.colors)[0]
      : null;
    if (firstColorKey && product.colors[firstColorKey].images.length > 0) {
      return product.colors[firstColorKey].images[0];
    }

    // Jeśli nie znaleziono żadnego obrazu, zwróć placeholder
    return '/placeholder.jpg';
  };

  // Funkcja pomocnicza do pobierania ceny produktu
  const getProductPrice = (
    product: LinenProduct,
  ): { current: number; regular?: number } => {
    // Jeśli produkt ma ustawione ceny, użyj ich
    if (product.current_price) {
      return {
        current: product.current_price,
        regular: product.regular_price,
      };
    }

    // W przeciwnym razie pobierz cenę z wariantów
    if (product.variants && product.variants.length > 0) {
      // Zwracamy cenę najmniejszego wariantu jako current_price
      return { current: product.variants[0].price };
    }

    // Jeśli nie ma ceny, zwróć 0
    return { current: 0 };
  };

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
            aria-label='Sortowanie produktów'
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
          {products.map((product) => {
            const mainImage = getMainImage(product);
            const price = getProductPrice(product);
            const colorsList = product.colors
              ? Object.values(product.colors)
              : [];

            return (
              <div
                key={product.id}
                className='bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1'
              >
                <Link href={`/posciel-premium/${product.id}`}>
                  <div className='relative h-64 w-full'>
                    <Image
                      src={mainImage}
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
                          {price.current.toFixed(2)} zł
                        </span>
                        {price.regular && price.regular > price.current && (
                          <span className='ml-2 text-sm text-gray-400 line-through'>
                            {price.regular.toFixed(2)} zł
                          </span>
                        )}
                      </div>
                      {colorsList.length > 0 && (
                        <div className='flex space-x-1'>
                          {colorsList.slice(0, 3).map((color, index) => (
                            <div
                              key={index}
                              className='w-4 h-4 rounded-full border border-gray-300'
                              style={{
                                backgroundColor: color.displayColor || '',
                              }}
                              title={color.displayName}
                            />
                          ))}
                          {colorsList.length > 3 && (
                            <div className='w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs'>
                              +{colorsList.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
