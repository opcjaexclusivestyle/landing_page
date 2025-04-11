'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function MainPageNavigation() {
  const containerRef = useRef(null);
  const curtainSectionRef = useRef(null);
  const blindSectionRef = useRef(null);
  const curtainsSectionRef = useRef(null);
  const beddingSectionRef = useRef(null);

  // Hook do sprawdzania czy widok jest mobilny
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Efekt dla animacji paneli przy przewijaniu
  useEffect(() => {
    const panels = document.querySelectorAll('.panel-section');

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

  return (
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
            Klasyczna elegancja i niepowtarzalny charakter dla Twojego wnętrza.
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
            src='/images/kitchen.jpg'
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
            src='/images/posciel.png'
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
            src='/images/Rolety.jpg'
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
  );
}
