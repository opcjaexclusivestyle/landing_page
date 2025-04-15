import { ReactNode } from 'react';

export const metadata = {
  title: 'Panel administracyjny',
  description: 'Panel administracyjny do zarządzania produktami',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex min-h-screen'>
      {/* Sidebar nawigacyjny */}
      <aside className='w-64 bg-[var(--deep-navy)] text-white p-6'>
        <h1 className='text-2xl font-bold mb-6'>Panel Admina</h1>
        <nav className='space-y-2'>
          <a
            href='/admin'
            className='block py-2 px-4 hover:bg-[var(--gold)] rounded transition-colors'
          >
            Pulpit
          </a>
          <a
            href='/admin/produkty'
            className='block py-2 px-4 hover:bg-[var(--gold)] rounded transition-colors'
          >
            Produkty
          </a>
          <a
            href='/admin/produkty/nowy'
            className='block py-2 px-4 hover:bg-[var(--gold)] rounded transition-colors'
          >
            Dodaj nowy produkt
          </a>
          <a
            href='/admin/zamowienia'
            className='block py-2 px-4 hover:bg-[var(--gold)] rounded transition-colors'
          >
            Zamówienia
          </a>
        </nav>
      </aside>

      {/* Główna zawartość */}
      <main className='flex-1 p-8 bg-gray-50'>{children}</main>
    </div>
  );
}
