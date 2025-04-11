'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import HeroSection from '@/components/HeroSection';
import NewProductsSection from '@/components/NewProductsSection';
import RecommendedProducts from '@/components/RecommendedProducts';
import MainPageNavigation from '@/components/MainPageNavigation';

// Przykładowa lista produktów - możesz przenieść ją do osobnego pliku
const recommendedProducts = [
  {
    id: 1,
    name: 'Firana ARLETA',
    description:
      'Firana ARLETA z lekkiej tkaniny szyfonowej z delikatnym połyskiem, kolor biały 295 x 160 cm przelotki',
    currentPrice: 74.46,
    regularPrice: 96.7,
    lowestPrice: 96.7,
    image: '/images/Firany.jpg', // Tymczasowo używam istniejącego obrazu
  },
  {
    id: 2,
    name: 'Firana ROXANA',
    description:
      'Firana ROXANA z etaminy zdobiona gipiurą z frędzelkami, kolor biały 350 x 145 cm przelotki',
    currentPrice: 108.65,
    regularPrice: 141.1,
    lowestPrice: 141.1,
    image: '/images/Firany.jpg', // Tymczasowo używam istniejącego obrazu
  },
  {
    id: 3,
    name: 'Firana SADIE',
    description:
      'Firana gotowa SADIE z drobnej siateczki z haftowanymi na dole firany drobnymi kwiatuszkami, kolor biały 300 x 150 cm przelotki',
    currentPrice: 183.8,
    regularPrice: 238.7,
    lowestPrice: 238.7,
    image: '/images/Firany.jpg', // Tymczasowo używam istniejącego obrazu
  },
];

// Dane produktów dla pościeli
const beddingProducts = [
  {
    id: 101,
    name: 'Pościel LUNA',
    description:
      'Luksusowa pościel bawełniana LUNA z subtelnym kwiatowym wzorem, kolor ecru, 160x200 cm, 2 poszewki na poduszki',
    currentPrice: 129.99,
    regularPrice: 169.99,
    lowestPrice: 129.99,
    image: '/images/posciel.png', // Używam istniejącego obrazu
  },
  {
    id: 102,
    name: 'Pościel STELLA',
    description:
      'Satynowa pościel STELLA z delikatnym połyskiem, kolor srebrny, 200x220 cm, komplet z poszewkami na poduszki',
    currentPrice: 159.99,
    regularPrice: 199.99,
    lowestPrice: 159.99,
    image: '/images/posciel.png', // Używam istniejącego obrazu
  },
  {
    id: 103,
    name: 'Pościel ROYAL',
    description:
      'Ekskluzywna pościel ROYAL z egipskiej bawełny o wysokiej gramaturze, kolor biały ze złotymi elementami, 180x200 cm',
    currentPrice: 249.99,
    regularPrice: 299.99,
    lowestPrice: 249.99,
    image: '/images/posciel.png', // Używam istniejącego obrazu
  },
];

export default function Home() {
  const navigationRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const contactButtonRef = useRef(null);

  // Hook do sprawdzania czy widok jest mobilny
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Rejestracja pluginu ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Główne animacje przy wczytywaniu strony
  useEffect(() => {
    const tl = gsap.timeline();

    // Animacja nawigacji
    tl.fromTo(
      navigationRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' },
      '-=0.5',
    );

    // Animacja przycisku kontaktowego
    tl.fromTo(
      contactButtonRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' },
      '-=0.5',
    );
  }, [isMobile]);

  // Przełączanie mobilnego menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <main className='flex flex-col min-h-screen'>
      {/* Header */}
      <header className='py-4 bg-white shadow-sm sticky top-0 z-50 transition-all ease-in-out duration-300'>
        <div className='container mx-auto px-4 flex justify-between items-center'>
          <div className='flex items-center'>
            <Link href='/' className='text-2xl font-bold text-gray-900'>
              Curtains
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex space-x-8'>
            <Link
              href='#oferta'
              className='text-gray-600 hover:text-primary font-medium transition-colors whitespace-nowrap'
            >
              Oferta
            </Link>
            <Link
              href='#realizacje'
              className='text-gray-600 hover:text-primary font-medium transition-colors whitespace-nowrap'
            >
              Realizacje
            </Link>
            <Link
              href='#jak-pracujemy'
              className='text-gray-600 hover:text-primary font-medium transition-colors whitespace-nowrap'
            >
              Jak pracujemy
            </Link>
            <Link
              href='#kontakt'
              className='text-gray-600 hover:text-primary font-medium transition-colors whitespace-nowrap'
            >
              Kontakt
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className='md:hidden text-gray-500 focus:outline-none'
          >
            {isMenuOpen ? (
              <XMarkIcon className='h-6 w-6' />
            ) : (
              <Bars3Icon className='h-6 w-6' />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`${
            isMenuOpen ? 'max-h-64' : 'max-h-0'
          } md:hidden overflow-hidden transition-all duration-300 ease-in-out`}
        >
          <div className='container mx-auto px-4 py-2'>
            <div className='flex flex-col space-y-3'>
              <Link
                href='#oferta'
                className='text-gray-600 hover:text-primary font-medium transition-colors'
                onClick={toggleMenu}
              >
                Oferta
              </Link>
              <Link
                href='#realizacje'
                className='text-gray-600 hover:text-primary font-medium transition-colors'
                onClick={toggleMenu}
              >
                Realizacje
              </Link>
              <Link
                href='#jak-pracujemy'
                className='text-gray-600 hover:text-primary font-medium transition-colors'
                onClick={toggleMenu}
              >
                Jak pracujemy
              </Link>
              <Link
                href='#kontakt'
                className='text-gray-600 hover:text-primary font-medium transition-colors'
                onClick={toggleMenu}
              >
                Kontakt
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Grid paneli 2x2 - przeniesiony do osobnego komponentu */}
      <MainPageNavigation />

      {/* Sekcja Nowości - Zasłony */}
      <NewProductsSection />

      {/* Nasza pościel */}
      <RecommendedProducts
        title='Nasza Pościel'
        subtitle='Komfort i elegancja dla Twojej sypialni'
        products={beddingProducts}
        background='gray'
        buttonText='SPRAWDŹ SZCZEGÓŁY'
        className='mt-8'
      />

      {/* Rekomendowane firany */}
      <RecommendedProducts
        title='Wybrane dla Ciebie'
        subtitle='Najlepsze firany w wyjątkowych cenach'
        products={recommendedProducts}
        background='light'
      />

      {/* Portfolio Section - Realizacje */}
      <section id='realizacje' className='py-20 bg-white'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center text-gray-900 mb-8'>
            Nasze realizacje
          </h2>
          <div className='flex justify-center mb-12'>
            <div className='inline-flex bg-gray-100 p-1 rounded-full'>
              <button className='px-6 py-2 rounded-full bg-primary text-white font-medium whitespace-nowrap'>
                Wszystkie
              </button>
              <button className='px-6 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-200 transition-colors whitespace-nowrap'>
                Rolety
              </button>
              <button className='px-6 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-200 transition-colors whitespace-nowrap'>
                Zasłony
              </button>
              <button className='px-6 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-200 transition-colors whitespace-nowrap'>
                Firany
              </button>
              <button className='px-6 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-200 transition-colors whitespace-nowrap'>
                Pościel
              </button>
            </div>
          </div>

          {/* Zaawansowany grid z elementami o różnych wymiarach */}
          <div className='grid grid-cols-1 md:grid-cols-6 gap-6 mb-12'>
            {/* Portfolio Item 1 - Duży element zajmujący 4 kolumny */}
            <div className='md:col-span-4 overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:-translate-y-2'>
              <div className='relative h-96 overflow-hidden'>
                <Image
                  src='/images/kitchen.jpg'
                  alt='Luksusowe zasłony w apartamencie'
                  width={1200}
                  height={800}
                  className='w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8'>
                  <h3 className='text-2xl font-bold text-white mb-2 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100'>
                    Luksusowe zasłony w apartamencie
                  </h3>
                  <p className='text-gray-200 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150'>
                    Warszawa, 2024
                  </p>
                  <button className='mt-4 w-max bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200'>
                    Zobacz projekt
                  </button>
                </div>
              </div>
            </div>

            {/* Portfolio Item 2 - Element zajmujący 2 kolumny */}
            <div className='md:col-span-2 overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:-translate-y-2'>
              <div className='relative h-96 overflow-hidden'>
                <Image
                  src='/images/Rolety.jpg'
                  alt='Rolety w sypialni'
                  width={600}
                  height={800}
                  className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8'>
                  <h3 className='text-xl font-bold text-white mb-2 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100'>
                    Nowoczesne rolety w sypialni
                  </h3>
                  <p className='text-gray-200 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150'>
                    Kraków, 2024
                  </p>
                  <button className='mt-4 w-max bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200'>
                    Zobacz projekt
                  </button>
                </div>
              </div>
            </div>

            {/* Portfolio Item 3 - Element zajmujący 3 kolumny */}
            <div className='md:col-span-3 overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:-translate-y-2'>
              <div className='relative h-80 overflow-hidden'>
                <Image
                  src='/images/posciel.png'
                  alt='Pościel hotelowa'
                  width={900}
                  height={600}
                  className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8'>
                  <h3 className='text-xl font-bold text-white mb-2 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100'>
                    Luksusowa pościel hotelowa
                  </h3>
                  <p className='text-gray-200 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150'>
                    Gdańsk, 2023
                  </p>
                  <button className='mt-4 w-max bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200'>
                    Zobacz projekt
                  </button>
                </div>
              </div>
            </div>

            {/* Portfolio Item 4 - Element zajmujący 3 kolumny */}
            <div className='md:col-span-3 overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:-translate-y-2'>
              <div className='relative h-80 overflow-hidden'>
                <Image
                  src='/images/Firany.jpg'
                  alt='Firany w kuchni'
                  width={900}
                  height={600}
                  className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8'>
                  <h3 className='text-xl font-bold text-white mb-2 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100'>
                    Delikatne firany w jasnej kuchni
                  </h3>
                  <p className='text-gray-200 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150'>
                    Poznań, 2024
                  </p>
                  <button className='mt-4 w-max bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200'>
                    Zobacz projekt
                  </button>
                </div>
              </div>
            </div>

            {/* Portfolio Item 5 - Element zajmujący 2 kolumny i 2 rzędy */}
            <div className='md:col-span-2 md:row-span-2 overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:-translate-y-2'>
              <div className='relative h-full overflow-hidden'>
                <Image
                  src='/images/kitchen.jpg'
                  alt='Zasłony w jadalni'
                  width={600}
                  height={1200}
                  className='w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8'>
                  <h3 className='text-xl font-bold text-white mb-2 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100'>
                    Eleganckie zasłony w jadalni
                  </h3>
                  <p className='text-gray-200 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150'>
                    Wrocław, 2023
                  </p>
                  <button className='mt-4 w-max bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200'>
                    Zobacz projekt
                  </button>
                </div>
              </div>
            </div>

            {/* Portfolio Item 6 - Element zajmujący 4 kolumny */}
            <div className='md:col-span-4 overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:-translate-y-2'>
              <div className='relative h-80 overflow-hidden'>
                <Image
                  src='/images/Rolety.jpg'
                  alt='Rolety w nowoczesnym biurze'
                  width={1200}
                  height={600}
                  className='w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8'>
                  <h3 className='text-xl font-bold text-white mb-2 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100'>
                    Rolety w nowoczesnym biurze
                  </h3>
                  <p className='text-gray-200 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150'>
                    Łódź, 2024
                  </p>
                  <button className='mt-4 w-max bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200'>
                    Zobacz projekt
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='text-center'>
            <button className='premium-button'>Zobacz więcej realizacji</button>
          </div>
        </div>
      </section>
    </main>
  );
}
