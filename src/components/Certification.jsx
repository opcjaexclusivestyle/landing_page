import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Certification.css';

// Rejestracja wtyczki ScrollTrigger dla GSAP
gsap.registerPlugin(ScrollTrigger);

const Certification = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const certificatesRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    // Całkowicie przepisana logika animacji

    // Tworzymy kontekst animacji, który będzie automatycznie czyszczony przy odmontowaniu
    const ctx = gsap.context(() => {
      // 1. Proste animacje wejścia bez ScrollTrigger
      gsap.set(
        [headerRef.current, certificatesRef.current, footerRef.current],
        {
          opacity: 0, // Początkowo wszystko jest niewidoczne
        },
      );

      // 2. Sekwencja animacji
      const tl = gsap.timeline({
        defaults: {
          ease: 'power2.out',
          duration: 0.8,
        },
      });

      // Animacja nagłówka
      tl.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      });

      // Animacja każdego certyfikatu osobno
      const certificateItems =
        certificatesRef.current.querySelectorAll('.certificate-item');
      tl.to(
        certificatesRef.current.querySelector('.certificates-label'),
        {
          opacity: 1,
          duration: 0.5,
        },
        '-=0.3',
      );

      // Animuj każdy certyfikat z opóźnieniem
      tl.to(
        certificateItems,
        {
          opacity: 1,
          y: 0,
          stagger: 0.2, // Opóźnienie między kolejnymi elementami
        },
        '-=0.2',
      );

      // Na końcu animuj stopkę
      tl.to(
        footerRef.current,
        {
          opacity: 1,
          y: 0,
        },
        '-=0.2',
      );

      // 3. Niezależna animacja kwiatków
      gsap.to('.flower-decoration', {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.2,
      });

      // 4. Dodatkowe zabezpieczenie - ustaw wszystko jako widoczne po 5 sekundach
      const safetyTimeout = setTimeout(() => {
        gsap.set(
          [
            headerRef.current,
            certificatesRef.current,
            certificatesRef.current.querySelectorAll('.certificate-item'),
            certificatesRef.current.querySelector('.certificates-label'),
            footerRef.current,
          ],
          {
            opacity: 1,
            y: 0,
            clearProps: 'transform,opacity', // Usuń wszystkie właściwości GSAP
          },
        );
      }, 5000);

      return () => clearTimeout(safetyTimeout);
    }, sectionRef); // Podajemy referencję sekcji jako kontekst

    // Funkcja czyszcząca
    return () => ctx.revert(); // Automatycznie czyści wszystkie animacje GSAP
  }, []);

  return (
    <section className='quality-section' ref={sectionRef}>
      <div className='flower-decoration flower-top-left'></div>
      <div className='flower-decoration flower-top-right'></div>
      <div className='flower-decoration flower-bottom-left'></div>
      <div className='flower-decoration flower-bottom-right'></div>

      <div
        className='quality-header'
        ref={headerRef}
        style={{ opacity: 0, transform: 'translateY(20px)' }}
      >
        <h2>Gwarancja Najwyższej Jakości</h2>
        <p>
          Nasze firany i zasłony to synonim najwyższej jakości i polskiego
          rzemiosła. Każdy produkt przechodzi rygorystyczną kontrolę jakości,
          aby zapewnić naszym klientom tylko najlepsze wyroby tekstylne do ich
          domów.
        </p>
      </div>

      <div className='certificates-grid' ref={certificatesRef}>
        <div className='certificates-label' style={{ opacity: 0 }}>
          <h3>Nasze Certyfikaty</h3>
          <div className='flower-label-decoration'></div>
        </div>

        <div className='certificates-container'>
          <div
            className='certificate-item'
            style={{ opacity: 0, transform: 'translateY(20px)' }}
          >
            <div className='certificate-icon'>
              <div className='poland-shape'></div>
            </div>
            <h3>Produkt Polski</h3>
            <p>
              Wszystkie nasze firany są produkowane w polskich szwalniach przez
              doświadczonych rzemieślników, co gwarantuje najwyższą jakość
              wykonania i wsparcie lokalnej gospodarki.
            </p>
          </div>

          <div
            className='certificate-item'
            style={{ opacity: 0, transform: 'translateY(20px)' }}
          >
            <div className='certificate-icon'>
              <div className='warranty-card'>
                <div className='warranty-card-text'>GWARANCJA JAKOŚCI</div>
                <div className='warranty-seal'></div>
              </div>
            </div>
            <h3>Pisemna Gwarancja Jakości</h3>
            <p>
              Do każdego zakupionego produktu dołączamy pisemną gwarancję z
              pieczęcią, potwierdzającą autentyczność i jakość naszych wyrobów
              oraz dającą pewność satysfakcji.
            </p>
          </div>

          <div
            className='certificate-item'
            style={{ opacity: 0, transform: 'translateY(20px)' }}
          >
            <div className='certificate-icon'>
              <div className='eco-icon'></div>
            </div>
            <h3>Certyfikat OEKO-TEX</h3>
            <p>
              Nasze produkty są wolne od szkodliwych substancji chemicznych i
              przebadane pod kątem bezpieczeństwa dla zdrowia człowieka, co
              potwierdza międzynarodowy certyfikat OEKO-TEX.
            </p>
          </div>
        </div>
      </div>

      <div
        className='quality-footer'
        ref={footerRef}
        style={{ opacity: 0, transform: 'translateY(20px)' }}
      >
        <a href='#kontakt' className='btn'>
          Dowiedz się więcej o naszych certyfikatach
        </a>
      </div>
    </section>
  );
};

export default Certification;
