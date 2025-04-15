'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

// Typ dla produktów
interface Product {
  id: number;
  name: string;
  current_price: number;
  regular_price: number;
  colors: string[];
  created_at: string;
  main_image: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<
    'name' | 'current_price' | 'created_at'
  >('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        // Sortowanie dynamiczne w zależności od wybranego pola i kierunku
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order(sortField, { ascending: sortDirection === 'asc' });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Błąd podczas pobierania produktów:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [sortField, sortDirection]);

  // Funkcja do zmiany sortowania
  const toggleSort = (field: 'name' | 'current_price' | 'created_at') => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Funkcja do filtrowania produktów wg wyszukiwania
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Funkcja do usuwania produktu
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten produkt?')) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);

        if (error) throw error;

        // Usunięcie produktu z lokalnego stanu
        setProducts(products.filter((product) => product.id !== id));
      } catch (error) {
        console.error('Błąd podczas usuwania produktu:', error);
      }
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-[var(--deep-navy)]'>Produkty</h1>
        <Link
          href='/admin/produkty/nowy'
          className='bg-[var(--gold)] hover:bg-[var(--deep-gold)] text-white px-4 py-2 rounded-md'
        >
          Dodaj nowy produkt
        </Link>
      </div>

      {/* Pasek wyszukiwania i filtrowania */}
      <div className='bg-white shadow rounded-lg p-4 mb-6'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <input
              type='text'
              placeholder='Wyszukaj produkt...'
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className='text-center py-10'>
          <div className='w-12 h-12 border-4 border-t-[var(--gold)] border-gray-200 rounded-full animate-spin mx-auto'></div>
          <p className='mt-4 text-gray-600'>Ładowanie produktów...</p>
        </div>
      ) : (
        <div className='bg-white shadow rounded-lg overflow-hidden'>
          {filteredProducts.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='bg-gray-50'>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Zdjęcie
                    </th>
                    <th
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer'
                      onClick={() => toggleSort('name')}
                    >
                      Nazwa
                      {sortField === 'name' && (
                        <span className='ml-1'>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer'
                      onClick={() => toggleSort('current_price')}
                    >
                      Cena
                      {sortField === 'current_price' && (
                        <span className='ml-1'>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Warianty koloru
                    </th>
                    <th
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer'
                      onClick={() => toggleSort('created_at')}
                    >
                      Data dodania
                      {sortField === 'created_at' && (
                        <span className='ml-1'>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='relative h-16 w-16 rounded overflow-hidden'>
                          {product.main_image ? (
                            <Image
                              src={product.main_image}
                              alt={product.name}
                              fill
                              className='object-cover'
                            />
                          ) : (
                            <div className='bg-gray-200 h-16 w-16 flex items-center justify-center text-gray-500'>
                              Brak
                            </div>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900'>
                          {product.name}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          {product.current_price.toFixed(2)} zł
                        </div>
                        {product.current_price !== product.regular_price && (
                          <div className='text-xs text-gray-500 line-through'>
                            {product.regular_price.toFixed(2)} zł
                          </div>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex space-x-1'>
                          {product.colors &&
                            product.colors.map((color, index) => (
                              <div
                                key={index}
                                className='h-6 w-6 rounded-full border border-gray-300'
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-500'>
                          {new Date(product.created_at).toLocaleDateString(
                            'pl-PL',
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex space-x-2'>
                          <Link
                            href={`/admin/produkty/${product.id}`}
                            className='text-[var(--gold)] hover:text-[var(--deep-gold)]'
                          >
                            Edytuj
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className='text-red-600 hover:text-red-800'
                          >
                            Usuń
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='text-center py-10'>
              <p className='text-gray-500'>Nie znaleziono produktów</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
