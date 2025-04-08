'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeaderMask from '../components/HeaderMask';
import About from '@/components/About';
import TypesSection from '@/components/TypesSection';
import KeyFactorsSection from '@/components/KeyFactorsSection';
import CommercialResidentialSection from '@/components/CommercialResidentialSection';
import OrderForm from '@/components/OrderForm';
import InquiryForm from '@/components/InquiryForm';
import MeasuringGuide from '@/components/MeasuringGuide';

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
      {/* Header z animowaną maską */}
      <HeaderMask
        videoSrc='/video/curtains.mp4'
        title='ZASŁONY'
        onEnterClick={() => {}}
      />

      {/* Główna zawartość strony */}
      <div
        ref={contentRef}
        className='min-h-screen py-10 px-4 md:px-8 lg:px-16 bg-[var(--light-gold)]'
      >
        {/* Nagłówek z przyciskiem powrotu */}

        {/* Sekcja About */}
        <About />

        {/* Sekcja typów zasłon */}
        <TypesSection />

        {/* Sekcja kluczowych atutów */}
        <KeyFactorsSection />

        {/* Sekcja Commercial & Residential */}
        <CommercialResidentialSection />

        {/* Formularz zamówienia */}
        <OrderForm />

        {/* Jak mierzyć */}
        <MeasuringGuide />
      </div>
    </>
  );
}
