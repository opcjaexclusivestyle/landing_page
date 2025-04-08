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
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Ulepszony generator losowych pozycji dla kwiatów
  const generateRandomPositions = () => {
    return Array(18)
      .fill(null)
      .map((_, index) => {
        // Podziel kwiaty na 3 warstwy o różnych właściwościach
        const layer = index % 3;
        const sizeMultiplier = layer === 0 ? 1.4 : layer === 1 ? 1 : 0.7;
        const opacityBase = layer === 0 ? 0.08 : layer === 1 ? 0.12 : 0.15;

        return {
          width: (80 + Math.random() * 120) * sizeMultiplier,
          height: (80 + Math.random() * 120) * sizeMultiplier,
          top: Math.random() * 110 - 5, // Pozwala niektórym kwiatom wychodzić poza widok
          left: Math.random() * 110 - 5,
          rotation: Math.random() * 360, // Losowa rotacja
          opacity: opacityBase + Math.random() * 0.08,
          delay: Math.random() * 0.5,
          layer: layer, // 0 - najdalej, 2 - najbliżej
          image: index % 3, // Użyj różnych obrazów kwiatów
        };
      });
  };

  // Efekt paralaksy dla tła
  const createParallaxEffect = () => {
    if (backgroundRef.current && window) {
      window.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

        gsap.to(backgroundRef.current, {
          x: moveX,
          y: moveY,
          duration: 1,
          ease: 'power1.out',
        });
      });
    }
  };

  useEffect(() => {
    // Generowanie pozycji kwiatów tylko po stronie klienta
    const positions = generateRandomPositions();

    // Efekt paralaksy
    createParallaxEffect();

    // Animacja kwiatów
    if (sectionRef.current && flowerElements.current.length > 0) {
      const flowers = flowerElements.current.filter(Boolean);

      flowers.forEach((flower, index) => {
        if (flower) {
          const pos = positions[index];
          // Ustawianie początkowych pozycji
          gsap.set(flower, {
            width: pos.width,
            height: pos.height,
            top: `${pos.top}%`,
            left: `${pos.left}%`,
            opacity: 0,
            rotation: pos.rotation,
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: pos.layer,
          });

          // Animacja wejścia
          gsap.to(flower, {
            opacity: pos.opacity,
            duration: 1.2,
            delay: pos.delay,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 90%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          });

          // Delikatna animacja unoszenia się
          gsap.to(flower, {
            y: '-5px',
            duration: 3 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 2,
          });

          // Delikatna animacja rotacji dla niektórych kwiatów
          if (index % 3 === 0) {
            gsap.to(flower, {
              rotation: `+=${Math.random() * 10 - 5}`,
              duration: 10 + Math.random() * 5,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
            });
          }
        }
      });
    }

    // Gradient tła z animacją
    gsap.to(sectionRef.current, {
      backgroundPosition: '100% 100%',
      duration: 15,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Animacja wejścia kart z poprawioną płynnością
    const cardsTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    });

    cardsTimeline.fromTo(
      [commercialCardRef.current, residentialCardRef.current],
      {
        y: 100,
        opacity: 0,
        scale: 0.92,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.4,
        stagger: 0.3,
        ease: 'power3.out',
      },
    );

    // Animacja ramek wewnętrznych z poprawionym efektem
    cardsTimeline.fromTo(
      [commercialFrameRef.current, residentialFrameRef.current],
      {
        opacity: 0,
        scale: 0.85,
        borderWidth: '0px',
      },
      {
        opacity: 1,
        scale: 1,
        borderWidth: '1px',
        duration: 1.2,
        stagger: 0.3,
        ease: 'power2.out',
      },
      '-=1.2',
    );

    // Animacja tekstu w kartach
    cardsTimeline.fromTo(
      [commercialTextRef.current, residentialTextRef.current],
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.3,
        ease: 'power2.out',
      },
      '-=1',
    );

    // Ulepszone efekty hover dla kart
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
          y: -12,
          scale: 1.03,
          boxShadow:
            '0 25px 60px rgba(0, 0, 0, 0.35), 0 0 30px rgba(212, 175, 55, 0.15)',
          duration: 0.5,
          ease: 'power2.out',
        });

        gsap.to(frame, {
          borderColor: 'var(--gold)',
          boxShadow: 'inset 0 0 25px rgba(212, 175, 55, 0.25)',
          duration: 0.5,
        });

        gsap.to(text.querySelector('h3'), {
          color: 'var(--gold)',
          textShadow: '0 0 20px rgba(212, 175, 55, 0.4)',
          letterSpacing: '1.2px',
          duration: 0.5,
        });

        gsap.to(text.querySelector('p'), {
          opacity: 1,
          y: -5,
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

        gsap.to(text.querySelector('p'), {
          opacity: 0.9,
          y: 0,
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

      // Usunięcie event listenera paralaksy
      if (window) {
        window.removeEventListener('mousemove', () => {});
      }
    };
  }, []);

  // Nazwy plików obrazów kwiatów
  const flowerImages = [
    '/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_d4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_0-removebg-preview.png',
    '/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_d4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_3-removebg-preview.png',
    '/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_49aa16d2-bca9-49f0-892e-c45372365ece_3-removebg-preview.png',
  ];

  return (
    <section
      ref={sectionRef}
      className='commercial-residential-section w-full py-28 relative overflow-hidden'
      style={{
        backgroundColor: '#0e0e12',
        backgroundImage:
          'linear-gradient(135deg, rgba(5,5,10,0.95), rgba(15,15,25,0.9), rgba(10,10,18,0.93))',
        backgroundSize: '200% 200%',
        transition: 'all 0.5s ease',
      }}
    >
      {/* Tło z efektem parallax */}
      <div ref={backgroundRef} className='absolute inset-0 z-0'>
        {/* Dekoracyjne elementy kwiatowe w zwiększonej ilości i z różnymi obrazami */}
        {Array(18)
          .fill(null)
          .map((_, i) => (
            <div
              key={`flower-${i}`}
              ref={(el) => {
                if (el) flowerElements.current[i] = el;
              }}
            >
              <Image
                src={flowerImages[i % 3]}
                alt=''
                fill
                style={{
                  objectFit: 'contain',
                  filter: `brightness(${
                    0.3 + (i % 3) * 0.1
                  }) sepia(0.3) hue-rotate(${15 + (i % 4) * 5}deg)`,
                  transformOrigin: 'center center',
                }}
              />
            </div>
          ))}
      </div>

      {/* Dodatkowy efekt mgły/obłoku */}
      <div
        className='absolute inset-0 z-1 bg-gradient-radial from-transparent via-transparent to-[#0e0e12]/80'
        style={{ mixBlendMode: 'multiply' }}
      ></div>

      <div className='container mx-auto px-6 relative z-10 max-w-[1400px]'>
        <div className='text-center mb-16'>
          <h2
            className='text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6'
            style={{
              textShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              letterSpacing: '1px',
            }}
          >
            Rozwiązania dla każdej przestrzeni
          </h2>
          <div className='w-36 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent mx-auto'></div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20'>
          {/* Karta Commercial */}
          <Link href='/commercial'>
            <div
              ref={commercialCardRef}
              className='card-container relative h-[520px] overflow-hidden rounded-lg shadow-xl cursor-pointer transform transition-all duration-500'
              style={{
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
              }}
            >
              {/* Tło */}
              <div className='absolute inset-0 bg-black/50 z-10'></div>
              <div className='absolute inset-0 overflow-hidden'>
                <Image
                  src='/images/place/comercial.jpg'
                  alt='Przestrzenie komercyjne'
                  fill
                  className='object-cover transition-transform duration-700'
                  style={{
                    filter: 'brightness(0.7)',
                    transform: 'scale(1.05)',
                  }}
                />
              </div>

              {/* Ramka wewnętrzna */}
              <div
                ref={commercialFrameRef}
                className='absolute inset-5 border border-white/20 rounded-md z-20'
              ></div>

              {/* Zawartość karty */}
              <div
                ref={commercialTextRef}
                className='absolute inset-0 z-30 flex flex-col justify-center p-12'
              >
                <div className='text-center'>
                  <h3
                    className='text-white text-4xl md:text-5xl font-serif mb-8 transition-all duration-300'
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
                  <div className='mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <span className='px-6 py-2 border border-[var(--gold)] text-[var(--gold)] rounded-full hover:bg-[var(--gold)]/10 transition-all duration-300'>
                      Dowiedz się więcej
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Karta Residential */}
          <Link href='/residential'>
            <div
              ref={residentialCardRef}
              className='card-container relative h-[520px] overflow-hidden rounded-lg shadow-xl cursor-pointer transform transition-all duration-500'
              style={{
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
              }}
            >
              {/* Tło */}
              <div className='absolute inset-0 bg-black/50 z-10'></div>
              <div className='absolute inset-0 overflow-hidden'>
                <Image
                  src='/images/place/residential.jpg'
                  alt='Przestrzenie mieszkalne'
                  fill
                  className='object-cover transition-transform duration-700'
                  style={{
                    filter: 'brightness(0.7)',
                    transform: 'scale(1.05)',
                  }}
                />
              </div>

              {/* Ramka wewnętrzna */}
              <div
                ref={residentialFrameRef}
                className='absolute inset-5 border border-white/20 rounded-md z-20'
              ></div>

              {/* Zawartość karty */}
              <div
                ref={residentialTextRef}
                className='absolute inset-0 z-30 flex flex-col justify-center p-12'
              >
                <div className='text-center'>
                  <h3
                    className='text-white text-4xl md:text-5xl font-serif mb-8 transition-all duration-300'
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
                  <div className='mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <span className='px-6 py-2 border border-[var(--gold)] text-[var(--gold)] rounded-full hover:bg-[var(--gold)]/10 transition-all duration-300'>
                      Dowiedz się więcej
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Ulepszone dekoracyjne elementy tła */}
      <div className='absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-50'></div>
      <div className='absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-50'></div>
      <div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-24 bg-gradient-to-b from-[var(--gold)]/50 to-transparent opacity-30'></div>
      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-px h-24 bg-gradient-to-t from-[var(--gold)]/50 to-transparent opacity-30'></div>
    </section>
  );
};

export default CommercialResidentialSection;
