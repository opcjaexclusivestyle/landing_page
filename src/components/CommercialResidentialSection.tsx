'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CommercialResidentialSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const commercialCardRef = useRef<HTMLDivElement>(null);
  const residentialCardRef = useRef<HTMLDivElement>(null);
  const commercialTextRef = useRef<HTMLDivElement>(null);
  const residentialTextRef = useRef<HTMLDivElement>(null);
  const commercialFrameRef = useRef<HTMLDivElement>(null);
  const residentialFrameRef = useRef<HTMLDivElement>(null);
  const flowerElements = useRef<(HTMLDivElement | null)[]>([]);

  // Generowanie losowych pozycji dla kwiatów
  const generateRandomPositions = () => {
    return Array(12)
      .fill(null)
      .map(() => ({
        width: 80 + Math.random() * 100,
        height: 80 + Math.random() * 100,
        top: Math.random() * 100,
        left: Math.random() * 100,
      }));
  };

  useEffect(() => {
    // Generowanie pozycji kwiatów tylko po stronie klienta
    const positions = generateRandomPositions();

    // Animacja kwiatów
    if (sectionRef.current && flowerElements.current.length > 0) {
      const flowers = flowerElements.current.filter(Boolean);

      flowers.forEach((flower, index) => {
        if (flower) {
          // Ustawianie początkowych pozycji
          gsap.set(flower, {
            width: positions[index].width,
            height: positions[index].height,
            top: `${positions[index].top}%`,
            left: `${positions[index].left}%`,
            opacity: 0,
            position: 'absolute',
            pointerEvents: 'none',
          });

          // Animacja wejścia
          gsap.to(flower, {
            opacity: 0.15,
            duration: 1,
            delay: index * 0.2,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      });
    }

    // Animacja wejścia kart
    const cardsTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    });

    cardsTimeline.fromTo(
      [commercialCardRef.current, residentialCardRef.current],
      {
        y: 80,
        opacity: 0,
        scale: 0.95,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
      },
    );

    // Animacja ramek wewnętrznych
    cardsTimeline.fromTo(
      [commercialFrameRef.current, residentialFrameRef.current],
      {
        opacity: 0,
        scale: 0.9,
        borderWidth: '0px',
      },
      {
        opacity: 1,
        scale: 1,
        borderWidth: '1px',
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out',
      },
      '-=1',
    );

    // Animacja tekstu w kartach
    cardsTimeline.fromTo(
      [commercialTextRef.current, residentialTextRef.current],
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
      },
      '-=0.8',
    );

    // Efekty hover dla kart
    const hoverCards = [
      {
        card: commercialCardRef.current,
        frame: commercialFrameRef.current,
        text: commercialTextRef.current,
      },
      {
        card: residentialCardRef.current,
        frame: residentialFrameRef.current,
        text: residentialTextRef.current,
      },
    ];

    hoverCards.forEach(({ card, frame, text }) => {
      if (!card || !frame || !text) return;

      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          scale: 1.02,
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          duration: 0.5,
          ease: 'power2.out',
        });

        gsap.to(frame, {
          borderColor: 'var(--gold)',
          boxShadow: 'inset 0 0 20px rgba(212, 175, 55, 0.2)',
          duration: 0.5,
        });

        gsap.to(text.querySelector('h3'), {
          color: 'var(--gold)',
          textShadow: '0 0 15px rgba(212, 175, 55, 0.3)',
          letterSpacing: '1px',
          duration: 0.5,
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
          duration: 0.5,
          ease: 'power2.out',
        });

        gsap.to(frame, {
          borderColor: 'rgba(255, 255, 255, 0.2)',
          boxShadow: 'none',
          duration: 0.5,
        });

        gsap.to(text.querySelector('h3'), {
          color: 'white',
          textShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
          letterSpacing: '0px',
          duration: 0.5,
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Usunięcie event listenerów
      hoverCards.forEach(({ card }) => {
        if (!card) return;
        card.removeEventListener('mouseenter', () => {});
        card.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className='commercial-residential-section w-full py-24 relative overflow-hidden'
      style={{
        backgroundColor: '#111111',
        backgroundImage:
          'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(20,20,20,0.9))',
      }}
    >
      {/* Dekoracyjne elementy kwiatowe */}
      {Array(12)
        .fill(null)
        .map((_, i) => (
          <div
            key={`flower-${i}`}
            ref={(el) => {
              if (el) flowerElements.current[i] = el;
            }}
          >
            <Image
              src='/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_d4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_0-removebg-preview.png'
              alt=''
              fill
              style={{
                objectFit: 'contain',
                opacity: 0.15,
                filter: 'brightness(0.4) sepia(0.3) hue-rotate(15deg)',
              }}
            />
          </div>
        ))}

      <div className='container mx-auto px-6 relative z-10 max-w-[1400px]'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16'>
          {/* Karta Commercial */}
          <Link href='/commercial'>
            <div
              ref={commercialCardRef}
              className='card-container relative h-[500px] overflow-hidden rounded-lg shadow-xl cursor-pointer'
              style={{ boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)' }}
            >
              {/* Tło */}
              <div className='absolute inset-0 bg-black/50 z-10'></div>
              <div className='absolute inset-0 overflow-hidden'>
                <Image
                  src='/images/place/comercial.jpg'
                  alt='Przestrzenie komercyjne'
                  fill
                  className='object-cover'
                  style={{ filter: 'brightness(0.7)' }}
                />
              </div>

              {/* Ramka wewnętrzna */}
              <div
                ref={commercialFrameRef}
                className='absolute inset-4 border border-white/20 rounded z-20'
              ></div>

              {/* Zawartość karty */}
              <div
                ref={commercialTextRef}
                className='absolute inset-0 z-30 flex flex-col justify-center p-10'
              >
                <div className='text-center'>
                  <h3
                    className='text-white text-4xl md:text-5xl font-serif mb-6'
                    style={{ textShadow: '0 5px 15px rgba(0, 0, 0, 0.5)' }}
                  >
                    Przestrzenie
                    <br />
                    Komercyjne
                  </h3>
                  <p className='text-white/90 text-lg max-w-md mx-auto leading-relaxed'>
                    Eleganckie zasłony i rolety zaprojektowane z myślą o
                    hotelach, restauracjach i biurach. Nasze rozwiązania łączą
                    estetykę z funkcjonalnością.
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Karta Residential */}
          <Link href='/residential'>
            <div
              ref={residentialCardRef}
              className='card-container relative h-[500px] overflow-hidden rounded-lg shadow-xl cursor-pointer'
              style={{ boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)' }}
            >
              {/* Tło */}
              <div className='absolute inset-0 bg-black/50 z-10'></div>
              <div className='absolute inset-0 overflow-hidden'>
                <Image
                  src='/images/place/residential.jpg'
                  alt='Przestrzenie mieszkalne'
                  fill
                  className='object-cover'
                  style={{ filter: 'brightness(0.7)' }}
                />
              </div>

              {/* Ramka wewnętrzna */}
              <div
                ref={residentialFrameRef}
                className='absolute inset-4 border border-white/20 rounded z-20'
              ></div>

              {/* Zawartość karty */}
              <div
                ref={residentialTextRef}
                className='absolute inset-0 z-30 flex flex-col justify-center p-10'
              >
                <div className='text-center'>
                  <h3
                    className='text-white text-4xl md:text-5xl font-serif mb-6'
                    style={{ textShadow: '0 5px 15px rgba(0, 0, 0, 0.5)' }}
                  >
                    Przestrzenie
                    <br />
                    Mieszkalne
                  </h3>
                  <p className='text-white/90 text-lg max-w-md mx-auto leading-relaxed'>
                    Spersonalizowane rozwiązania dla domów i mieszkań, które
                    odzwierciedlają indywidualny charakter każdej przestrzeni.
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Dekoracyjne elementy tła */}
      <div className='absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-30'></div>
      <div className='absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-30'></div>
    </section>
  );
};

export default CommercialResidentialSection;
