'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { CartItemOptions } from './BeddingForm';

// Typy
export type ProductColorOption = string;

export interface ProductVariant {
  id: number;
  label: string;
  size: string;
  additionalInfo?: string;
  price: number;
}

export interface AdditionalOption {
  name: string;
  label: string;
  pricingKey: string;
  sizes: {
    [key: string]: number;
  };
}

export interface ColorData {
  code: string;
  name: string;
  displayColor: string;
}

export interface ProductData {
  name: string;
  description: string;
  baseProduct: string;
  colors: {
    [key: string]: {
      images: string[];
      displayName: string;
      code: string;
      displayColor: string;
    };
  };
  variants: ProductVariant[];
  additionalOptions?: AdditionalOption[];
  features: string[];
  defaultColor: string;
  defaultVariant: number;
}

interface ProductFormProps {
  productData: ProductData;
}

const ProductForm: React.FC<ProductFormProps> = ({ productData }) => {
  const dispatch = useDispatch();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    productData.variants.find((v) => v.id === productData.defaultVariant) ||
      productData.variants[0],
  );
  const [additionalOptions, setAdditionalOptions] = useState<{
    [key: string]: { enabled: boolean; selectedSize: string };
  }>(
    (productData.additionalOptions || []).reduce(
      (acc, option) => ({
        ...acc,
        [option.name]: {
          enabled: false,
          selectedSize: Object.keys(option.sizes)[0] || '',
        },
      }),
      {},
    ),
  );
  const [selectedColor, setSelectedColor] = useState<ProductColorOption>(
    productData.defaultColor,
  );
  const [mainImage, setMainImage] = useState<string>(
    productData.colors[productData.defaultColor].images[0],
  );
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Aktualizacja głównego obrazu po zmianie koloru
  useEffect(() => {
    if (productData.colors[selectedColor]?.images?.length > 0) {
      setMainImage(productData.colors[selectedColor].images[0]);
    }
  }, [selectedColor, productData.colors]);

  // Aktualizacja domyślnego rozmiaru opcji dodatkowych na podstawie wybranego wariantu
  useEffect(() => {
    if (selectedVariant && productData.additionalOptions) {
      const newOptions = { ...additionalOptions };

      productData.additionalOptions.forEach((option) => {
        if (option.sizes[selectedVariant.size] !== undefined) {
          newOptions[option.name] = {
            ...newOptions[option.name],
            selectedSize: selectedVariant.size,
          };
        }
      });

      setAdditionalOptions(newOptions);
    }
  }, [selectedVariant, productData.additionalOptions]);

  // Obliczanie całkowitej ceny
  const calculateTotalPrice = () => {
    let basePrice = selectedVariant.price;

    // Dodaj cenę za opcje dodatkowe
    if (productData.additionalOptions) {
      productData.additionalOptions.forEach((option) => {
        const optionState = additionalOptions[option.name];
        if (optionState?.enabled) {
          basePrice += option.sizes[optionState.selectedSize] || 0;
        }
      });
    }

    return basePrice * quantity;
  };

  const totalPrice = calculateTotalPrice();

  // Funkcja do dodania produktu do koszyka
  const handleAddToCart = () => {
    const colorInfo = productData.colors[selectedColor];

    const details = [
      `Wariant: ${selectedVariant.label}`,
      ...Object.entries(additionalOptions)
        .filter(([_, optionState]) => optionState.enabled)
        .map(([optionName, optionState]) => {
          const option = productData.additionalOptions?.find(
            (o) => o.name === optionName,
          );
          return `${option?.label || optionName}: ${optionState.selectedSize}`;
        }),
    ]
      .filter(Boolean)
      .join(', ');

    const additionalOptionsObject = Object.entries(additionalOptions)
      .filter(([_, optionState]) => optionState.enabled)
      .reduce(
        (acc, [name, optionState]) => ({
          ...acc,
          [name]: optionState.selectedSize,
        }),
        {},
      );

    const options: CartItemOptions = {
      width: selectedVariant.size.split('x')[0],
      height: selectedVariant.size.split('x')[1],
      embroidery: false,
      curtainRod: false,
      additionalOptions: additionalOptionsObject,
    };

    // Dodajemy wariant jako opcję do przekazania
    if (selectedVariant) {
      options.variant = selectedVariant.id;
    }

    // Dodajemy kolor jako string, ponieważ CartItemOptions.color oczekuje typu ColorOption lub undefined
    // ale nie możemy bezpośrednio przypisać stringa do tego typu
    dispatch(
      addToCart({
        id: uuidv4(),
        name: `${productData.name} – ${colorInfo.displayName}${
          details ? ` (${details})` : ''
        }`,
        price: totalPrice,
        quantity: quantity,
        options,
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
            alt={productData.name}
            fill
            className='object-cover'
            priority
            data-testid='main-product-image'
          />
        </div>

        {/* Miniatury zdjęć */}
        <div className='grid grid-cols-4 gap-2'>
          {productData.colors[selectedColor]?.images.map((img, idx) => (
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
                alt={`${productData.name} miniatura ${idx + 1}`}
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
            {Object.entries(productData.colors).map(([colorKey, colorData]) => (
              <button
                key={colorKey}
                className={`w-8 h-8 rounded-full bg-[${
                  colorData.displayColor
                }] border ${
                  selectedColor === colorKey
                    ? 'ring-2 ring-[var(--gold)]'
                    : 'border-gray-300'
                }`}
                onClick={() => setSelectedColor(colorKey as ProductColorOption)}
                aria-label={colorData.displayName}
                data-testid={`color-${colorKey}`}
                style={{ backgroundColor: colorData.displayColor }}
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
          {productData.name} – {productData.colors[selectedColor]?.displayName}
        </h1>

        <div
          className='text-xl font-semibold text-[var(--gold)]'
          data-testid='product-price'
        >
          {totalPrice.toFixed(2)} zł
        </div>

        <p className='text-gray-600'>{productData.description}</p>

        <div className='space-y-4'>
          {/* Wybór wariantu produktu */}
          <div>
            <label className='block mb-2 font-medium text-gray-700'>
              Wybierz wariant:
            </label>
            <select
              value={selectedVariant.id}
              onChange={(e) => {
                const variantId = parseInt(e.target.value);
                const newVariant = productData.variants.find(
                  (v) => v.id === variantId,
                );
                if (newVariant) setSelectedVariant(newVariant);
              }}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
              data-testid='product-variant-select'
            >
              {productData.variants.map((variant) => (
                <option
                  key={variant.id}
                  value={variant.id}
                  data-testid={`option-variant-${variant.id}`}
                >
                  {variant.label} - {variant.price.toFixed(2)} zł
                </option>
              ))}
            </select>
          </div>

          {/* Opcje dodatkowe */}
          {productData.additionalOptions?.map((option) => (
            <div key={option.name}>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id={option.name}
                  checked={additionalOptions[option.name]?.enabled || false}
                  onChange={(e) =>
                    setAdditionalOptions({
                      ...additionalOptions,
                      [option.name]: {
                        ...additionalOptions[option.name],
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className='h-4 w-4 text-[var(--gold)] focus:ring-[var(--gold)] border-gray-300 rounded'
                  data-testid={`${option.name}-checkbox`}
                />
                <label
                  htmlFor={option.name}
                  className='ml-2 block text-gray-700'
                >
                  {option.label}
                </label>
              </div>

              {/* Wybór rozmiaru opcji - pojawia się tylko gdy checkbox jest zaznaczony */}
              {additionalOptions[option.name]?.enabled && (
                <div className='mt-3 ml-6'>
                  <label className='block mb-2 text-sm text-gray-700'>
                    Wybierz rozmiar:
                  </label>
                  <select
                    value={additionalOptions[option.name]?.selectedSize || ''}
                    onChange={(e) =>
                      setAdditionalOptions({
                        ...additionalOptions,
                        [option.name]: {
                          ...additionalOptions[option.name],
                          selectedSize: e.target.value,
                        },
                      })
                    }
                    className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                    data-testid={`${option.name}-size-select`}
                  >
                    {Object.entries(option.sizes).map(([size, price]) => (
                      <option
                        key={size}
                        value={size}
                        data-testid={`option-${option.name}-${size}`}
                      >
                        {size} (+
                        {price.toFixed(2)} zł)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}

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
            {productData.features.map((feature, index) => (
              <li key={index} data-testid={`product-feature-${index}`}>
                {feature}
              </li>
            ))}
            <li data-testid='product-details'>
              Wariant: {selectedVariant.label}
              {Object.entries(additionalOptions)
                .filter(([_, optionState]) => optionState.enabled)
                .map(([optionName, optionState]) => {
                  const option = productData.additionalOptions?.find(
                    (o) => o.name === optionName,
                  );
                  return `, ${option?.label || optionName}: ${
                    optionState.selectedSize
                  }`;
                })}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
