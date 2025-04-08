'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from '../../redux/cartSlice';
import Link from 'next/link';
import type { CartItem } from '../../redux/cartSlice';
import { loadStripe } from '@stripe/stripe-js';

// Inicjalizacja Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
);

interface RootState {
  cart: {
    items: CartItem[];
    customerInfo: {
      name: string;
      email: string;
      city?: string;
      postalCode?: string;
      street?: string;
      houseNumber?: string;
    } | null;
    total: string;
  };
}

const CartPage = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const customerInfo = useSelector(
    (state: RootState) => state.cart.customerInfo,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  // Obliczanie całkowitej ceny
  const totalPrice = cartItems.reduce(
    (total: number, item: CartItem) =>
      total + parseFloat(item.amount) * item.quantity,
    0,
  );

  // Obsługa zmiany ilości produktu
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  // Obsługa usuwania produktu
  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id));
  };

  // Obsługa procesu płatności
  const handleCheckout = async () => {
    if (!customerInfo) {
      setError('Proszę uzupełnić dane kontaktowe przed płatnością');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Tworzenie sesji checkout Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            price_data: {
              currency: 'pln',
              product_data: {
                name: item.productName,
                description: `Wymiary: ${item.width}cm × ${item.height}cm`,
              },
              unit_amount: Math.round(parseFloat(item.amount) * 100),
            },
            quantity: item.quantity,
          })),
          customer: customerInfo,
          total: totalPrice,
        }),
      });

      const { clientSecret, error: stripeError } = await response.json();

      if (stripeError) {
        throw new Error(stripeError);
      }

      // Przekierowanie do strony płatności Stripe
      window.location.href = `/stripe-checkout?session_id=${clientSecret}`;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Wystąpił błąd podczas przetwarzania płatności',
      );
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-[var(--deep-navy)] mb-4'>
            Twój koszyk jest pusty
          </h1>
          <p className='text-gray-600 mb-8'>
            Przejdź do naszego katalogu, aby wybrać produkty.
          </p>
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

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
      <h1 className='text-3xl font-bold text-[var(--deep-navy)] mb-8'>
        Twój koszyk
      </h1>

      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        {/* Nagłówek tabeli */}
        <div className='hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-100 text-gray-700 font-medium'>
          <div className='col-span-5'>Produkt</div>
          <div className='col-span-2 text-center'>Cena</div>
          <div className='col-span-3 text-center'>Ilość</div>
          <div className='col-span-2 text-right'>Wartość</div>
        </div>

        {/* Lista produktów */}
        {cartItems.map((item: CartItem) => (
          <div
            key={item.id}
            className='grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-gray-200'
          >
            {/* Nazwa produktu */}
            <div className='col-span-5 flex flex-col'>
              <span className='font-medium text-[var(--deep-navy)]'>
                {item.productName}
              </span>
              <span className='text-sm text-gray-500'>
                {item.width && item.height
                  ? `${item.width} cm × ${item.height} cm`
                  : ''}
              </span>
            </div>

            {/* Cena jednostkowa */}
            <div className='col-span-2 text-center flex md:block items-center'>
              <span className='md:hidden font-medium mr-2'>Cena:</span>
              <span>{parseFloat(item.amount).toFixed(2)} zł</span>
            </div>

            {/* Kontrolka ilości */}
            <div className='col-span-3 flex items-center justify-center'>
              <div className='flex items-center border border-gray-300 rounded-md'>
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                  className='px-3 py-1 text-gray-600 hover:text-[var(--gold)]'
                >
                  -
                </button>
                <span className='px-3 py-1 border-x border-gray-300'>
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                  className='px-3 py-1 text-gray-600 hover:text-[var(--gold)]'
                >
                  +
                </button>
              </div>
            </div>

            {/* Wartość i przycisk usuwania */}
            <div className='col-span-2 text-right flex md:block items-center justify-between'>
              <span className='md:hidden font-medium'>Wartość:</span>
              <div className='flex items-center justify-end'>
                <span className='font-medium mr-4'>
                  {(parseFloat(item.amount) * item.quantity).toFixed(2)} zł
                </span>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className='text-red-500 hover:text-red-700'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Podsumowanie */}
        <div className='p-4 bg-gray-50'>
          <div className='flex justify-between items-center mb-2'>
            <span className='font-medium'>Podsumowanie</span>
            <span className='font-bold text-lg text-[var(--deep-navy)]'>
              {totalPrice.toFixed(2)} zł
            </span>
          </div>
          <div className='text-sm text-gray-500 mb-4'>
            * Cena zawiera podatek VAT
          </div>
        </div>
      </div>

      {/* Informacje o płatności */}
      <div className='mt-8 bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-xl font-bold text-[var(--deep-navy)] mb-4'>
          Informacje o płatności
        </h2>
        <p className='text-gray-600 mb-4'>
          Po kliknięciu przycisku &quot;Przejdź do płatności&quot; zostaniesz
          przekierowany do bezpiecznego systemu płatności Stripe, gdzie będziesz
          mógł bezpiecznie dokonać zakupu.
        </p>
        <div className='flex flex-col md:flex-row items-center'>
          <div className='mb-4 md:mb-0 md:mr-4 text-center md:text-left'>
            <p className='text-sm text-gray-600'>Akceptujemy:</p>
            <div className='flex space-x-2 mt-2'>
              <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs'>
                BLIK
              </span>
              <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs'>
                Visa
              </span>
              <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs'>
                MasterCard
              </span>
              <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs'>
                Przelew
              </span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className={`w-full md:w-auto mt-4 md:mt-0 px-6 py-3 rounded-md font-bold text-white ${
              isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[var(--gold)] hover:bg-[var(--deep-gold)] transition-colors'
            }`}
          >
            {isProcessing ? 'Przetwarzanie...' : 'Przejdź do płatności'}
          </button>
        </div>
        {error && (
          <div className='mt-4 p-4 bg-red-50 text-red-600 rounded-md'>
            {error}
          </div>
        )}
      </div>

      {/* Link powrotu do sklepu */}
      <div className='mt-8 text-center'>
        <Link
          href='/'
          className='text-[var(--deep-navy)] hover:text-[var(--gold)] transition-colors'
        >
          ← Wróć do sklepu
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
