'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';

// Inicjalizacja Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
);

interface Session {
  id: string;
  customer_details: {
    email: string;
    name: string;
    address: {
      city: string;
      country: string;
      line1: string;
      line2: string | null;
      postal_code: string;
    };
  };
  line_items: {
    data: Array<{
      description: string;
      quantity: number;
      amount_total: number;
    }>;
  };
  metadata: {
    customer_name: string;
    customer_email: string;
    customer_city: string;
    customer_postal_code: string;
    customer_street: string;
    customer_house_number: string;
  };
}

export default function PaymentSuccessPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('Brak identyfikatora sesji');
      setIsLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const response = await fetch(
          `/api/get-checkout-session?session_id=${sessionId}`,
        );
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setSession(data.session);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Wystąpił błąd podczas pobierania danych zamówienia',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className='max-w-4xl mx-auto my-16 p-8 text-center'>
        <div className='animate-spin w-12 h-12 mx-auto mb-4 border-4 border-[var(--gold)] border-t-transparent rounded-full'></div>
        <p className='text-lg'>Pobieranie informacji o zamówieniu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-4xl mx-auto my-16 p-8'>
        <div className='bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg'>
          <h2 className='text-2xl font-serif mb-4'>Wystąpił problem</h2>
          <p className='mb-6'>{error}</p>
          <Link
            href='/'
            className='inline-block py-3 px-6 bg-gradient-to-r from-[var(--deep-navy)] to-[var(--royal-gold)] text-white rounded-lg hover:shadow-lg transition-all'
          >
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto my-16 p-8'>
      <div className='text-center mb-12'>
        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <svg
            className='w-8 h-8 text-green-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 13l4 4L19 7'
            />
          </svg>
        </div>
        <h1 className='text-3xl font-serif text-[var(--deep-navy)] mb-4'>
          Dziękujemy za zamówienie!
        </h1>
        <p className='text-gray-600'>
          Twoja płatność została zrealizowana pomyślnie. Wkrótce otrzymasz email
          z potwierdzeniem.
        </p>
      </div>

      {session && (
        <div className='border-t border-gray-200 pt-8 mt-8'>
          <h2 className='text-xl font-serif mb-6 text-[var(--deep-navy)]'>
            Szczegóły zamówienia
          </h2>

          <div className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {session.line_items?.data.map((item, index) => (
                <div
                  key={index}
                  className='border border-gray-200 rounded-lg p-4 flex items-center'
                >
                  <div className='flex-1'>
                    <h3 className='font-medium'>{item.description}</h3>
                    <p className='text-gray-500 text-sm'>
                      Ilość: {item.quantity}
                    </p>
                    <p className='font-bold mt-2'>
                      {(item.amount_total / 100).toFixed(2)} zł
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {session.customer_details && (
              <div className='bg-gray-50 p-4 rounded-lg'>
                <h3 className='font-medium mb-2'>Adres dostawy:</h3>
                <p>{session.customer_details.name}</p>
                <p>{session.customer_details.address.line1}</p>
                {session.customer_details.address.line2 && (
                  <p>{session.customer_details.address.line2}</p>
                )}
                <p>
                  {session.customer_details.address.postal_code}{' '}
                  {session.customer_details.address.city}
                </p>
                <p>{session.customer_details.address.country}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className='mt-12 text-center'>
        <Link
          href='/'
          className='inline-block py-3 px-6 bg-[var(--gold)] text-white rounded-md hover:bg-[var(--deep-gold)] transition-colors'
        >
          Wróć do sklepu
        </Link>
      </div>
    </div>
  );
}
