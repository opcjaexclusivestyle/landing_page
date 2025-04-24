'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import SellingCard, { Card } from './SellingCard';

interface Product {
  id: number;
  image: string;
  alt: string;
  description: string;
  example: string;
  price: string;
}

const NewProductsSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const titleInnerRef = useRef(null);
  const textRef = useRef(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const sectionBgRef = useRef(null);
  const decorativeElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Dane produktów - warto przenieść do osobnego pliku w przyszłości
  const products: Product[] = [
    {
      id: 1,
      image: '/images/curtains/curtain-1.jpg',
      alt: 'Zasłona roślinna',
      description:
        'Zasłona z tkaniny w elegancki roślinny wzór z połyskującą nicią i efektem 3D, kolor turkusowy, złoty',
      example: '140×250 cm, taśma 5 cm, kolor turkusowy, złoty',
      price: '563,25 zł',
    },
    {
      id: 2,
      image: '/images/curtains/curtain-2.jpg',
      alt: 'Zasłona pepitka złota',
      description:
        'Zasłona z eleganckiej tkaniny z efektem 3D i połyskującym wzorem w pepitkę, kolor złoty',
      example: '140×250 cm, taśma 5 cm, kolor złoty',
      price: '459,50 zł',
    },
    {
      id: 3,
      image: '/images/curtains/curtain-3.jpg',
      alt: 'Zasłona miętowa',
      description:
        'Zasłona z eleganckiej tkaniny z efektem 3D i połyskującym wzorem w pepitkę, kolor miętowy, złoty',
      example: '140×250 cm, taśma 5 cm, kolor miętowy, złoty',
      price: '459,50 zł',
    },
  ];

  // Konwertujemy produkty na format karty
  const convertToCards = (products: Product[]): Card[] => {
    return products.map((product) => ({
      id: product.id,
      title: product.alt,
      description: product.description,
      image: product.image,
      price: parseFloat(product.price.replace(',', '.').replace(' zł', '')),
      buttonText: 'Zamów',
      additionalInfo: product.example,
    }));
  };

  // Rejestracja pluginów GSAP
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

    // Utworzenie timeline dla całej sekcji
    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        toggleActions: 'play none none reverse',
        onEnter: () => setIsVisible(true),
        onLeave: () => setIsVisible(false),
        onEnterBack: () => setIsVisible(true),
        onLeaveBack: () => setIsVisible(false),
      },
    });

    // Przygotowanie tytułu
    const tytul = 'Nowości — Zasłony szyte na wymiar';

    // Ustawienie początkowego stanu tytułu
    gsap.set(titleInnerRef.current, {
      opacity: 0,
      y: 20,
    });

    // Uproszczona animacja tytułu
    const titleTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    titleTimeline.to(titleInnerRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
    });

    // Efektowna przemiana tła
    gsap.fromTo(
      sectionBgRef.current,
      {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        backgroundImage: 'none',
      },
      {
        backgroundColor: 'rgba(10, 10, 24, 0.97)',
        backgroundImage:
          'url(/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_49aa16d2-bca9-49f0-892e-c45372365ece_3-removebg-preview.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        duration: 1.5,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'top 20%',
          scrub: true,
        },
      },
    );

    // Efekt parallax dla całej sekcji
    gsap.to(sectionRef.current, {
      backgroundPositionY: '20%',
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
      },
    });

    // Animacja elementów dekoracyjnych
    decorativeElementsRef.current.forEach((element, index) => {
      if (element) {
        // Sprawdzamy, czy element jest cząsteczką
        if (element.classList.contains('particle')) {
          // Specjalna animacja dla cząsteczek pyłu/blasku
          gsap.fromTo(
            element,
            {
              opacity: 0,
              scale: 0.5,
            },
            {
              opacity: () => Math.random() * 0.7 + 0.3, // Losowa przezroczystość
              scale: () => Math.random() * 0.5 + 0.8,
              duration: 2,
              delay: Math.random() * 3, // Losowe opóźnienie
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            },
          );

          // Animacja "pływania" cząsteczek
          gsap.to(element, {
            x: `random(-100, 100)`,
            y: `random(-100, 100)`,
            duration: () => Math.random() * 10 + 15, // Losowy czas trwania animacji
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: Math.random() * 5,
          });
        }
        // Specjalna animacja dla efektów kurtyn
        else if (
          element.parentElement &&
          element.parentElement.classList.contains('overflow-hidden')
        ) {
          gsap.fromTo(
            element,
            {
              opacity: 0,
              x: element.parentElement.classList.contains('left-0')
                ? -100
                : 100,
              y: -50,
              scale: 0.5,
            },
            {
              opacity: 0.8,
              x: 0,
              y: 0,
              scale: 1,
              duration: 2.5,
              delay: 0.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 70%',
                toggleActions: 'play none none reverse',
              },
            },
          );

          // Dodatkowa animacja "falowania" kurtyn
          gsap.to(element, {
            y: 'random(-20, 20)',
            x: element.parentElement.classList.contains('left-0')
              ? 'random(-30, 10)'
              : 'random(-10, 30)',
            rotation: element.parentElement.classList.contains('left-0')
              ? 'random(-5, 5)'
              : 'random(-5, 5)',
            scale: 'random(0.95, 1.05)',
            duration: 8,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }
        // Standardowa animacja dla pozostałych elementów dekoracyjnych
        else {
          gsap.fromTo(
            element,
            {
              opacity: 0,
              scale: 0.5,
              y: index % 2 === 0 ? 50 : -50,
              rotation: index % 2 === 0 ? -15 : 15,
            },
            {
              opacity: 0.9,
              scale: 1,
              y: 0,
              rotation: 0,
              duration: 1.2,
              delay: 0.1 * index,
              ease: 'elastic.out(1, 0.75)',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 70%',
                toggleActions: 'play none none reverse',
              },
            },
          );

          // Dodajemy animację pływania elementów
          gsap.to(element, {
            y: index % 2 === 0 ? '+=20' : '-=20',
            x: index % 3 === 0 ? '+=15' : '-=15',
            rotation: index % 2 === 0 ? '-=5' : '+=5',
            duration: 3 + index,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }
      }
    });

    // Animacja paragrafów tekstowych - bardziej dramatyczne pojawianie się i zmiana koloru
    paragraphsRef.current.forEach((paragraph, index) => {
      if (paragraph) {
        // Animacja pojawiania się paragrafu
        gsap.fromTo(
          paragraph,
          {
            y: 40,
            opacity: 0,
            scale: 0.95,
            filter: 'blur(5px)',
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            delay: 0.7 + index * 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: textRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          },
        );

        // Animacja zmiany koloru tekstu - bardziej dramatyczna
        gsap.fromTo(
          paragraph,
          { color: '#6b7280' }, // Ciemniejszy szary (gray-500)
          {
            color: '#ffffff', // Biały kolor końcowy na ciemnym tle
            duration: 1.5,
            ease: 'power1.inOut',
            scrollTrigger: {
              trigger: paragraph,
              start: 'top 70%',
              end: 'top 40%',
              scrub: true,
            },
          },
        );

        // Dodatkowa animacja lekkiego powiększenia przy scrollowaniu
        gsap.fromTo(
          paragraph,
          { scale: 0.98 },
          {
            scale: 1.02,
            duration: 1,
            scrollTrigger: {
              trigger: paragraph,
              start: 'top 60%',
              end: 'top 30%',
              scrub: true,
            },
          },
        );
      }
    });

    // Animacja kart produktów - bardziej efektowne wejście
    cardsRef.current.forEach((card, index) => {
      if (card) {
        // Główna animacja karty
        gsap.fromTo(
          card,
          {
            y: 120,
            opacity: 0,
            rotationY: -15,
            scale: 0.9,
            transformOrigin: 'center bottom',
          },
          {
            y: 0,
            opacity: 1,
            rotationY: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            delay: 0.3 + index * 0.25,
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          },
        );

        // Dodajmy delikatny efekt paralaksy do kart
        gsap.fromTo(
          card,
          { y: 0 },
          {
            y: -30,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );

        // Bardziej efektowna animacja hover dla kart
        const image = card.querySelector('.card-image');
        const cardContent = card.querySelector('.card-content');
        const priceTag = card.querySelector('.price-tag');

        if (image) {
          // Animacja obrazu na hover
          card.addEventListener('mouseenter', () => {
            gsap.to(image, {
              scale: 1.15,
              filter: 'brightness(1.1) saturate(1.2)',
              duration: 0.5,
              ease: 'power2.out',
            });

            if (cardContent) {
              gsap.to(cardContent, {
                y: -10,
                duration: 0.4,
                ease: 'power1.out',
              });
            }

            if (priceTag) {
              gsap.to(priceTag, {
                scale: 1.1,
                color: '#f59e0b',
                duration: 0.3,
              });
            }
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(image, {
              scale: 1,
              filter: 'brightness(1) saturate(1)',
              duration: 0.5,
              ease: 'power2.out',
            });

            if (cardContent) {
              gsap.to(cardContent, {
                y: 0,
                duration: 0.4,
                ease: 'power1.out',
              });
            }

            if (priceTag) {
              gsap.to(priceTag, {
                scale: 1,
                color: '#111827',
                duration: 0.3,
              });
            }
          });
        }
      }
    });

    // Cleanup funkcji ScrollTrigger
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Funkcja do dodawania kart do referencji
  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  // Funkcja do dodawania paragrafów do referencji
  const addToParagraphRefs = (el: HTMLParagraphElement | null) => {
    if (el && !paragraphsRef.current.includes(el)) {
      paragraphsRef.current.push(el);
    }
  };

  // Funkcja do dodawania elementów dekoracyjnych do referencji
  const addToDecorativeRefs = (el: HTMLDivElement | null) => {
    if (el && !decorativeElementsRef.current.includes(el)) {
      decorativeElementsRef.current.push(el);
    }
  };

  return (
    <section
      ref={sectionRef}
      className='min-h-screen relative py-32 overflow-hidden transition-all duration-1000'
      id='nowosci'
    >
      {/* Tło sekcji z efektem przejścia */}
      <div
        ref={sectionBgRef}
        className='absolute inset-0 w-full h-full z-0 transition-colors duration-1000'
        style={{
          backgroundImage: 'url(/images/background-flower.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      />

      <div className='container relative mx-auto px-4 sm:px-6 lg:px-8 z-10'>
        <div ref={titleRef} className='mb-20'>
          <h2
            ref={titleInnerRef}
            className='text-4xl md:text-5xl lg:text-6xl tracking-wide text-center font-bold text-white drop-shadow-lg'
          >
            Nowości — Zasłony szyte na wymiar
          </h2>
        </div>

        <div
          ref={textRef}
          className='relative overflow-hidden mb-24 px-6 md:px-16 lg:px-28 z-10'
        >
          <p
            ref={(el) => addToParagraphRefs(el)}
            className='text-sm md:text-base lg:text-lg tracking-wide text-center mb-6 leading-relaxed font-light transition-colors duration-700'
            style={{ color: '#6b7280' }}
          >
            Nasze produkty powstają w lokalnej szwalni, z najwyższej jakości
            materiałów. Każde zamówienie traktujemy indywidualnie, z dbałością o
            detale i potrzeby naszych klientów.
          </p>
          <p
            ref={(el) => addToParagraphRefs(el)}
            className='text-sm md:text-base lg:text-lg tracking-wide text-center mb-6 leading-relaxed font-light transition-colors duration-700'
            style={{ color: '#6b7280' }}
          >
            Dzięki takiemu podejściu, uszyliśmy już ponad{' '}
            <span className='text-xl md:text-2xl lg:text-3xl font-semibold text-gold'>
              100 000
            </span>{' '}
            metrów bieżących zasłon i firan, które zdobią wnętrza w całej
            Polsce.
          </p>
          <p
            ref={(el) => addToParagraphRefs(el)}
            className='text-sm md:text-base lg:text-lg tracking-wide text-center leading-relaxed font-light transition-colors duration-700'
            style={{ color: '#6b7280' }}
          >
            Klienci którzy nam zaufali, chętnie wracają – bo wiedzą, że w{' '}
            <span className='text-lg md:text-xl lg:text-2xl font-medium text-gold'>
              Zasłonex
            </span>{' '}
            liczy się nie tylko{' '}
            <span className='text-gold font-medium'>piękno</span>, ale i{' '}
            <span className='text-white font-medium'>jakość</span>.
          </p>
          <div className='absolute inset-0 bg-gradient-radial from-transparent to-black/5 pointer-events-none'></div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10'>
          {convertToCards(products).map((card, index) => (
            <div
              key={card.id}
              ref={(el: HTMLDivElement | null) => {
                cardsRef.current[index] = el;
              }}
            >
              <SellingCard
                card={card}
                showPrice={true}
                buttonVariant='primary'
              />
            </div>
          ))}
        </div>

        {/* Przycisk "Zobacz więcej" z efektem błyszczenia */}
        <div className='mt-16 text-center'>
          <button className='group relative inline-flex items-center justify-center px-8 py-3.5 overflow-hidden font-medium text-white bg-gradient-to-r from-gold to-amber-600 rounded-md shadow-md transition-all duration-300 ease-out hover:scale-105'>
            <span className='absolute inset-0 w-full h-full bg-gradient-to-br from-amber-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out'></span>
            <span className='relative z-10 text-lg'>
              Zobacz więcej produktów
            </span>
            <span className='ml-2 relative z-10'>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewProductsSection;
