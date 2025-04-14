'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  // Pobieranie danych koszyka z Redux
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Obsługa animacji paska nawigacyjnego przy przewijaniu
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = prevScrollPos < currentScrollPos;

      // Widoczność paska nawigacyjnego przy przewijaniu
      if (currentScrollPos > 80) {
        setVisible(!isScrollingDown);
      } else {
        setVisible(true);
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  // Animacja rozwijania menu na urządzeniach mobilnych
  useEffect(() => {
    if (isMenuOpen) {
      gsap.to('.mobile-menu', {
        height: 'auto',
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      gsap.to('.mobile-menu', {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  }, [isMenuOpen]);

  return (
    <nav
      className={`fixed w-full z-50 transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className='bg-white bg-opacity-95 shadow-md'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            {/* Logo */}
            <div className='flex items-center'>
              <Link href='/' className='flex-shrink-0 flex items-center'>
                <span className='text-xl font-medium text-[var(--deep-navy)]'>
                  Firany & Rolety
                </span>
              </Link>
            </div>

            {/* Nawigacja dla większych ekranów */}
            <div className='hidden md:flex items-center space-x-6'>
              <Link
                href='/zaslony'
                className='text-gray-700 hover:text-[var(--gold)] transition-colors'
              >
                Zasłony
              </Link>
              <Link
                href='/firany'
                className='text-gray-700 hover:text-[var(--gold)] transition-colors'
              >
                Firany
              </Link>
              <Link
                href='/przescieradlo'
                className='text-gray-700 hover:text-[var(--gold)] transition-colors'
              >
                Prześcieradło
              </Link>
              <Link
                href='/rolety'
                className='text-gray-700 hover:text-[var(--gold)] transition-colors'
              >
                Rolety
              </Link>
              <Link
                href='/kontakt'
                className='text-gray-700 hover:text-[var(--gold)] transition-colors'
              >
                Kontakt
              </Link>

              {/* Koszyk */}
              <Link
                href='/cart'
                className='relative flex items-center text-gray-700 hover:text-[var(--gold)] transition-colors'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
                {itemCount > 0 && (
                  <span className='absolute -top-2 -right-2 bg-[var(--gold)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Przycisk menu mobilnego */}
            <div className='md:hidden flex items-center space-x-4'>
              {/* Ikona koszyka na urządzeniach mobilnych */}
              <Link
                href='/cart'
                className='relative flex items-center text-gray-700 hover:text-[var(--gold)] transition-colors'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
                {itemCount > 0 && (
                  <span className='absolute -top-2 -right-2 bg-[var(--gold)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Przycisk menu */}
              <button
                type='button'
                className='text-gray-700 hover:text-[var(--gold)] focus:outline-none'
                aria-controls='mobile-menu'
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className='sr-only'>Otwórz menu główne</span>
                {isMenuOpen ? (
                  <svg
                    className='h-6 w-6'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                ) : (
                  <svg
                    className='h-6 w-6'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 6h16M4 12h16M4 18h16'
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobilne */}
        <div className='mobile-menu md:hidden overflow-hidden h-0 opacity-0'>
          <div className='px-2 pt-2 pb-3 space-y-1 bg-white'>
            <Link
              href='/zaslony'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-[var(--light-gold)] hover:text-[var(--deep-navy)]'
              onClick={() => setIsMenuOpen(false)}
            >
              Zasłony
            </Link>
            <Link
              href='/firany'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-[var(--light-gold)] hover:text-[var(--deep-navy)]'
              onClick={() => setIsMenuOpen(false)}
            >
              Firany
            </Link>
            <Link
              href='/przescieradlo'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-[var(--light-gold)] hover:text-[var(--deep-navy)]'
              onClick={() => setIsMenuOpen(false)}
            >
              Prześcieradło
            </Link>
            <Link
              href='/rolety'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-[var(--light-gold)] hover:text-[var(--deep-navy)]'
              onClick={() => setIsMenuOpen(false)}
            >
              Rolety
            </Link>
            <Link
              href='/kontakt'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-[var(--light-gold)] hover:text-[var(--deep-navy)]'
              onClick={() => setIsMenuOpen(false)}
            >
              Kontakt
            </Link>
            <Link
              href='/cart'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-[var(--light-gold)] hover:text-[var(--deep-navy)] flex items-center'
              onClick={() => setIsMenuOpen(false)}
            >
              <span className='mr-2'>Koszyk</span>
              {itemCount > 0 && (
                <span className='bg-[var(--gold)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
