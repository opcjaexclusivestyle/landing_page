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
    </div>
  );
}
