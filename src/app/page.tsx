'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <main className='flex flex-col min-h-screen'>
      {/* Header */}
      <header className='py-4 bg-white shadow-sm sticky top-0 z-50 transition-all ease-in-out duration-300'>
        <div className='container mx-auto px-4 flex justify-between items-center'>
          <div className='flex items-center'>
            <Link href='/' className='text-2xl font-bold text-gray-900'>
              Curtains
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex space-x-8'>
            <Link
              href='#oferta'
              className='text-gray-600 hover:text-primary font-medium transition-colors whitespace-nowrap'
            >
              Oferta
            </Link>
            <Link
              href='#realizacje'
              className='text-gray-600 hover:text-primary font-medium transition-colors whitespace-nowrap'
            >
              Realizacje
            </Link>
            <Link
              href='#jak-pracujemy'
              className='text-gray-600 hover:text-primary font-medium transition-colors whitespace-nowrap'
            >
              Jak pracujemy
            </Link>
            <Link
              href='#kontakt'
              className='text-gray-600 hover:text-primary font-medium transition-colors whitespace-nowrap'
            >
              Kontakt
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className='md:hidden text-gray-500 focus:outline-none'
          >
            {isMenuOpen ? (
              <XMarkIcon className='h-6 w-6' />
            ) : (
              <Bars3Icon className='h-6 w-6' />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`${
            isMenuOpen ? 'max-h-64' : 'max-h-0'
          } md:hidden overflow-hidden transition-all duration-300 ease-in-out`}
        >
          <div className='container mx-auto px-4 py-2'>
            <div className='flex flex-col space-y-3'>
              <Link
                href='#oferta'
                className='text-gray-600 hover:text-primary font-medium transition-colors'
                onClick={toggleMenu}
              >
                Oferta
              </Link>
              <Link
                href='#realizacje'
                className='text-gray-600 hover:text-primary font-medium transition-colors'
                onClick={toggleMenu}
              >
                Realizacje
              </Link>
              <Link
                href='#jak-pracujemy'
                className='text-gray-600 hover:text-primary font-medium transition-colors'
                onClick={toggleMenu}
              >
                Jak pracujemy
              </Link>
              <Link
                href='#kontakt'
                className='text-gray-600 hover:text-primary font-medium transition-colors'
                onClick={toggleMenu}
              >
                Kontakt
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className='hero-section w-full min-h-[600px] flex items-center'>
        <div className='container mx-auto px-4 py-20'>
          <div className='max-w-2xl'>
            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
              Eleganckie dekoracje okienne i tekstylia domowe
            </h1>
            <p className='text-lg text-gray-700 mb-8'>
              Tworzymy wyjątkowe wnętrza z najwyższej jakości rolet, zasłon,
              firan i pościeli. Nadaj swojemu domowi niepowtarzalny charakter z
              naszymi produktami szytymi na miarę.
            </p>
            <a
              href='#kontakt'
              className='bg-primary text-white px-8 py-3 font-medium rounded-button shadow-lg hover:bg-blue-600 transition-colors whitespace-nowrap'
            >
              Zamów konsultację
            </a>
          </div>
        </div>
      </section>

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

      {/* Testimony Section */}
      <section id='testimony' className='py-20 bg-white'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center text-gray-900 mb-16'>
            Co mówią nasi klienci
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Testimony 1 */}
            <div className='bg-gray-50 p-8 rounded-lg shadow-md'>
              <div className='flex items-center mb-4'>
                <div className='w-12 h-12 bg-gray-300 rounded-full overflow-hidden mr-4'>
                  <Image
                    src='/images/testimonial-1.jpg'
                    alt='Klient'
                    width={48}
                    height={48}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div>
                  <h3 className='font-bold text-gray-900'>Anna Kowalska</h3>
                  <p className='text-gray-600 text-sm'>Warszawa</p>
                </div>
              </div>
              <div className='mb-4'>
                <div className='flex text-yellow-400'>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                  </svg>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                  </svg>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                  </svg>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                  </svg>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                  </svg>
                </div>
              </div>
              <p className='text-gray-700'>
                "Jestem pod ogromnym wrażeniem jakości wykonania zasłon.
                Wszystko idealnie dopasowane, a materiał jest przepiękny. Usługa
                od początku do końca profesjonalna."
              </p>
            </div>

            {/* Testimony 2 */}
            <div className='bg-gray-50 p-8 rounded-lg shadow-md'>
              <div className='flex items-center mb-4'>
                <div className='w-12 h-12 bg-gray-300 rounded-full overflow-hidden mr-4'>
                  <Image
                    src='/images/testimonial-2.jpg'
                    alt='Klient'
                    width={48}
                    height={48}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div>
                  <h3 className='font-bold text-gray-900'>Piotr Nowak</h3>
                  <p className='text-gray-600 text-sm'>Kraków</p>
                </div>
              </div>
              <div className='mb-4'>
                <div className='flex text-yellow-400'>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                  </svg>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                  </svg>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                  </svg>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                  </svg>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                  </svg>
                </div>
              </div>
              <p className='text-gray-700'>
                "Rolety, które zamówiłem, są dokładnie takie jak chciałem.
                Doskonała jakość materiału i wykonania. Szczególnie podoba mi
                się możliwość regulacji natężenia światła."
              </p>
            </div>

            {/* Testimony 3 */}
            <div className='bg-gray-50 p-8 rounded-lg shadow-md'>
              <div className='flex items-center mb-4'>
                <div className='w-12 h-12 bg-gray-300 rounded-full overflow-hidden mr-4'>
                  <Image
                    src='/images/testimonial-3.jpg'
                    alt='Klient'
                    width={48}
                    height={48}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div>
                  <h3 className='font-bold text-gray-900'>
                    Magdalena Wiśniewska
                  </h3>
                  <p className='text-gray-600 text-sm'>Gdańsk</p>
                </div>
              </div>
              <div className='mb-4'>
                <div className='flex text-yellow-400'>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                  </svg>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                  </svg>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                  </svg>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                  </svg>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                  </svg>
                </div>
              </div>
              <p className='text-gray-700'>
                "Pościel, którą kupiłam, jest luksusowa i niesamowicie miękka.
                Jakość przeszyć i wykończenia jest na najwyższym poziomie. Z
                pewnością wrócę po więcej produktów!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section - Realizacje */}
      <section id='realizacje' className='py-20 bg-white'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center text-gray-900 mb-8'>
            Nasze realizacje
          </h2>
          <div className='flex justify-center mb-12'>
            <div className='inline-flex bg-gray-100 p-1 rounded-full'>
              <button className='px-6 py-2 rounded-full bg-primary text-white font-medium whitespace-nowrap'>
                Wszystkie
              </button>
              <button className='px-6 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-200 transition-colors whitespace-nowrap'>
                Rolety
              </button>
              <button className='px-6 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-200 transition-colors whitespace-nowrap'>
                Zasłony
              </button>
              <button className='px-6 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-200 transition-colors whitespace-nowrap'>
                Firany
              </button>
              <button className='px-6 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-200 transition-colors whitespace-nowrap'>
                Pościel
              </button>
            </div>
          </div>

          {/* Zaawansowany grid z elementami o różnych wymiarach */}
          <div className='grid grid-cols-1 md:grid-cols-6 gap-6 mb-12'>
            {/* Portfolio Item 1 - Duży element zajmujący 4 kolumny */}
            <div className='md:col-span-4 overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:-translate-y-2'>
              <div className='relative h-96 overflow-hidden'>
                <Image
                  src='/images/kitchen.jpg'
                  alt='Luksusowe zasłony w apartamencie'
                  width={1200}
                  height={800}
                  className='w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8'>
                  <h3 className='text-2xl font-bold text-white mb-2 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100'>
                    Luksusowe zasłony w apartamencie
                  </h3>
                  <p className='text-gray-200 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150'>
                    Warszawa, 2024
                  </p>
                  <button className='mt-4 w-max bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200'>
                    Zobacz projekt
                  </button>
                </div>
              </div>
            </div>

            {/* Portfolio Item 2 - Element zajmujący 2 kolumny */}
            <div className='md:col-span-2 overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:-translate-y-2'>
              <div className='relative h-96 overflow-hidden'>
                <Image
                  src='/images/Rolety.jpg'
                  alt='Rolety w sypialni'
                  width={600}
                  height={800}
                  className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8'>
                  <h3 className='text-xl font-bold text-white mb-2 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100'>
                    Nowoczesne rolety w sypialni
                  </h3>
                  <p className='text-gray-200 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150'>
                    Kraków, 2024
                  </p>
                  <button className='mt-4 w-max bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200'>
                    Zobacz projekt
                  </button>
                </div>
              </div>
            </div>

            {/* Portfolio Item 3 - Element zajmujący 3 kolumny */}
            <div className='md:col-span-3 overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:-translate-y-2'>
              <div className='relative h-80 overflow-hidden'>
                <Image
                  src='/images/posciel.png'
                  alt='Pościel hotelowa'
                  width={900}
                  height={600}
                  className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8'>
                  <h3 className='text-xl font-bold text-white mb-2 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100'>
                    Luksusowa pościel hotelowa
                  </h3>
                  <p className='text-gray-200 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150'>
                    Gdańsk, 2023
                  </p>
                  <button className='mt-4 w-max bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200'>
                    Zobacz projekt
                  </button>
                </div>
              </div>
            </div>

            {/* Portfolio Item 4 - Element zajmujący 3 kolumny */}
            <div className='md:col-span-3 overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:-translate-y-2'>
              <div className='relative h-80 overflow-hidden'>
                <Image
                  src='/images/Firany.jpg'
                  alt='Firany w kuchni'
                  width={900}
                  height={600}
                  className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8'>
                  <h3 className='text-xl font-bold text-white mb-2 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100'>
                    Delikatne firany w jasnej kuchni
                  </h3>
                  <p className='text-gray-200 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150'>
                    Poznań, 2024
                  </p>
                  <button className='mt-4 w-max bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200'>
                    Zobacz projekt
                  </button>
                </div>
              </div>
            </div>

            {/* Portfolio Item 5 - Element zajmujący 2 kolumny i 2 rzędy */}
            <div className='md:col-span-2 md:row-span-2 overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:-translate-y-2'>
              <div className='relative h-full overflow-hidden'>
                <Image
                  src='/images/kitchen.jpg'
                  alt='Zasłony w jadalni'
                  width={600}
                  height={1200}
                  className='w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8'>
                  <h3 className='text-xl font-bold text-white mb-2 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100'>
                    Eleganckie zasłony w jadalni
                  </h3>
                  <p className='text-gray-200 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150'>
                    Wrocław, 2023
                  </p>
                  <button className='mt-4 w-max bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200'>
                    Zobacz projekt
                  </button>
                </div>
              </div>
            </div>

            {/* Portfolio Item 6 - Element zajmujący 4 kolumny */}
            <div className='md:col-span-4 overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:-translate-y-2'>
              <div className='relative h-80 overflow-hidden'>
                <Image
                  src='/images/Rolety.jpg'
                  alt='Rolety w nowoczesnym biurze'
                  width={1200}
                  height={600}
                  className='w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8'>
                  <h3 className='text-xl font-bold text-white mb-2 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100'>
                    Rolety w nowoczesnym biurze
                  </h3>
                  <p className='text-gray-200 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150'>
                    Łódź, 2024
                  </p>
                  <button className='mt-4 w-max bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200'>
                    Zobacz projekt
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='text-center'>
            <button className='bg-primary text-white px-8 py-3 font-medium rounded-full shadow-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transform hover:scale-105 transition-transform duration-300 whitespace-nowrap'>
              Zobacz więcej realizacji
            </button>
          </div>
        </div>
      </section>

      {/* Process Section - Jak pracujemy */}
      <section id='jak-pracujemy' className='py-20 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center text-gray-900 mb-16'>
            Proces współpracy
          </h2>
          <div className='relative'>
            {/* Timeline Line */}
            <div className='hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2'></div>

            {/* Step 1 */}
            <div className='relative flex flex-col md:flex-row items-center mb-16 md:mb-24'>
              <div className='md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right'>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  ✂️ Tkanina zostaje precyzyjnie przycięta
                </h3>
                <p className='text-gray-700'>
                  Maszyna tnie materiał dokładnie na wymiar, który wybrałeś – z
                  milimetrową dokładnością.
                </p>
              </div>
              <div className='z-10 w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full font-bold shadow-lg md:absolute md:left-1/2 md:transform md:-translate-x-1/2'>
                1
              </div>
              <div className='md:w-1/2 md:pl-12 md:text-left'></div>
            </div>

            {/* Step 2 */}
            <div className='relative flex flex-col md:flex-row items-center mb-16 md:mb-24'>
              <div className='md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right'></div>
              <div className='z-10 w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full font-bold shadow-lg md:absolute md:left-1/2 md:transform md:-translate-x-1/2'>
                2
              </div>
              <div className='md:w-1/2 md:pl-12 md:text-left'>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  🧵 Do akcji wkraczają nasze krawcowe
                </h3>
                <p className='text-gray-700'>
                  Tkanina trafia w ręce doświadczonych specjalistek, które dbają
                  o każdy detal i staranne przeszycia.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className='relative flex flex-col md:flex-row items-center mb-16 md:mb-24'>
              <div className='md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right'>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  🔍 Kontrola jakości
                </h3>
                <p className='text-gray-700'>
                  Każdy element jest dokładnie sprawdzany – zarówno jakość
                  szycia, jak i samego materiału.
                </p>
              </div>
              <div className='z-10 w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full font-bold shadow-lg md:absolute md:left-1/2 md:transform md:-translate-x-1/2'>
                3
              </div>
              <div className='md:w-1/2 md:pl-12 md:text-left'></div>
            </div>

            {/* Step 4 */}
            <div className='relative flex flex-col md:flex-row items-center mb-16 md:mb-24'>
              <div className='md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right'></div>
              <div className='z-10 w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full font-bold shadow-lg md:absolute md:left-1/2 md:transform md:-translate-x-1/2'>
                4
              </div>
              <div className='md:w-1/2 md:pl-12 md:text-left'>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  📦 Czas na pakowanie
                </h3>
                <p className='text-gray-700'>
                  Gotowy produkt składamy z troską i pakujemy tak, by dotarł do
                  Ciebie w perfekcyjnym stanie.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className='relative flex flex-col md:flex-row items-center mb-16 md:mb-24'>
              <div className='md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right'>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  🚚 Wysyłka w drogę!
                </h3>
                <p className='text-gray-700'>
                  Przekazujemy paczkę kurierowi, a Ty możesz na bieżąco śledzić
                  trasę swojej przesyłki.
                </p>
              </div>
              <div className='z-10 w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full font-bold shadow-lg md:absolute md:left-1/2 md:transform md:-translate-x-1/2'>
                5
              </div>
              <div className='md:w-1/2 md:pl-12 md:text-left'></div>
            </div>

            {/* Step 6 */}
            <div className='relative flex flex-col md:flex-row items-center'>
              <div className='md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right'></div>
              <div className='z-10 w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full font-bold shadow-lg md:absolute md:left-1/2 md:transform md:-translate-x-1/2'>
                6
              </div>
              <div className='md:w-1/2 md:pl-12 md:text-left'>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  ✅ Gotowe!
                </h3>
                <p className='text-gray-700'>
                  Twoje dekoracje tekstylne są już u Ciebie. Możesz cieszyć się
                  ich wyglądem i funkcjonalnością przez długie lata!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kontakt Section - Formularz kontaktowy */}
      <section id='kontakt' className='py-20 bg-white'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center text-gray-900 mb-16'>
            Skontaktuj się z nami
          </h2>
          <div className='max-w-3xl mx-auto bg-gray-50 rounded-lg p-8 shadow-lg'>
            <form className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-gray-700 font-medium mb-2'
                  >
                    Imię i nazwisko
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
                    placeholder='Twoje imię i nazwisko'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-gray-700 font-medium mb-2'
                  >
                    Adres e-mail
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
                    placeholder='Twój adres e-mail'
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='phone'
                  className='block text-gray-700 font-medium mb-2'
                >
                  Numer telefonu
                </label>
                <input
                  type='tel'
                  id='phone'
                  name='phone'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='Twój numer telefonu'
                />
              </div>

              <div>
                <label
                  htmlFor='subject'
                  className='block text-gray-700 font-medium mb-2'
                >
                  Temat
                </label>
                <select
                  id='subject'
                  name='subject'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
                  required
                >
                  <option value=''>Wybierz temat</option>
                  <option value='rolety'>Rolety</option>
                  <option value='zaslony'>Zasłony</option>
                  <option value='firany'>Firany</option>
                  <option value='posciel'>Pościel</option>
                  <option value='other'>Inny temat</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor='message'
                  className='block text-gray-700 font-medium mb-2'
                >
                  Wiadomość
                </label>
                <textarea
                  id='message'
                  name='message'
                  rows={5}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='Twoja wiadomość'
                  required
                ></textarea>
              </div>

              <div className='flex items-start'>
                <input
                  type='checkbox'
                  id='privacy'
                  name='privacy'
                  className='mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded'
                  required
                />
                <label
                  htmlFor='privacy'
                  className='ml-2 block text-sm text-gray-700'
                >
                  Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie
                  z polityką prywatności w celu obsługi tego zapytania.
                </label>
              </div>

              <div className='text-center'>
                <button
                  type='submit'
                  className='px-8 py-3 bg-primary text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                >
                  Wyślij wiadomość
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
