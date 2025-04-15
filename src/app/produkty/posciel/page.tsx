'use client';

import React from 'react';
import ProductForm from '@/components/ProductForm';
import productData from '@/data/productData.json';
import { ProductData } from '@/components/ProductForm';

const BeddingProductPage: React.FC = () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <nav className='flex' aria-label='Breadcrumb'>
          <ol className='inline-flex items-center space-x-1 md:space-x-3'>
            <li className='inline-flex items-center'>
              <a href='/' className='text-gray-700 hover:text-gray-900'>
                Strona główna
              </a>
            </li>
            <li>
              <div className='flex items-center'>
                <span className='mx-2 text-gray-400'>/</span>
                <a
                  href='/produkty'
                  className='text-gray-700 hover:text-gray-900'
                >
                  Produkty
                </a>
              </div>
            </li>
            <li>
              <div className='flex items-center'>
                <span className='mx-2 text-gray-400'>/</span>
                <span className='text-gray-500'>Pościel</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <ProductForm productData={productData as ProductData} />

      <div className='mt-16 border-t border-gray-200 pt-8'>
        <h2 className='text-2xl font-bold mb-4'>Szczegółowy opis produktu</h2>
        <div className='prose max-w-none'>
          <p>
            Pościel adamaszkowa SAN ANTONIO to luksusowy wybór dla miłośników
            eleganckiej pościeli. Wykonana z najwyższej jakości bawełny
            satynowej, łączy w sobie piękny design z wyjątkowym komfortem.
          </p>

          <h3 className='text-xl font-semibold mt-6 mb-3'>Zalety produktu:</h3>
          <ul className='list-disc pl-5 space-y-2'>
            <li>
              Elegancki wzór adamaszkowy, który dodaje sypialni luksusowego
              charakteru
            </li>
            <li>
              Wykonana z bawełny satynowej o wysokiej gramaturze zapewniającej
              trwałość
            </li>
            <li>
              Dostępna w czterech klasycznych kolorach pasujących do każdego
              wystroju
            </li>
            <li>
              Zamek błyskawiczny ułatwiający wkładanie i zdejmowanie poszewek
            </li>
            <li>Doskonale reguluje temperaturę ciała podczas snu</li>
            <li>Łatwa w pielęgnacji - możliwość prania w temperaturze 60°C</li>
          </ul>

          <h3 className='text-xl font-semibold mt-6 mb-3'>Pielęgnacja:</h3>
          <p>
            Aby zachować piękny wygląd pościeli przez długi czas, zalecamy
            pranie w temperaturze do 60°C. Pościel można suszyć w suszarce
            bębnowej w niskiej temperaturze. Prasowanie nie jest konieczne, ale
            dla uzyskania idealnie gładkiej powierzchni można prasować w
            średniej temperaturze.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BeddingProductPage;
