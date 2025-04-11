'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

const HeroSection = () => {
  const sectionRef = useRef(null);
  const leftPanelRef = useRef(null);
  const boxesRef = useRef([]);
  const overlayRef = useRef(null);

  useEffect(() => {
    // Animacja tła
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 },
    );

    // Animacja głównego kontenera
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.2 },
    );

    // Animacja lewego panelu
    gsap.fromTo(
      leftPanelRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, delay: 0.3, ease: 'power2.out' },
    );

    // Animacja boxów - pojawianie się jeden po drugim z efektem sprężystości
    boxesRef.current.forEach((box, index) => {
      gsap.fromTo(
        box,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.5 + index * 0.15,
          ease: 'back.out(1.2)',
        },
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className='hero-section w-full py-16 md:py-20 lg:py-24 flex items-center relative overflow-hidden'
    >
      {/* Tło z obrazem */}
      <div className='absolute inset-0 z-0 overflow-hidden'>
        <Image
          src='/images/hero/background.jpg'
          alt='Eleganckie wnętrze z dekoracyjnymi firanamai'
          fill
          priority
          className='object-cover object-center'
        />
        <div
          ref={overlayRef}
          className='absolute inset-0 bg-gradient-to-r from-green-50/85 to-green-100/70 backdrop-blur-[2px]'
        ></div>
      </div>

      <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10'>
          {/* Lewa sekcja - zajmuje 2/5 szerokości na dużych ekranach */}
          <div
            ref={leftPanelRef}
            className='col-span-1 lg:col-span-2 bg-white/90 rounded-3xl p-8 md:p-10 shadow-xl flex flex-col justify-center backdrop-blur-sm border border-green-100'
          >
            <h2 className='text-3xl md:text-4xl font-bold text-green-700 mb-6'>
              Odmień swoje wnętrze i zyskaj 20% rabatu!
            </h2>
            <p className='text-gray-700 text-lg mb-4'>
              Pochwal się metamorfozą Twojego wnętrza. Prześlij nam zdjęcia
              pomieszczenia przed i po zawieszeniu naszych firan lub zasłon, a
              otrzymasz 20% zniżki na kolejny produkt.
            </p>
            <p className='text-gray-700 text-lg mb-8'>
              Zainspiruj innych swoją aranżacją i zgarnij rabat na kolejne
              piękne dodatki do domu.
            </p>
            <button className='bg-green-600 hover:bg-green-700 text-white text-lg font-medium py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-md w-fit'>
              Skontaktuj się z nami
            </button>
          </div>

          {/* Prawa sekcja - zajmuje 3/5 szerokości na dużych ekranach */}
          <div className='col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 lg:gap-8'>
            {/* Box 1 */}
            <div
              ref={(el) => (boxesRef.current[0] = el)}
              className='bg-white/90 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all h-60 sm:h-auto flex flex-col group'
            >
              <div className='relative h-28 overflow-hidden'>
                <Image
                  src='/images/hero/curtain-samples.jpg'
                  alt='Próbki tkanin'
                  fill
                  className='object-cover group-hover:scale-105 transition-transform duration-700'
                />
              </div>
              <div className='p-5 flex-grow flex flex-col justify-between'>
                <h3 className='text-xl font-semibold text-green-700 mb-2'>
                  Zamów próbki tkanin z dostawą gratis!
                </h3>
                <p className='text-gray-600'>
                  Sprawdź, czy nasze produkty pasują do Twojego wnętrza – zamów
                  próbki i otrzymaj je z dostawą gratis!
                </p>
              </div>
            </div>

            {/* Box 2 */}
            <div
              ref={(el) => (boxesRef.current[1] = el)}
              className='bg-white/90 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all h-60 sm:h-auto flex flex-col group'
            >
              <div className='relative h-28 overflow-hidden'>
                <Image
                  src='/images/hero/custom-curtains.jpg'
                  alt='Tkaniny szyte na wymiar'
                  fill
                  className='object-cover group-hover:scale-105 transition-transform duration-700'
                />
              </div>
              <div className='p-5 flex-grow flex flex-col justify-between'>
                <h3 className='text-xl font-semibold text-green-700 mb-2'>
                  Tkaniny szyte na wymiar
                </h3>
                <p className='text-gray-600'>
                  Idealne dopasowanie do Twojego okna – oferujemy tkaniny szyte
                  dokładnie na wymiar!
                </p>
              </div>
            </div>

            {/* Box 3 */}
            <div
              ref={(el) => (boxesRef.current[2] = el)}
              className='bg-white/90 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all h-60 sm:h-auto flex flex-col group'
            >
              <div className='relative h-28 overflow-hidden'>
                <Image
                  src='/images/hero/delivery.jpg'
                  alt='Darmowa dostawa'
                  fill
                  className='object-cover group-hover:scale-105 transition-transform duration-700'
                />
              </div>
              <div className='p-5 flex-grow flex flex-col justify-between'>
                <h3 className='text-xl font-semibold text-green-700 mb-2'>
                  Darmowa dostawa od 399 zł
                </h3>
                <p className='text-gray-600'>
                  Zrób zakupy już teraz i skorzystaj z darmowej dostawy przy
                  zamówieniu od 399 zł!
                </p>
              </div>
            </div>

            {/* Box 4 */}
            <div
              ref={(el) => (boxesRef.current[3] = el)}
              className='bg-gradient-to-br from-green-50 to-green-100/90 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all h-60 sm:h-auto cursor-pointer group relative'
            >
              <div className='relative h-full w-full flex items-center justify-center p-6'>
                <div className='absolute inset-0 overflow-hidden opacity-20'>
                  <Image
                    src='/images/hero/new-collection.jpg'
                    alt='Nowa oferta'
                    fill
                    className='object-cover object-center'
                  />
                </div>
                <div className='bg-white/60 backdrop-blur-sm rounded-xl p-6 w-full h-full flex items-center justify-center'>
                  <div className='text-center'>
                    <span className='font-semibold text-xl text-green-800 block mb-2 group-hover:scale-105 transition-transform'>
                      Nowa kolekcja!
                    </span>
                    <span className='text-green-700'>
                      Już wkrótce nowa oferta - zapisz się, aby otrzymać
                      powiadomienie!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
