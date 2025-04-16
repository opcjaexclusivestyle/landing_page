'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Definiujemy interfejs dla produktu
export interface Product {
  id: number;
  name: string;
  description: string;
  currentPrice: number;
  regularPrice: number;
  lowestPrice: number;
  image: string;
}

// Definiujemy właściwości komponentu aby był reuzywalny
interface RecommendedProductsProps {
  title?: string;
  subtitle?: string;
  products: Product[];
  background?: 'white' | 'gray' | 'light';
  showPriceDetails?: boolean;
  buttonText?: string;
  className?: string;
}

export default function RecommendedProducts({
  title = 'Wybrane dla Ciebie',
  subtitle,
  products,
  background = 'white',
  showPriceDetails = true,
  buttonText = 'DODAJ DO KOSZYKA',
  className = '',
}: RecommendedProductsProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Ustawiamy klasy tła w zależności od wybranej opcji
  const getBgClass = () => {
    switch (background) {
      case 'gray':
        return 'bg-gray-100';
      case 'light':
        return 'bg-gray-50';
      default:
        return 'bg-white';
    }
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animacja nagłówka
    const headings =
      sectionRef.current?.querySelectorAll('.section-heading') || [];
    if (headings.length > 0) {
      headings.forEach((heading) => {
        gsap.fromTo(
          heading,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
            },
          },
        );
      });
    }

    // Animacja kart produktów
    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        },
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`py-24 relative ${getBgClass()} ${className}`}
    >
      {/* Dekoracyjny element w tle */}
      <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent'></div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <h2 className='section-heading text-3xl md:text-4xl font-light text-black mb-4 tracking-wider'>
            {title}
          </h2>
          {subtitle && (
            <p className='section-heading text-gray-600 text-lg'>{subtitle}</p>
          )}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {products.map((product, index) => (
            <div
              key={product.id}
              ref={(el: HTMLDivElement | null) => {
                cardsRef.current[index] = el;
              }}
              className='rounded-lg overflow-hidden shadow-lg border border-gray-100 transform transition-transform duration-300 hover:-translate-y-2 bg-white'
            >
              <div className='relative h-72 overflow-hidden'>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className='object-cover transition-transform duration-700 hover:scale-105'
                />

                {/* Plakietka ze zniżką, gdy cena jest obniżona */}
                {product.currentPrice < product.regularPrice && (
                  <div className='absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold'>
                    -
                    {Math.round(
                      (1 - product.currentPrice / product.regularPrice) * 100,
                    )}
                    %
                  </div>
                )}
              </div>

              <div className='p-6 bg-white'>
                <h3 className='font-medium text-gray-800 mb-2'>
                  {product.name}
                </h3>
                <p className='text-sm text-gray-700 mb-3 h-20 leading-relaxed overflow-hidden'>
                  {product.description}
                </p>

                <div className='space-y-2 mb-4'>
                  <div className='flex items-center'>
                    <p className='text-primary font-semibold text-2xl'>
                      {product.currentPrice.toFixed(2)} zł
                    </p>
                    {product.currentPrice < product.regularPrice && (
                      <p className='ml-2 text-sm text-gray-400 line-through'>
                        {product.regularPrice.toFixed(2)} zł
                      </p>
                    )}
                  </div>

                  {showPriceDetails && (
                    <>
                      <p className='text-xs text-gray-500'>
                        Najniższa cena z 30 dni:{' '}
                        {product.lowestPrice.toFixed(2)} zł
                      </p>
                      <p className='text-xs text-gray-500'>
                        Cena regularna: {product.regularPrice.toFixed(2)} zł
                      </p>
                    </>
                  )}
                </div>

                <button className='premium-button'>{buttonText}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
