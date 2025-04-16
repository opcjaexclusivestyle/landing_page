/**
 * Główny komponent strony
 *
 * Ten plik to komponent serwerowy Next.js, który:
 * 1. Pobiera dane (np. posty blogowe) asynchronicznie po stronie serwera
 * 2. Przekazuje te dane do komponentu klienckiego (HomeClient)
 *
 * Ważne:
 * - Ten plik NIE ma deklaracji 'use client', więc działa na serwerze
 * - Możemy tutaj używać async/await (które nie jest dozwolone w komponentach klienckich)
 */

import { fetchBlogPosts } from '@/lib/supabase';
import HomeClient from '@/components/HomeClient';

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

// Komponent strony głównej - pobiera dane z serwera i przekazuje do komponentu klienta
export default async function Home() {
  // Pobieranie postów blogowych z Supabase
  const blogPosts = await fetchBlogPosts(3); // Pobieramy tylko 3 posty na stronę główną

  return (
    <HomeClient
      blogPosts={blogPosts}
      recommendedProducts={recommendedProducts}
      beddingProducts={beddingProducts}
    />
  );
}
