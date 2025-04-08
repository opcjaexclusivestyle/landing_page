'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function Home() {
  const containerRef = useRef(null);
  const curtainSectionRef = useRef(null);
  const blindSectionRef = useRef(null);
  const curtainsSectionRef = useRef(null);
  const beddingSectionRef = useRef(null);
  const navigationRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const contactButtonRef = useRef(null);

  // Hook do sprawdzania czy widok jest mobilny
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Rejestracja pluginu ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Główne animacje przy wczytywaniu strony
  useEffect(() => {
    const tl = gsap.timeline();

    // Początkowa animacja - powolne rozjaśnianie strony
    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: 'power2.inOut' },
    );

    // Animacja dla wszystkich paneli - pojawiają się jeden po drugim
    const panels = document.querySelectorAll('.panel-section');
    panels.forEach((panel, index) => {
      tl.fromTo(
        panel,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        },
        `-=${index > 0 ? 0.4 : 0}`,
      );
    });

    // Animacja nawigacji
    tl.fromTo(
      navigationRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' },
      '-=0.5',
    );

    // Animacja przycisku kontaktowego
    tl.fromTo(
      contactButtonRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' },
      '-=0.5',
    );

    // Animacje dla efektu paralaksy przy przewijaniu
    panels.forEach((panel) => {
      gsap.to(panel.querySelector('.panel-image'), {
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        y: isMobile ? 20 : 50,
        scale: isMobile ? 1.05 : 1.1,
      });
    });
  }, [isMobile]);

  // Przełączanie mobilnego menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <main className='flex flex-col min-h-screen'>
      {/* Górne menu nawigacyjne */}
      <nav
        ref={navigationRef}
        className='fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-4 md:py-6 flex justify-between items-center bg-black/80 backdrop-blur-md'
      >
        <div className='text-white text-xl md:text-2xl font-light tracking-widest'>
          <span className='text-[var(--gold)]'>Elegant</span> Curtains
        </div>

        {/* Menu mobilne */}
        <div className='md:hidden'>
          <button
            onClick={toggleMobileMenu}
            className='text-white p-2 focus:outline-none relative hover:text-[var(--gold)] transition-colors duration-300'
            aria-label='Otwórz menu'
          >
            <svg
              className='w-7 h-7'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              ) : (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16m-7 6h7'
                />
              )}
            </svg>
            <span className='absolute -bottom-1 left-0 w-full h-0.5 bg-[var(--gold)] transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100'></span>
          </button>
        </div>

        {/* Menu desktopowe */}
        <div className='hidden md:flex space-x-10'>
          <Link
            href='/firany'
            className='text-white hover:text-[var(--gold)] transition-colors duration-300 text-lg font-light tracking-wider'
          >
            Firany
          </Link>
          <Link
            href='/zaslony'
            className='text-white hover:text-[var(--gold)] transition-colors duration-300 text-lg font-light tracking-wider'
          >
            Zasłony
          </Link>
          <Link
            href='/rolety'
            className='text-white hover:text-[var(--gold)] transition-colors duration-300 text-lg font-light tracking-wider'
          >
            Rolety
          </Link>
          <Link
            href='/posciel'
            className='text-white hover:text-[var(--gold)] transition-colors duration-300 text-lg font-light tracking-wider'
          >
            Pościel
          </Link>
          <Link
            href='/contact'
            className='text-white hover:text-[var(--gold)] transition-colors duration-300 text-lg font-light tracking-wider'
          >
            Kontakt
          </Link>
        </div>
      </nav>

      {/* Mobilne menu rozwijane */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className='fixed top-16 left-0 w-full bg-black/95 z-50 py-4 flex flex-col items-center md:hidden animate-fade-in-up'
        >
          <Link
            href='/firany'
            className='text-white hover:text-[var(--gold)] transition-colors duration-300 text-lg font-medium tracking-wider py-4 w-full text-center'
            onClick={() => setMobileMenuOpen(false)}
          >
            Firany
          </Link>
          <div className='w-10 h-px bg-gray-700 my-1'></div>
          <Link
            href='/zaslony'
            className='text-white hover:text-[var(--gold)] transition-colors duration-300 text-lg font-medium tracking-wider py-4 w-full text-center'
            onClick={() => setMobileMenuOpen(false)}
          >
            Zasłony
          </Link>
          <div className='w-10 h-px bg-gray-700 my-1'></div>
          <Link
            href='/rolety'
            className='text-white hover:text-[var(--gold)] transition-colors duration-300 text-lg font-medium tracking-wider py-4 w-full text-center'
            onClick={() => setMobileMenuOpen(false)}
          >
            Rolety
          </Link>
          <div className='w-10 h-px bg-gray-700 my-1'></div>
          <Link
            href='/posciel'
            className='text-white hover:text-[var(--gold)] transition-colors duration-300 text-lg font-medium tracking-wider py-4 w-full text-center'
            onClick={() => setMobileMenuOpen(false)}
          >
            Pościel
          </Link>
          <div className='w-10 h-px bg-gray-700 my-1'></div>
          <Link
            href='/contact'
            className='text-white hover:text-[var(--gold)] transition-colors duration-300 text-lg font-medium tracking-wider py-4 w-full text-center'
            onClick={() => setMobileMenuOpen(false)}
          >
            Kontakt
          </Link>
        </div>
      )}

      {/* Przycisk kontaktowy */}
      <div
        ref={contactButtonRef}
        className='fixed bottom-10 right-10 z-50 hidden md:block'
      >
        <Link href='/contact' className='premium-button'>
          Umów Konsultację
        </Link>
      </div>

      {/* Grid paneli 2x2 */}
      <div
        ref={containerRef}
        className='grid grid-cols-1 md:grid-cols-2 mt-16 md:mt-20 min-h-screen'
      >
        {/* Panel 1: Firany */}
        <section
          ref={curtainSectionRef}
          className='panel-section relative min-h-[50vh] overflow-hidden border-b border-r border-gray-800/30'
        >
          {/* Obraz tła */}
          <div className='panel-image absolute inset-0 w-full h-full z-0'>
            <Image
              src='/images/Firany.jpg'
              alt='Luksusowe firany'
              fill
              priority
              quality={100}
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                transformOrigin: 'center center',
              }}
              className='w-full h-full'
            />

            {/* Gradient overlay */}
            <div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70' />
          </div>

          {/* Tekst i przycisk */}
          <div className='relative z-10 text-center p-6 md:p-10 flex flex-col items-center justify-center h-full'>
            <h2 className='text-3xl md:text-5xl lg:text-6xl mb-4 font-light tracking-widest text-white luxury-heading drop-shadow-lg'>
              Firany
            </h2>
            <p className='text-base md:text-lg lg:text-xl mb-6 md:mb-10 text-white font-light tracking-wide leading-relaxed drop-shadow-md max-w-md mx-auto'>
              Klasyczna elegancja i niepowtarzalny charakter dla Twojego
              wnętrza.
            </p>

            <Link href='/firany' className='premium-button'>
              ZOBACZ WIĘCEJ
            </Link>
          </div>
        </section>

        {/* Panel 2: Zasłony */}
        <section
          ref={curtainsSectionRef}
          className='panel-section relative min-h-[50vh] overflow-hidden border-b border-l border-gray-800/30'
        >
          {/* Obraz tła */}
          <div className='panel-image absolute inset-0 w-full h-full z-0'>
            <Image
              src='/images/kitchen.jpg' // Tymczasowo używam istniejącego obrazu, należy zmienić na zdjęcie zasłon
              alt='Eleganckie zasłony'
              fill
              priority
              quality={100}
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                transformOrigin: 'center center',
              }}
              className='w-full h-full'
            />

            {/* Gradient overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/70' />
          </div>

          {/* Tekst i przycisk */}
          <div className='relative z-10 text-center p-6 md:p-10 flex flex-col items-center justify-center h-full'>
            <h2 className='text-3xl md:text-5xl lg:text-6xl mb-4 font-light tracking-widest text-white luxury-heading drop-shadow-lg'>
              Zasłony
            </h2>
            <p className='text-base md:text-lg lg:text-xl mb-6 md:mb-10 text-white font-light tracking-wide leading-relaxed drop-shadow-md max-w-md mx-auto'>
              Pełna prywatność i stylowy design w każdym pomieszczeniu.
            </p>

            <Link href='/zaslony' className='premium-button'>
              ZOBACZ KOLEKCJĘ
            </Link>
          </div>
        </section>

        {/* Panel 3: Pościel */}
        <section
          ref={beddingSectionRef}
          className='panel-section relative min-h-[50vh] overflow-hidden border-t border-r border-gray-800/30'
        >
          {/* Obraz tła */}
          <div className='panel-image absolute inset-0 w-full h-full z-0'>
            <Image
              src='/images/posciel.png' // Tymczasowo używam istniejącego obrazu, należy zmienić na zdjęcie pościeli
              alt='Luksusowa pościel'
              fill
              priority
              quality={100}
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                transformOrigin: 'center center',
              }}
              className='w-full h-full'
            />

            {/* Gradient overlay */}
            <div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70' />
          </div>

          {/* Tekst i przycisk */}
          <div className='relative z-10 text-center p-6 md:p-10 flex flex-col items-center justify-center h-full'>
            <h2 className='text-3xl md:text-5xl lg:text-6xl mb-4 font-light tracking-widest text-white luxury-heading drop-shadow-lg'>
              Pościel
            </h2>
            <p className='text-base md:text-lg lg:text-xl mb-6 md:mb-10 text-white font-light tracking-wide leading-relaxed drop-shadow-md max-w-md mx-auto'>
              Komfort snu i elegancka oprawa Twojej sypialni.
            </p>

            <Link href='/posciel' className='premium-button'>
              ODKRYJ KOMFORT
            </Link>
          </div>
        </section>

        {/* Panel 4: Rolety */}
        <section
          ref={blindSectionRef}
          className='panel-section relative min-h-[50vh] overflow-hidden border-t border-l border-gray-800/30'
        >
          {/* Obraz tła */}
          <div className='panel-image absolute inset-0 w-full h-full z-0'>
            <Image
              src='/images/Rolety.jpg' // Tymczasowo używam istniejącego obrazu, należy zmienić na właściwe zdjęcie rolet
              alt='Nowoczesne rolety'
              fill
              priority
              quality={100}
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                transformOrigin: 'center center',
              }}
              className='w-full h-full'
            />

            {/* Gradient overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/70' />
          </div>

          {/* Tekst i przycisk */}
          <div className='relative z-10 text-center p-6 md:p-10 flex flex-col items-center justify-center h-full'>
            <h2 className='text-3xl md:text-5xl lg:text-6xl mb-4 font-light tracking-widest text-white luxury-heading drop-shadow-lg'>
              Rolety
            </h2>
            <p className='text-base md:text-lg lg:text-xl mb-6 md:mb-10 text-white font-light tracking-wide leading-relaxed drop-shadow-md max-w-md mx-auto'>
              Nowoczesne rozwiązania zaprojektowane z myślą o funkcjonalności i
              elegancji.
            </p>

            <Link href='/rolety' className='premium-button'>
              POZNAJ OFERTĘ
            </Link>
          </div>
        </section>
      </div>

      {/* Przycisk kontaktowy na mobile - widoczny na dole strony */}
      <div className='md:hidden w-full py-6 bg-black/80 backdrop-blur-md flex justify-center sticky bottom-0 z-40 border-t border-gray-800/30 shadow-[0_-5px_15px_rgba(0,0,0,0.3)]'>
        <Link href='/contact' className='premium-button'>
          Umów Konsultację
        </Link>
      </div>
    </main>
  );
}
