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
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='footer-column'>
            <h3 className='text-lg font-semibold text-[var(--deep-navy)] mb-6 relative'>
              Firma
              <span className='absolute bottom-[-10px] left-0 w-10 h-[3px] bg-[var(--beige)]'></span>
            </h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/o-nas'
                  className='text-gray-600 hover:text-[var(--deep-gold)] transition-all duration-300 text-sm'
                >
                  O nas
                </Link>
              </li>
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
          </div>

          <div className='footer-column'>
            <h3 className='text-lg font-semibold text-[var(--deep-navy)] mb-6 relative'>
              Kontakt z nami
              <span className='absolute bottom-[-10px] left-0 w-10 h-[3px] bg-[var(--beige)]'></span>
            </h3>
            <div className='space-y-3 text-sm text-gray-600'>
              <p>Adres: Ul. Redutowa 9 , Radom 26-600 </p>
              <p>Telefon: 531 400 230</p>
              <p>E-mail: biuro@zasłonex</p>
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
                  viewBox='0 0 496 512'
                >
                  <path
                    fill='currentColor'
                    d='M496 256c0 137-111 248-248 248-25.6 0-50.2-3.9-73.4-11.1 10.1-16.5 25.2-43.5 30.8-65 3-11.6 15.4-59 15.4-59 8.1 15.4 31.7 28.5 56.8 28.5 74.8 0 128.7-68.8 128.7-154.3 0-81.9-66.9-143.2-152.9-143.2-107 0-163.9 71.8-163.9 150.1 0 36.4 19.4 81.7 50.3 96.1 4.7 2.2 7.2 1.2 8.3-3.3.8-3.4 5-20.3 6.9-28.1.6-2.5.3-4.7-1.7-7.1-10.1-12.5-18.3-35.3-18.3-56.6 0-54.7 41.4-107.6 112-107.6 60.9 0 103.6 41.5 103.6 100.9 0 67.1-33.9 113.6-78 113.6-24.3 0-42.6-20.1-36.7-44.8 7-29.5 20.5-61.3 20.5-82.6 0-19-10.2-34.9-31.4-34.9-24.9 0-44.9 25.7-44.9 60.2 0 22 7.4 36.8 7.4 36.8s-24.5 103.8-29 123.2c-5 21.4-3 51.6-.9 71.2C65.4 450.9 0 361.1 0 256 0 119 111 8 248 8s248 111 248 248z'
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
            <h3 className='text-lg font-semibold text-[var(--deep-navy)] mt-6 mb-4 relative'>
              Zakupy
              <span className='absolute bottom-[-10px] left-0 w-10 h-[3px] bg-[var(--beige)]'></span>
            </h3>
            <ul className='space-y-3 mt-6'>
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

          <div className='footer-column'>
            <h3 className='text-lg font-semibold text-[var(--deep-navy)] mb-6 relative'>
              Newsletter
              <span className='absolute bottom-[-10px] left-0 w-10 h-[3px] bg-[var(--beige)]'></span>
            </h3>
            <p className='text-sm text-gray-600 mb-4'>
              Zapisz się, aby otrzymywać najnowsze informacje o trendach,
              promocjach i ofertach specjalnych.
            </p>
            <form className='space-y-3'>
              <input
                type='email'
                placeholder='Twój e-mail'
                className='w-full py-2 px-3 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--beige)] focus:border-[var(--beige)]'
                required
              />
              <input
                type='tel'
                placeholder='Telefon (opcjonalnie)'
                className='w-full py-2 px-3 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--beige)] focus:border-[var(--beige)]'
              />
              <div className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id='recaptcha'
                  className='h-4 w-4 text-[var(--beige)] focus:ring-[var(--beige)]'
                />
                <label htmlFor='recaptcha' className='text-xs text-gray-600'>
                  Nie jestem robotem
                </label>
              </div>
              <div className='flex items-start space-x-2'>
                <input
                  type='checkbox'
                  id='consent'
                  className='h-4 w-4 mt-0.5 text-[var(--beige)] focus:ring-[var(--beige)]'
                  required
                />
                <label htmlFor='consent' className='text-xs text-gray-500'>
                  Wyrażam zgodę na otrzymywanie informacji handlowych od firmy
                  FAUXIS.{' '}
                  <Link
                    href='/polityka-prywatnosci'
                    className='text-[var(--deep-gold)] hover:underline'
                  >
                    Zasady przetwarzania danych
                  </Link>
                </label>
              </div>
              <button
                type='submit'
                className='bg-[var(--beige)] hover:bg-[var(--deep-gold)] text-white py-2 px-4 text-sm rounded transition-all duration-300 flex items-center'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-2'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
                Zapisz się
              </button>
            </form>
          </div>
        </div>

        <div className='mt-10 pt-6 border-t border-gray-200 text-center'>
          <p className='text-sm text-gray-500'>
            &copy; {new Date().getFullYear()} FAUXIS. Wszelkie prawa
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
        </div>
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
    </footer>
  );
};

export default Footer;
