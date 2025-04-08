'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SimpleHeader from '../components/SimpleHeader';
import About from '../../components/About';
import TypesSection from '../../components/TypesSection';
import KeyFactorsSection from '../../components/KeyFactorsSection';
import CommercialResidentialSection from '../../components/CommercialResidentialSection';
import MeasuringGuide from '../../components/MeasuringGuide';
import BlindsInquiryForm from '../../components/BlindsInquiryForm';

export default function Rolety() {
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef(null);
  const descriptionRef = useRef(null);

  // Rejestracja pluginów GSAP
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Efekt animacji przy ładowaniu strony
  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(headerRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: 'power3.out',
    });

    tl.from(
      descriptionRef.current,
      {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.5',
    );
  }, []);

  return (
    <>
      {/* Używamy nowego komponentu SimpleHeader */}
      <SimpleHeader
        videoSrc='/video/curtains.mp4'
        title='ROLETY'
        subtitle='Nowoczesne rozwiązania okienne'
        description='Funkcjonalność i elegancja w jednym'
        height='60vh'
      />

      {/* Główna zawartość strony */}
      <div
        ref={contentRef}
        className='min-h-screen py-10 px-4 md:px-8 lg:px-16 bg-[var(--light-gold)]'
      >
        {/* Nagłówek z przyciskiem powrotu */}
        <div
          className='mb-12 flex justify-between items-center'
          ref={headerRef}
        >
          <Link
            href='/'
            className='text-[var(--deep-navy)] hover:text-[var(--gold)] transition-colors'
          >
            &larr; Powrót do strony głównej
          </Link>
          <h2 className='text-4xl md:text-5xl lg:text-6xl text-center luxury-heading font-light text-[var(--deep-navy)]'>
            Rolety
          </h2>
          <div className='w-[100px]'></div> {/* Pusty element dla wyrównania */}
        </div>

        <div ref={descriptionRef}>
          {/* Sekcja About */}
          <About />

          {/* Sekcja typów zasłon */}
          <TypesSection />

          {/* Sekcja kluczowych atutów */}
          <KeyFactorsSection />

          {/* Sekcja Commercial & Residential */}
          <CommercialResidentialSection />

          {/* Opis */}
          <div className='max-w-4xl mx-auto mb-16 text-center text-black'>
            <p className='text-lg md:text-xl leading-relaxed mb-6'>
              Nasze rolety to idealne połączenie funkcjonalności i nowoczesnego
              designu. Oferujemy szeroki wybór rozwiązań, które zapewnią Ci
              prywatność, kontrolę światła i elegancki wygląd Twoich okien.
            </p>
            <p className='text-lg md:text-xl leading-relaxed'>
              Od klasycznych rolet, przez systemy dzień-noc, po rozwiązania
              elektryczne - w naszej ofercie znajdziesz produkty najwyższej
              jakości, które idealnie dopasują się do Twojego wnętrza.
            </p>
          </div>

          {/* Jak mierzyć */}
          <MeasuringGuide />

          {/* Formularz zgłoszeniowy dla rolet */}
          <BlindsInquiryForm />
        </div>
      </div>
    </>
  );
}
