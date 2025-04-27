'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Product {
  name: string;
  imagePath: string;
  images: string[];
}

interface CarouselOfCurtainsProps {
  products: Product[];
  selectedProduct: string;
  onProductSelect: (productName: string) => void;
}

const CarouselComponent: React.FC<{
  products: Product[];
  selectedProduct: string;
  onProductSelect: (productName: string) => void;
  direction: 'left' | 'right';
  title?: string;
}> = ({ products, selectedProduct, onProductSelect, direction, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Sprawdzanie czy jesteśmy na urządzeniu mobilnym
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Funkcja do przewijania karuzeli
  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const itemWidth = isMobile ? 160 : 176; // Dostosowanie szerokości do widoku mobilnego
      carouselRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth',
      });
    }
  };

  // Automatyczne przewijanie tylko na desktopie
  useEffect(() => {
    if (!isPaused && products.length > 0 && !isMobile) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          let nextIndex;
          if (direction === 'left') {
            nextIndex = (prevIndex + 1) % products.length;
          } else {
            nextIndex = (prevIndex - 1 + products.length) % products.length;
          }
          scrollToIndex(nextIndex);
          return nextIndex;
        });
      }, 3000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isPaused, products.length, isMobile, direction]);

  // Obsługa pauzy przy najechaniu myszką (tylko na desktopie)
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsPaused(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsPaused(false);
    }
  };

  // Obsługa kliknięcia w strzałki
  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + products.length) % products.length;
      scrollToIndex(newIndex);
      return newIndex;
    });
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % products.length;
      scrollToIndex(newIndex);
      return newIndex;
    });
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className='mb-4'>
      {title && (
        <h4 className='text-md font-medium mb-2 text-deep-navy'>{title}</h4>
      )}
      <div className='relative'>
        <div
          ref={carouselRef}
          className={`flex overflow-x-auto gap-4 pb-4 scrollbar-hide ${
            isMobile ? 'px-4' : ''
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {products.map((product, index) => (
            <div
              key={product.name}
              className={`flex-shrink-0 w-40 cursor-pointer rounded-lg border-2 p-2 transition-all ${
                selectedProduct === product.name
                  ? 'border-royal-gold bg-gold/10'
                  : 'border-gray-200 hover:border-royal-gold/50'
              }`}
              onClick={() => onProductSelect(product.name)}
            >
              <div className='relative w-full h-32 mb-2 rounded-md overflow-hidden'>
                {product.images && product.images.length > 0 && (
                  <Image
                    src={`${product.imagePath}/${product.images[0]}`}
                    alt={product.name}
                    fill
                    sizes='160px'
                    className='object-cover'
                  />
                )}
              </div>
              <p className='text-sm font-medium text-center text-gray-900'>
                {product.name}
              </p>
            </div>
          ))}
        </div>

        {/* Strzałki nawigacyjne - zawsze widoczne na mobile, na desktop tylko przy hover */}
        <button
          onClick={handlePrevClick}
          className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10 ${
            isMobile ? 'block' : 'hidden group-hover:block'
          }`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 text-deep-navy'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
        </button>

        <button
          onClick={handleNextClick}
          className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10 ${
            isMobile ? 'block' : 'hidden group-hover:block'
          }`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 text-deep-navy'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5l7 7-7 7'
            />
          </svg>
        </button>

        {/* Wskaźniki na dole karuzeli - tylko na mobile */}
        {isMobile && (
          <div className='flex justify-center gap-2 mt-4'>
            {products.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentIndex === index ? 'bg-royal-gold' : 'bg-gray-300'
                }`}
                onClick={() => {
                  setCurrentIndex(index);
                  scrollToIndex(index);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CarouselOfCurtains: React.FC<CarouselOfCurtainsProps> = ({
  products,
  selectedProduct,
  onProductSelect,
}) => {
  // Podział produktów na dwie grupy: zawierające "EFE" w nazwie i pozostałe
  const efeProducts = products.filter((product) =>
    product.name.includes('EFE'),
  );

  const otherProducts = products.filter(
    (product) => !product.name.includes('EFE'),
  );

  return (
    <div>
      {efeProducts.length > 0 && (
        <CarouselComponent
          products={efeProducts}
          selectedProduct={selectedProduct}
          onProductSelect={onProductSelect}
          direction='left'
          title='Kolekcja EFE'
        />
      )}

      {otherProducts.length > 0 && (
        <CarouselComponent
          products={otherProducts}
          selectedProduct={selectedProduct}
          onProductSelect={onProductSelect}
          direction='right'
          // title='Pozostałe materiały'
        />
      )}
    </div>
  );
};

export default CarouselOfCurtains;
