import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

interface CardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  buttonText: string;
  buttonLink: string;
}

interface DualCardSectionProps {
  firstCard: CardProps;
  secondCard: CardProps;
  backgroundColor?: string;
  flowerPattern?: boolean;
  flowerImages?: string[];
}

const DualCardSectionReusable: React.FC<DualCardSectionProps> = ({
  firstCard,
  secondCard,
  backgroundColor = 'linear-gradient(135deg, #f5f0ff 0%, #f0f6ff 100%)',
  flowerPattern = true,
  flowerImages = [
    '/images/flowers/small-flower-1.png',
    '/images/flowers/small-flower-2.png',
    '/images/flowers/small-flower-3.png',
  ],
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const secondCardRef = useRef<HTMLDivElement>(null);
  const firstTextRef = useRef<HTMLDivElement>(null);
  const secondTextRef = useRef<HTMLDivElement>(null);
  const firstFrameRef = useRef<HTMLDivElement>(null);
  const secondFrameRef = useRef<HTMLDivElement>(null);
  const flowerElements = useRef<(HTMLDivElement | null)[]>([]);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Generator losowych pozycji dla kwiatów
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
    // Rejestracja ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Generowanie pozycji kwiatów tylko po stronie klienta
    const positions = generateRandomPositions();

    // Efekt paralaksy
    createParallaxEffect();

    // Animacja kwiatów
    if (
      sectionRef.current &&
      flowerElements.current.length > 0 &&
      flowerPattern
    ) {
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

    // Animacja wejścia kart
    const cardsTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    });

    cardsTimeline.fromTo(
      [firstCardRef.current, secondCardRef.current],
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

    // Animacja ramek wewnętrznych
    cardsTimeline.fromTo(
      [firstFrameRef.current, secondFrameRef.current],
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
      [firstTextRef.current, secondTextRef.current],
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

    // Czyszczenie
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [flowerPattern]);

  return (
    <section
      ref={sectionRef}
      className='dual-card-section relative py-20 overflow-hidden'
      style={{ background: backgroundColor }}
    >
      {/* Tło */}
      <div
        ref={backgroundRef}
        className='absolute inset-0 bg-gradient-to-br from-transparent to-transparent z-0'
      ></div>

      {/* Kwiaty w tle */}
      {flowerPattern &&
        Array.from({ length: 18 }).map((_, index) => (
          <div
            key={`flower-${index}`}
            ref={(el) => {
              flowerElements.current[index] = el;
            }}
            className='absolute pointer-events-none z-0'
            style={{
              backgroundImage: `url(${
                flowerImages[index % flowerImages.length]
              })`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          ></div>
        ))}

      <div className='container mx-auto px-4 relative z-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12'>
          {/* Pierwsza karta */}
          <div
            ref={firstCardRef}
            className='card-wrapper bg-white bg-opacity-90 rounded-xl overflow-hidden shadow-lg transition-all duration-500'
          >
            <div className='card h-full flex flex-col relative'>
              <div className='relative h-64 md:h-72 overflow-hidden'>
                <Image
                  src={firstCard.imageSrc}
                  alt={firstCard.imageAlt}
                  fill
                  className='object-cover transition-transform duration-700 hover:scale-105'
                />
                <div
                  ref={firstFrameRef}
                  className='absolute inset-0 border border-white border-opacity-30 m-4 rounded-md'
                ></div>
              </div>
              <div
                ref={firstTextRef}
                className='card-content p-6 flex-grow flex flex-col justify-between'
              >
                <div>
                  <h3 className='text-2xl font-light text-gray-800 mb-4'>
                    {firstCard.title}
                  </h3>
                  <p className='text-gray-600 leading-relaxed mb-6'>
                    {firstCard.description}
                  </p>
                </div>
                <div>
                  <Link
                    href={firstCard.buttonLink}
                    className='inline-flex items-center px-5 py-2 rounded-md bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color-dark)] transition-colors duration-300'
                  >
                    {firstCard.buttonText}
                    <svg
                      className='ml-2 w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M14 5l7 7m0 0l-7 7m7-7H3'
                      ></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Druga karta */}
          <div
            ref={secondCardRef}
            className='card-wrapper bg-white bg-opacity-90 rounded-xl overflow-hidden shadow-lg transition-all duration-500'
          >
            <div className='card h-full flex flex-col relative'>
              <div className='relative h-64 md:h-72 overflow-hidden'>
                <Image
                  src={secondCard.imageSrc}
                  alt={secondCard.imageAlt}
                  fill
                  className='object-cover transition-transform duration-700 hover:scale-105'
                />
                <div
                  ref={secondFrameRef}
                  className='absolute inset-0 border border-white border-opacity-30 m-4 rounded-md'
                ></div>
              </div>
              <div
                ref={secondTextRef}
                className='card-content p-6 flex-grow flex flex-col justify-between'
              >
                <div>
                  <h3 className='text-2xl font-light text-gray-800 mb-4'>
                    {secondCard.title}
                  </h3>
                  <p className='text-gray-600 leading-relaxed mb-6'>
                    {secondCard.description}
                  </p>
                </div>
                <div>
                  <Link
                    href={secondCard.buttonLink}
                    className='inline-flex items-center px-5 py-2 rounded-md bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color-dark)] transition-colors duration-300'
                  >
                    {secondCard.buttonText}
                    <svg
                      className='ml-2 w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M14 5l7 7m0 0l-7 7m7-7H3'
                      ></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dual-card-section {
          background-size: 200% 200%;
          animation: gradientAnimation 15s ease infinite;
        }

        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .card-wrapper:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
    </section>
  );
};

export default DualCardSectionReusable;
