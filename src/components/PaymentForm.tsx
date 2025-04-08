'use client';

import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Inicjalizacja Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
);

interface PaymentFormProps {
  amount: number;
  customerInfo: {
    name: string;
    email: string;
    city?: string;
    postalCode?: string;
    street?: string;
    houseNumber?: string;
  };
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const PaymentFormContent: React.FC<PaymentFormProps> = ({
  amount,
  customerInfo,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret',
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) return;

      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Płatność zakończona sukcesem!');
          if (onSuccess) onSuccess();
          break;
        case 'processing':
          setMessage('Trwa przetwarzanie płatności...');
          break;
        case 'requires_payment_method':
          setMessage('Płatność nie powiodła się, spróbuj ponownie.');
          if (onError) onError('Płatność nie powiodła się, spróbuj ponownie.');
          break;
        default:
          setMessage('Coś poszło nie tak.');
          if (onError) onError('Coś poszło nie tak.');
          break;
      }
    });
  }, [stripe, onSuccess, onError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
          payment_method_data: {
            billing_details: {
              name: customerInfo.name,
              email: customerInfo.email,
              address: {
                city: customerInfo.city,
                postal_code: customerInfo.postalCode,
                line1: `${customerInfo.street} ${customerInfo.houseNumber}`,
                country: 'PL',
              },
            },
          },
        },
      });

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(
            error.message || 'Wystąpił błąd podczas przetwarzania płatności.',
          );
          if (onError)
            onError(
              error.message || 'Wystąpił błąd podczas przetwarzania płatności.',
            );
        } else {
          setMessage('Wystąpił nieoczekiwany błąd.');
          if (onError) onError('Wystąpił nieoczekiwany błąd.');
        }
      }
    } catch (err) {
      setMessage('Wystąpił błąd podczas przetwarzania płatności.');
      if (onError) onError('Wystąpił błąd podczas przetwarzania płatności.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
        <h3 className='text-xl font-serif mb-4 text-[var(--deep-navy)] border-b border-[var(--gold)] pb-2'>
          Szczegóły płatności
        </h3>
        <PaymentElement
          options={{
            layout: 'tabs',
            defaultValues: {
              billingDetails: {
                name: customerInfo.name,
                email: customerInfo.email,
              },
            },
          }}
        />
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes('sukces')
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {message}
        </div>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        className='w-full magic-button relative overflow-hidden py-4 px-8 text-lg rounded-lg bg-gradient-to-r from-[var(--deep-navy)] to-[var(--royal-gold)] text-white font-medium transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed'
      >
        {isLoading ? (
          <>
            <span className='opacity-0'>ZAPŁAĆ {amount} ZŁ</span>
            <span className='absolute inset-0 flex items-center justify-center'>
              <svg
                className='animate-spin h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
            </span>
          </>
        ) : (
          `ZAPŁAĆ ${amount} ZŁ`
        )}
      </button>

      <p className='text-center text-sm text-gray-500'>
        Twoje dane płatnicze są przetwarzane bezpiecznie przez Stripe. Nie
        przechowujemy Twoich danych karty kredytowej.
      </p>
    </form>
  );
};

const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: props.amount,
            name: props.customerInfo.name,
            metadata: {
              email: props.customerInfo.email,
              city: props.customerInfo.city,
              postalCode: props.customerInfo.postalCode,
              street: props.customerInfo.street,
              houseNumber: props.customerInfo.houseNumber,
            },
          }),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Wystąpił błąd podczas inicjalizacji płatności',
        );
        if (props.onError) {
          props.onError(
            err instanceof Error
              ? err.message
              : 'Wystąpił błąd podczas inicjalizacji płatności',
          );
        }
      }
    };

    createPaymentIntent();
  }, [props.amount, props.customerInfo, props.onError]);

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg'>
        <h2 className='text-2xl font-serif mb-4'>Wystąpił problem</h2>
        <p className='mb-6'>{error}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className='text-center p-6'>
        <div className='animate-spin w-12 h-12 mx-auto mb-4 border-4 border-[var(--gold)] border-t-transparent rounded-full'></div>
        <p className='text-lg'>Inicjalizacja płatności...</p>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#1a365d',
            colorBackground: '#ffffff',
            colorText: '#1a365d',
            colorDanger: '#dc2626',
            fontFamily: 'Inter, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
          },
        },
      }}
    >
      <PaymentFormContent {...props} />
    </Elements>
  );
};

export default PaymentForm;
