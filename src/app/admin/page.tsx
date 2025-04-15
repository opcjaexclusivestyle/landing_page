'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Definiowanie typów dla danych produktów i zamówień
interface Product {
  id: number;
  name: string;
  current_price: number;
  created_at: string;
}

interface Order {
  id: number;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface DashboardStats {
  productCount: number;
  orderCount: number;
  recentProducts: Product[];
  recentOrders: Order[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    productCount: 0,
    orderCount: 0,
    recentProducts: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Pobieranie danych statystycznych z Supabase
        // To są zapytania przykładowe, możesz je dostosować do rzeczywistej struktury bazy danych

        const { count: productCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        const { count: orderCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });

        const { data: recentProducts } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        const { data: recentOrders } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          productCount: productCount || 0,
          orderCount: orderCount || 0,
          recentProducts: (recentProducts as Product[]) || [],
          recentOrders: (recentOrders as Order[]) || [],
        });
      } catch (error) {
        console.error('Błąd podczas pobierania statystyk:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className='text-3xl font-bold mb-8'>Pulpit</h1>

      {loading ? (
        <div className='text-center py-10'>
          <div className='w-12 h-12 border-4 border-t-[var(--gold)] border-gray-200 rounded-full animate-spin mx-auto'></div>
          <p className='mt-4 text-gray-600'>Ładowanie danych...</p>
        </div>
      ) : (
        <>
          {/* Karty ze statystykami */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            <div className='bg-white shadow rounded-lg p-6'>
              <h2 className='text-xl font-medium text-gray-700 mb-2'>
                Produkty
              </h2>
              <p className='text-3xl font-bold text-[var(--gold)]'>
                {stats.productCount}
              </p>
              <p className='text-sm text-gray-500 mt-2'>
                Łączna liczba produktów w sklepie
              </p>
            </div>

            <div className='bg-white shadow rounded-lg p-6'>
              <h2 className='text-xl font-medium text-gray-700 mb-2'>
                Zamówienia
              </h2>
              <p className='text-3xl font-bold text-[var(--gold)]'>
                {stats.orderCount}
              </p>
              <p className='text-sm text-gray-500 mt-2'>
                Łączna liczba zamówień
              </p>
            </div>
          </div>

          {/* Ostatnio dodane produkty */}
          <div className='bg-white shadow rounded-lg p-6 mb-8'>
            <h2 className='text-xl font-medium text-gray-700 mb-4'>
              Ostatnio dodane produkty
            </h2>

            {stats.recentProducts && stats.recentProducts.length > 0 ? (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-gray-50'>
                      <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>
                        Nazwa
                      </th>
                      <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>
                        Cena
                      </th>
                      <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>
                        Data dodania
                      </th>
                      <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>
                        Akcje
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentProducts.map((product) => (
                      <tr key={product.id} className='border-t'>
                        <td className='px-4 py-3'>{product.name}</td>
                        <td className='px-4 py-3'>
                          {product.current_price.toFixed(2)} zł
                        </td>
                        <td className='px-4 py-3'>
                          {new Date(product.created_at).toLocaleDateString(
                            'pl-PL',
                          )}
                        </td>
                        <td className='px-4 py-3'>
                          <a
                            href={`/admin/produkty/${product.id}`}
                            className='text-[var(--gold)] hover:underline'
                          >
                            Edytuj
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className='text-gray-500 text-center py-4'>
                Brak produktów do wyświetlenia
              </p>
            )}
          </div>

          {/* Ostatnie zamówienia */}
          <div className='bg-white shadow rounded-lg p-6'>
            <h2 className='text-xl font-medium text-gray-700 mb-4'>
              Ostatnie zamówienia
            </h2>

            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-gray-50'>
                      <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>
                        ID
                      </th>
                      <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>
                        Klient
                      </th>
                      <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>
                        Kwota
                      </th>
                      <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>
                        Status
                      </th>
                      <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order) => (
                      <tr key={order.id} className='border-t'>
                        <td className='px-4 py-3'>{order.id}</td>
                        <td className='px-4 py-3'>{order.customer_name}</td>
                        <td className='px-4 py-3'>
                          {order.total_amount.toFixed(2)} zł
                        </td>
                        <td className='px-4 py-3'>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'processing'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.status === 'completed'
                              ? 'Zrealizowane'
                              : order.status === 'processing'
                              ? 'W realizacji'
                              : 'Nowe'}
                          </span>
                        </td>
                        <td className='px-4 py-3'>
                          {new Date(order.created_at).toLocaleDateString(
                            'pl-PL',
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className='text-gray-500 text-center py-4'>
                Brak zamówień do wyświetlenia
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
