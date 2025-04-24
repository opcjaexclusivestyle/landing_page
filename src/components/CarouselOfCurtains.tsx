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

const CarouselOfCurtains: React.FC<CarouselOfCurtainsProps> = ({
  products,
  selectedProduct,
  onProductSelect,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Funkcja do przewijania karuzeli
  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const itemWidth = 176; // 160px (w-40) + 16px (gap-4)
      carouselRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth',
      });
    }
  };

  // Automatyczne przewijanie
  useEffect(() => {
    if (!isPaused && products.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % products.length;
          scrollToIndex(nextIndex);
          return nextIndex;
        });
      }, 3000); // Przewijanie co 3 sekundy

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isPaused, products.length]);

  // Obsługa pauzy przy najechaniu myszką
  const handleMouseEnter = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
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

  return (
    <div className='relative'>
      <div
        ref={carouselRef}
        className='flex overflow-x-auto gap-4 pb-4 scrollbar-hide'
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

      {/* Strzałki nawigacyjne */}
      <button
        onClick={handlePrevClick}
        className='absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10'
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
        className='absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10'
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
    </div>
  );
};

export default CarouselOfCurtains;
