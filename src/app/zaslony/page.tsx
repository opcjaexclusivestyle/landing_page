'use client';
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SimpleHeader from '../components/SimpleHeader';
import OrderForm from '@/components/OrderForm';
import Certification from '../../components/Certification';
import MeasuringGuide from '@/components/MeasuringGuide';
import TestimonialsSection from '@/components/TestimonialsSection';
// import WorkProcess from '@/components/WorkProcess';
import WorkProcessArtistic from '@/components/WorkProcessArtistic';

export default function Zaslony() {
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const contentElement = contentRef.current;
    const headerElement = headerRef.current;

    const handleScroll = () => {
      if (!contentElement || !headerElement) return;

      const scrollPosition = window.scrollY;
      const contentOffsetTop = contentElement.offsetTop;

      // Gdy scrollujemy poniżej contentu, dodajemy cień do nagłówka
      if (scrollPosition > contentOffsetTop) {
        headerElement.classList.add('shadow-md');
        headerElement.classList.add('bg-white');
        headerElement.classList.add('sticky');
        headerElement.classList.add('top-0');
        headerElement.classList.add('z-10');
      } else {
        headerElement.classList.remove('shadow-md');
        headerElement.classList.remove('bg-white');
        headerElement.classList.remove('sticky');
        headerElement.classList.remove('top-0');
        headerElement.classList.remove('z-10');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Używamy nowego komponentu SimpleHeader */}
      <SimpleHeader
        videoSrc='/video/curtains.mp4'
        title='Zasłony'
        subtitle='Elegancja i styl'
        description='Odkryj kolekcję luksusowych zasłon'
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
            className='text-gray-600 hover:text-gray-800 transition-colors duration-300'
          >
            &larr; Powrót do strony głównej
          </Link>
          <div className='w-[100px]'></div> {/* Pusty element dla wyrównania */}
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
          <WorkProcessArtistic />
          {/* Sekcja Testimoniali */}
          <TestimonialsSection type='zaslony' />

          {/* Formularz zamówienia */}
          <OrderForm productType='zaslony' />
          {/* <Certification /> */}

          {/* Jak mierzyć */}
          <MeasuringGuide />
        </div>
      </div>
    </>
  );
}
