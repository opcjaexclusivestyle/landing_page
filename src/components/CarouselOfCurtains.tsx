'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

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
  variant: 'gold' | 'navy';
}> = ({
  products,
  selectedProduct,
  onProductSelect,
  direction,
  title,
  variant,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Kolory gradientowe zależne od wariantu
  const gradientFrom =
    variant === 'gold' ? 'from-royal-gold/30' : 'from-deep-navy/30';
  const gradientTo = variant === 'gold' ? 'to-gold/5' : 'to-royal-blue/5';
  const accentColor = variant === 'gold' ? 'royal-gold' : 'deep-navy';
  const hoverColor = variant === 'gold' ? 'gold' : 'royal-blue';

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
      const itemWidth = isMobile ? 160 : 200; // Zwiększona szerokość dla lepszej prezentacji
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
    setIsHovered(true);
    if (!isMobile) {
      setIsPaused(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
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
    <div className='mb-8 relative z-0'>
      {title && (
        <motion.h4
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`text-lg font-medium mb-3 text-${accentColor} relative inline-block`}
        >
          {title}
          <motion.div
            className={`absolute -bottom-1 left-0 h-0.5 bg-${accentColor} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.2, duration: 0.7 }}
          />
        </motion.h4>
      )}

      <div
        className={`relative bg-gradient-to-b ${gradientFrom} ${gradientTo} p-6 rounded-xl shadow-lg overflow-hidden group`}
      >
        {/* Efekt błyszczenia w tle */}
        <div className='absolute inset-0 overflow-hidden opacity-30'>
          <div
            className={`absolute -inset-[50%] bg-${accentColor}/10 rotate-45 transform-gpu blur-3xl ${
              isHovered ? 'animate-pulse' : ''
            }`}
          ></div>
        </div>

        {/* Dekoracyjny element ozdobny */}
        <div
          className={`absolute top-0 right-0 w-40 h-40 bg-${accentColor}/5 rounded-full -mt-10 -mr-10 blur-xl`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 w-40 h-40 bg-${accentColor}/5 rounded-full -mb-10 -ml-10 blur-xl`}
        ></div>

        <div
          ref={carouselRef}
          className={`flex overflow-x-auto gap-6 pb-4 scrollbar-hide relative z-10 py-2 ${
            isMobile ? 'px-2' : 'px-4'
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              whileHover={{
                scale: 1.05,
                rotateY: direction === 'left' ? 5 : -5,
                transition: { duration: 0.3 },
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`flex-shrink-0 w-48 cursor-pointer rounded-lg p-3 transition-all transform-gpu backdrop-blur-sm
                ${
                  selectedProduct === product.name
                    ? `border-2 border-${accentColor} bg-${accentColor}/10 shadow-[0_0_15px_rgba(var(--${
                        variant === 'gold' ? 'gold' : 'deep-navy'
                      }),0.3)]`
                    : `border border-white/30 bg-white/20 hover:border-${hoverColor}/50 hover:bg-white/30`
                }`}
              onClick={() => onProductSelect(product.name)}
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
              }}
            >
              <div
                className={`relative w-full h-40 mb-3 rounded-md overflow-hidden`}
              >
                {product.images && product.images.length > 0 && (
                  <>
                    {/* Efekt podświetlenia dla wybranego produktu */}
                    {selectedProduct === product.name && (
                      <div
                        className={`absolute inset-0 shadow-inner ring-2 ring-${accentColor} rounded-md z-20`}
                      />
                    )}
                    <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10' />
                    <Image
                      src={`${product.imagePath}/${product.images[0]}`}
                      alt={product.name}
                      fill
                      sizes='192px'
                      className={`object-cover transition-transform duration-700 ${
                        isHovered ? 'scale-110' : 'scale-100'
                      }`}
                    />
                  </>
                )}
              </div>
              <div className='space-y-1'>
                <p
                  className={`text-sm font-medium text-center ${
                    selectedProduct === product.name
                      ? `text-${accentColor}`
                      : 'text-gray-900'
                  }`}
                >
                  {product.name}
                </p>
                <div className='flex justify-center'>
                  <span
                    className={`text-xs px-2 py-0.5 bg-${accentColor}/10 text-${accentColor} rounded-full`}
                  >
                    Wybierz
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Efekty cieniowania na krawędziach karuzeli */}
        <div className='absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-white/40 to-transparent z-20 pointer-events-none'></div>
        <div className='absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-white/40 to-transparent z-20 pointer-events-none'></div>

        {/* Strzałki nawigacyjne - nowy design */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevClick}
          className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg z-30 backdrop-blur-sm border border-gray-200
            hover:border-${accentColor} group/btn ${
            isHovered || isMobile ? 'opacity-100' : 'opacity-70'
          }`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={`h-5 w-5 text-${accentColor} group-hover/btn:text-${hoverColor}`}
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
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNextClick}
          className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg z-30 backdrop-blur-sm border border-gray-200
            hover:border-${accentColor} group/btn ${
            isHovered || isMobile ? 'opacity-100' : 'opacity-70'
          }`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={`h-5 w-5 text-${accentColor} group-hover/btn:text-${hoverColor}`}
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
        </motion.button>

        {/* Eleganckie wskaźniki na dole karuzeli */}
        <div className='flex justify-center gap-1.5 mt-6'>
          {products.map((_, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? `bg-${accentColor} scale-110`
                  : `bg-gray-300 hover:bg-${accentColor}/50`
              }`}
              onClick={() => {
                setCurrentIndex(index);
                scrollToIndex(index);
              }}
            />
          ))}
        </div>
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
    <div className='relative'>
      {/* Dekoracyjny element tła */}
      <div className='absolute -top-10 -right-20 w-64 h-64 bg-royal-gold/5 rounded-full blur-3xl'></div>
      <div className='absolute -bottom-10 -left-20 w-64 h-64 bg-deep-navy/5 rounded-full blur-3xl'></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className='space-y-6'
      >
        {efeProducts.length > 0 && (
          <CarouselComponent
            products={efeProducts}
            selectedProduct={selectedProduct}
            onProductSelect={onProductSelect}
            direction='left'
            title='✨ Ekskluzywna Kolekcja EFE ✨'
            variant='gold'
          />
        )}

        {otherProducts.length > 0 && (
          <CarouselComponent
            products={otherProducts}
            selectedProduct={selectedProduct}
            onProductSelect={onProductSelect}
            direction='right'
            variant='navy'
          />
        )}
      </motion.div>
    </div>
  );
};

export default CarouselOfCurtains;
