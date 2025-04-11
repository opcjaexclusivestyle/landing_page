import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from './Button';

const Header = () => {
  return (
    <header className='sticky top-0 z-50 w-full bg-white-pure shadow-sm'>
      <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
        <Link href='/' className='flex items-center'>
          <Image
            src='/logo.png'
            alt='Logo'
            width={150}
            height={40}
            className='h-10 w-auto'
          />
        </Link>

        <nav className='hidden md:flex items-center space-x-8'>
          <Link
            href='/'
            className='text-black-soft hover:text-yellow-primary text-base font-medium transition-colors'
          >
            Strona główna
          </Link>
          <Link
            href='/produkty'
            className='text-black-soft hover:text-yellow-primary text-base font-medium transition-colors'
          >
            Produkty
          </Link>
          <Link
            href='/o-nas'
            className='text-black-soft hover:text-yellow-primary text-base font-medium transition-colors'
          >
            O nas
          </Link>
          <Link
            href='/kontakt'
            className='text-black-soft hover:text-yellow-primary text-base font-medium transition-colors'
          >
            Kontakt
          </Link>
        </nav>

        <div className='flex items-center space-x-4'>
          <Button variant='outline' size='sm'>
            Zaloguj się
          </Button>
          <Button>Zamów teraz</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
