'use client';
import { useState } from 'react';
import Header from '../components/Header';
import Link from 'next/link';

export default function ExamplesPage() {
  const [showContent, setShowContent] = useState(false);

  const handleCtaClick = () => {
    setShowContent(true);
  };

  return (
    <main className='min-h-screen'>
      {/* Przykład nowego komponentu Header */}
      {!showContent && (
        <Header
          videoSrc='/videos/curtains.mp4'
          mainTitle='FIRANY'
          subTitle='Elegancja i jakość'
          description='Odkryj najnowsze trendy'
          ctaText='Poznaj naszą ofertę'
          onCtaClick={handleCtaClick}
          finalScale={15}
          animationDuration={3.5}
        />
      )}

      {/* Treść strony po kliknięciu przycisku CTA */}
      {showContent && (
        <div className='pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto'>
          <h1 className='text-4xl md:text-5xl font-light text-center mb-12 text-gray-800'>
            Nasza kolekcja firan
          </h1>

          {/* Nawigacja do strony głównej */}
          <div className='mb-8 text-center'>
            <Link
              href='/'
              className='text-blue-600 hover:text-blue-800 transition-colors duration-300'
            >
              Powrót do strony głównej
            </Link>
          </div>

          {/* Informacja o przykładzie */}
          <div className='bg-blue-50 p-6 rounded-lg mb-12 max-w-3xl mx-auto'>
            <h2 className='text-xl text-blue-800 mb-2'>
              Informacja o przykładzie
            </h2>
            <p className='text-gray-700'>
              Ta strona demonstruje nowy, uniwersalny komponent Header z
              animacją GSAP. Komponent jest w pełni responsywny i może być
              konfigurowany za pomocą różnych propsów.
            </p>
          </div>

          {/* Przykładowa treść strony */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className='bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 duration-300'
              >
                <div className='h-64 bg-gray-200'></div>
                <div className='p-6'>
                  <h3 className='text-xl font-medium mb-2'>
                    Kolekcja firany {index + 1}
                  </h3>
                  <p className='text-gray-600 mb-4'>
                    Elegancki design dostosowany do nowoczesnych wnętrz.
                  </p>
                  <button className='bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors duration-300'>
                    Szczegóły
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Przycisk do ponownego pokazania Header */}
          <div className='mt-16 text-center'>
            <button
              onClick={() => setShowContent(false)}
              className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300'
            >
              Pokaż ponownie animację nagłówka
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
