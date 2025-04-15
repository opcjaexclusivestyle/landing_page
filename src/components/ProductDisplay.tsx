'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

// Typy
interface SizeVariant {
  id: string;
  label: string;
  beddingSize?: string;
  pillowSize?: string;
  price: number;
}

interface ColorVariant {
  color: string;
  name: string;
  images: string[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  regular_price: number;
  current_price: number;
  lowest_price: number;
  sizes: SizeVariant[];
  color_variants: ColorVariant[];
  sheet_prices: { [key: string]: number };
  benefits: string[];
  main_image: string;
}

interface ProductDisplayProps {
  product: Product;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ product }) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState<SizeVariant>(
    product.sizes[0] || { id: '0', label: '', price: 0 },
  );
  const [includeSheet, setIncludeSheet] = useState(false);
  const [selectedSheetSize, setSelectedSheetSize] = useState<string>(
    Object.keys(product.sheet_prices)[0] || '',
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.color_variants[0]?.color || '',
  );
  const [mainImage, setMainImage] = useState<string>(
    product.color_variants[0]?.images[0] || product.main_image || '',
  );
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Aktualizacja głównego obrazu po zmianie koloru
  useEffect(() => {
    const colorVariant = product.color_variants.find(
      (c) => c.color === selectedColor,
    );
    if (colorVariant && colorVariant.images.length > 0) {
      setMainImage(colorVariant.images[0]);
    }
  }, [selectedColor, product.color_variants]);

  // Aktualizacja domyślnego rozmiaru prześcieradła na podstawie wybranego rozmiaru pościeli
  useEffect(() => {
    if (
      selectedSize?.beddingSize &&
      Object.keys(product.sheet_prices).includes(selectedSize.beddingSize)
    ) {
      setSelectedSheetSize(selectedSize.beddingSize);
    }
  }, [selectedSize, product.sheet_prices]);

  // Obliczanie całkowitej ceny
  const calculateTotalPrice = () => {
    const basePrice = selectedSize?.price || product.current_price;
    const sheetPrice = includeSheet
      ? product.sheet_prices[selectedSheetSize] || 0
      : 0;
    return (basePrice + sheetPrice) * quantity;
  };

  const totalPrice = calculateTotalPrice();

  // Funkcja do dodania produktu do koszyka
  const handleAddToCart = () => {
    const colorVariant = product.color_variants.find(
      (c) => c.color === selectedColor,
    );
    const colorName = colorVariant?.name || selectedColor;

    const productDetails = [
      selectedSize?.label ? `${selectedSize.label}` : '',
      selectedSize?.beddingSize && selectedSize?.pillowSize
        ? `(poszwa ${selectedSize.beddingSize} i poszewka ${selectedSize.pillowSize})`
        : '',
      includeSheet && selectedSheetSize
        ? `Prześcieradło ${selectedSheetSize}`
        : '',
    ]
      .filter(Boolean)
      .join(', ');

    dispatch(
      addToCart({
        id: uuidv4(),
        name: `${product.name} - ${colorName}${
          productDetails ? ` (${productDetails})` : ''
        }`,
        price: totalPrice,
        quantity: quantity,
        options: {
          width: selectedSize?.beddingSize?.split('x')[0] || '',
          height: selectedSize?.beddingSize?.split('x')[1] || '',
          embroidery: false,
          curtainRod: false,
        },
      }),
    );

    setIsAddedToCart(true);

    // Resetowanie komunikatu po 3 sekundach
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 3000);
  };

  // Jeśli nie ma produktu lub jest nieprawidłowy
  if (!product || !product.id) {
    return (
      <div className='p-8 text-center'>
        Produkt nie został znaleziony lub jest niedostępny.
      </div>
    );
  }

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
            alt={product.name}
            fill
            className='object-cover'
            priority
            data-testid='main-product-image'
          />
        </div>

        {/* Miniatury zdjęć */}
        <div className='grid grid-cols-4 gap-2'>
          {product.color_variants
            .find((c) => c.color === selectedColor)
            ?.images.map((img, idx) => (
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
                  alt={`${product.name} miniatura ${idx + 1}`}
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
            {product.color_variants.map((colorVariant, idx) => (
              <button
                key={idx}
                className={`w-8 h-8 rounded-full border ${
                  selectedColor === colorVariant.color
                    ? 'ring-2 ring-[var(--gold)]'
                    : 'border-gray-300'
                }`}
                style={{
                  backgroundColor: colorVariant.color.startsWith('#')
                    ? colorVariant.color
                    : '',
                }}
                onClick={() => setSelectedColor(colorVariant.color)}
                aria-label={colorVariant.name}
                data-testid={`color-${colorVariant.color}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Prawa strona - Informacje o produkcie i formularz */}
      <div className='space-y-6'>
        <h1
          className='text-2xl font-bold text-[var(--deep-navy)]'
          data-testid='product-title'
        >
          {product.name} –{' '}
          {product.color_variants.find((c) => c.color === selectedColor)
            ?.name || selectedColor}
        </h1>

        <div className='flex items-center gap-2'>
          <div
            className='text-xl font-semibold text-[var(--gold)]'
            data-testid='product-price'
          >
            {totalPrice.toFixed(2)} zł
          </div>

          {product.regular_price > product.current_price && (
            <div className='text-sm text-gray-400 line-through'>
              {product.regular_price.toFixed(2)} zł
            </div>
          )}
        </div>

        <p className='text-gray-600'>{product.description}</p>

        <div className='space-y-4'>
          {/* Wybór zestawu pościeli */}
          <div>
            <label className='block mb-2 font-medium text-gray-700'>
              Wybierz komplet:
            </label>
            <select
              value={selectedSize?.id || ''}
              onChange={(e) => {
                const setId = e.target.value;
                const newSize = product.sizes.find((set) => set.id === setId);
                if (newSize) setSelectedSize(newSize);
              }}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
              data-testid='bedding-set-select'
            >
              {product.sizes.map((size) => (
                <option
                  key={size.id}
                  value={size.id}
                  data-testid={`option-set-${size.id}`}
                >
                  {size.label} - {size.price.toFixed(2)} zł
                </option>
              ))}
            </select>
          </div>

          {/* Opcja prześcieradła */}
          {Object.keys(product.sheet_prices).length > 0 && (
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
                    {Object.entries(product.sheet_prices).map(
                      ([size, price]) => (
                        <option
                          key={size}
                          value={size}
                          data-testid={`option-sheet-${size}`}
                        >
                          {size} (+
                          {price.toFixed(2)} zł)
                        </option>
                      ),
                    )}
                  </select>
                </div>
              )}
            </div>
          )}

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

        {/* Korzyści produktu */}
        {product.benefits && product.benefits.length > 0 && (
          <div className='border-t border-gray-200 pt-4 mt-6'>
            <h3 className='font-medium text-gray-800 mb-2'>Korzyści:</h3>
            <ul className='list-disc list-inside space-y-1 text-gray-600'>
              {product.benefits.map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Szczegóły produktu */}
        <div className='border-t border-gray-200 pt-4 mt-2'>
          <h3 className='font-medium text-gray-800 mb-2'>
            Szczegóły produktu:
          </h3>
          <ul className='list-disc list-inside space-y-1 text-gray-600'>
            {selectedSize?.beddingSize && selectedSize?.pillowSize && (
              <li data-testid='product-details'>
                Zestaw zawiera: poszwę na kołdrę {selectedSize.beddingSize} i
                poszewkę na poduszkę {selectedSize.pillowSize}
                {includeSheet &&
                  `, prześcieradło bez gumki ${selectedSheetSize}`}
              </li>
            )}
            <li>Możliwość prania w 60°C</li>
            <li>Materiał: 100% bawełna satynowa</li>
            <li>Kraj produkcji: Polska</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
