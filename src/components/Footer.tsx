import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className='bg-[var(--deep-navy)] text-white py-8 mt-10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Informacje o firmie */}
          <div>
            <h3 className='text-xl font-medium mb-4'>Firany & Rolety</h3>
            <p className='text-gray-300'>
              Tworzymy eleganckie rozwiązania dla każdego wnętrza. Nasze
              produkty łączą w sobie piękno, funkcjonalność i wysoką jakość
              wykonania.
            </p>
          </div>

          {/* Szybkie linki */}
          <div>
            <h3 className='text-xl font-medium mb-4'>Szybkie linki</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/firany'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Firany
                </Link>
              </li>
              <li>
                <Link
                  href='/rolety'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Rolety
                </Link>
              </li>
              <li>
                <Link
                  href='/kontakt'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Kontakt
                </Link>
              </li>
              <li>
                <Link
                  href='/cart'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Koszyk
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className='text-xl font-medium mb-4'>Kontakt</h3>
            <p className='text-gray-300 mb-2'>
              ul. Przykładowa 123
              <br />
              00-000 Warszawa
            </p>
            <p className='text-gray-300'>
              Tel: +48 123 456 789
              <br />
              Email: kontakt@firany-rolety.pl
            </p>
          </div>
        </div>

        <div className='mt-8 pt-8 border-t border-gray-700 text-center text-gray-400'>
          <p>
            &copy; {new Date().getFullYear()} Firany & Rolety. Wszelkie prawa
            zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
