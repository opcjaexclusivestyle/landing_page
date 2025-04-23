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

// Komponent strony głównej - pobiera dane z serwera i przekazuje do komponentu klienta
export default async function Home() {
  // Pobieranie postów blogowych z Supabase
  const blogPosts = await fetchBlogPosts(3); // Pobieramy tylko 3 posty na stronę główną

  return <HomeClient blogPosts={blogPosts} />;
}
