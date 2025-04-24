'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

// Typy
export type ColorOption = string;
export type PurchaseType = 'bedding-with-sheet' | 'bedding-only' | 'sheet-only';

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

export interface Comment {
  id: string;
  author: string;
  date: string;
  content: string;
  rating: number;
}

export interface CartItemOptions {
  width: string;
  height: string;
  embroidery: boolean;
  curtainRod: boolean;
  purchaseType?: PurchaseType;
  color?: ColorOption;
  customSize?: string | null;
  comment?: string | null;
  variant?: number;
  additionalOptions?: Record<string, string>;
}

export interface BeddingProductData {
  name: string;
  description: string;
  beddingSets: BeddingSet[];
  sheetPrices: SheetPrices;
  colors: {
    [key: string]: {
      images: string[];
      displayName: string;
      displayColor: string;
    };
  };
  defaultColor: ColorOption;
  features: string[];
  comments?: Comment[];
}

interface BeddingFormProps {
  productData: BeddingProductData;
}

const BeddingForm: React.FC<BeddingFormProps> = ({ productData }) => {
  const dispatch = useDispatch();
  const [selectedSet, setSelectedSet] = useState<BeddingSet>(
    productData.beddingSets[0],
  );
  const [includeSheet, setIncludeSheet] = useState(true);
  const [selectedSheetSize, setSelectedSheetSize] = useState<string>(
    Object.keys(productData.sheetPrices)[0],
  );
  const [selectedColor, setSelectedColor] = useState<ColorOption>(
    productData.defaultColor,
  );
  const [mainImage, setMainImage] = useState<string>('');
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [purchaseType, setPurchaseType] =
    useState<PurchaseType>('bedding-with-sheet');
  const [customSizeComment, setCustomSizeComment] = useState('');
  const [hasCustomSize, setHasCustomSize] = useState(false);
  const [customerComment, setCustomerComment] = useState('');

  // Ustawienie domyślnego obrazu po załadowaniu komponentu
  useEffect(() => {
    if (productData.colors[selectedColor]?.images?.length > 0) {
      setMainImage(productData.colors[selectedColor].images[0]);
    }
  }, [selectedColor, productData.colors]);

  // Aktualizacja domyślnego rozmiaru prześcieradła na podstawie wybranego rozmiaru pościeli
  useEffect(() => {
    if (
      selectedSet &&
      Object.keys(productData.sheetPrices).includes(selectedSet.beddingSize)
    ) {
      setSelectedSheetSize(selectedSet.beddingSize);
    }
  }, [selectedSet, productData.sheetPrices]);

  // Aktualizacja checkboxa prześcieradła na podstawie wybranego typu zakupu
  useEffect(() => {
    if (purchaseType === 'bedding-with-sheet') {
      setIncludeSheet(true);
    } else if (purchaseType === 'bedding-only') {
      setIncludeSheet(false);
    }
  }, [purchaseType]);

  // Aktualizacja typu zakupu na podstawie checkboxa prześcieradła
  useEffect(() => {
    if (!includeSheet && purchaseType === 'bedding-with-sheet') {
      setPurchaseType('bedding-only');
    } else if (includeSheet && purchaseType === 'bedding-only') {
      setPurchaseType('bedding-with-sheet');
    }
  }, [includeSheet]);

  // Obliczanie całkowitej ceny
  const calculateTotalPrice = () => {
    if (purchaseType === 'sheet-only') {
      return productData.sheetPrices[selectedSheetSize] * quantity;
    } else {
      const beddingPrice = selectedSet.price;
      const sheetPrice = includeSheet
        ? productData.sheetPrices[selectedSheetSize] || 0
        : 0;
      return (beddingPrice + sheetPrice) * quantity;
    }
  };

  const totalPrice = calculateTotalPrice();

  // Funkcja do dodania produktu do koszyka
  const handleAddToCart = () => {
    const colorInfo = productData.colors[selectedColor];
    const colorLabel = colorInfo.displayName;

    let productName = '';
    let details = '';

    if (purchaseType === 'sheet-only') {
      productName = `Prześcieradło adamaszkowe – ${colorLabel}`;
      details = `Rozmiar: ${selectedSheetSize}`;
    } else {
      productName = `${productData.name} – ${colorLabel}`;
      details = [
        `Komplet: poszwa ${selectedSet.beddingSize} i poszewka ${selectedSet.pillowSize}`,
        includeSheet ? `Prześcieradło bez gumki ${selectedSheetSize}` : '',
      ]
        .filter(Boolean)
        .join(', ');
    }

    if (hasCustomSize && customSizeComment) {
      details += ` | Niestandardowy rozmiar: ${customSizeComment}`;
    }

    if (customerComment) {
      details += ` | Komentarz: ${customerComment}`;
    }

    const options: CartItemOptions = {
      width:
        purchaseType !== 'sheet-only'
          ? selectedSet.beddingSize.split('x')[0]
          : '0',
      height:
        purchaseType !== 'sheet-only'
          ? selectedSet.beddingSize.split('x')[1]
          : '0',
      embroidery: false,
      curtainRod: false,
      purchaseType: purchaseType,
      color: selectedColor,
      customSize: hasCustomSize ? customSizeComment : null,
      comment: customerComment || null,
    };

    dispatch(
      addToCart({
        id: uuidv4(),
        name: `${productName} (${details})`,
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

  // Renderowanie właściwego formularza w zależności od typu zakupu
  const renderPurchaseOptions = () => {
    return (
      <div className='border border-gray-200 rounded-md p-4 mb-4'>
        <h3 className='font-medium text-gray-800 mb-3'>
          Wybierz opcję zakupu:
        </h3>
        <div className='space-y-2'>
          <div className='flex items-center'>
            <input
              type='radio'
              id='bedding-with-sheet'
              name='purchase-type'
              value='bedding-with-sheet'
              checked={purchaseType === 'bedding-with-sheet'}
              onChange={() => setPurchaseType('bedding-with-sheet')}
              className='h-4 w-4 text-[var(--gold)] focus:ring-[var(--gold)]'
              data-testid='bedding-with-sheet-radio'
            />
            <label
              htmlFor='bedding-with-sheet'
              className='ml-2 block text-gray-700'
            >
              Pościel z prześcieradłem
            </label>
          </div>

          <div className='flex items-center'>
            <input
              type='radio'
              id='bedding-only'
              name='purchase-type'
              value='bedding-only'
              checked={purchaseType === 'bedding-only'}
              onChange={() => setPurchaseType('bedding-only')}
              className='h-4 w-4 text-[var(--gold)] focus:ring-[var(--gold)]'
              data-testid='bedding-only-radio'
            />
            <label htmlFor='bedding-only' className='ml-2 block text-gray-700'>
              Tylko pościel
            </label>
          </div>

          <div className='flex items-center'>
            <input
              type='radio'
              id='sheet-only'
              name='purchase-type'
              value='sheet-only'
              checked={purchaseType === 'sheet-only'}
              onChange={() => setPurchaseType('sheet-only')}
              className='h-4 w-4 text-[var(--gold)] focus:ring-[var(--gold)]'
              data-testid='sheet-only-radio'
            />
            <label htmlFor='sheet-only' className='ml-2 block text-gray-700'>
              Tylko prześcieradło
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className='space-y-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Lewa strona - Galeria */}
          <div className='space-y-4'>
            {/* Główny obraz */}
            <div
              className='relative h-[400px] w-full rounded-lg overflow-hidden border border-gray-200'
              data-testid='main-image-container'
            >
              {mainImage && (
                <Image
                  src={mainImage}
                  alt='Pościel'
                  fill
                  className='object-cover'
                  priority
                  data-testid='main-product-image'
                />
              )}
            </div>

            {/* Miniatury zdjęć */}
            <div className='grid grid-cols-4 gap-2'>
              {productData.colors[selectedColor]?.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative h-20 cursor-pointer rounded overflow-hidden border-2 ${
                    mainImage === img
                      ? 'border-[var(--gold)]'
                      : 'border-gray-200'
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
                {Object.entries(productData.colors).map(
                  ([colorKey, colorData]) => (
                    <button
                      key={colorKey}
                      className={`w-8 h-8 rounded-full border ${
                        selectedColor === colorKey
                          ? 'ring-2 ring-[var(--gold)]'
                          : 'border-gray-300'
                      }`}
                      onClick={() => setSelectedColor(colorKey as ColorOption)}
                      aria-label={colorData.displayName}
                      data-testid={`color-${colorKey}`}
                      style={{ backgroundColor: colorData.displayColor }}
                    />
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Prawa strona - Informacje o produkcie i formularz */}
          <div className='bg-[rgba(19,24,42,0.1)] space-y-6 p-6 rounded-lg'>
            <h1
              className='text-2xl font-bold text-[var(--deep-navy)]'
              data-testid='product-title'
            >
              {purchaseType === 'sheet-only'
                ? `Prześcieradło adamaszkowe – ${productData.colors[selectedColor]?.displayName}`
                : `${productData.name} – ${productData.colors[selectedColor]?.displayName}`}
            </h1>

            <div
              className='text-xl font-semibold text-[var(--gold)]'
              data-testid='product-price'
            >
              {totalPrice.toFixed(2)} zł
            </div>

            <p className='text-gray-600'>{productData.description}</p>

            <div className='space-y-4'>
              {/* Opcje zakupu */}
              {renderPurchaseOptions()}

              {/* Wybór zestawu pościeli - widoczne tylko dla pościeli */}
              {purchaseType !== 'sheet-only' && (
                <div>
                  <label className='block mb-2 font-medium text-gray-700'>
                    Wybierz komplet:
                  </label>
                  <select
                    value={selectedSet.id}
                    onChange={(e) => {
                      const setId = parseInt(e.target.value);
                      const newSet = productData.beddingSets.find(
                        (set) => set.id === setId,
                      );
                      if (newSet) setSelectedSet(newSet);
                    }}
                    className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                    data-testid='bedding-set-select'
                  >
                    {productData.beddingSets.map((set) => (
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
              )}

              {/* Opcja prześcieradła i wybór rozmiaru - dla wariantu pościel z prześcieradłem */}
              {purchaseType === 'bedding-with-sheet' && (
                <div className='mt-4'>
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

                  {includeSheet && (
                    <div className='mt-3'>
                      <label className='block mb-2 text-sm text-gray-700'>
                        Wybierz rozmiar prześcieradła:
                      </label>
                      <select
                        value={selectedSheetSize}
                        onChange={(e) => setSelectedSheetSize(e.target.value)}
                        className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                        data-testid='sheet-size-select'
                      >
                        {Object.keys(productData.sheetPrices).map((size) => (
                          <option
                            key={size}
                            value={size}
                            data-testid={`option-sheet-${size}`}
                          >
                            {size} (+{productData.sheetPrices[size].toFixed(2)}{' '}
                            zł)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Wybór rozmiaru prześcieradła - tylko dla samego prześcieradła */}
              {purchaseType === 'sheet-only' && (
                <div>
                  <label className='block mb-2 font-medium text-gray-700'>
                    Wybierz rozmiar prześcieradła:
                  </label>
                  <select
                    value={selectedSheetSize}
                    onChange={(e) => setSelectedSheetSize(e.target.value)}
                    className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                    data-testid='sheet-size-select'
                  >
                    {Object.keys(productData.sheetPrices).map((size) => (
                      <option
                        key={size}
                        value={size}
                        data-testid={`option-sheet-${size}`}
                      >
                        {size} ({productData.sheetPrices[size].toFixed(2)} zł)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Opcja niestandardowego rozmiaru */}
              <div className='border-t border-gray-200 pt-4'>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='customSize'
                    checked={hasCustomSize}
                    onChange={(e) => setHasCustomSize(e.target.checked)}
                    className='h-4 w-4 text-[var(--gold)] focus:ring-[var(--gold)] border-gray-300 rounded'
                    data-testid='custom-size-checkbox'
                  />
                  <label
                    htmlFor='customSize'
                    className='ml-2 block text-gray-700 font-medium'
                  >
                    Inny rozmiar
                  </label>
                </div>

                {hasCustomSize && (
                  <div className='mt-3 p-4 bg-gray-50 rounded-md'>
                    <label className='block mb-2 text-sm text-gray-700'>
                      Podaj szczegóły niestandardowego rozmiaru:
                    </label>
                    <textarea
                      value={customSizeComment}
                      onChange={(e) => setCustomSizeComment(e.target.value)}
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                      rows={3}
                      placeholder='Opisz potrzebny rozmiar...'
                      data-testid='custom-size-textarea'
                    />
                    <p className='mt-2 text-sm text-gray-600'>
                      Jeśli chcesz zmienić rozmiar poduszek, napisz nam o tym w
                      komentarzu do zamówienia, a my wykonamy to bezpłatnie. W
                      przypadku pościeli o niestandardowych wymiarach wybierz
                      rozmiar najbardziej zbliżony do tego, którego
                      potrzebujesz.
                    </p>
                    <p className='mt-2 text-sm text-gray-600'>
                      Jeśli wymiary będą znacząco odbiegać od wybranych,
                      skontaktujemy się z Tobą mailowo lub telefonicznie.
                    </p>
                    <p className='mt-2 text-sm font-medium text-gray-700'>
                      Masz pytania? Zadzwoń do nas: 111 111 111.
                    </p>
                  </div>
                )}
              </div>

              {/* Pole komentarza do zamówienia */}
              <div className='border-t border-gray-200 pt-4'>
                <label className='block mb-2 font-medium text-gray-700'>
                  Komentarz do zamówienia (opcjonalnie):
                </label>
                <textarea
                  value={customerComment}
                  onChange={(e) => setCustomerComment(e.target.value)}
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                  rows={3}
                  placeholder='Dodatkowe informacje lub życzenia...'
                  data-testid='comment-textarea'
                />
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
                {productData.features.map((feature, index) => (
                  <li key={index} data-testid={`product-feature-${index}`}>
                    {feature}
                  </li>
                ))}
                {purchaseType !== 'sheet-only' && <li>Zapięcie: na zamek</li>}
                <li data-testid='product-details'>
                  {purchaseType === 'sheet-only'
                    ? `Prześcieradło bez gumki ${selectedSheetSize}`
                    : `Zestaw zawiera: poszwę na kołdrę ${
                        selectedSet.beddingSize
                      } i poszewkę na poduszkę ${selectedSet.pillowSize}
                     ${
                       includeSheet
                         ? `, prześcieradło bez gumki ${selectedSheetSize}`
                         : ''
                     }`}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sekcja komentarzy */}
        <div className='border-t border-gray-200 pt-8 mt-8'>
          <h2 className='text-xl font-bold text-[var(--deep-navy)] mb-6'>
            Komentarze klientów
          </h2>

          {productData.comments && productData.comments.length > 0 ? (
            <div className='space-y-6'>
              {productData.comments.map((comment) => (
                <div key={comment.id} className='border-b border-gray-200 pb-6'>
                  <div className='flex justify-between items-center mb-2'>
                    <div className='font-medium'>{comment.author}</div>
                    <div className='text-sm text-gray-500'>{comment.date}</div>
                  </div>
                  <div className='flex mb-3'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        xmlns='http://www.w3.org/2000/svg'
                        className={`h-5 w-5 ${
                          i < comment.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                      </svg>
                    ))}
                  </div>
                  <p className='text-gray-700'>{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className='space-y-4'>
              <p className='text-gray-500'>
                Ten produkt nie ma jeszcze komentarzy. Bądź pierwszy i podziel
                się swoją opinią!
              </p>
              <div className='bg-gray-50 p-4 rounded-md border border-gray-200'>
                <p className='text-gray-700 mb-2'>
                  W tej sekcji znajdziesz opinie klientów o naszych pościelach i
                  prześcieradłach.
                </p>
                <p className='text-gray-700'>
                  Jeśli masz pytania lub uwagi dotyczące konkretnego zamówienia,
                  możesz skorzystać z pola "Komentarz do zamówienia" podczas
                  składania zamówienia lub skontaktować się z nami telefonicznie
                  pod numerem: 531 400 230
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BeddingForm;
