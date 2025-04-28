'use client';
import Image from 'next/image';
import React from 'react';

const PortfolioSection = () => {
  return (
    <section id='realizacje' className='py-20 bg-white'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl font-bold text-center text-gray-900 mb-8'>
          Metamorfozy wnętrz naszych klientów
        </h2>

        {/* Grid z 5 elementami w określonym układzie */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
          {/* Pierwszy rząd: 2/3 + 1/3 */}
          {/* Portfolio Item 1 - Element zajmujący 2/3 szerokości */}
          <div className='md:col-span-2 overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:-translate-y-2'>
            <div className='relative h-96 overflow-hidden'>
              <Image
                src='/images/kitchen.jpg'
                alt='Luksusowe zasłony w apartamencie'
                width={1200}
                height={800}
                className='w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8'>
                <h3 className='text-2xl font-bold text-white mb-2 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100'>
                  Luksusowe zasłony w apartamencie
                </h3>
                <p className='text-gray-200 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150'>
                  Warszawa, 2024
                </p>
                <button className='mt-4 w-max bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200'>
                  Zobacz projekt
                </button>
              </div>
            </div>
          </div>

          {/* Portfolio Item 2 - Element zajmujący 1/3 szerokości */}
          <div className='md:col-span-1 overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:-translate-y-2'>
            <div className='relative h-96 overflow-hidden'>
              <Image
                src='/images/Rolety.jpg'
                alt='Rolety w sypialni'
                width={600}
                height={800}
                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8'>
                <h3 className='text-xl font-bold text-white mb-2 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100'>
                  Nowoczesne rolety w sypialni
                </h3>
                <p className='text-gray-200 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150'>
                  Kraków, 2024
                </p>
                <button className='mt-4 w-max bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200'>
                  Zobacz projekt
                </button>
              </div>
            </div>
          </div>

          {/* Drugi rząd: Pełna szerokość 3/3 */}
          {/* Portfolio Item 3 - Element zajmujący pełną szerokość */}
          <div className='md:col-span-3 overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:-translate-y-2'>
            <div className='relative h-80 overflow-hidden'>
              <Image
                src='/images/posciel.png'
                alt='Pościel hotelowa'
                width={1200}
                height={600}
                className='w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8'>
                <h3 className='text-xl font-bold text-white mb-2 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100'>
                  Luksusowa pościel hotelowa
                </h3>
                <p className='text-gray-200 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150'>
                  Gdańsk, 2023
                </p>
                <button className='mt-4 w-max bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200'>
                  Zobacz projekt
                </button>
              </div>
            </div>
          </div>

          {/* Trzeci rząd: 1/3 + 2/3 */}
          {/* Portfolio Item 4 - Element zajmujący 1/3 szerokości */}
          <div className='md:col-span-1 overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:-translate-y-2'>
            <div className='relative h-80 overflow-hidden'>
              <Image
                src='/images/Firany.jpg'
                alt='Firany w kuchni'
                width={600}
                height={800}
                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8'>
                <h3 className='text-xl font-bold text-white mb-2 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100'>
                  Delikatne firany w jasnej kuchni
                </h3>
                <p className='text-gray-200 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150'>
                  Poznań, 2024
                </p>
                <button className='mt-4 w-max bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200'>
                  Zobacz projekt
                </button>
              </div>
            </div>
          </div>

          {/* Portfolio Item 5 - Element zajmujący 2/3 szerokości */}
          <div className='md:col-span-2 overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:-translate-y-2'>
            <div className='relative h-80 overflow-hidden'>
              <Image
                src='/images/kitchen.jpg'
                alt='Zasłony w jadalni'
                width={1200}
                height={600}
                className='w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8'>
                <h3 className='text-xl font-bold text-white mb-2 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100'>
                  Eleganckie zasłony w jadalni
                </h3>
                <p className='text-gray-200 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150'>
                  Wrocław, 2023
                </p>
                <button className='mt-4 w-max bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200'>
                  Zobacz projekt
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='text-center'>
          <button className='premium-button'>Zobacz więcej realizacji</button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
