'use client';

import React from 'react';
import Link from 'next/link';
import SimpleHeader from '../components/SimpleHeader';
import BeddingForm, {
  BeddingProductData,
  ColorOption,
  BeddingSet,
} from '../../components/BeddingForm';
import productDataJson from '../../data/productData.json';

// Transformacja danych z JSON do formatu BeddingProductData
const mapProductDataToBeddingForm = (): BeddingProductData => {
  // Mapowanie wariantów z JSON na BeddingSets
  const beddingSets: BeddingSet[] = productDataJson.variants.map((variant) => {
    // Wyodrębniamy rozmiar poszwy i poszewki z opisu
    const sizeParts = variant.additionalInfo.split(' i ');
    const beddingSize = variant.size; // Z JSONa
    const pillowSize =
      sizeParts.length > 1
        ? sizeParts[1]
            .replace('poszewka ', '')
            .replace('poszewki ', '')
            .split(' ')[0]
        : '70x80'; // Domyślny rozmiar, jeśli nie można wyodrębnić

    return {
      id: variant.id,
      label: `${beddingSize} + ${pillowSize}`,
      beddingSize: beddingSize,
      pillowSize: pillowSize,
      price: variant.price,
    };
  });

  // Tworzymy cennik prześcieradeł z opcji dodatkowych
  const sheetOption = productDataJson.additionalOptions.find(
    (option) => option.name === 'sheet',
  );
  const sheetPrices = sheetOption?.sizes || {};

  // Mapowanie kolorów
  const colors = Object.entries(productDataJson.colors).reduce(
    (acc, [colorKey, colorData]) => {
      acc[colorKey] = {
        images: colorData.images,
        displayName: colorData.displayName,
        displayColor: colorData.displayColor,
      };
      return acc;
    },
    {} as BeddingProductData['colors'],
  );

  return {
    name: productDataJson.name,
    description: productDataJson.description,
    beddingSets: beddingSets,
    sheetPrices: sheetPrices,
    colors: colors,
    defaultColor: productDataJson.defaultColor as ColorOption,
    features: productDataJson.features,
  };
};

const productData = mapProductDataToBeddingForm();

export default function PrzescieradloPage() {
  return (
    <>
      <SimpleHeader
        videoSrc='/video/linen.mp4'
        title='Pościel i Prześcieradła'
        subtitle='Komfort i elegancja'
        description='Odkryj naszą kolekcję luksusowej pościeli'
        height='60vh'
      />

      <div className='min-h-screen py-10 px-4 md:px-8 lg:px-16 bg-[var(--light-gold)]'>
        {/* Nagłówek z przyciskiem powrotu */}
        <div className='mb-8 flex justify-between items-center'>
          <Link
            href='/'
            className='text-gray-600 hover:text-gray-800 transition-colors duration-300'
          >
            &larr; Powrót do strony głównej
          </Link>
          <h2 className='text-3xl md:text-4xl font-light text-gray-800'>
            Pościel i Prześcieradła
          </h2>
          <div className='w-[100px]'></div> {/* Pusty element dla wyrównania */}
        </div>

        <div className='max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6 my-8'>
          {/* Komponent formularza pościeli z danymi z pliku JSON */}
          <BeddingForm productData={productData} />
        </div>
      </div>
    </>
  );
}
