'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import HeroSection from '@/components/HeroSection';
import NewProductsSection from '@/components/NewProductsSection';
import RecommendedProducts from '@/components/RecommendedProducts';
import MainPageNavigation from '@/components/MainPageNavigation';
import PortfolioSection from '@/components/PortfolioSection';
import BlogSection from '@/components/BlogSection';

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

// Dane przykładowych postów blogowych
const blogPosts = [
  {
    id: 1,
    title: 'Jak dobrać idealne zasłony do nowoczesnego wnętrza?',
    excerpt:
      'Odkryj najnowsze trendy w dekoracji okien i poznaj skuteczne metody doboru zasłon, które idealnie wpasują się w styl Twojego nowoczesnego domu.',
    category: 'Porady',
    image: '/images/Firany.jpg',
    publishDate: '15 maj 2023',
    author: {
      name: 'Anna Kowalska',
      avatar: '/images/avatar1.jpg',
    },
    readTime: 5,
  },
  {
    id: 2,
    title: 'Naturalne materiały we wnętrzach - powrót do korzeni',
    excerpt:
      'Len, bawełna i jedwab - dlaczego naturalne materiały przeżywają renesans w aranżacji wnętrz i jak wykorzystać je w sypialni.',
    category: 'Trendy',
    image: '/images/posciel.png',
    publishDate: '2 czerwiec 2023',
    author: {
      name: 'Piotr Nowak',
      avatar: '/images/avatar2.jpg',
    },
    readTime: 7,
  },
  {
    id: 3,
    title: 'Metamorfoza sypialni w stylu skandynawskim',
    excerpt:
      'Krok po kroku pokazujemy, jak przeprowadzić efektowną metamorfozę sypialni, wykorzystując jasne kolory, naturalne tkaniny i minimalistyczne dodatki.',
    category: 'Inspiracje',
    image: '/images/Firany.jpg',
    publishDate: '20 czerwiec 2023',
    author: {
      name: 'Magdalena Wiśniewska',
      avatar: '/images/avatar3.jpg',
    },
    readTime: 9,
  },
];

export default function Home() {
  const navigationRef = useRef(null);
  const contactButtonRef = useRef(null);

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
  }, []);

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
      <PortfolioSection />

      {/* Blog Section - nowa sekcja */}
      <BlogSection posts={blogPosts} />
    </main>
  );
}
