'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Typ dla zamówienia
interface Order {
  id: string;
  created_at: string;
  user_email: string | null;
  total_amount: number;
  status: string;
  items?: any[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pobieranie zamówień
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        // Pobieramy zamówienia z Supabase
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Jeśli nie ma błędu, ustawiamy dane
        setOrders(data || []);
      } catch (err) {
        console.error('Błąd podczas pobierania zamówień:', err);
        setError('Wystąpił błąd podczas pobierania zamówień');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  // Renderowanie podczas ładowania
  if (loading) {
    return (
      <div className='p-4'>
        <div className='w-12 h-12 border-4 border-t-[var(--gold)] border-gray-200 rounded-full animate-spin mx-auto'></div>
      </div>
    );
  }

  // Renderowanie w przypadku błędu
  if (error) {
    return (
      <div className='p-4'>
        <div className='bg-red-50 p-4 rounded-md'>
          <h2 className='text-red-800 font-medium'>Błąd</h2>
          <p className='text-red-700'>{error}</p>
        </div>
      </div>
    );
  }

  // Jeśli nie ma zamówień
  if (orders.length === 0) {
    return (
      <div className='p-4'>
        <h1 className='text-2xl font-bold mb-4'>Zamówienia</h1>
        <div className='bg-gray-50 p-8 text-center rounded-lg'>
          <p className='text-gray-600'>Brak zamówień do wyświetlenia</p>
        </div>
      </div>
    );
  }

  // Renderowanie listy zamówień
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Zamówienia</h1>

      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                ID
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Data
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Klient
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Kwota
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Status
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {order.id.substring(0, 8)}...
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {new Date(order.created_at).toLocaleDateString('pl-PL')}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {order.user_email || 'Brak danych'}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {order.total_amount
                    ? `${order.total_amount.toFixed(2)} zł`
                    : 'Brak danych'}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.status || 'Nieznany'}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <button className='text-indigo-600 hover:text-indigo-900 mr-2'>
                    Szczegóły
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
