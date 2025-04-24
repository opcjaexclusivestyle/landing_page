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
// import FAQSection from '@/components/FAQSection';
import {
  BlogPost,
  Product,
  fetchCalculatorProducts,
  supabase,
} from '@/lib/supabase';

interface HomeClientProps {
  blogPosts: BlogPost[];
}

interface TableCheckResult {
  products_linen?: {
    exists: boolean;
    data: any[];
  };
  products?: {
    exists: boolean;
    data: any[];
  };
  error?: any;
}

interface LinenProduct {
  id: number;
  name: string;
  fabric_price_per_mb?: number;
  fabricPricePerMB?: number;
  sewing_price_per_mb?: number;
  sewingPricePerMB?: number;
  base?: string;
  image_path?: string;
  imagePath?: string;
  images: string[];
  created_at?: string;
  description?: string;
  style_tags?: string[];
  material?: string;
  composition?: string;
  pattern?: string;
  color?: string;
  height_cm?: number;
  width_type?: string;
  maintenance?: string;
}

export default function HomeClient({ blogPosts }: HomeClientProps) {
  const navigationRef = useRef(null);
  const contactButtonRef = useRef(null);
  const [beddingProducts, setBeddingProducts] = useState<Product[]>([]);
  const [curtainProducts, setCurtainProducts] = useState<Product[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    success?: boolean;
    error?: any;
  } | null>(null);

  // Rejestracja pluginu ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Pobieranie produktów przy montowaniu komponentu
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        console.log('Rozpoczynam pobieranie produktów...');

        // Pobieranie produktów pościelowych z tabeli products_linen
        const { data: linenData, error: linenError } = await supabase
          .from('products_linen')
          .select('*');

        if (linenError) {
          console.error('Błąd podczas pobierania pościeli:', linenError);
        } else {
          console.log('Pobrane produkty pościelowe:', linenData);

          // Mapowanie produktów pościelowych
          const mappedLinenProducts = linenData.map((product) => {
            console.log('Mapowanie produktu pościelowego:', product);
            const imageUrl = product.image || '';
            console.log('Ścieżka obrazka pościel:', imageUrl);
            return {
              id: Number(product.id) || 0,
              name: product.name,
              description: product.description || '',
              currentPrice: product.price || 0,
              regularPrice: (product.price || 0) * 1.2,
              lowestPrice: (product.price || 0) * 0.9,
              image: imageUrl,
              category: 'bedding' as const,
            };
          });

          setBeddingProducts(mappedLinenProducts);
        }

        // Pobieranie tylko 3 pierwszych firan z tabeli calculator_products
        const { data: curtainData, error: curtainError } = await supabase
          .from('calculator_products')
          .select('*')
          .limit(3);

        if (curtainError) {
          console.error('Błąd podczas pobierania firan:', curtainError);
        } else {
          console.log('Pobrane firany (surowe dane):', curtainData);

          // Mapowanie produktów firanowych
          const mappedCurtainProducts = (curtainData || []).map((product) => {
            console.log('Mapowanie produktu firany:', product);
            // Używamy image_path, albo pierwszego obrazka z tablicy images, albo imagePath
            const imageUrl =
              product.image_path ||
              (product.images && product.images[0]) ||
              product.imagePath ||
              '';
            console.log('Ścieżka obrazka firany:', imageUrl);

            // Tworzenie sluga z nazwy produktu (zmiana na małe litery, usunięcie znaków specjalnych, zamiana spacji na myślniki)
            const slug = product.name
              ? product.name
                  .toLowerCase()
                  .replace(/[^\w\s]/gi, '')
                  .replace(/\s+/g, '-')
              : `product-${product.id}`;

            return {
              id: Number(product.id) || 0,
              name: product.name || 'Brak nazwy',
              description: product.description || '',
              currentPrice:
                product.fabric_price_per_mb || product.fabricPricePerMB || 0,
              regularPrice:
                (product.fabric_price_per_mb || product.fabricPricePerMB || 0) *
                1.2,
              lowestPrice:
                (product.fabric_price_per_mb || product.fabricPricePerMB || 0) *
                0.9,
              image: imageUrl,
              category: 'curtains' as const,
              slug: slug, // Dodajemy slug do obiektu produktu
            };
          });

          console.log('Zmapowane firany:', mappedCurtainProducts);
          setCurtainProducts(mappedCurtainProducts);
        }

        setConnectionStatus({ success: true });
      } catch (error) {
        console.error('Błąd podczas pobierania produktów:', error);
        setConnectionStatus({ success: false, error });
      }
    };

    fetchAllProducts();
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
        products={curtainProducts}
        background='light'
        moreProductsLink='/firany-premium'
      />

      {/* Portfolio Section - Realizacje */}
      <PortfolioSection />

      {/* FAQ Section - sekcja najczęściej zadawanych pytań */}
      {/* <FAQSection
        title='Często zadawane pytania'
        subtitle='Znajdź odpowiedzi na najczęstsze pytania dotyczące naszych produktów'
      /> */}

      {/* Blog Section - przekazujemy pobrane posty z Supabase */}
      <BlogSection posts={blogPosts} />
    </main>
  );
}
