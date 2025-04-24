'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/store/cartSlice';

export default function OrderCompletedPage() {
  const dispatch = useDispatch();

  // Po załadowaniu strony wyczyść koszyk
  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className='max-w-4xl mx-auto my-16 px-4'>
      <div className='bg-white rounded-xl shadow-lg p-8 text-center'>
        <div className='flex justify-center mb-6'>
          <div className='w-24 h-24 bg-green-100 rounded-full flex items-center justify-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-12 w-12 text-green-600'
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
        </div>

        <h1 className='text-3xl font-bold text-[var(--deep-navy)] mb-4'>
          Dziękujemy za złożenie zamówienia!
        </h1>

        <p className='text-lg text-gray-600 mb-8'>
          Twoje zamówienie zostało pomyślnie złożone. Potwierdzenie zostało
          wysłane na podany adres e-mail.
        </p>

        <div className='bg-gray-50 rounded-lg p-6 mb-8'>
          <h2 className='text-xl font-semibold text-[var(--deep-navy)] mb-4'>
            Co dalej?
          </h2>
          <ul className='text-left space-y-3'>
            <li className='flex items-start'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-[var(--gold)] mr-2 flex-shrink-0'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <span>
                Otrzymasz e-mail z potwierdzeniem i szczegółami zamówienia
              </span>
            </li>
            <li className='flex items-start'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-[var(--gold)] mr-2 flex-shrink-0'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <span>Nasz zespół przystąpi do realizacji zamówienia</span>
            </li>
            <li className='flex items-start'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-[var(--gold)] mr-2 flex-shrink-0'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <span>
                Otrzymasz informację o wysyłce wraz z numerem śledzenia
              </span>
            </li>
          </ul>
        </div>

        <div className='space-y-4'>
          <Link
            href='/'
            className='inline-block py-3 px-8 bg-[var(--gold)] text-white rounded-md hover:bg-[var(--deep-gold)] transition-colors'
          >
            Powrót do strony głównej
          </Link>

          <p className='text-sm text-gray-500'>
            Masz pytania dotyczące zamówienia? Skontaktuj się z nami:{' '}
            <a
              href='mailto:kontakt@firma.pl'
              className='text-[var(--gold)] hover:underline'
            >
              kontakt@firma.pl
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
