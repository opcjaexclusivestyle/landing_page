'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';

// Inicjalizacja Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
);

// Funkcja do pobierania szczegółów sesji
const getCheckoutSession = async (sessionId) => {
  try {
    const response = await fetch(
      `/api/get-checkout-session?session_id=${sessionId}`,
    );
    const data = await response.json();

    if (data.error) throw new Error(data.error);
    return data.session;
  } catch (error) {
    console.error('Błąd podczas pobierania sesji:', error);
    throw error;
  }
};

export default function PaymentSuccessPage() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
        const sessionData = await getCheckoutSession(sessionId);
        setSession(sessionData);
      } catch (err) {
        setError(err.message);
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

  // Dla celów demonstracyjnych, wyświetlamy potwierdzenie nawet bez sesji
  const paymentStatus = session?.payment_status || 'paid';
  const isSuccessful =
    paymentStatus === 'paid' ||
    paymentStatus === 'complete' ||
    paymentStatus === 'success';

  return (
    <div className='max-w-4xl mx-auto my-16 px-4'>
      <div className='bg-white rounded-xl shadow-xl overflow-hidden p-8 md:p-10'>
        <div className='text-center mb-10'>
          {isSuccessful ? (
            <>
              <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-10 w-10 text-green-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <h1 className='text-3xl md:text-4xl font-serif text-[var(--deep-navy)] mb-3'>
                Dziękujemy za zamówienie!
              </h1>
              <p className='text-lg text-gray-600 max-w-xl mx-auto'>
                Twoje zamówienie zostało przyjęte. Potwierdzenie zostało wysłane
                na podany adres email.
              </p>
            </>
          ) : (
            <>
              <div className='w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-10 w-10 text-yellow-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
              </div>
              <h1 className='text-3xl md:text-4xl font-serif text-[var(--deep-navy)] mb-3'>
                Oczekiwanie na potwierdzenie
              </h1>
              <p className='text-lg text-gray-600 max-w-xl mx-auto'>
                Twoje zamówienie zostało złożone, ale płatność wymaga dodatkowej
                weryfikacji.
              </p>
            </>
          )}
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

              {session.shipping_details && (
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h3 className='font-medium mb-2'>Adres dostawy:</h3>
                  <p>{session.shipping_details.name}</p>
                  <p>{session.shipping_details.address.line1}</p>
                  {session.shipping_details.address.line2 && (
                    <p>{session.shipping_details.address.line2}</p>
                  )}
                  <p>
                    {session.shipping_details.address.postal_code}{' '}
                    {session.shipping_details.address.city}
                  </p>
                  <p>{session.shipping_details.address.country}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className='text-center mt-10'>
          <Link
            href='/'
            className='inline-block py-3 px-8 bg-gradient-to-r from-[var(--deep-navy)] to-[var(--royal-gold)] text-white rounded-lg hover:shadow-lg transition-all'
          >
            Powrót do strony głównej
          </Link>
        </div>
      </div>
    </div>
  );
}
