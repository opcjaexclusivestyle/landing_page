'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import LinenProductsList from '@/components/LinenProductsList';
import Loading from '@/app/components/Loading';
import { supabase } from '@/lib/supabase';
import SimpleHeader from '../components/SimpleHeader';

export default function LinenProductsPage() {
  const [connectionStatus, setConnectionStatus] = useState<{
    success?: boolean;
    error?: any;
  } | null>(null);

  useEffect(() => {
    // Testowe sprawdzenie połączenia z Supabase
    async function testConnection() {
      try {
        console.log('Testowanie połączenia z Supabase...');
        // Używamy count(*) zamiast count(*) z head aby sprawdzić istnienie tabeli
        // bez odwoływania się do konkretnych kolumn
        const { data, error } = await supabase
          .from('products_linen')
          .select('id')
          .limit(1);

        console.log('Wynik testu połączenia:', { data, error });
        setConnectionStatus({ success: !error, error });

        if (error) {
          console.error('Błąd połączenia z tabelą products_linen:', error);
        } else {
          console.log('Połączenie z tabelą products_linen działa poprawnie');
        }
      } catch (err) {
        console.error('Wyjątek podczas testowania połączenia:', err);
        setConnectionStatus({ success: false, error: err });
      }
    }

    testConnection();
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
      <div className='container mx-auto'>
        {connectionStatus && !connectionStatus.success && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 my-4'>
            <h3 className='text-lg font-semibold text-red-700'>
              Problem z połączeniem do bazy danych
            </h3>
            <p className='text-red-600'>
              Wystąpił problem z połączeniem do tabeli products_linen. Sprawdź
              konsolę deweloperską, aby uzyskać więcej informacji.
            </p>
            <pre className='mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto'>
              {JSON.stringify(connectionStatus.error, null, 2)}
            </pre>
          </div>
        )}
        <Suspense fallback={<Loading />}>
          <LinenProductsList />
        </Suspense>
      </div>
    </>
  );
}
