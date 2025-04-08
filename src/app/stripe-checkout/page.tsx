'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Inicjalizacja Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
);

export default function StripeCheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
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

    setClientSecret(sessionId);
    setIsLoading(false);
  }, [sessionId]);

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
            href='/cart'
            className='inline-block py-3 px-6 bg-gradient-to-r from-[var(--deep-navy)] to-[var(--royal-gold)] text-white rounded-lg hover:shadow-lg transition-all'
          >
            Wróć do koszyka
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
          href='/cart'
          className='inline-block py-2 px-4 text-[var(--deep-navy)] hover:underline'
        >
          Powrót do koszyka
        </Link>
      </div>
    </div>
  );
}
