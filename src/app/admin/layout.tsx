'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logoutUser, loginUser } from '@/redux/actions';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminLayout({ children }: { children: ReactNode }) {
  console.log('🔷 Renderowanie layoutu administratora');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // Używamy naszego hooka do weryfikacji uprawnień
  const { isVerifying } = useAdminAuth();

  const handleLogout = async () => {
    console.log('🔷 Wylogowywanie...');

    // Usuwamy dane admina z sessionStorage i localStorage
    try {
      // Czyścimy sessionStorage
      sessionStorage.removeItem('adminVerified');
      sessionStorage.removeItem('adminUserName');
      sessionStorage.removeItem('adminDashboardStats');
      sessionStorage.removeItem('adminDashboardStatsTime');

      // Czyścimy również localStorage
      localStorage.removeItem('adminVerified');
      localStorage.removeItem('adminUserName');
    } catch (e) {
      console.error('Błąd podczas czyszczenia danych przeglądarki:', e);
    }

    await supabase.auth.signOut();
    console.log('🔷 Wylogowano z Supabase');

    // Aktualizacja stanu Redux
    dispatch(logoutUser());

    router.push('/login');
    console.log('🔷 Przekierowano na stronę logowania');
  };

  if (isVerifying) {
    console.log('🔷 Weryfikacja uprawnień w toku...');
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='w-12 h-12 border-4 border-t-[var(--gold)] border-gray-200 rounded-full animate-spin'></div>
      </div>
    );
  }

  console.log('🔷 Renderuję pełny layout administratora');
  return (
    <div className='flex min-h-screen'>
      {/* Sidebar nawigacyjny */}
      <aside className='w-64 bg-[var(--deep-navy)] text-white p-6'>
        <h1 className='text-2xl font-bold mb-6'>Panel Admina</h1>

        {user?.email && (
          <div className='mb-6 pb-4 border-b border-gray-700'>
            <p className='text-sm text-gray-300'>Zalogowany jako:</p>
            <p className='font-medium truncate'>{user.email}</p>
          </div>
        )}

        <nav className='space-y-1'>
          <Link
            href='/admin'
            className='block py-2 px-4 hover:bg-[var(--gold)] rounded transition-colors'
          >
            Pulpit
          </Link>

          {/* Produkty */}
          <div className='pt-2 mt-2 border-t border-gray-700'>
            <p className='text-xs uppercase tracking-wider text-gray-400 px-4 py-1'>
              Produkty
            </p>
          </div>

          <Link
            href='/admin/produkty-lniane'
            className='block py-2 px-4 hover:bg-[var(--gold)] rounded transition-colors'
          >
            Produkty lniane
          </Link>

          <Link
            href='/admin/kalkulator-produkty'
            className='block py-2 px-4 hover:bg-[var(--gold)] rounded transition-colors'
          >
            Produkty kalkulatora
          </Link>

          <Link
            href='/admin/produkty-zaslony'
            className='block py-2 px-4 hover:bg-[var(--gold)] rounded transition-colors'
          >
            Zasłony
          </Link>

          {/* Blog */}
          <div className='pt-2 mt-2 border-t border-gray-700'>
            <p className='text-xs uppercase tracking-wider text-gray-400 px-4 py-1'>
              Blog
            </p>
          </div>

          <Link
            href='/admin/blog'
            className='block py-2 px-4 hover:bg-[var(--gold)] rounded transition-colors'
          >
            Wpisy na blogu
          </Link>

          {/* Opinie */}
          <div className='pt-2 mt-2 border-t border-gray-700'>
            <p className='text-xs uppercase tracking-wider text-gray-400 px-4 py-1'>
              Opinie
            </p>
          </div>

          <Link
            href='/admin/opinie'
            className='block py-2 px-4 hover:bg-[var(--gold)] rounded transition-colors'
          >
            Opinie klientów
          </Link>

          {/* Inne */}
          <div className='pt-4 mt-6 border-t border-gray-700'>
            <button
              onClick={handleLogout}
              className='w-full text-left py-2 px-4 hover:bg-red-600 rounded transition-colors text-gray-200 hover:text-white'
            >
              Wyloguj się
            </button>
          </div>
        </nav>
      </aside>

      {/* Główna zawartość */}
      <main className='flex-1 p-8 bg-gray-50 overflow-auto'>{children}</main>
    </div>
  );
}
