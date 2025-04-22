'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Pobieranie danych koszyka z Redux
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Sprawdzamy, czy użytkownik jest administratorem
  useEffect(() => {
    const checkAdminStatus = async () => {
      // Najpierw sprawdzamy pamięć podręczną
      const cachedAdminStatus = sessionStorage.getItem('adminVerified');
      if (cachedAdminStatus === 'true') {
        setIsAdmin(true);
        return;
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profile?.role === 'admin') {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error(
          'Błąd podczas sprawdzania statusu administratora:',
          error,
        );
      }
    };

    checkAdminStatus();
  }, []);

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
        {/* Górny pasek z informacjami kontaktowymi */}
        <div className='bg-[var(--deep-navy)] text-white py-2'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
            <div className='text-sm'>Godziny otwarcia: 8:00 - 16:00</div>
            <div className='flex items-center space-x-4'>
              <div className='text-sm'>
                <span className='font-medium'>Potrzebujesz pomocy?</span>
                <span className='mx-2'>|</span>
                <span>ZADZWOŃ DO MATEUSZA</span>
                <a
                  href='tel:531400230'
                  className='ml-2 font-semibold text-[var(--gold)] hover:text-white transition-colors'
                >
                  531 400 230
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            {/* Logo */}
            <div className='flex items-center'>
              <Link href='/' className='flex-shrink-0 flex items-center'>
                <Image
                  src='/logo_zaslonex.svg'
                  alt='Zasłonex'
                  width={150}
                  height={50}
                  className='h-10'
                />
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
                href='/posciel-premium'
                className='text-gray-700 hover:text-[var(--gold)] transition-colors'
              >
                Pościel
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

              {/* Ikona administratora - wyświetlana tylko jeśli użytkownik jest adminem */}
              {isAdmin && (
                <Link
                  href='/admin'
                  className='text-gray-700 hover:text-[var(--gold)] transition-colors'
                  title='Panel administratora'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='w-6 h-6'
                  >
                    <path
                      fillRule='evenodd'
                      d='M11.484 2.17a.75.75 0 0 1 1.032 0 11.209 11.209 0 0 0 7.877 3.08.75.75 0 0 1 .722.515 12.74 12.74 0 0 1 .635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 0 1-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.223-2.73.635-3.985a.75.75 0 0 1 .722-.516l.143.001c2.996 0 5.718-1.17 7.734-3.08ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75ZM12 15a.75.75 0 0 0 0 1.5h.007a.75.75 0 0 0 0-1.5H12Z'
                      clipRule='evenodd'
                    />
                  </svg>
                </Link>
              )}

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
              {/* Ikona administratora dla urządzeń mobilnych */}
              {isAdmin && (
                <Link
                  href='/admin'
                  className='text-gray-700 hover:text-[var(--gold)] transition-colors'
                  title='Panel administratora'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='w-6 h-6'
                  >
                    <path
                      fillRule='evenodd'
                      d='M11.484 2.17a.75.75 0 0 1 1.032 0 11.209 11.209 0 0 0 7.877 3.08.75.75 0 0 1 .722.515 12.74 12.74 0 0 1 .635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 0 1-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.223-2.73.635-3.985a.75.75 0 0 1 .722-.516l.143.001c2.996 0 5.718-1.17 7.734-3.08ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75ZM12 15a.75.75 0 0 0 0 1.5h.007a.75.75 0 0 0 0-1.5H12Z'
                      clipRule='evenodd'
                    />
                  </svg>
                </Link>
              )}

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
              Pościel
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
            {isAdmin && (
              <Link
                href='/admin'
                className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-[var(--light-gold)] hover:text-[var(--deep-navy)] flex items-center'
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='w-5 h-5 mr-2'
                >
                  <path
                    fillRule='evenodd'
                    d='M11.484 2.17a.75.75 0 0 1 1.032 0 11.209 11.209 0 0 0 7.877 3.08.75.75 0 0 1 .722.515 12.74 12.74 0 0 1 .635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 0 1-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.223-2.73.635-3.985a.75.75 0 0 1 .722-.516l.143.001c2.996 0 5.718-1.17 7.734-3.08ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75ZM12 15a.75.75 0 0 0 0 1.5h.007a.75.75 0 0 0 0-1.5H12Z'
                    clipRule='evenodd'
                  />
                </svg>
                Panel Administratora
              </Link>
            )}
            <Link
              href='/cart'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-[var(--light-gold)] hover:text-[var(--deep-navy)] flex items-center'
              onClick={() => setIsMenuOpen(false)}
            >
              <span className='mr-2'>Koszyk</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
