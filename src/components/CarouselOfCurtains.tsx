'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useAnimation, PanInfo } from 'framer-motion';

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
  const controls = useAnimation();

  // Kolory gradientowe zależne od wariantu
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

  // Obliczenie liczby widocznych elementów i przesuwania
  const visibleItems = isMobile ? 1 : 3;
  const slidesToScroll = isMobile ? 1 : 3;
  const totalPages = Math.ceil(products.length / slidesToScroll);

  // Funkcja do przewijania karuzeli
  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      let newIndex = index;

      // Zapobieganie wyświetlaniu pustych miejsc (gdy ostatnia strona nie jest pełna)
      const maxIndex = Math.max(0, products.length - visibleItems);
      if (newIndex > maxIndex) {
        newIndex = maxIndex;
      }

      // Szerokość jednego elementu wraz z odstępem (gap)
      const gap = 16; // 4 jednostki = 16px (gap-4)
      const itemWidth = isMobile
        ? 160
        : (carouselRef.current.clientWidth - gap * (visibleItems - 1)) /
          visibleItems;

      // Przesunięcie o dokładnie określoną liczbę elementów
      carouselRef.current.scrollTo({
        left: newIndex * (itemWidth + gap),
        behavior: 'smooth',
      });
    }
  };

  // Obsługa pauzy przy najechaniu myszką (tylko na desktopie)
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Obsługa kliknięcia w strzałki
  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => {
      // Przesuwanie o slidesToScroll (1 na mobile, 3 na desktopie)
      const newIndex = Math.max(0, prevIndex - slidesToScroll);
      scrollToIndex(newIndex);
      return newIndex;
    });
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => {
      // Przesuwanie o slidesToScroll (1 na mobile, 3 na desktopie)
      const newIndex = Math.min(
        products.length - visibleItems,
        prevIndex + slidesToScroll,
      );
      scrollToIndex(newIndex);
      return newIndex;
    });
  };

  // Obsługa gestów przesuwania palcem
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      handleNextClick();
    } else if (info.offset.x > swipeThreshold) {
      handlePrevClick();
    }
  };

  // Określenie, czy można dalej przewijać w danym kierunku
  const canGoNext = currentIndex < products.length - visibleItems;
  const canGoPrev = currentIndex > 0;

  if (products.length === 0) {
    return null;
  }

  return (
    <div className='mb-8 relative z-0 max-w-5xl mx-auto'>
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
        className={`relative bg-white p-6 rounded-xl shadow-lg overflow-hidden group`}
      >
        <motion.div
          drag='x'
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className='relative w-full'
        >
          <div
            ref={carouselRef}
            className={`flex overflow-x-auto gap-4 pb-4 scrollbar-hide relative z-10 py-2 snap-x`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.name}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`flex-shrink-0 snap-start ${
                  isMobile ? 'w-full' : `w-[${100 / visibleItems - 4}%]`
                } cursor-pointer rounded-lg p-3 transition-all transform-gpu
                  ${
                    selectedProduct === product.name
                      ? `border-2 border-${accentColor} bg-amber-50 shadow-[0_0_15px_rgba(var(--${
                          variant === 'gold' ? 'gold' : 'deep-navy'
                        }),0.3)]`
                      : `border border-white/30 bg-amber-50 hover:border-${hoverColor}/50`
                  }`}
                onClick={() => onProductSelect(product.name)}
                style={{
                  perspective: '1000px',
                  transformStyle: 'preserve-3d',
                  width: isMobile
                    ? '100%'
                    : `calc(${100 / visibleItems}% - ${
                        (16 * (visibleItems - 1)) / visibleItems
                      }px)`,
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
                        className='object-cover transition-transform duration-700'
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
        </motion.div>

        {/* Strzałki nawigacyjne */}
        {canGoPrev && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevClick}
            className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-30 backdrop-blur-sm border border-gray-200
              hover:border-${accentColor} group/btn opacity-100`}
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
        )}

        {canGoNext && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextClick}
            className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-30 backdrop-blur-sm border border-gray-200
              hover:border-${accentColor} group/btn opacity-100`}
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
    <div className='relative max-w-5xl mx-auto'>
      {/* Dekoracyjny element tła */}
      <div className='absolute -top-10 right-0 w-64 h-64 bg-royal-gold/5 rounded-full blur-3xl'></div>
      <div className='absolute -bottom-10 left-0 w-64 h-64 bg-deep-navy/5 rounded-full blur-3xl'></div>

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

      {/* Przyciski przeniesione pod opinie (będą dodane w komponencie nadrzędnym) */}
    </div>
  );
};

export default CarouselOfCurtains;
