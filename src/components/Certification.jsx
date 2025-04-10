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

  useEffect(() => {
    // Prosta animacja bez zbędnych efektów
    const ctx = gsap.context(() => {
      // Opóźnione uruchomienie animacji, aby dać przeglądarce czas na renderowanie
      const tl = gsap.timeline({
        defaults: {
          ease: 'power2.out',
          duration: 0.5,
        },
      });

      // Animacja nagłówka sekcji
      tl.fromTo(headerRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0 });

      // Animacja etykiety certyfikatów
      tl.fromTo(
        certificatesRef.current.querySelector('.certificates-label'),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0 },
        '-=0.2', // Lekkie nałożenie na poprzednią animację
      );

      // Animacja elementów certyfikatów - każdy osobno ale z małym opóźnieniem
      const certificateItems =
        certificatesRef.current.querySelectorAll('.certificate-item');
      tl.fromTo(
        certificateItems,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1, // Krótki czas między elementami
        },
        '-=0.2',
      );

      // Animacja kwiatków - bardzo delikatna
      gsap.to('.flower-decoration', {
        y: -3,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className='quality-section' ref={sectionRef}>
      <div className='flower-decoration flower-top-left'></div>
      <div className='flower-decoration flower-top-right'></div>
      <div className='flower-decoration flower-bottom-left'></div>
      <div className='flower-decoration flower-bottom-right'></div>

      <div className='quality-header' ref={headerRef}>
        <h2>Gwarancja Najwyższej Jakości</h2>
        <p>
          Nasze firany i zasłony to synonim najwyższej jakości i polskiego
          rzemiosła. Każdy produkt przechodzi rygorystyczną kontrolę jakości,
          aby zapewnić naszym klientom tylko najlepsze wyroby tekstylne do ich
          domów.
        </p>
      </div>

      <div className='certificates-grid' ref={certificatesRef}>
        <div className='certificates-label'>
          <h3>Nasze Certyfikaty</h3>
          <div className='flower-label-decoration'></div>
        </div>

        <div className='certificates-container'>
          <div className='certificate-item'>
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

          <div className='certificate-item'>
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

          <div className='certificate-item'>
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
    </section>
  );
};

export default Certification;
