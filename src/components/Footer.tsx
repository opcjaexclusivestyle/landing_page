'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className='bg-gray-50 border-t border-gray-100 py-12'>
      <div className='footer-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='footer-column'>
            <h3 className='text-lg font-semibold text-[var(--deep-navy)] mb-6 relative'>
              Firma
              <span className='absolute bottom-[-10px] left-0 w-10 h-[3px] bg-[var(--beige)]'></span>
            </h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/kontakt'
                  className='text-gray-600 hover:text-[var(--deep-gold)] transition-all duration-300 text-sm'
                >
                  Kontakt
                </Link>
              </li>
              <li>
                <Link
                  href='/blog'
                  className='text-gray-600 hover:text-[var(--deep-gold)] transition-all duration-300 text-sm'
                >
                  Blog
                </Link>
              </li>
            </ul>
            <h3 className='text-lg font-semibold text-[var(--deep-navy)] mt-8 mb-6 relative'>
              Konto
              <span className='absolute bottom-[-10px] left-0 w-10 h-[3px] bg-[var(--beige)]'></span>
            </h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/cart'
                  className='text-gray-600 hover:text-[var(--deep-gold)] transition-all duration-300 text-sm'
                >
                  Koszyk
                </Link>
              </li>
            </ul>
          </div>

          <div className='footer-column'>
            <h3 className='text-lg font-semibold text-[var(--deep-navy)] mb-6 relative'>
              Zasłonex
              <span className='absolute bottom-[-10px] left-0 w-10 h-[3px] bg-[var(--beige)]'></span>
            </h3>
            <div className='space-y-3 text-sm text-gray-600'>
              <p>Adres: Ul. Redutowa 9 , Radom 26-600 </p>
              <p>Telefon:+48 531 005 929</p>
              <p>E-mail: zaslonex.info@gmial.com</p>
            </div>
            <h3 className='text-lg font-semibold text-[var(--deep-navy)] mt-6 mb-4 relative'>
              Znajdź nas na
              <span className='absolute bottom-[-10px] left-0 w-10 h-[3px] bg-[var(--beige)]'></span>
            </h3>
            <div className='flex space-x-3 mt-6'>
              <a
                href='#'
                className='w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-[var(--beige)] hover:text-white transition-all duration-300'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  viewBox='0 0 320 512'
                >
                  <path
                    fill='currentColor'
                    d='M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z'
                  />
                </svg>
              </a>
              <a
                href='#'
                className='w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-[var(--beige)] hover:text-white transition-all duration-300'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  viewBox='0 0 448 512'
                >
                  <path
                    fill='currentColor'
                    d='M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z'
                  />
                </svg>
              </a>
              <a
                href='#'
                className='w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-[var(--beige)] hover:text-white transition-all duration-300'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  viewBox='0 0 448 512'
                >
                  <path
                    fill='currentColor'
                    d='M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z'
                  />
                </svg>
              </a>
              <a
                href='#'
                className='w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-[var(--beige)] hover:text-white transition-all duration-300'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  viewBox='0 0 488 512'
                >
                  <path
                    fill='currentColor'
                    d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className='footer-column'>
            <h3 className='text-lg font-semibold text-[var(--deep-navy)] mb-6 relative'>
              Zakupy
              <span className='absolute bottom-[-10px] left-0 w-10 h-[3px] bg-[var(--beige)]'></span>
            </h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/promocje'
                  className='text-gray-600 hover:text-[var(--deep-gold)] transition-all duration-300 text-sm'
                >
                  Promocje
                </Link>
              </li>
              <li>
                <Link
                  href='/regulamin'
                  className='text-gray-600 hover:text-[var(--deep-gold)] transition-all duration-300 text-sm'
                >
                  Regulamin
                </Link>
              </li>
              <li>
                <Link
                  href='/polityka-prywatnosci'
                  className='text-gray-600 hover:text-[var(--deep-gold)] transition-all duration-300 text-sm'
                >
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link
                  href='/platnosci'
                  className='text-gray-600 hover:text-[var(--deep-gold)] transition-all duration-300 text-sm'
                >
                  Formy płatności
                </Link>
              </li>
              <li>
                <Link
                  href='/dostawa'
                  className='text-gray-600 hover:text-[var(--deep-gold)] transition-all duration-300 text-sm'
                >
                  Czasy i koszty dostawy
                </Link>
              </li>
              <li>
                <Link
                  href='/konto'
                  className='text-gray-600 hover:text-[var(--deep-gold)] transition-all duration-300 text-sm'
                >
                  Moje konto
                </Link>
              </li>
              <li>
                <Link
                  href='/reklamacje'
                  className='text-gray-600 hover:text-[var(--deep-gold)] transition-all duration-300 text-sm'
                >
                  Reklamacja / Zwrot towaru
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-10 pt-6 border-t border-gray-200 text-center'>
          <p className='text-sm text-gray-500'>
            &copy; {new Date().getFullYear()} Zasłonex. Wszelkie prawa
            zastrzeżone.
            <Link
              href='/regulamin'
              className='ml-3 text-gray-500 hover:text-[var(--deep-gold)]'
            >
              Regulamin
            </Link>
            <Link
              href='/mapa-strony'
              className='ml-3 text-gray-500 hover:text-[var(--deep-gold)]'
            >
              Mapa strony
            </Link>
          </p>
          <p className='mt-2 text-sm text-gray-500'>
            Strona stworzona przez{' '}
            <a
              href='https://acurgturbo.pl'
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-500 hover:text-[var(--deep-gold)]'
            >
              Acurg Turbo
            </a>
          </p>
        </div>

        <button
          onClick={scrollToTop}
          className='back-to-top fixed bottom-5 right-5 w-10 h-10 bg-[var(--beige)] hover:bg-[var(--deep-gold)] text-white flex items-center justify-center rounded transition-all duration-300 shadow-md'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4'
            viewBox='0 0 384 512'
          >
            <path
              fill='currentColor'
              d='M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z'
            />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
