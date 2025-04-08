import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  amount: string;
  productName: string;
  name: string;
  address: {
    city: string;
    postalCode: string;
    street: string;
    houseNumber: string;
  };
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  amount,
  productName,
  name,
  address,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Sprawdzenie statusu płatności po powrocie z przekierowania
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
      // Stripe.js nie został jeszcze załadowany
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/potwierdzenie-zamowienia`,
        payment_method_data: {
          billing_details: {
            name: name,
            address: {
              city: address.city,
              postal_code: address.postalCode,
              line1: `${address.street} ${address.houseNumber}`,
              country: 'PL',
            },
          },
        },
      },
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message);
        if (onError)
          onError(
            error.message || 'Wystąpił błąd podczas przetwarzania płatności.',
          );
      } else {
        setMessage('Wystąpił nieoczekiwany błąd.');
        if (onError) onError('Wystąpił nieoczekiwany błąd.');
      }
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'tabs' as const,
  };

  return (
    <form id='payment-form' onSubmit={handleSubmit} className='space-y-6'>
      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
        <h3 className='text-xl font-serif mb-4 text-[var(--deep-navy)] border-b border-[var(--gold)] pb-2'>
          Szczegóły płatności
        </h3>

        <PaymentElement id='payment-element' options={paymentElementOptions} />
      </div>

      {/* Wyświetl ewentualne błędy lub komunikaty */}
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

export default CheckoutForm;
