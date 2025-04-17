'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import JwtDebugger from '@/components/JwtDebugger';

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
  adminInfo?: {
    email: string;
    role: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  // Używamy hooka do weryfikacji uprawnień administratora
  const { isVerifying } = useAdminAuth();

  const [stats, setStats] = useState<DashboardStats>({
    productCount: 0,
    orderCount: 0,
    recentProducts: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Pobieramy dane tylko jeśli weryfikacja jest zakończona
    if (!isVerifying) {
      fetchStats();
    }

    async function fetchStats() {
      try {
        // Sprawdzamy, czy dane są już w pamięci podręcznej
        const cachedStats = sessionStorage.getItem('adminDashboardStats');
        const cacheTime = sessionStorage.getItem('adminDashboardStatsTime');

        // Wykorzystujemy cache, jeśli dane są nie starsze niż 5 minut
        if (cachedStats && cacheTime) {
          const now = new Date().getTime();
          const cacheAge = now - parseInt(cacheTime);

          // Jeśli dane są względnie świeże (mniej niż 5 minut)
          if (cacheAge < 5 * 60 * 1000) {
            if (mounted) {
              setStats(JSON.parse(cachedStats));
              setLoading(false);
              return;
            }
          }
        }

        // Pobieranie danych statystycznych z Supabase
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

        // Pobieranie danych sesji
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const newStats = {
            productCount: productCount || 0,
            orderCount: orderCount || 0,
            recentProducts: (recentProducts as Product[]) || [],
            recentOrders: (recentOrders as Order[]) || [],
            adminInfo: {
              email: session.user.email || '',
              role: 'admin',
            },
          };

          // Zapisujemy dane w pamięci podręcznej
          sessionStorage.setItem(
            'adminDashboardStats',
            JSON.stringify(newStats),
          );
          sessionStorage.setItem(
            'adminDashboardStatsTime',
            new Date().getTime().toString(),
          );

          if (mounted) {
            setStats(newStats);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Błąd podczas pobierania statystyk:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    }

    return () => {
      mounted = false;
    };
  }, [isVerifying]);

  // Zwracamy komponent ładowania, gdy trwa weryfikacja
  if (isVerifying) {
    return (
      <div className='text-center py-10'>
        <div className='w-12 h-12 border-4 border-t-[var(--gold)] border-gray-200 rounded-full animate-spin mx-auto'></div>
        <p className='mt-4 text-gray-600'>Weryfikacja uprawnień...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className='text-3xl font-bold mb-8'>Pulpit</h1>

      {/* Debugger JWT - tylko w środowisku deweloperskim */}
      {process.env.NODE_ENV === 'development' && <JwtDebugger />}

      {loading ? (
        <div className='text-center py-10'>
          <div className='w-12 h-12 border-4 border-t-[var(--gold)] border-gray-200 rounded-full animate-spin mx-auto'></div>
          <p className='mt-4 text-gray-600'>Ładowanie danych...</p>
        </div>
      ) : (
        <>
          {/* Informacje o zalogowanym administratorze */}
          {stats.adminInfo && (
            <div className='bg-white shadow rounded-lg p-6 mb-8'>
              <h2 className='text-xl font-medium text-gray-700 mb-4'>
                Twoje konto administratora
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-500'>Email:</p>
                  <p className='font-medium'>{stats.adminInfo.email}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Rola:</p>
                  <p className='font-medium'>
                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--gold)] text-white'>
                      {stats.adminInfo.role}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

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
                          <Link
                            href={`/admin/produkty/${product.id}`}
                            className='text-[var(--gold)] hover:underline'
                          >
                            Edytuj
                          </Link>
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
