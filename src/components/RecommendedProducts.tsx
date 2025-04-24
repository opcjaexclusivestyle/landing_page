'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SellingCard, { Card } from './SellingCard';
import Link from 'next/link';

// Definiujemy interfejs dla produktu
export interface Product {
  id: number;
  name: string;
  description: string;
  currentPrice: number;
  regularPrice: number;
  lowestPrice: number;
  image: string;
  category?: 'bedding' | 'curtains';
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
  moreProductsLink?: string;
}

export default function RecommendedProducts({
  title = 'Wybrane dla Ciebie',
  subtitle,
  products,
  background = 'white',
  showPriceDetails = true,
  buttonText = 'DODAJ DO KOSZYKA',
  className = '',
  moreProductsLink = '/produkty',
}: RecommendedProductsProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const carouselContainerRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  // Modyfikujemy logikę warunkową
  const hasLessThanThreeProducts = products.length < 3;
  const hasExactlyThreeProducts = products.length === 3;
  const hasMoreThanThreeProducts = products.length > 3;

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

  // Funkcja do przesunięcia karuzeli o określoną liczbę kart
  const scrollTo = (position: number) => {
    setCurrentPosition(position);
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${
        position * cardWidth
      }px)`;
    }
  };

  // Przesunięcie karuzeli w lewo
  const scrollLeft = () => {
    if (currentPosition > 0) {
      scrollTo(currentPosition - 1);
    }
  };

  // Przesunięcie karuzeli w prawo
  const scrollRight = () => {
    // Ograniczenie do długości produktów (lub do 1, jeśli chcemy tylko zobaczyć kartę "Zobacz więcej")
    const maxPosition = hasMoreThanThreeProducts ? products.length - 2 : 1;

    if (currentPosition < maxPosition) {
      scrollTo(currentPosition + 1);
    }
  };

  // Konwertujemy produkty na format karty
  const convertToCards = (products: Product[]): Card[] => {
    return products.map((product) => ({
      id: product.id,
      title: product.name,
      description: product.description,
      image: product.image,
      price: product.currentPrice,
      oldPrice: product.regularPrice,
      discount:
        product.currentPrice < product.regularPrice
          ? Math.round((1 - product.currentPrice / product.regularPrice) * 100)
          : undefined,
      buttonText: buttonText,
      additionalInfo: showPriceDetails
        ? `Najniższa cena z 30 dni: ${product.lowestPrice.toFixed(
            2,
          )} zł\nCena regularna: ${product.regularPrice.toFixed(2)} zł`
        : undefined,
    }));
  };

  // Tworzenie karty "Zobacz więcej"
  const seeMoreCard = {
    id: -1, // Unikalny ID dla karty
    title: 'Chcesz zobaczyć więcej produktów?',
    description: 'Naciśnij tutaj aby przejść do pełnej oferty',
    image: '',
    price: 0,
    oldPrice: 0,
    buttonText: '→',
    isSpecial: true, // To pole będzie używane do rozpoznania specjalnej karty
    linkTo: moreProductsLink,
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

    // Obliczanie szerokości karty
    const calculateCardWidth = () => {
      if (carouselContainerRef.current) {
        // Pobieramy szerokość kontenera i dzielimy przez 3 (liczba widocznych kart)
        const containerWidth = carouselContainerRef.current.clientWidth;
        const gapSize = 20; // Rozmiar przerwy między kartami (gap-5 = 1.25rem = 20px)
        const cardWidth = (containerWidth - gapSize * 2) / 3; // 3 karty w rzędzie
        setCardWidth(cardWidth);
      }
    };

    // Inicjalizacja szerokości kart
    calculateCardWidth();
    scrollTo(0);

    // Nasłuchiwanie zmian rozmiaru okna
    window.addEventListener('resize', calculateCardWidth);
    return () => window.removeEventListener('resize', calculateCardWidth);
  }, []);

  // Efekt aktualizujący przewijanie przy zmianie szerokości karty
  useEffect(() => {
    scrollTo(currentPosition);
  }, [cardWidth]);

  // Dodanie elementu do referencji
  const addToItemsRef = (el: HTMLDivElement | null, index: number) => {
    itemsRef.current[index] = el;
  };

  // Dla mniej niż 3 produktów - standardowy widok z kartą "Zobacz więcej" obok
  if (hasLessThanThreeProducts) {
    return (
      <section
        ref={sectionRef}
        className={`py-24 relative ${getBgClass()} ${className}`}
      >
        {/* Dekoracyjny element w tle */}
        <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent'></div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center max-w-3xl mx-auto mb-16'>
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
            {/* Produkty */}
            {convertToCards(products).map((card) => (
              <div key={card.id} className=''>
                <SellingCard
                  card={card}
                  showPrice={true}
                  buttonVariant='primary'
                />
              </div>
            ))}

            {/* Karta "Zobacz więcej" bezpośrednio obok produktów */}
            <div className=''>
              <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:translate-y-[-5px] transition-transform duration-300'>
                <Link
                  href={moreProductsLink}
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

  // Przygotowanie produktów do wyświetlenia w karuzeli
  // Używamy wszystkich produktów do karuzeli + dodajemy kartę "Zobacz więcej" na końcu
  const allProducts = hasExactlyThreeProducts
    ? [...products]
    : [...products, { ...products[0], id: -10 }, { ...products[1], id: -11 }];
  const cards = [...convertToCards(allProducts)];

  // Dla dokładnie 3 produktów lub więcej - karuzela
  return (
    <section
      ref={sectionRef}
      className={`py-24 relative ${getBgClass()} ${className}`}
    >
      {/* Dekoracyjny element w tle */}
      <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent'></div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <h2 className='section-heading text-3xl md:text-4xl text-black mb-4 tracking-wider luxury-heading'>
            {title}
          </h2>
          {subtitle && (
            <p className='section-heading text-gray-600 text-lg'>{subtitle}</p>
          )}
        </div>

        {/* Kontener karuzeli */}
        <div className='relative px-10' ref={carouselContainerRef}>
          {/* Przyciski nawigacyjne */}
          <button
            onClick={scrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer border border-gray-200 ${
              currentPosition === 0 ? 'hidden' : ''
            }`}
            aria-label='Poprzedni'
          >
            <span className='border-gray-800 border-r-2 border-b-2 w-2 h-2 transform rotate-135 mr-0.5'></span>
          </button>

          <button
            onClick={scrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer border border-gray-200 ${
              (hasExactlyThreeProducts && currentPosition === 1) ||
              (hasMoreThanThreeProducts &&
                currentPosition >= products.length - 2)
                ? 'hidden'
                : ''
            }`}
            aria-label='Następny'
          >
            <span className='border-gray-800 border-r-2 border-b-2 w-2 h-2 transform -rotate-45 ml-0.5'></span>
          </button>

          {/* Karuzela z kartami produktów i kartą "Zobacz więcej" na końcu */}
          <div className='overflow-hidden'>
            <div
              ref={carouselRef}
              className='flex transition-transform duration-500 ease-in-out gap-5'
            >
              {/* Produkty - pierwsze 3 lub wszystkie jeśli jest ich dokładnie 3 */}
              {hasExactlyThreeProducts
                ? convertToCards(products).map((card, index) => (
                    <div
                      ref={(el) => addToItemsRef(el, index)}
                      key={card.id}
                      className='flex-shrink-0'
                      style={{ width: cardWidth ? `${cardWidth}px` : '33%' }}
                    >
                      <SellingCard
                        card={card}
                        showPrice={true}
                        buttonVariant='primary'
                      />
                    </div>
                  ))
                : convertToCards(products).map((card, index) => (
                    <div
                      ref={(el) => addToItemsRef(el, index)}
                      key={card.id}
                      className='flex-shrink-0'
                      style={{ width: cardWidth ? `${cardWidth}px` : '33%' }}
                    >
                      <SellingCard
                        card={card}
                        showPrice={true}
                        buttonVariant='primary'
                      />
                    </div>
                  ))}

              {/* Karta "Zobacz więcej" jako ostatnia karta w karuzeli */}
              <div
                ref={(el) =>
                  addToItemsRef(
                    el,
                    hasExactlyThreeProducts ? 3 : products.length,
                  )
                }
                className='flex-shrink-0'
                style={{ width: cardWidth ? `${cardWidth}px` : '33%' }}
              >
                <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:translate-y-[-5px] transition-transform duration-300'>
                  <Link
                    href={moreProductsLink}
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

        {/* Wskaźniki pozycji karuzeli */}
        <div className='flex justify-center mt-6 space-x-2'>
          {hasExactlyThreeProducts
            ? // Dla dokładnie 3 produktów mamy tylko 2 pozycje przewijania
              [0, 1].map((index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                    currentPosition === index ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  aria-label={`Przejdź do pozycji ${index + 1}`}
                />
              ))
            : // Dla więcej niż 3 produktów mamy tyle pozycji ile jest produktów minus 2
              Array.from({ length: products.length - 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                    currentPosition === index ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  aria-label={`Przejdź do pozycji ${index + 1}`}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
