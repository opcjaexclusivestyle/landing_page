import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Firany i Rolety | Eleganckie rozwiązania dla Twojego domu',
  description:
    'Oferujemy luksusowe firany i rolety na wymiar, które idealnie dopasują się do Twojego wnętrza. Profesjonalne doradztwo i najwyższa jakość wykonania.',
  keywords:
    'firany, rolety, dekoracje okienne, żaluzje, zasłony, rolety rzymskie, firany na wymiar',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pl'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <footer className='bg-[var(--deep-navy)] text-white py-8 mt-10'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {/* Informacje o firmie */}
              <div>
                <h3 className='text-xl font-medium mb-4'>Firany & Rolety</h3>
                <p className='text-gray-300'>
                  Tworzymy eleganckie rozwiązania dla każdego wnętrza. Nasze
                  produkty łączą w sobie piękno, funkcjonalność i wysoką jakość
                  wykonania.
                </p>
              </div>

              {/* Szybkie linki */}
              <div>
                <h3 className='text-xl font-medium mb-4'>Szybkie linki</h3>
                <ul className='space-y-2'>
                  <li>
                    <a
                      href='/firany'
                      className='text-gray-300 hover:text-white transition-colors'
                    >
                      Firany
                    </a>
                  </li>
                  <li>
                    <a
                      href='/rolety'
                      className='text-gray-300 hover:text-white transition-colors'
                    >
                      Rolety
                    </a>
                  </li>
                  <li>
                    <a
                      href='/kontakt'
                      className='text-gray-300 hover:text-white transition-colors'
                    >
                      Kontakt
                    </a>
                  </li>
                </ul>
              </div>

              {/* Kontakt */}
              <div>
                <h3 className='text-xl font-medium mb-4'>Kontakt</h3>
                <p className='text-gray-300 mb-2'>
                  ul. Przykładowa 123
                  <br />
                  00-000 Warszawa
                </p>
                <p className='text-gray-300'>
                  Tel: +48 123 456 789
                  <br />
                  Email: kontakt@firany-rolety.pl
                </p>
              </div>
            </div>

            <div className='mt-8 pt-8 border-t border-gray-700 text-center text-gray-400'>
              <p>
                &copy; {new Date().getFullYear()} Firany & Rolety. Wszelkie
                prawa zastrzeżone.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
