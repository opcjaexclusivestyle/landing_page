'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import JwtDebugger from '@/components/JwtDebugger';

interface AdminStats {
  blogCount: number;
  productsLinenCount: number;
  calculatorProductsCount: number;
  testimonialsCount: number;
}

export default function AdminDashboard() {
  const { isVerifying } = useAdminAuth();
  const [stats, setStats] = useState<AdminStats>({
    blogCount: 0,
    productsLinenCount: 0,
    calculatorProductsCount: 0,
    testimonialsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isVerifying) {
      fetchStats();
    }
  }, [isVerifying]);

  async function fetchStats() {
    try {
      setLoading(true);

      // Pobieranie liczby wpisów na blogu
      const { count: blogCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });

      // Pobieranie liczby produktów lnianych
      const { count: productsLinenCount } = await supabase
        .from('products_linen')
        .select('*', { count: 'exact', head: true });

      // Pobieranie liczby produktów kalkulatora
      const { count: calculatorProductsCount } = await supabase
        .from('calculator_products')
        .select('*', { count: 'exact', head: true });

      // Pobieranie liczby opinii
      const { count: testimonialsCount } = await supabase
        .from('testimonials')
        .select('*', { count: 'exact', head: true });

      setStats({
        blogCount: blogCount || 0,
        productsLinenCount: productsLinenCount || 0,
        calculatorProductsCount: calculatorProductsCount || 0,
        testimonialsCount: testimonialsCount || 0,
      });
    } catch (error) {
      console.error('Błąd podczas pobierania statystyk:', error);
    } finally {
      setLoading(false);
    }
  }

  // Zwracamy komponent ładowania, gdy trwa weryfikacja
  if (isVerifying) {
    return (
      <div className='text-center py-10'>
        <div className='w-12 h-12 border-4 border-t-[var(--gold)] border-gray-200 rounded-full animate-spin mx-auto'></div>
        <p className='mt-4 text-gray-600'>Weryfikacja uprawnień...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className='text-3xl font-bold mb-8'>Panel Administratora</h1>

      {/* Debugger JWT - tylko w środowisku deweloperskim */}
      {process.env.NODE_ENV === 'development' && <JwtDebugger />}

      {loading ? (
        <div className='text-center py-10'>
          <div className='w-12 h-12 border-4 border-t-[var(--gold)] border-gray-200 rounded-full animate-spin mx-auto'></div>
          <p className='mt-4 text-gray-600'>Ładowanie danych...</p>
        </div>
      ) : (
        <>
          {/* Karty ze statystykami */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <Link
              href='/admin/produkty-lniane'
              className='bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow'
            >
              <h2 className='text-xl font-medium text-gray-700 mb-2'>
                Produkty lniane
              </h2>
              <p className='text-3xl font-bold text-[var(--gold)]'>
                {stats.productsLinenCount}
              </p>
              <p className='text-sm text-gray-500 mt-2'>
                Łączna liczba produktów lnianych
              </p>
            </Link>

            <Link
              href='/admin/kalkulator-produkty'
              className='bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow'
            >
              <h2 className='text-xl font-medium text-gray-700 mb-2'>
                Produkty kalkulatora
              </h2>
              <p className='text-3xl font-bold text-[var(--gold)]'>
                {stats.calculatorProductsCount}
              </p>
              <p className='text-sm text-gray-500 mt-2'>
                Łączna liczba produktów kalkulatora
              </p>
            </Link>

            <Link
              href='/admin/blog'
              className='bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow'
            >
              <h2 className='text-xl font-medium text-gray-700 mb-2'>Blog</h2>
              <p className='text-3xl font-bold text-[var(--gold)]'>
                {stats.blogCount}
              </p>
              <p className='text-sm text-gray-500 mt-2'>
                Łączna liczba wpisów na blogu
              </p>
            </Link>

            <Link
              href='/admin/opinie'
              className='bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow'
            >
              <h2 className='text-xl font-medium text-gray-700 mb-2'>Opinie</h2>
              <p className='text-3xl font-bold text-[var(--gold)]'>
                {stats.testimonialsCount}
              </p>
              <p className='text-sm text-gray-500 mt-2'>
                Łączna liczba opinii klientów
              </p>
            </Link>
          </div>

          {/* Instrukcje */}
          <div className='bg-white shadow rounded-lg p-6 mb-8'>
            <h2 className='text-xl font-medium text-gray-700 mb-4'>
              Witaj w panelu administratora!
            </h2>
            <p className='text-gray-600 mb-4'>
              Z tego miejsca możesz zarządzać wszystkimi produktami, wpisami na
              blogu i opiniami klientów. Wybierz jedną z sekcji powyżej lub z
              menu bocznego, aby rozpocząć edycję.
            </p>
            <div className='bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700'>
              <p className='font-medium'>Wskazówka:</p>
              <p>
                Wszystkie zmiany są zapisywane natychmiast w bazie danych.
                Upewnij się, że wprowadzasz poprawne dane.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
