import React, { ReactNode } from 'react';
import Link from 'next/link';

interface BlogLayoutProps {
  children: ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className='blog-layout min-h-screen'>
      {/* Nagłówek bloga */}
      <header className='bg-white shadow-sm border-b border-gray-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-6'>
            <Link href='/' className='flex items-center'>
              <span className='text-primary font-bold text-xl'>
                Exclusive Style
              </span>
            </Link>

            <nav className='flex space-x-8'>
              <Link href='/blog' className='text-gray-700 hover:text-primary'>
                Wszystkie
              </Link>
              <Link
                href='/blog/kategoria/inspiracje'
                className='text-gray-700 hover:text-primary'
              >
                Inspiracje
              </Link>
              <Link
                href='/blog/kategoria/porady'
                className='text-gray-700 hover:text-primary'
              >
                Porady
              </Link>
              <Link
                href='/blog/kategoria/trendy'
                className='text-gray-700 hover:text-primary'
              >
                Trendy
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Zawartość bloga */}
      <main>{children}</main>

      {/* Stopka bloga */}
      <footer className='bg-gray-50 border-t border-gray-100 py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div>
              <h3 className='font-bold text-gray-900 mb-4'>O nas</h3>
              <p className='text-gray-600'>
                Ekskluzywne wnętrza, unikalne projekty i inspiracje dla Twojego
                domu.
              </p>
            </div>
            <div>
              <h3 className='font-bold text-gray-900 mb-4'>Kategorie</h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    href='/blog/kategoria/inspiracje'
                    className='text-gray-600 hover:text-primary'
                  >
                    Inspiracje
                  </Link>
                </li>
                <li>
                  <Link
                    href='/blog/kategoria/porady'
                    className='text-gray-600 hover:text-primary'
                  >
                    Porady
                  </Link>
                </li>
                <li>
                  <Link
                    href='/blog/kategoria/trendy'
                    className='text-gray-600 hover:text-primary'
                  >
                    Trendy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='font-bold text-gray-900 mb-4'>Social Media</h3>
              <ul className='space-y-2'>
                <li>
                  <a href='#' className='text-gray-600 hover:text-primary'>
                    Instagram
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-primary'>
                    Facebook
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-primary'>
                    Pinterest
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='font-bold text-gray-900 mb-4'>Newsletter</h3>
              <p className='text-gray-600 mb-4'>
                Zapisz się, aby otrzymywać najnowsze inspiracje.
              </p>
              <div className='flex'>
                <input
                  type='email'
                  placeholder='Twój email'
                  className='px-4 py-2 rounded-l-md border border-gray-300 focus:ring-primary focus:border-primary'
                />
                <button className='bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90'>
                  Zapisz
                </button>
              </div>
            </div>
          </div>

          <div className='mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm'>
            &copy; {new Date().getFullYear()} Exclusive Style. Wszelkie prawa
            zastrzeżone.
          </div>
        </div>
      </footer>
    </div>
  );
}
