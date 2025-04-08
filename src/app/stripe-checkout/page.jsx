'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';

// Inicjalizacja Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
);

// Funkcja do pobierania client secret
const fetchClientSecret = async (data) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const { clientSecret, error } = await response.json();

    if (error) throw new Error(error);
    return clientSecret;
  } catch (error) {
    console.error('Błąd podczas pobierania client secret:', error);
    throw error;
  }
};

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const getClientSecret = async () => {
      try {
        setIsLoading(true);
        // Pobieranie danych z parametrów URL
        const data = {
          amount: searchParams.get('amount'),
          productName: searchParams.get('productName'),
          name: searchParams.get('name'),
          metadata: {
            width: searchParams.get('width'),
            height: searchParams.get('height'),
            email: searchParams.get('email'),
          },
        };

        // Sprawdzenie czy mamy wszystkie potrzebne dane
        if (!data.amount || !data.productName || !data.name) {
          throw new Error('Brak wymaganych danych zamówienia');
        }

        const clientSecret = await fetchClientSecret(data);
        setClientSecret(clientSecret);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    getClientSecret();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className='max-w-4xl mx-auto my-16 p-8 text-center'>
        <div className='animate-spin w-12 h-12 mx-auto mb-4 border-4 border-[var(--gold)] border-t-transparent rounded-full'></div>
        <p className='text-lg'>Inicjalizacja płatności...</p>
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
    <div className='max-w-4xl mx-auto my-16 p-4'>
      <h1 className='text-3xl md:text-4xl font-serif mb-8 text-center text-[var(--deep-navy)]'>
        Finalizacja zamówienia
      </h1>

      <div className='bg-white rounded-xl shadow-xl overflow-hidden'>
        {clientSecret && (
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret }}
          >
            <div className='h-[650px] md:h-[750px]'>
              <EmbeddedCheckout />
            </div>
          </EmbeddedCheckoutProvider>
        )}
      </div>

      <div className='text-center mt-8'>
        <Link
          href='/'
          className='inline-block py-2 px-4 text-[var(--deep-navy)] hover:underline'
        >
          Powrót do strony głównej
        </Link>
      </div>
    </div>
  );
}
