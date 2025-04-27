'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Power3, Power2, Power4, Back, Elastic, Expo } from 'gsap';

interface AnimatedRoletySectionProps {
  onSelectType: (type: string) => void;
}

interface ProductData {
  id: string;
  title: string;
  imageSrc: string;
  tags: string[];
  description: string;
}

const products: ProductData[] = [
  {
    id: 'rzymskie',
    title: 'Rolety rzymskie',
    imageSrc: '/images/rolety/Roleta rzymska.png',
    tags: ['nowoczesność', 'wygoda', 'elegancja'],
    description:
      'Eleganckie rozwiązanie, które łączy funkcjonalność rolet z miękkością tkanin.',
  },
  {
    id: 'plisowane',
    title: 'Rolety plisowane',
    imageSrc: '/images/rolety/Roleta plisowana.png',
    tags: ['prywatność', 'design', 'komfort'],
    description:
      'Idealne do okien o nietypowych kształtach, zapewniające pełną kontrolę światła.',
  },
  {
    id: 'zaslony',
    title: 'Zasłony',
    imageSrc: '/images/Firany.jpg',
    tags: ['klimat', 'dekoracja', 'funkcjonalność'],
    description: 'Klasyczne rozwiązanie, które doda elegancji każdemu wnętrzu.',
  },
];

const AnimatedRoletySection: React.FC<AnimatedRoletySectionProps> = ({
  onSelectType,
}) => {
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const tilesContainerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const detailsRef = useRef<HTMLDivElement>(null);
  const decorationRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Rejestracja potrzebnych pluginów GSAP
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, MotionPathPlugin);

      // Sprawdzenie, czy ScrollTrigger jest poprawnie zainicjalizowany
      if (!ScrollTrigger) {
        console.error('ScrollTrigger nie został zainicjalizowany poprawnie');
        return;
      }
    }
  }, []);

  // Inicjalizacja głównych animacji sekcji (bez kafelków)
  useEffect(() => {
    if (
      !sectionRef.current ||
      !headingRef.current ||
      !subheadingRef.current ||
      !ctaRef.current ||
      !decorationRef.current
    )
      return;

    // Resetowanie ScrollTriggerów przed utworzeniem nowych
    ScrollTrigger.getAll().forEach((t) => t.kill());

    const ctx = gsap.context(() => {
      // Główna animacja wejściowa
      timelineRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'center center',
          toggleActions: 'play none none none',
          id: 'main-section-trigger',
          onEnter: () => console.log('Rolety section entered viewport'),
        },
        onComplete: () =>
          console.log('Rolety section main animation completed'),
      });

      // Efekt paralaksy dla tła
      gsap.to('.paralax-bg', {
        y: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
          id: 'parallax-bg-trigger',
        },
      });

      // Animacja nagłówków z efektem splitText
      if (headingRef.current && subheadingRef.current) {
        timelineRef.current.from(
          headingRef.current.children,
          {
            opacity: 0,
            y: 60,
            skewY: 5,
            stagger: 0.06,
            ease: Power4.easeOut,
            duration: 1,
          },
          0,
        );
        timelineRef.current.from(
          subheadingRef.current,
          {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: Power3.easeOut,
          },
          0.3,
        );
      }

      // Animacja przycisku CTA
      if (ctaRef.current) {
        timelineRef.current.from(
          ctaRef.current,
          {
            scale: 0.8,
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: Back.easeOut.config(2),
          },
          0.6,
        );
      }

      // Animacja elementów dekoracyjnych
      if (decorationRef.current) {
        const decorElements =
          decorationRef.current.querySelectorAll('.decor-element');
        decorElements.forEach((element, index) => {
          gsap.set(element, {
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100,
            rotation: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.5,
            opacity: 0,
          });
          gsap.to(element, {
            opacity: 0.15 + Math.random() * 0.1,
            scale: 0.8 + Math.random() * 0.5,
            duration: 2 + Math.random() * 1.5,
            delay: 0.8 + index * 0.15,
            ease: Power2.easeInOut,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
              id: `decor-appear-${index}`,
            },
          });
          gsap.to(element, {
            motionPath: {
              path: [
                {
                  x: '+=' + (Math.random() * 40 - 20),
                  y: '+=' + (Math.random() * 40 - 20),
                },
                {
                  x: '+=' + (Math.random() * 40 - 20),
                  y: '+=' + (Math.random() * 40 - 20),
                },
                {
                  x: '+=' + (Math.random() * 40 - 20),
                  y: '+=' + (Math.random() * 40 - 20),
                },
              ],
              curviness: 1.5,
            },
            rotation: '+=' + (Math.random() * 180 - 90),
            duration: 20 + Math.random() * 15,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        });
      }
    }, sectionRef);

    // Cleanup dla głównego hooka
    return () => {
      console.log('Cleaning up main section animations');
      ctx.revert();
    };
  }, [sectionRef, headingRef, subheadingRef, ctaRef, decorationRef]);

  // Dedykowana animacja dla kafelków przy scrollu
  useEffect(() => {
    // Poczekaj aż kafelki zostaną wyrenderowane i refy będą dostępne
    if (!tilesContainerRef.current) return;

    const tiles = Array.from(tileRefs.current.values()).filter(
      Boolean,
    ) as HTMLDivElement[];

    if (tiles.length === 0) {
      console.warn(
        'Brak kafelków do animacji. Upewnij się, że są renderowane.',
      );
      return;
    }

    const ctx = gsap.context(() => {
      console.log(`Animating ${tiles.length} tiles`);
      tiles.forEach((tile, index) => {
        if (!tile) return;

        // Ustawienie stanu początkowego ale z opacity 1, żeby kafelki były widoczne nawet gdy animacja nie zadziała
        gsap.set(tile, { opacity: 1, y: 0, scale: 1, rotation: 0 });

        gsap.fromTo(
          tile,
          { opacity: 0.3, y: 50, scale: 0.95, rotation: -2 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 1.2,
            ease: Expo.easeOut,
            scrollTrigger: {
              trigger: tilesContainerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reset',
              id: `tile-trigger-${index}`,
              onEnter: () => console.log(`Tile ${index} entered`),
            },
            delay: index * 0.1,
          },
        );
      });
    }, tilesContainerRef);

    // Cleanup dla animacji kafelków
    return () => {
      console.log('Cleaning up tile animations');
      ctx.revert();
    };
  }, [products.length]);

  // Obsługa interakcji z kafelkami
  useEffect(() => {
    const ctx = gsap.context(() => {
      tileRefs.current.forEach((tile, id) => {
        if (!tile) return;

        // Usunięcie starych listenerów przed dodaniem nowych
        const newTile = tile.cloneNode(true) as HTMLDivElement;
        if (tile.parentNode) {
          tile.parentNode.replaceChild(newTile, tile);
          tileRefs.current.set(id, newTile);
        }

        // Dodanie nowych listenerów
        newTile.addEventListener('mouseenter', () => {
          setHoveredTile(id);

          gsap.to(newTile, {
            scale: 1.05,
            y: -10,
            rotation: 0,
            opacity: 1,
            boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
            duration: 0.4,
            ease: 'power2.out',
          });

          // Animacja tagów
          const tags = newTile.querySelectorAll('.tag');
          gsap.to(tags, {
            scale: 1.1,
            backgroundColor: 'rgba(255, 255, 255, 0.35)',
            color: 'white',
            stagger: 0.05,
            duration: 0.3,
          });

          // Animacja ikony
          const icon = newTile.querySelector('.tile-icon');
          if (icon) {
            gsap.to(icon, {
              scale: 1.2,
              rotate: '0deg',
              duration: 0.4,
              ease: 'back.out',
            });
          }
        });

        newTile.addEventListener('mouseleave', () => {
          setHoveredTile(null);

          gsap.to(newTile, {
            scale: 1,
            y: 0,
            rotation: -3,
            opacity: 0.95,
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
            duration: 0.4,
            ease: 'power2.out',
          });

          // Powrót tagów do stanu początkowego
          const tags = newTile.querySelectorAll('.tag');
          gsap.to(tags, {
            scale: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            duration: 0.3,
            stagger: 0.03,
          });

          // Animacja ikony powrót
          const icon = newTile.querySelector('.tile-icon');
          if (icon) {
            gsap.to(icon, {
              scale: 1,
              rotate: '15deg',
              duration: 0.3,
              ease: 'power1.out',
            });
          }
        });

        newTile.addEventListener('click', () => {
          const productId = id;
          handleProductSelect(productId);
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [products]);

  // Obsługa wyboru produktu
  const handleProductSelect = (productId: string) => {
    setSelectedTile(productId);
    setIsExpanded(true);
    onSelectType(productId);

    // Animacja rozwinięcia szczegółów
    if (detailsRef.current) {
      gsap.fromTo(
        detailsRef.current,
        { height: 0, opacity: 0 },
        {
          height: 'auto',
          opacity: 1,
          duration: 0.7,
          ease: Power2.easeOut,
          onComplete: () => {
            // Scroll do detali
            if (detailsRef.current) {
              gsap.to(window, {
                scrollTo: {
                  y: detailsRef.current,
                  offsetY: 50,
                },
                duration: 0.8,
                ease: Power2.easeInOut,
              });
            }
          },
        },
      );
    }
  };

  // Zamknięcie szczegółów produktu
  const closeDetails = () => {
    if (detailsRef.current) {
      gsap.to(detailsRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: Power2.easeIn,
        onComplete: () => {
          setIsExpanded(false);
          setSelectedTile(null);
        },
      });
    }
  };

  // Funkcja do bezpiecznego przypisywania referencji
  const setTileRef = (el: HTMLDivElement | null, id: string): void => {
    if (el) {
      console.log(`Setting ref for tile: ${id}`);
      tileRefs.current.set(id, el);
    }
  };

  // Pozyskanie danych wybranego produktu
  const selectedProduct = selectedTile
    ? products.find((product) => product.id === selectedTile)
    : null;

  return (
    <section
      ref={sectionRef}
      className='pt-20 pb-24 relative overflow-hidden bg-gradient-to-b from-white to-gray-50'
      id='rolety-section'
    >
      {/* Tło z efektem paralaksy */}
      <div className='paralax-bg absolute top-0 left-0 w-full h-full opacity-20 z-0 pointer-events-none'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-80'></div>
        <div className='grid grid-cols-10 grid-rows-8 h-full w-full'>
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} className='border border-gray-100 opacity-30'></div>
          ))}
        </div>
      </div>

      {/* Elementy dekoracyjne */}
      <div
        ref={decorationRef}
        className='absolute inset-0 overflow-hidden pointer-events-none z-0'
      >
        <div className='decor-element absolute top-20 left-[10%] w-28 h-28 opacity-0 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full blur-sm'></div>
        <div className='decor-element absolute top-[30%] right-[15%] w-24 h-24 opacity-0 bg-gradient-to-br from-amber-100 to-yellow-50 rounded-full blur-sm'></div>
        <div className='decor-element absolute bottom-[20%] left-[20%] w-32 h-32 opacity-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full blur-sm'></div>
        <div className='decor-element absolute bottom-[25%] right-[25%] w-20 h-20 opacity-0 bg-gradient-to-br from-pink-100 to-pink-50 rounded-full blur-sm'></div>
        <div className='decor-element absolute top-[50%] left-[40%] w-16 h-16 opacity-0 bg-gradient-to-br from-green-100 to-green-50 rounded-full blur-sm'></div>
        <div className='decor-element absolute top-[60%] right-[5%] w-36 h-36 opacity-0 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full blur-md'></div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='text-center mb-16'>
          <h2
            ref={headingRef}
            className='text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-purple-700 mb-4'
          >
            <span>Odkryj</span> <span>idealne</span> <span>rozwiązania</span>{' '}
            <span>dla</span> <span>Twojego</span> <span>domu</span>
          </h2>
          <p
            ref={subheadingRef}
            className='mt-4 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'
          >
            Profesjonalne systemy osłonowe, które łączą elegancję z
            funkcjonalnością, zaprojektowane z myślą o Twoim komforcie
          </p>

          <div ref={ctaRef} className='mt-8 inline-block'>
            <button
              className='px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg transform transition-all hover:scale-105 active:scale-95 hover:shadow-xl'
              onClick={() => {
                const element = document.getElementById('kontakt-section');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Skontaktuj się z nami
            </button>
          </div>
        </div>

        <div
          ref={tilesContainerRef}
          className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'
        >
          {products.map((product) => (
            <div
              key={product.id}
              ref={(el) => setTileRef(el, product.id)}
              onClick={() => handleProductSelect(product.id)}
              className={`tile-item relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-colors duration-300 group h-96 transform perspective-1000 ${
                hoveredTile === product.id ? 'z-10' : 'z-0'
              }`}
              style={{ opacity: 1 }}
              aria-label={`Wybierz ${product.title}`}
            >
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 transition-opacity duration-400 group-hover:from-black/90 group-hover:via-black/50'></div>

              <div className='tile-icon absolute top-5 right-5 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center z-20 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110'>
                <svg
                  className='w-5 h-5 text-white opacity-80 group-hover:opacity-100 transition-opacity'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 7l5 5m0 0l-5 5m5-5H6'
                  ></path>
                </svg>
              </div>

              <div className='absolute inset-0 overflow-hidden rounded-2xl'>
                <Image
                  src={product.imageSrc}
                  alt={product.title}
                  fill
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                  quality={85}
                  priority={product.id === 'rzymskie'}
                  className='object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105'
                />
              </div>

              <div className='absolute inset-x-0 bottom-0 p-5 z-20'>
                <div className='transform transition-transform duration-400 ease-out group-hover:translate-y-[-10px]'>
                  <h3 className='text-xl font-semibold text-white mb-1 drop-shadow-md'>
                    {product.title}
                  </h3>
                  <p className='text-white/80 text-sm mb-3 line-clamp-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                    {product.description}
                  </p>
                  <div className='flex flex-wrap gap-x-2 gap-y-1'>
                    {product.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className='tag px-2.5 py-0.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-xs transition-all duration-300 group-hover:bg-white/20 group-hover:text-white'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Szczegóły wybranego produktu */}
        {selectedTile && (
          <div
            ref={detailsRef}
            className='mt-12 bg-white rounded-2xl overflow-hidden shadow-xl opacity-0 h-0'
          >
            <div className='relative p-6 md:p-8'>
              <button
                onClick={closeDetails}
                className='absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors'
                aria-label='Zamknij szczegóły'
              >
                <svg
                  className='w-6 h-6 text-gray-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  ></path>
                </svg>
              </button>

              <div className='flex flex-col md:flex-row gap-8'>
                <div className='md:w-1/2 rounded-xl overflow-hidden'>
                  {selectedProduct && (
                    <Image
                      src={selectedProduct.imageSrc}
                      alt={selectedProduct.title}
                      width={800}
                      height={600}
                      className='w-full h-[300px] md:h-[400px] object-cover rounded-xl'
                    />
                  )}
                </div>

                <div className='md:w-1/2'>
                  {selectedProduct && (
                    <>
                      <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                        {selectedProduct.title}
                      </h3>
                      <p className='text-gray-600 mb-6'>
                        {selectedProduct.description}
                      </p>

                      <div className='mb-6'>
                        <h4 className='font-semibold text-gray-900 mb-2'>
                          Cechy produktu:
                        </h4>
                        <ul className='space-y-2'>
                          <li className='flex items-center'>
                            <svg
                              className='w-5 h-5 text-green-500 mr-2'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M5 13l4 4L19 7'
                              ></path>
                            </svg>
                            Wykonane z najwyższej jakości materiałów
                          </li>
                          <li className='flex items-center'>
                            <svg
                              className='w-5 h-5 text-green-500 mr-2'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M5 13l4 4L19 7'
                              ></path>
                            </svg>
                            Precyzyjna kontrola światła w pomieszczeniu
                          </li>
                          <li className='flex items-center'>
                            <svg
                              className='w-5 h-5 text-green-500 mr-2'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M5 13l4 4L19 7'
                              ></path>
                            </svg>
                            Łatwy montaż i prosta obsługa
                          </li>
                          <li className='flex items-center'>
                            <svg
                              className='w-5 h-5 text-green-500 mr-2'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M5 13l4 4L19 7'
                              ></path>
                            </svg>
                            Możliwość dopasowania do indywidualnych potrzeb
                          </li>
                        </ul>
                      </div>

                      <div className='flex flex-wrap gap-2 mb-6'>
                        {selectedProduct.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className='px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm'
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button
                        className='w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors'
                        onClick={() => {
                          onSelectType(selectedProduct.id);
                          // Scroll do sekcji z formularzem
                          const element =
                            document.getElementById('kontakt-section');
                          if (element)
                            element.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Zapytaj o wycenę
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AnimatedRoletySection;
