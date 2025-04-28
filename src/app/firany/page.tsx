'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SimpleHeader from '../components/SimpleHeader';
import OrderForm from '../../components/OrderForm';
import Certification from '../../components/Certification';
import MeasuringGuide from '../../components/MeasuringGuide';
import TestimonialsSection from '../../components/TestimonialsSection';
import WorkProcess from '../../components/WorkProcess';
import About from '../../components/About';
import TypesSection from '../../components/TypesSection';
import KeyFactorsSection from '../../components/KeyFactorsSection';
import CommercialResidentialSection from '../../components/CommercialResidentialSection';
export default function Firany() {
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
        title='Firany'
        subtitle='Elegancja i styl'
        description='Odkryj kolekcję luksusowych firan'
        height='60vh'
      />

      {/* Główna zawartość strony */}
      <div
        ref={contentRef}
        className='min-h-screen py-10 px-4 md:px-8 lg:px-16 bg-[var(--light-gold)]'
      >
        {/* Nagłówek z przyciskiem powrotu */}
        <div ref={headerRef} className='mb-8 flex justify-between items-center'>
          <Link
            href='/'
            className='text-gray-600 hover:text-gray-800 transition-colors duration-300 flex-1 text-left'
          >
            &larr; Powrót do strony głównej
          </Link>

          <div className='flex-1'></div>
        </div>

        <div>
          {/* Sekcja About */}
          {/* <About /> */}
          {/* Sekcja typów zasłon */}
          {/* <TypesSection /> */}

          {/* Sekcja kluczowych atutów */}
          {/* <KeyFactorsSection /> */}

          {/* Sekcja Commercial & Residential */}
          {/* <CommercialResidentialSection /> */}
          <WorkProcess />
          {/* Sekcja Testimoniali */}

          <TestimonialsSection type='firany' />

          {/* Formularz zamówienia */}
          <OrderForm />
          {/* <Certification /> */}

          {/* Jak mierzyć */}
          <MeasuringGuide />
        </div>
      </div>
    </>
  );
}
