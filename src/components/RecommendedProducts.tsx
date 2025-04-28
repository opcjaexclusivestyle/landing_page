'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SellingCard, { Card } from './SellingCard';
import Link from 'next/link';

// Define interface for product
export interface Product {
  id: number;
  name: string;
  description: string;
  currentPrice: number;
  regularPrice: number;
  lowestPrice: number;
  image: string;
  category?: 'bedding' | 'curtains';
  slug?: string;
}

// Define component properties
interface RecommendedProductsProps {
  title?: string;
  subtitle?: string;
  products: Product[];
  background?: 'white' | 'gray' | 'light';
  showPriceDetails?: boolean;
  buttonText?: string;
  className?: string;
  moreProductsLink?: string;
}

export default function RecommendedProducts({
  title = 'Wybrane dla Ciebie',
  subtitle,
  products = [], // Default to empty array
  background = 'white',
  showPriceDetails = true,
  buttonText = 'SPRAWDŹ SZCZEGÓŁY',
  className = '',
  moreProductsLink = '/produkty',
}: RecommendedProductsProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const carouselContainerRef = useRef<HTMLDivElement | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  // Stan do obsługi przeciągania
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);

  // Calculate number of visible cards based on width
  const getVisibleCards = () => {
    if (!carouselContainerRef.current) return 1;
    const containerWidth = carouselContainerRef.current.clientWidth;
    if (containerWidth < 640) return 1;
    if (containerWidth < 1024) return 2;
    return 3;
  };

  // Calculate max scroll position based on visible cards
  const calculateMaxPosition = () => {
    const totalItems = safeProducts.length + 1; // +1 for "See More" card
    const visibleCards = getVisibleCards();
    return Math.max(0, totalItems - visibleCards);
  };

  // Set background classes based on the selected option
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

  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];

  // Determine if we have enough products for a carousel
  const hasEnoughForCarousel = safeProducts.length >= 3;

  // Get category-specific link for "See More" card
  const getCategoryMoreLink = () => {
    if (safeProducts.length === 0) return moreProductsLink;

    // Jeśli moreProductsLink jest już ustawiony, używamy go zamiast domyślnych wartości
    if (moreProductsLink && moreProductsLink !== '/produkty') {
      return moreProductsLink;
    }

    const firstProduct = safeProducts[0];
    if (firstProduct?.category === 'curtains') {
      return '/firany-premium';
    } else if (firstProduct?.category === 'bedding') {
      return '/posciel-premium';
    }
    return moreProductsLink;
  };

  // Convert products to card format - FIXED to always return an array
  const convertToCards = (productList: Product[] = []): Card[] => {
    if (!Array.isArray(productList) || productList.length === 0) {
      return []; // Always return an array
    }

    const cards: Card[] = [];

    // Sprawdzamy, czy moreProductsLink wskazuje na zasłony zamiast firan
    const isZaslonyPage = moreProductsLink.includes('zaslony-premium');

    for (const product of productList) {
      if (!product) continue;

      // Determine button URL based on product category and moreProductsLink
      let buttonLink = '';

      if (product.category === 'curtains') {
        // Jeśli jesteśmy na stronie zasłon, kierujemy do zasłon, w przeciwnym razie do firan
        if (isZaslonyPage) {
          buttonLink = product.slug
            ? `/zaslony-premium/${encodeURIComponent(product.slug)}`
            : `/zaslony-premium/${encodeURIComponent(`product-${product.id}`)}`;
        } else {
          buttonLink = product.slug
            ? `/firany-premium/${encodeURIComponent(product.slug)}`
            : `/firany-premium/${encodeURIComponent(`product-${product.id}`)}`;
        }
      } else if (product.category === 'bedding') {
        buttonLink = product.slug
          ? `/${product.slug}`
          : `/posciel-premium/${product.id}`;
      }

      const discount =
        product.currentPrice < product.regularPrice
          ? Math.round((1 - product.currentPrice / product.regularPrice) * 100)
          : undefined;

      // Truncate description to max 150 characters
      const truncatedDescription = product.description
        ? product.description.length > 150
          ? product.description.substring(0, 147) + '...'
          : product.description
        : '';

      cards.push({
        id: product.id,
        title: product.name || '',
        description: truncatedDescription,
        image: product.image || '',
        price: product.currentPrice,
        oldPrice: product.regularPrice,
        discount,
        buttonText,
        buttonLink,
      });
    }

    return cards;
  };

  // Function to scroll the carousel by position
  const scrollTo = (position: number) => {
    if (position < 0) position = 0;

    const maxPosition = calculateMaxPosition();
    if (position > maxPosition) position = maxPosition;

    setCurrentPosition(position);
    setPrevTranslate(position * cardWidth);
    setCurrentTranslate(position * cardWidth);

    if (carouselRef.current && cardWidth > 0) {
      carouselRef.current.style.transform = `translateX(-${
        position * cardWidth
      }px)`;
    }
  };

  // Scroll left
  const scrollLeft = () => {
    if (currentPosition > 0) {
      scrollTo(currentPosition - 1);
    }
  };

  // Scroll right
  const scrollRight = () => {
    const maxPosition = calculateMaxPosition();
    if (currentPosition < maxPosition) {
      scrollTo(currentPosition + 1);
    }
  };

  // Funkcje obsługi przeciągania
  const touchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    if ('touches' in e) {
      setStartX(e.touches[0].clientX);
    } else {
      setStartX(e.clientX);
    }

    // Wyłączamy animację podczas rozpoczęcia przeciągania
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'none';
    }
  };

  const touchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;

    // Zapobiegaj domyślnemu zachowaniu przeglądarki przy przeciąganiu
    e.preventDefault();

    let currentX;
    if ('touches' in e) {
      currentX = e.touches[0].clientX;
    } else {
      currentX = e.clientX;
    }

    const diff = startX - currentX;
    const newTranslate = prevTranslate + diff;

    // Ograniczamy przesuwanie poza granice, ale umożliwiamy elastyczne przekroczenie o 25% szerokości
    const totalItems = safeProducts.length + 1; // +1 dla kafelka "pokaż więcej"
    const maxTranslate = (totalItems - 2) * cardWidth;
    const elasticLimit = cardWidth * 0.25;

    if (
      newTranslate < -elasticLimit ||
      newTranslate > maxTranslate + elasticLimit
    )
      return;

    setCurrentTranslate(newTranslate);

    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${newTranslate}px)`;
    }
  };

  const touchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Przywracamy animację po zakończeniu przeciągania
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'transform 500ms ease-in-out';
    }

    const movedBy = currentTranslate - prevTranslate;
    const maxPosition = calculateMaxPosition();

    // Jeśli przesunięto o więcej niż 100px lub 1/3 szerokości karty, przechodzimy do następnej/poprzedniej pozycji
    if (Math.abs(movedBy) > Math.max(50, cardWidth / 4)) {
      if (movedBy > 0) {
        // Przesunięto w prawo (palcem w lewo)
        if (currentPosition < maxPosition) {
          scrollTo(currentPosition + 1);
        } else {
          scrollTo(maxPosition); // Powrót do maksymalnej pozycji
        }
      } else {
        // Przesunięto w lewo (palcem w prawo)
        if (currentPosition > 0) {
          scrollTo(currentPosition - 1);
        } else {
          scrollTo(0); // Powrót do pierwszej pozycji
        }
      }
    } else {
      // Powrót do bieżącej pozycji (zaokrąglonej do najbliższej karty)
      const closestPosition = Math.round(currentTranslate / cardWidth);
      scrollTo(Math.max(0, Math.min(maxPosition, closestPosition)));
    }

    // Reset prevTranslate after animation settles
    setTimeout(() => {
      if (carouselRef.current) {
        const finalPosition = Math.max(
          0,
          Math.min(maxPosition, Math.round(currentTranslate / cardWidth)),
        );
        setPrevTranslate(finalPosition * cardWidth);
      }
    }, 500); // Match transition duration

    // Nie ustawiamy prevTranslate natychmiastowo tutaj, robimy to w setTimeout
    // setPrevTranslate(currentPosition * cardWidth); // Usunięte
  };

  // Effect to initialize GSAP animations and calculate card width
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Register GSAP ScrollTrigger
      gsap.registerPlugin(ScrollTrigger);

      // Animate section headings
      const headingElements =
        sectionRef.current?.querySelectorAll('.section-heading');
      if (headingElements && headingElements.length > 0) {
        headingElements.forEach((heading) => {
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
    }
  }, []);

  // Effect to calculate card width and handle window resize
  useEffect(() => {
    // Calculate width of each card based on container
    const calculateCardWidth = () => {
      if (!carouselContainerRef.current) return;

      const containerWidth = carouselContainerRef.current.clientWidth;
      const gapSize = 20; // Gap size (gap-5 = 1.25rem = 20px)
      let newCardWidth = 0;
      const visibleCards = getVisibleCards(); // Używamy getVisibleCards

      // Calculate card width based on visible cards
      if (visibleCards === 1) {
        newCardWidth = containerWidth - 40; // Full width minus padding
      } else {
        newCardWidth =
          (containerWidth - gapSize * (visibleCards - 1) - 40) / visibleCards;
      }

      setCardWidth(newCardWidth);
    };

    // Initialize and handle window resize
    calculateCardWidth();

    const handleResize = () => {
      calculateCardWidth();
      scrollTo(currentPosition); // Realign carousel after resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentPosition]);

  // Dodajemy obiekt stylów dla karuzeli, uwzględniając tryb przeciągania
  const carouselStyle = {
    transform: `translateX(-${currentPosition * cardWidth}px)`,
    cursor: isDragging ? 'grabbing' : 'grab',
    transition: isDragging ? 'none' : 'transform 500ms ease-in-out',
    userSelect: 'none' as 'none', // Zapobiega zaznaczaniu tekstu podczas przeciągania
  };

  // For fewer than 3 products, show grid view
  if (!hasEnoughForCarousel) {
    const productCards = convertToCards(safeProducts);

    return (
      <section
        ref={sectionRef}
        className={`py-16 md:py-24 relative ${getBgClass()} ${className}`}
      >
        {/* Decorative element */}
        <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent'></div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center max-w-3xl mx-auto mb-12 md:mb-16'>
            <h2 className='section-heading text-3xl md:text-4xl text-black mb-4 tracking-wider luxury-heading'>
              {title}
            </h2>
            {subtitle && (
              <p className='section-heading text-gray-600 text-lg'>
                {subtitle}
              </p>
            )}
          </div>

          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {/* Product cards - safely iterate with array check */}
            {Array.isArray(productCards) && productCards.length > 0 ? (
              productCards.map((card) => (
                <div key={card.id} className='h-full'>
                  <SellingCard
                    card={card}
                    showPrice={true}
                    buttonVariant='primary'
                  />
                </div>
              ))
            ) : (
              <div>No products available</div>
            )}

            {/* "See More" card */}
            <div className='h-full'>
              <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:translate-y-[-5px] transition-transform duration-300'>
                <Link
                  href={getCategoryMoreLink()}
                  className='flex flex-col items-center justify-center w-full h-full'
                >
                  <span className='text-4xl text-primary mb-4'>→</span>
                  <h3 className='text-xl font-semibold text-gray-800 mb-3'>
                    Chcesz zobaczyć więcej produktów?
                  </h3>
                  <p className='text-gray-600 text-sm'>
                    Naciśnij tutaj aby przejść do pełnej oferty
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // For 3 or more products, show carousel
  const productCards = convertToCards(safeProducts);
  const maxPosition = calculateMaxPosition(); // Calculate max position here

  return (
    <section
      ref={sectionRef}
      className={`py-16 md:py-24 relative ${getBgClass()} ${className}`}
    >
      {/* Decorative element */}
      <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent'></div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center max-w-3xl mx-auto mb-12 md:mb-16'>
          <h2 className='section-heading text-3xl md:text-4xl text-black mb-4 tracking-wider luxury-heading'>
            {title}
          </h2>
          {subtitle && (
            <p className='section-heading text-gray-600 text-lg'>{subtitle}</p>
          )}
        </div>

        {/* Carousel container */}
        <div className='relative px-6 md:px-10' ref={carouselContainerRef}>
          {/* Navigation buttons */}
          <button
            onClick={scrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer border border-gray-200 ${
              currentPosition <= 0
                ? 'opacity-0 pointer-events-none'
                : 'opacity-100'
            } transition-opacity duration-300`}
            aria-label='Poprzedni'
            disabled={currentPosition <= 0}
          >
            <span className='border-gray-800 border-r-2 border-b-2 w-2 h-2 transform rotate-135 mr-0.5'></span>
          </button>

          <button
            onClick={scrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer border border-gray-200 ${
              currentPosition >= maxPosition // Use calculated maxPosition
                ? 'opacity-0 pointer-events-none'
                : 'opacity-100'
            } transition-opacity duration-300`}
            aria-label='Następny'
            disabled={currentPosition >= maxPosition} // Use calculated maxPosition
          >
            <span className='border-gray-800 border-r-2 border-b-2 w-2 h-2 transform -rotate-45 ml-0.5'></span>
          </button>

          {/* Carousel with products */}
          <div className='overflow-hidden'>
            <div
              ref={carouselRef}
              className='flex gap-5 touch-pan-x select-none'
              style={carouselStyle}
              onTouchStart={touchStart}
              onTouchMove={touchMove}
              onTouchEnd={touchEnd}
              onMouseDown={(e) => {
                // Rozpoczynaj przeciąganie tylko dla lewego przycisku myszy
                if (e.button === 0) touchStart(e);
              }}
              onMouseMove={(e) => {
                // Zapobiegaj domyślnemu zaznaczaniu tekstu podczas przeciągania
                if (isDragging) {
                  e.preventDefault();
                  touchMove(e);
                }
              }}
              onMouseUp={touchEnd}
              onMouseLeave={touchEnd}
            >
              {/* Product cards - safely iterate with array check */}
              {Array.isArray(productCards) && productCards.length > 0
                ? productCards.map((card) => (
                    <div
                      key={card.id}
                      className='flex-shrink-0'
                      style={{
                        width: cardWidth ? `${cardWidth}px` : 'auto', // Używamy auto jeśli cardWidth nie jest jeszcze ustawiony
                      }}
                    >
                      <SellingCard
                        card={card}
                        showPrice={true}
                        buttonVariant='primary'
                      />
                    </div>
                  ))
                : null}

              {/* "See More" card (always at the end) */}
              <div
                className='flex-shrink-0'
                style={{
                  width: cardWidth ? `${cardWidth}px` : 'auto', // Używamy auto jeśli cardWidth nie jest jeszcze ustawiony
                }}
              >
                <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:translate-y-[-5px] transition-transform duration-300'>
                  <Link
                    href={getCategoryMoreLink()}
                    className='flex flex-col items-center justify-center w-full h-full'
                  >
                    <span className='text-4xl text-primary mb-4'>→</span>
                    <h3 className='text-xl font-semibold text-gray-800 mb-3'>
                      Chcesz zobaczyć więcej produktów?
                    </h3>
                    <p className='text-gray-600 text-sm'>
                      Naciśnij tutaj aby przejść do pełnej oferty
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Position indicators */}
        {safeProducts.length > 3 && (
          <div className='flex justify-center mt-6 space-x-2'>
            {Array.from({
              length: Math.min(
                safeProducts.length + 1 - getVisibleCards() + 1,
                5,
              ),
            }).map(
              // Poprawka długości dla wskaźników
              (_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-colors duration-300 ${
                    currentPosition === index ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  aria-label={`Przejdź do pozycji ${index + 1}`}
                />
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}
