'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SellingCard, { Card } from './SellingCard';

// Właściwości komponentu
interface SellingCardsProps {
  title?: string;
  subtitle?: string;
  cards: Card[];
  background?: 'white' | 'gray' | 'light';
  showPrice?: boolean;
  className?: string;
  onCardClick?: (card: Card) => void;
  buttonVariant?: 'primary' | 'secondary' | 'outline';
  gridCols?: '1' | '2' | '3' | '4';
}

export default function SellingCards({
  title,
  subtitle,
  cards,
  background = 'white',
  showPrice = true,
  className = '',
  onCardClick,
  buttonVariant = 'primary',
  gridCols = '3',
}: SellingCardsProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Ustawiamy klasy tła
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

  // Ustawiamy klasy siatki
  const getGridCols = () => {
    switch (gridCols) {
      case '1':
        return 'grid-cols-1';
      case '2':
        return 'grid-cols-1 sm:grid-cols-2';
      case '3':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case '4':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
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

    // Animacja kart
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
      <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent'></div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {(title || subtitle) && (
          <div className='text-center max-w-3xl mx-auto mb-16'>
            {title && (
              <h2 className='section-heading text-3xl md:text-4xl text-black mb-4 tracking-wider luxury-heading'>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className='section-heading text-gray-600 text-lg'>
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={`grid ${getGridCols()} gap-8`}>
          {cards.map((card, index) => (
            <div
              key={card.id}
              ref={(el: HTMLDivElement | null) => {
                cardsRef.current[index] = el;
              }}
            >
              <SellingCard
                card={card}
                showPrice={showPrice}
                buttonVariant={buttonVariant}
                onCardClick={onCardClick}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
