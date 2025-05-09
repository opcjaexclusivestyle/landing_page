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
import { BlogPost, supabase, generateSlug } from '@/lib/supabase';
import { Product } from '@/components/RecommendedProducts'; // Importuj Product z RecommendedProducts
import { useLinenProducts } from '@/hooks/useLinenProducts';

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

  // Pobieranie produktów pościelowych za pomocą hooka useLinenProducts
  // Ograniczamy wyświetlanie do 3 różnych rodzajów pościeli
  const {
    products: linenProducts,
    loading: linenLoading,
    getMainImage,
    getProductPrice,
  } = useLinenProducts({
    limit: 3, // Pobieramy kilka produktów, aby znaleźć jeden z wariantami kolorów
  });

  // Rejestracja pluginu ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Mapowanie produktów pościelowych - tworzymy kafelki dla wariantów kolorystycznych JEDNEGO produktu
  useEffect(() => {
    if (!linenLoading && linenProducts.length > 0) {
      // Znajdź pierwszy produkt z dostępnymi kolorami
      const productWithColors = linenProducts.find(
        (p) => p.colors && Object.keys(p.colors).length > 1,
      );

      if (productWithColors) {
        console.log('Znaleziono produkt z kolorami:', productWithColors);
        const price = getProductPrice(productWithColors);
        const mappedColorVariants: Product[] = [];

        // Przetwórz warianty kolorystyczne (max 4)
        Object.entries(productWithColors.colors)
          .slice(0, 2) // Ograniczamy do 4 kolorów
          .forEach(([colorCode, colorData]) => {
            if (colorData.images && colorData.images.length > 0) {
              mappedColorVariants.push({
                // Używamy kombinacji ID produktu i kodu koloru jako unikalnego ID dla kafelka
                // Można też użyć samego product.id, jeśli komponent SellingCard nie wymaga unikalności na tym poziomie
                id: Number(productWithColors.id) || Math.random(), // Tymczasowe rozwiązanie dla unikalności ID
                name: `${productWithColors.name} - ${colorData.displayName}`,
                description: productWithColors.description || '',
                currentPrice: price,
                regularPrice: price * 1.2,
                lowestPrice: price * 0.9,
                image: colorData.images[0], // Obrazek specyficzny dla koloru
                category: 'bedding' as const,
                // Link do produktu z wybranym kolorem
                slug: `posciel-premium/${productWithColors.id}?color=${colorCode}`,
              });
            }
          });

        console.log('Utworzone kafelki kolorów:', mappedColorVariants);
        setBeddingProducts(mappedColorVariants);
      } else {
        // Fallback: Jeśli nie znaleziono produktu z kolorami, pokaż pierwsze 3 produkty (jak poprzednio)
        console.log(
          'Nie znaleziono produktu z wieloma kolorami, pokazuję pierwsze 3 produkty.',
        );
        const fallbackProducts = linenProducts.slice(0, 2).map((product) => {
          const imageUrl = getMainImage(product);
          const price = getProductPrice(product);
          return {
            id: Number(product.id) || 0,
            name: product.name,
            description: product.description || '',
            currentPrice: price,
            regularPrice: price * 1.2,
            lowestPrice: price * 0.9,
            image: imageUrl,
            category: 'bedding' as const,
            slug: `posciel-premium/${product.id}`,
          };
        });
        setBeddingProducts(fallbackProducts);
      }
    }
  }, [linenProducts, linenLoading]); // Usunięto getMainImage i getProductPrice z zależności

  // Pobieranie produktów firanowych przy montowaniu komponentu
  useEffect(() => {
    const fetchCurtainProducts = async () => {
      try {
        console.log('Rozpoczynam pobieranie firan...');

        // Pobieranie tylko 3 produktów z tabeli calculator_products, które są promowane
        // i sortowanie ich według promotion_index (im wyższy, tym wyżej na liście)
        const { data: curtainData, error: curtainError } = await supabase
          .from('calculator_products')
          .select('*')
          .eq('promoted', true)
          .order('promotion_index', { ascending: false })
          .limit(3);

        if (curtainError) {
          console.error('Błąd podczas pobierania firan:', curtainError);
        } else {
          console.log('Pobrane firany (surowe dane):', curtainData);

          // Mapowanie produktów firanowych
          const mappedCurtainProducts = (curtainData || []).map((product) => {
            console.log('Mapowanie produktu firany:', product);
            // Używamy image_path, albo pierwszego obrazka z tablicy images, albo imagePath
            const imageUrl = `${product.image_path}//1.webp`;
            product.imagePath || '';
            console.log('Ścieżka obrazka firany:', `${imageUrl}/1.webp}`);

            // Używamy sluga z bazy danych lub generujemy go za pomocą funkcji generateSlug
            const slug = product.slug || generateSlug(product.name, product.id);

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

    fetchCurtainProducts();
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
    <main className='flex flex-col min-h-screen overflow-x-hidden'>
      {/* Header */}

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
        background='white'
        buttonText='SPRAWDŹ'
        className='mt-8'
        moreProductsLink='/posciel-premium'
      />

      {/* Rekomendowane firany */}
      <RecommendedProducts
        title='Wybrane dla Ciebie'
        subtitle='Najlepsze firany w wyjątkowych cenach'
        products={curtainProducts}
        buttonText='SPRAWDŹ'
        background='gray'
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
