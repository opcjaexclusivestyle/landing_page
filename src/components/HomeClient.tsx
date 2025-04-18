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
import FAQSection from '@/components/FAQSection';
import { BlogPost } from '@/lib/supabase';

interface HomeClientProps {
  blogPosts: BlogPost[];
  recommendedProducts: any[];
  beddingProducts: any[];
}

// Komponent po stronie klienta do obsługi animacji i referencji
export default function HomeClient({
  blogPosts,
  recommendedProducts,
  beddingProducts,
}: HomeClientProps) {
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

      {/* FAQ Section - sekcja najczęściej zadawanych pytań */}
      <FAQSection
        title='Często zadawane pytania'
        subtitle='Znajdź odpowiedzi na najczęstsze pytania dotyczące naszych produktów'
      />

      {/* Blog Section - przekazujemy pobrane posty z Supabase */}
      <BlogSection posts={blogPosts} />
    </main>
  );
}
