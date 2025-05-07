'use client';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
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

  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];

  // Usuwam logikę wykrywania rozmiaru ekranu i zastępuję ją nowym podejściem
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Efekt wykrywający rozmiar ekranu (tylko do kalkulacji szerokości)
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    // Sprawdź rozmiar podczas pierwszego renderowania
    if (typeof window !== 'undefined') {
      checkScreenSize();
    }

    // Nasłuchuj zmian rozmiaru ekranu
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Determine if we use carousel (>= 2 products)
  const hasEnoughForCarousel = safeProducts.length >= 2;

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

  // Get category-specific link for "See More" card
  const getCategoryMoreLink = () => {
    if (safeProducts.length === 0) return moreProductsLink;
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
    const isZaslonyPage = moreProductsLink.includes('zaslony-premium');
    for (const product of productList) {
      if (!product) continue;
      let buttonLink = '';
      if (product.category === 'curtains') {
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

  // Calculate number of visible cards based on width - wrapped in useCallback
  const getVisibleCards = useCallback(() => {
    if (!carouselContainerRef.current) return 1;
    const containerWidth = carouselContainerRef.current.clientWidth;
    if (containerWidth < 640) return 1;
    if (containerWidth < 1024) return 2;
    return 3; // Maksymalnie 3 karty na desktopie
  }, []); // Pusta tablica zależności, bo nie zależy od stanu/propsów

  // Obliczamy maksymalną pozycję przewijania
  const calculateMaxPosition = useCallback(() => {
    const totalItems = safeProducts.length + 1; // +1 dla kafelka "Zobacz więcej"
    const visibleCards = getVisibleCards();
    if (cardWidth <= 0 || visibleCards <= 0) return 0;
    // Upewniamy się, że ostatni kafelek będzie widoczny w całości
    return Math.max(0, totalItems - visibleCards);
  }, [safeProducts.length, cardWidth, getVisibleCards]); // Zależność od getVisibleCards

  // Zaktualizowana i uproszczona funkcja przewijania
  const scrollTo = useCallback(
    (position: number) => {
      const carousel = carouselRef.current;
      if (!carousel || cardWidth <= 0) {
        console.error(
          '[scrollTo] Nie można przewinąć: brak elementu karuzeli lub szerokości karty.',
          { hasCarousel: !!carousel, cardWidth },
        );
        return;
      }
      const maxPos = calculateMaxPosition();
      const newPosition = Math.max(0, Math.min(position, maxPos));
      console.log(
        `[scrollTo] Próba przewinięcia do pozycji: ${position}, Wynikowa pozycja: ${newPosition}, Max: ${maxPos}`,
      );
      if (newPosition !== currentPosition) {
        setCurrentPosition(newPosition);
      }

      let translateX = newPosition * cardWidth;
      // Gdy jesteśmy na ostatniej pozycji, upewnijmy się że ostatni kafelek jest w pełni widoczny
      // oraz że nie widać kawałków wcześniejszych produktów
      if (
        newPosition === maxPos &&
        maxPos > 0 &&
        carouselContainerRef.current
      ) {
        const gapSize = 20;
        const visibleCards = getVisibleCards();
        const containerWidth = carouselContainerRef.current.clientWidth;
        const isDesktop = containerWidth >= 1024;

        // Obliczamy, ile produktów powinniśmy przesunąć by pokazać ostatnie produkty i kafelek "Zobacz więcej"
        const totalItems = safeProducts.length + 1; // +1 dla kafelka "Zobacz więcej"

        // Określamy ile pozycji musimy przesunąć, aby dokładnie pokazać ostatnie produkty i kafelek
        const numberOfItemsToShow = Math.min(visibleCards, totalItems);
        const startingItemIndex = totalItems - numberOfItemsToShow;

        // Obliczamy dokładną pozycję przewinięcia
        translateX = startingItemIndex * cardWidth;
        if (startingItemIndex > 0) {
          // Dodajemy odstępy między kartami
          translateX += startingItemIndex * gapSize;
        }

        // Specjalna korekta dla widoku desktopowego - dodajemy 100px
        if (isDesktop) {
          const desktopOffset = 100;
          translateX += desktopOffset;
          console.log(
            `[scrollTo] Zastosowano korektę dla desktopu: +${desktopOffset}px`,
          );
        }

        console.log(
          `[scrollTo] Precyzyjne ustawienie ostatnich ${numberOfItemsToShow} elementów: ${translateX}px`,
        );
      }

      carousel.style.transition = 'transform 500ms ease-in-out';
      carousel.style.transform = `translateX(-${translateX}px)`;
      setPrevTranslate(translateX);
      setCurrentTranslate(translateX);
    },
    [
      cardWidth,
      currentPosition,
      calculateMaxPosition,
      safeProducts.length,
      getVisibleCards,
    ], // Dodane zależności
  );

  // Scroll left
  const scrollLeft = useCallback(() => {
    console.log('[scrollLeft] Kliknięto strzałkę w lewo.');
    scrollTo(currentPosition - 1);
  }, [currentPosition, scrollTo]);

  // Funkcja bezpośrednio pokazująca ostatni kafelek "Zobacz więcej"
  const showLastTile = useCallback(() => {
    if (!carouselRef.current || !carouselContainerRef.current) return;

    const lastTileIndex = safeProducts.length; // Indeks kafelka "Zobacz więcej"
    const containerWidth = carouselContainerRef.current.clientWidth;
    const visibleCards = getVisibleCards();

    // Pobieramy faktyczne elementy DOM
    const carouselItems =
      carouselRef.current.querySelectorAll('.flex-shrink-0');
    const lastItem = carouselItems[lastTileIndex];

    if (!lastItem) {
      console.error('[showLastTile] Nie znaleziono ostatniego kafelka');
      return;
    }

    // Obliczamy, o ile musimy przesunąć karuzelę, aby ostatni kafelek był w pełni widoczny
    // Każemy pokazać tyle ostatnich kafelków, ile może się zmieścić w kontenerze
    const lastItemRect = lastItem.getBoundingClientRect();
    const lastItemWidth = lastItemRect.width;

    // Maksymalna liczba widocznych kafelków
    const totalItems = safeProducts.length + 1;

    // Ile kafelków pokazujemy (ostatnich)
    const showItems = Math.min(visibleCards, totalItems);

    // Indeks pierwszego pokazywanego kafelka
    const firstVisibleIndex = totalItems - showItems;

    // Obliczamy pozycję do przewinięcia
    let translateX = 0;

    // Jeśli mamy wystarczająco elementów, przechodzimy do konkretnej pozycji
    if (firstVisibleIndex >= 0 && firstVisibleIndex < carouselItems.length) {
      const targetItem = carouselItems[firstVisibleIndex];
      const targetRect = targetItem.getBoundingClientRect();
      const containerRect =
        carouselContainerRef.current.getBoundingClientRect();

      // Obliczamy różnicę między pozycją pierwszego elementu a krawędzią kontenera
      translateX = targetRect.left - containerRect.left;

      // Jeśli jesteśmy w widoku desktop, dodajemy korektę
      if (containerWidth >= 1024) {
        translateX += 150; // Zwiększona korekta dla desktop
      } else if (containerWidth >= 640) {
        translateX += 60; // Korekta dla tabletów
      } else {
        translateX += 30; // Korekta dla mobile
      }
    }

    // Ustawiamy pozycję
    console.log(
      `[showLastTile] Przesuwanie do ostatniego kafelka: ${translateX}px`,
    );
    const maxPos = calculateMaxPosition();
    setCurrentPosition(maxPos);

    if (carouselRef.current) {
      carouselRef.current.style.transition = 'transform 500ms ease-in-out';
      carouselRef.current.style.transform = `translateX(-${translateX}px)`;
      setPrevTranslate(translateX);
      setCurrentTranslate(translateX);
    }
  }, [safeProducts.length, getVisibleCards, calculateMaxPosition]);

  // Scroll right
  const scrollRight = useCallback(() => {
    console.log('[scrollRight] Kliknięto strzałkę w prawo.');
    const maxPos = calculateMaxPosition();

    // Jeśli jesteśmy na przedostatniej lub ostatniej pozycji, pokazujemy ostatni kafelek
    if (currentPosition >= maxPos - 1) {
      console.log('[scrollRight] Przesuwanie do ostatniego kafelka');
      showLastTile();
    } else {
      scrollTo(currentPosition + 1);
    }
  }, [currentPosition, scrollTo, calculateMaxPosition, showLastTile]);

  // Funkcje obsługi przeciągania
  const touchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    if ('touches' in e) {
      setStartX(e.touches[0].clientX);
    } else {
      setStartX(e.clientX);
    }
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'none';
    }
  };

  const touchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    let currentX;
    if ('touches' in e) {
      currentX = e.touches[0].clientX;
    } else {
      currentX = e.clientX;
    }
    const diff = startX - currentX;
    const newTranslate = prevTranslate + diff;
    const totalItems = safeProducts.length + 1;
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
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'transform 500ms ease-in-out';
    }
    const movedBy = currentTranslate - prevTranslate;
    const maxPosition = calculateMaxPosition();
    if (Math.abs(movedBy) > Math.max(50, cardWidth / 4)) {
      if (movedBy > 0) {
        scrollTo(Math.min(currentPosition + 1, maxPosition));
      } else {
        scrollTo(Math.max(currentPosition - 1, 0));
      }
    } else {
      const closestPosition = Math.round(currentTranslate / cardWidth);
      scrollTo(Math.max(0, Math.min(maxPosition, closestPosition)));
    }
  };

  // Effect to initialize GSAP animations
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
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
    const calculateCardWidth = () => {
      if (!carouselContainerRef.current) {
        console.warn(
          '[calculateCardWidth] Kontener karuzeli jeszcze nie istnieje.',
        );
        return 0;
      }
      const containerWidth = carouselContainerRef.current.clientWidth;
      if (containerWidth <= 0) {
        console.warn('[calculateCardWidth] Szerokość kontenera to 0.');
        return 0;
      }
      const gapSize = 20;
      const visibleCards = getVisibleCards();
      const paddingSize = 40;
      let newCardWidth = 0;
      if (visibleCards === 1) {
        newCardWidth = containerWidth - paddingSize;
      } else {
        newCardWidth =
          (containerWidth - gapSize * (visibleCards - 1) - paddingSize) /
          visibleCards;
      }
      console.log(
        `[calculateCardWidth] Obliczono szerokość karty: ${newCardWidth}px (kontener: ${containerWidth}px, widoczne karty: ${visibleCards})`,
      );
      if (newCardWidth > 0 && newCardWidth !== cardWidth) {
        setCardWidth(newCardWidth);
        return newCardWidth;
      }
      return cardWidth;
    };

    const initialWidth = calculateCardWidth();

    if (initialWidth > 0 && carouselRef.current) {
      const maxPos = calculateMaxPosition();
      const safePosition = Math.min(currentPosition, maxPos);
      const translateX = safePosition * initialWidth;
      console.log(
        `[useEffect Width] Inicjalizacja/Aktualizacja szerokości: ${initialWidth}px, pozycja: ${safePosition}, translateX: ${translateX}px`,
      );
      if (safePosition !== currentPosition) {
        setCurrentPosition(safePosition);
      }
      carouselRef.current.style.transition = 'none';
      carouselRef.current.style.transform = `translateX(-${translateX}px)`;
      setPrevTranslate(translateX);
      setCurrentTranslate(translateX);
    }

    const handleResize = () => {
      console.log('[handleResize] Zmiana rozmiaru okna.');
      const newWidth = calculateCardWidth();
      if (newWidth > 0 && carouselRef.current) {
        const maxPos = calculateMaxPosition();
        const safePosition = Math.min(currentPosition, maxPos);
        const translateX = safePosition * newWidth;
        console.log(
          `[handleResize] Nowa szerokość: ${newWidth}px, pozycja: ${safePosition}, translateX: ${translateX}px`,
        );
        if (safePosition !== currentPosition) {
          setCurrentPosition(safePosition);
        }
        carouselRef.current.style.transition = 'none';
        carouselRef.current.style.transform = `translateX(-${translateX}px)`;
        setPrevTranslate(translateX);
        setCurrentTranslate(translateX);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [
    safeProducts.length,
    getVisibleCards,
    calculateMaxPosition,
    cardWidth,
    currentPosition,
  ]); // Dodano cardWidth i currentPosition do zależności

  // Dodajemy obiekt stylów dla karuzeli, uwzględniając tryb przeciągania
  const carouselStyle = {
    transform: `translateX(-${currentTranslate}px)`,
    cursor: isDragging ? 'grabbing' : 'grab',
    transition: isDragging ? 'none' : 'transform 500ms ease-in-out',
    userSelect: 'none' as 'none',
    WebkitUserSelect: 'none' as 'none',
    MozUserSelect: 'none' as 'none',
  };

  // Obliczamy maxPosition i konwertujemy karty PRZED warunkiem
  const maxPosition = useMemo(calculateMaxPosition, [calculateMaxPosition]);
  const productCards = useMemo(
    () => convertToCards(safeProducts),
    [safeProducts, buttonText, moreProductsLink],
  );

  // Grid view (jeśli mniej niż 2 produkty)
  if (!hasEnoughForCarousel) {
    return (
      <section
        ref={sectionRef}
        className={`py-12 md:py-16 lg:py-24 relative ${getBgClass()} ${className}`}
      >
        {/* Decorative element */}
        <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent'></div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center max-w-3xl mx-auto mb-8 md:mb-12 lg:mb-16'>
            <h2 className='section-heading text-2xl sm:text-3xl md:text-4xl text-black mb-3 md:mb-4 tracking-wider luxury-heading'>
              {title}
            </h2>
            {subtitle && (
              <p className='section-heading text-gray-600 text-base md:text-lg'>
                {subtitle}
              </p>
            )}
          </div>
          <div className='grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {/* Product cards */}
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
              <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center cursor-pointer hover:translate-y-[-5px] transition-transform duration-300'>
                <Link
                  href={getCategoryMoreLink()}
                  className='flex flex-col items-center justify-center w-full h-full'
                >
                  <span className='text-2xl sm:text-3xl md:text-4xl text-primary mb-4'>
                    →
                  </span>
                  <h3 className='text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-4 max-w-xs sm:max-w-sm md:max-w-md leading-relaxed'>
                    Chcesz zobaczyć więcej produktów?
                  </h3>
                  <p className='text-gray-600 text-sm sm:text-base leading-relaxed max-w-xs sm:max-w-sm md:max-w-md text-wrap text-center'>
                    Naciśnij tutaj, aby przejść do pełnej oferty i odkryć
                    wszystkie dostępne produkty, które przygotowaliśmy
                    specjalnie dla Ciebie.
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Carousel view (jeśli 2 lub więcej produktów)
  return (
    <section
      ref={sectionRef}
      className={`py-12 md:py-16 lg:py-24 relative ${getBgClass()} ${className}`}
    >
      {/* Decorative element */}
      <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent'></div>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center max-w-3xl mx-auto mb-8 md:mb-12 lg:mb-16'>
          <h2 className='section-heading text-2xl sm:text-3xl md:text-4xl text-black mb-3 md:mb-4 tracking-wider luxury-heading'>
            {title}
          </h2>
          {subtitle && (
            <p className='section-heading text-gray-600 text-base md:text-lg'>
              {subtitle}
            </p>
          )}
        </div>
        {/* Carousel container */}
        <div
          className='relative px-4 sm:px-6 md:px-10'
          ref={carouselContainerRef}
        >
          {/* Przyciski nawigacyjne z atrybutem disabled */}
          <button
            type='button'
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer border border-gray-200 transition-opacity duration-300 ${
              currentPosition <= 0
                ? 'opacity-50 cursor-not-allowed'
                : 'opacity-100'
            }`}
            aria-label='Poprzedni'
            onClick={scrollLeft}
            disabled={currentPosition <= 0}
          >
            <span className='border-gray-800 border-l-2 border-b-2 w-2 h-2 transform rotate-45 ml-0.5'></span>
          </button>
          <button
            type='button'
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer border border-gray-200 transition-opacity duration-300 ${
              currentPosition >= maxPosition
                ? 'opacity-50 cursor-not-allowed'
                : 'opacity-100'
            }`}
            aria-label='Następny'
            onClick={scrollRight}
            disabled={currentPosition >= maxPosition}
          >
            <span className='border-gray-800 border-r-2 border-b-2 w-2 h-2 transform -rotate-45 ml-0.5'></span>
          </button>
          {/* Carousel with products */}
          <div className='overflow-hidden'>
            <div
              ref={carouselRef}
              className='flex gap-3 sm:gap-4 md:gap-5 touch-pan-x select-none'
              style={carouselStyle}
              onTouchStart={touchStart}
              onTouchMove={touchMove}
              onTouchEnd={touchEnd}
              onMouseDown={(e) => {
                if (e.button === 0) touchStart(e);
              }}
              onMouseMove={(e) => {
                if (isDragging) {
                  e.preventDefault();
                  touchMove(e);
                }
              }}
              onMouseUp={touchEnd}
              onMouseLeave={touchEnd}
            >
              {/* Product cards */}
              {Array.isArray(productCards) && productCards.length > 0
                ? productCards.map((card) => (
                    <div
                      key={card.id}
                      className='flex-shrink-0'
                      style={{
                        width: cardWidth ? `${cardWidth}px` : 'auto',
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
              {/* "See More" card */}
              <div
                className='flex-shrink-0'
                style={{
                  width: cardWidth ? `${cardWidth}px` : 'auto',
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
                    <p className='text-gray-600 text-sm text-center'>
                      Naciśnij tutaj aby przejść
                      <br />
                      do pełnej oferty
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
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-colors duration-300 ${
                  currentPosition === index ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label={`Przejdź do pozycji ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
