'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
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
      <Navbar />

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
