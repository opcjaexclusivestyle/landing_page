'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const NewProductsSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Dane produktów - warto przenieść do osobnego pliku w przyszłości
  const products = [
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

  // Rejestracja pluginu ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animacja tytułu
    gsap.fromTo(
      titleRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      },
    );

    // Animacja kart produktów
    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.2 + index * 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        },
      );
    });

    // Animacja hover dla kart
    cardsRef.current.forEach((card) => {
      if (card) {
        const image = card.querySelector('.card-image');
        if (image) {
          card.addEventListener('mouseenter', () => {
            gsap.to(image, { scale: 1.08, duration: 0.5, ease: 'power1.out' });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(image, { scale: 1, duration: 0.5, ease: 'power1.out' });
          });
        }
      }
    });
  }, []);

  // Funkcja do dodawania kart do referencji
  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <section
      ref={sectionRef}
      className='bg-white py-24 overflow-hidden'
      id='nowosci'
    >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <h2
          ref={titleRef}
          className='text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-center text-gray-900 mb-16 luxury-heading'
        >
          Nowości — Zasłony szyte na wymiar
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'>
          {products.map((product, index) => (
            <div
              key={index}
              ref={(el) => {
                if (cardsRef.current) {
                  cardsRef.current[index] = el;
                }
              }}
              className='border border-gray-100 rounded-2xl shadow-md overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl'
            >
              <div className='relative'>
                <div className='relative h-80 overflow-hidden'>
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    className='object-cover card-image'
                  />
                </div>
                <span className='absolute top-4 left-4 bg-yellow-600 text-white text-xs font-semibold px-3 py-1 rounded-md'>
                  SZYCIE NA WYMIAR
                </span>
                <button className='absolute top-4 right-4 text-black/80 bg-white/70 hover:bg-white rounded-full p-2 transition-colors duration-300 shadow-md transform hover:scale-105'>
                  ❤️
                </button>
              </div>
              <div className='p-6'>
                <p className='text-sm text-gray-700 mb-3 line-clamp-2 tracking-wide'>
                  {product.description}
                </p>
                <p className='text-xs text-gray-500 mb-3 tracking-wide'>
                  <strong>Przykład:</strong> {product.example}
                </p>
                <div className='flex items-center justify-between'>
                  <p className='text-lg font-semibold text-gray-900'>
                    {product.price}
                  </p>
                  <button className='premium-button'>Zamów</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewProductsSection;
