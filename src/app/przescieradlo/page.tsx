'use client';

import React from 'react';
import Link from 'next/link';
import SimpleHeader from '../components/SimpleHeader';
import BeddingForm, {
  BeddingSet,
  SheetPrices,
  ColorImages,
} from '../../components/BeddingForm';

// Zdefiniowane gotowe zestawy pościeli (poszwa + poszewka) z cenami
const beddingSets: BeddingSet[] = [
  {
    id: 1,
    label: '135x200 + 50x60',
    beddingSize: '135x200',
    pillowSize: '50x60',
    price: 195.99,
  },
  {
    id: 2,
    label: '140x200 + 70x80',
    beddingSize: '140x200',
    pillowSize: '70x80',
    price: 199.99,
  },
  {
    id: 3,
    label: '150x200 + 50x60',
    beddingSize: '150x200',
    pillowSize: '50x60',
    price: 215.15,
  },
  {
    id: 4,
    label: '160x200 + 70x80',
    beddingSize: '160x200',
    pillowSize: '70x80',
    price: 227.22,
  },
  {
    id: 5,
    label: '180x200 + 70x80',
    beddingSize: '180x200',
    pillowSize: '70x80',
    price: 259.9,
  },
  {
    id: 6,
    label: '200x200 + 50x60',
    beddingSize: '200x200',
    pillowSize: '50x60',
    price: 290.99,
  },
  {
    id: 7,
    label: '220x200 + 70x80',
    beddingSize: '220x200',
    pillowSize: '70x80',
    price: 316.0,
  },
  {
    id: 8,
    label: '240x220 + 70x80',
    beddingSize: '240x220',
    pillowSize: '70x80',
    price: 345.0,
  },
];

// Cennik prześcieradeł
const sheetPrices: SheetPrices = {
  '135x200': 91.0,
  '140x200': 94.25,
  '150x200': 199.9,
  '160x200': 107.25,
  '180x200': 120.25,
  '200x200': 133.25,
  '220x200': 146.25,
  '240x220': 159.25,
};

// Ścieżki obrazów dla różnych kolorów
const colorImages: ColorImages = {
  white: [
    '/images/linen/white_1.jpg',
    '/images/linen/white_6.jpg',
    '/images/linen/white_7.jpg',
    '/images/linen/white_9.jpg',
  ],
  beige: [
    '/images/linen/beige_11.jpg',
    '/images/linen/beige_14.jpg',
    '/images/linen/beige_16.jpg',
    '/images/linen/beige_19.jpg',
  ],
  silver: [
    '/images/linen/silver_22.jpg',
    '/images/linen/silver_24.jpg',
    '/images/linen/silver_26.jpg',
    '/images/linen/silver_28.jpg',
  ],
  black: [
    '/images/linen/black_30.jpg',
    '/images/linen/black_32.jpg',
    '/images/linen/black_34.jpg',
    '/images/linen/black_36.jpg',
  ],
};

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
          {/* Komponent formularza pościeli */}
          <BeddingForm
            beddingSets={beddingSets}
            sheetPrices={sheetPrices}
            colorImages={colorImages}
          />
        </div>
      </div>
    </>
  );
}
