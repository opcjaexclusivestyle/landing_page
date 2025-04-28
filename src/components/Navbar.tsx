'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Zamykanie menu po zmianie strony
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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
            // Zapisz status w pamięci podręcznej na czas trwania sesji
            sessionStorage.setItem('adminVerified', 'true');
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

      // Nie chowamy nawigacji jeśli menu jest otwarte
      if (isMenuOpen) {
        setVisible(true);
        setPrevScrollPos(currentScrollPos);
        return;
      }

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
  }, [prevScrollPos, isMenuOpen]);

  // Animacja rozwijania menu na urządzeniach mobilnych
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (isMenuOpen) {
      // Najpierw ustawmy display block zanim rozpoczniemy animację
      mobileMenuRef.current.style.display = 'block';

      gsap.to(mobileMenuRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      gsap.to(mobileMenuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          if (mobileMenuRef.current) {
            mobileMenuRef.current.style.display = 'none';
          }
        },
      });
    }
  }, [isMenuOpen]);

  // Obsługa zamykania menu przy kliknięciu poza menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('button')
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Blokujemy scrollowanie gdy menu mobilne jest otwarte
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Funkcja do renderowania ikony koszyka z licznikiem
  const renderCartIcon = () => {
    return (
      <Link
        href='/cart'
        className='relative flex items-center text-gray-700 hover:text-[var(--gold)] transition-colors'
        aria-label={`Koszyk, ${itemCount} produktów`}
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
          <span
            className='absolute -top-2 -right-2 bg-[var(--gold)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'
            key={itemCount} // Dodanie klucza wymusi ponowne renderowanie przy zmianie
          >
            {itemCount}
          </span>
        )}
      </Link>
    );
  };

  // Funkcja renderująca link nawigacyjny w menu mobilnym
  const MobileNavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={`block w-full py-3 px-4 text-base font-medium border-b border-gray-200
        ${
          pathname === href
            ? 'text-[var(--gold)] border-l-4 border-l-[var(--gold)] pl-3'
            : 'text-gray-700 hover:bg-gray-50'
        } transition-colors`}
      onClick={() => setIsMenuOpen(false)}
    >
      {label}
    </Link>
  );

  // Funkcja renderująca link nawigacyjny w menu desktopowym
  const DesktopNavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={`text-gray-700 hover:text-[var(--gold)] transition-colors relative px-1
        ${
          pathname === href
            ? 'text-[var(--gold)] font-semibold after:content-[""] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-[2px] after:bg-[var(--gold)]'
            : ''
        }
      `}
    >
      {label}
    </Link>
  );

  // Renderowanie ikony administratora
  const AdminIcon = () => (
    <Link
      href='/admin'
      className={`text-gray-700 hover:text-[var(--gold)] transition-colors ${
        pathname === '/admin' ? 'text-[var(--gold)]' : ''
      }`}
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
  );

  return (
    <nav
      className={`fixed w-full z-50 transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className='bg-white bg-opacity-95 shadow-md' ref={navbarRef}>
        {/* Górny pasek z informacjami kontaktowymi - ukryty na najmniejszych ekranach */}
        <div className='bg-[var(--deep-navy)] text-white py-2 hidden xs:block'>
          <div className='max-w-7xl mx-auto px-3 sm:px-6 lg:px-8'>
            <div className='flex flex-col xs:flex-row justify-between items-center text-[11px] xs:text-xs sm:text-sm'>
              <div className='mb-1 xs:mb-0'>Godziny otwarcia: 8:00 - 16:00</div>
              <div className='flex items-center'>
                <div className='text-center xs:text-left'>
                  <span className='font-medium'>Potrzebujesz pomocy?</span>
                  <span className='mx-1 hidden xs:inline'>|</span>
                  <span className='block xs:inline'>ZADZWOŃ DO MATEUSZA</span>
                  <a
                    href='tel:531400230'
                    className='ml-1 font-semibold text-[var(--gold)] hover:text-white transition-colors'
                  >
                    531 400 230
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Główny pasek nawigacyjny */}
        <div className='w-full mx-auto px-3 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo */}
            <div className='flex items-center'>
              <Link href='/' className='flex-shrink-0 flex items-center'>
                <Image
                  src='/logo_zaslonex.svg'
                  alt='Zasłonex'
                  width={120}
                  height={40}
                  className='h-8 w-auto sm:h-10 md:h-12 md:w-auto'
                  priority
                />
              </Link>
            </div>

            {/* Nawigacja dla większych ekranów */}
            <div className='hidden md:flex items-center space-x-3 lg:space-x-6'>
              <DesktopNavLink href='/zaslony' label='Zasłony' />
              <DesktopNavLink href='/firany' label='Firany' />
              <DesktopNavLink href='/posciel-premium' label='Pościel' />
              <DesktopNavLink href='/rolety' label='Rolety' />
              <DesktopNavLink href='/kontakt' label='Kontakt' />

              <div className='flex items-center pl-2 space-x-3'>
                {/* Ikona administratora - wyświetlana tylko jeśli użytkownik jest adminem */}
                {isAdmin && <AdminIcon />}
                {/* Koszyk */}
                {renderCartIcon()}
              </div>
            </div>

            {/* Przyciski dla wersji mobilnej */}
            <div className='flex md:hidden items-center space-x-2 sm:space-x-3'>
              {/* Ikona administratora dla urządzeń mobilnych */}
              {isAdmin && <AdminIcon />}

              {/* Ikona koszyka na urządzeniach mobilnych */}
              {renderCartIcon()}

              {/* Przycisk menu */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className='inline-flex items-center justify-center p-1.5 rounded-md text-gray-700 hover:text-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--gold)]'
                aria-expanded={isMenuOpen}
                aria-label='Menu główne'
              >
                <span className='sr-only'>Otwórz menu</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobilne */}
        <div
          ref={mobileMenuRef}
          className='mobile-menu overflow-hidden opacity-0 h-0 md:hidden w-screen'
          style={{ display: 'none' }}
          aria-hidden={!isMenuOpen}
        >
          {/* Link do telefonu wyświetlany tylko w najmniejszych ekranach (gdy górny pasek jest ukryty) */}
          <div className='xs:hidden bg-[var(--deep-navy)] text-white py-2 px-4 text-center'>
            <div className='flex flex-col text-xs'>
              <span>Godziny otwarcia: 8:00 - 16:00</span>
              <span className='font-medium mt-1'>Potrzebujesz pomocy?</span>
              <a
                href='tel:531400230'
                className='mt-1 font-semibold text-[var(--gold)] hover:text-white transition-colors'
              >
                ZADZWOŃ DO MATEUSZA: 531 400 230
              </a>
            </div>
          </div>

          <div className='bg-white divide-y divide-gray-100'>
            <MobileNavLink href='/zaslony' label='Zasłony' />
            <MobileNavLink href='/firany' label='Firany' />
            <MobileNavLink href='/posciel-premium' label='Pościel' />
            <MobileNavLink href='/rolety' label='Rolety' />
            <MobileNavLink href='/kontakt' label='Kontakt' />
          </div>
        </div>
      </div>
    </nav>
  );
}
