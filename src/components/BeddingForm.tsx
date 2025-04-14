'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/cartSlice';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

// Typy
export type ColorOption = 'white' | 'beige' | 'silver' | 'black';

export interface BeddingSet {
  id: number;
  label: string;
  beddingSize: string;
  pillowSize: string;
  price: number;
}

export interface SheetPrices {
  [key: string]: number;
}

export interface ColorImages {
  [key: string]: string[];
}

interface BeddingFormProps {
  beddingSets: BeddingSet[];
  sheetPrices: SheetPrices;
  colorImages: ColorImages;
}

const BeddingForm: React.FC<BeddingFormProps> = ({
  beddingSets,
  sheetPrices,
  colorImages,
}) => {
  const dispatch = useDispatch();
  const [selectedSet, setSelectedSet] = useState<BeddingSet>(beddingSets[0]);
  const [includeSheet, setIncludeSheet] = useState(false);
  const [selectedSheetSize, setSelectedSheetSize] = useState<string>(
    Object.keys(sheetPrices)[0],
  );
  const [selectedColor, setSelectedColor] = useState<ColorOption>('beige');
  const [mainImage, setMainImage] = useState<string>(colorImages.beige[0]);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Aktualizacja głównego obrazu po zmianie koloru
  useEffect(() => {
    setMainImage(colorImages[selectedColor][0]);
  }, [selectedColor, colorImages]);

  // Aktualizacja domyślnego rozmiaru prześcieradła na podstawie wybranego rozmiaru pościeli
  useEffect(() => {
    if (
      selectedSet &&
      Object.keys(sheetPrices).includes(selectedSet.beddingSize)
    ) {
      setSelectedSheetSize(selectedSet.beddingSize);
    }
  }, [selectedSet, sheetPrices]);

  // Obliczanie całkowitej ceny
  const calculateTotalPrice = () => {
    const beddingPrice = selectedSet.price;
    const sheetPrice = includeSheet ? sheetPrices[selectedSheetSize] || 0 : 0;
    return (beddingPrice + sheetPrice) * quantity;
  };

  const totalPrice = calculateTotalPrice();

  // Funkcja do dodania produktu do koszyka
  const handleAddToCart = () => {
    const colorLabel =
      selectedColor === 'white'
        ? 'biała'
        : selectedColor === 'beige'
        ? 'beżowa'
        : selectedColor === 'silver'
        ? 'srebrna'
        : 'czarna';

    const productName = `Pościel adamaszkowa SAN ANTONIO – ${colorLabel}`;

    const details = [
      `Komplet: poszwa ${selectedSet.beddingSize} i poszewka ${selectedSet.pillowSize}`,
      includeSheet ? `Prześcieradło bez gumki ${selectedSheetSize}` : '',
    ]
      .filter(Boolean)
      .join(', ');

    dispatch(
      addItem({
        id: uuidv4(),
        productName: `${productName} (${details})`,
        width: selectedSet.beddingSize.split('x')[0],
        height: selectedSet.beddingSize.split('x')[1],
        amount: totalPrice.toFixed(2),
        quantity: quantity,
      }),
    );

    setIsAddedToCart(true);

    // Resetowanie komunikatu po 3 sekundach
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 3000);
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
      {/* Lewa strona - Galeria */}
      <div className='space-y-4'>
        {/* Główny obraz */}
        <div
          className='relative h-[400px] w-full rounded-lg overflow-hidden border border-gray-200'
          data-testid='main-image-container'
        >
          <Image
            src={mainImage}
            alt='Pościel'
            fill
            className='object-cover'
            priority
            data-testid='main-product-image'
          />
        </div>

        {/* Miniatury zdjęć */}
        <div className='grid grid-cols-4 gap-2'>
          {colorImages[selectedColor].map((img, idx) => (
            <div
              key={idx}
              className={`relative h-20 cursor-pointer rounded overflow-hidden border-2 ${
                mainImage === img ? 'border-[var(--gold)]' : 'border-gray-200'
              }`}
              onClick={() => setMainImage(img)}
              data-testid={`thumbnail-${idx}`}
            >
              <Image
                src={img}
                alt={`Pościel miniatura ${idx + 1}`}
                fill
                className='object-cover'
              />
            </div>
          ))}
        </div>

        {/* Wybór koloru */}
        <div className='mt-4'>
          <h3 className='text-sm font-medium text-gray-700 mb-2'>
            Wybierz kolor:
          </h3>
          <div className='flex space-x-3'>
            <button
              className={`w-8 h-8 rounded-full bg-white border ${
                selectedColor === 'white'
                  ? 'ring-2 ring-[var(--gold)]'
                  : 'border-gray-300'
              }`}
              onClick={() => setSelectedColor('white')}
              aria-label='Biały'
              data-testid='color-white'
            />
            <button
              className={`w-8 h-8 rounded-full bg-[#E8DCCA] border ${
                selectedColor === 'beige'
                  ? 'ring-2 ring-[var(--gold)]'
                  : 'border-gray-300'
              }`}
              onClick={() => setSelectedColor('beige')}
              aria-label='Beżowy'
              data-testid='color-beige'
            />
            <button
              className={`w-8 h-8 rounded-full bg-[#C0C0C0] border ${
                selectedColor === 'silver'
                  ? 'ring-2 ring-[var(--gold)]'
                  : 'border-gray-300'
              }`}
              onClick={() => setSelectedColor('silver')}
              aria-label='Srebrny'
              data-testid='color-silver'
            />
            <button
              className={`w-8 h-8 rounded-full bg-[#333333] border ${
                selectedColor === 'black'
                  ? 'ring-2 ring-[var(--gold)]'
                  : 'border-gray-300'
              }`}
              onClick={() => setSelectedColor('black')}
              aria-label='Czarny'
              data-testid='color-black'
            />
          </div>
        </div>
      </div>

      {/* Prawa strona - Informacje o produkcie i formularz */}
      <div className='space-y-6'>
        <h1
          className='text-2xl font-bold text-[var(--deep-navy)]'
          data-testid='product-title'
        >
          Pościel adamaszkowa SAN ANTONIO –{' '}
          {selectedColor === 'white'
            ? 'biała'
            : selectedColor === 'beige'
            ? 'beżowa'
            : selectedColor === 'silver'
            ? 'srebrna'
            : 'czarna'}
        </h1>

        <div
          className='text-xl font-semibold text-[var(--gold)]'
          data-testid='product-price'
        >
          {totalPrice.toFixed(2)} zł
        </div>

        <p className='text-gray-600'>
          Luksusowa pościel adamaszkowa wykonana z najwyższej jakości bawełny
          satynowej. Elegancki wzór i wykończenie zapewniają zarówno estetykę,
          jak i komfort snu.
        </p>

        <div className='space-y-4'>
          {/* Wybór zestawu pościeli */}
          <div>
            <label className='block mb-2 font-medium text-gray-700'>
              Wybierz komplet:
            </label>
            <select
              value={selectedSet.id}
              onChange={(e) => {
                const setId = parseInt(e.target.value);
                const newSet = beddingSets.find((set) => set.id === setId);
                if (newSet) setSelectedSet(newSet);
              }}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
              data-testid='bedding-set-select'
            >
              {beddingSets.map((set) => (
                <option
                  key={set.id}
                  value={set.id}
                  data-testid={`option-set-${set.id}`}
                >
                  {set.label} - {set.price.toFixed(2)} zł
                </option>
              ))}
            </select>
          </div>

          {/* Opcja prześcieradła */}
          <div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='includeSheet'
                checked={includeSheet}
                onChange={(e) => setIncludeSheet(e.target.checked)}
                className='h-4 w-4 text-[var(--gold)] focus:ring-[var(--gold)] border-gray-300 rounded'
                data-testid='sheet-checkbox'
              />
              <label
                htmlFor='includeSheet'
                className='ml-2 block text-gray-700'
              >
                Dodaj prześcieradło bez gumki
              </label>
            </div>

            {/* Wybór rozmiaru prześcieradła - pojawia się tylko gdy checkbox jest zaznaczony */}
            {includeSheet && (
              <div className='mt-3 ml-6'>
                <label className='block mb-2 text-sm text-gray-700'>
                  Wybierz rozmiar prześcieradła:
                </label>
                <select
                  value={selectedSheetSize}
                  onChange={(e) => setSelectedSheetSize(e.target.value)}
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                  data-testid='sheet-size-select'
                >
                  {Object.keys(sheetPrices).map((size) => (
                    <option
                      key={size}
                      value={size}
                      data-testid={`option-sheet-${size}`}
                    >
                      {size} (+
                      {sheetPrices[size].toFixed(2)} zł)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Wybór ilości */}
          <div>
            <label className='block mb-2 font-medium text-gray-700'>
              Ilość:
            </label>
            <div className='flex items-center'>
              <button
                className='px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100'
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                data-testid='quantity-decrease'
              >
                -
              </button>
              <input
                type='number'
                min='1'
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className='w-16 text-center border-y border-gray-300 py-1'
                data-testid='quantity-input'
              />
              <button
                className='px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100'
                onClick={() => setQuantity(quantity + 1)}
                data-testid='quantity-increase'
              >
                +
              </button>
            </div>
          </div>

          {/* Przycisk dodania do koszyka */}
          <div className='pt-4'>
            <button
              onClick={handleAddToCart}
              className='w-full bg-[var(--gold)] hover:bg-[var(--deep-gold)] text-white py-3 px-4 rounded-md transition-colors'
              data-testid='add-to-cart-button'
            >
              Dodaj do koszyka
            </button>

            {isAddedToCart && (
              <div
                className='mt-3 p-2 bg-green-100 text-green-700 text-center rounded-md'
                data-testid='added-to-cart-message'
              >
                Produkt dodany do koszyka!
              </div>
            )}
          </div>
        </div>

        {/* Szczegóły produktu */}
        <div className='border-t border-gray-200 pt-4 mt-6'>
          <h3 className='font-medium text-gray-800 mb-2'>
            Szczegóły produktu:
          </h3>
          <ul className='list-disc list-inside space-y-1 text-gray-600'>
            <li>Materiał: 100% bawełna satynowa</li>
            <li>Wzór: adamaszek</li>
            <li>Zapięcie: na zamek</li>
            <li data-testid='product-details'>
              Zestaw zawiera: poszwę na kołdrę {selectedSet.beddingSize} i
              poszewkę na poduszkę {selectedSet.pillowSize}
              {includeSheet && `, prześcieradło bez gumki ${selectedSheetSize}`}
            </li>
            <li>Możliwość prania w 60°C</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BeddingForm;
