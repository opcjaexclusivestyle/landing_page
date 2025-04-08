'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { setCustomerInfo } from '@/store/customerSlice';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import productsConfig from '@/config/products.json';

interface Product {
  name: string;
  fabricPricePerMB: number;
  sewingPricePerMB: number;
  base?: string;
  imagePath: string;
  images: string[];
}

interface OrderFormProps {
  productName?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rodWidth: string;
  height: string;
  tapeType: string;
  selectedProduct: string;
  selectedImageIndex: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  options: {
    width: string;
    height: string;
    embroidery: boolean;
    curtainRod: boolean;
  };
}

const TAPE_TYPES = [
  { id: 'pencil-8', name: 'Taśma ołówek 8 cm (Marszczenie 1:2)', ratio: 2 },
  { id: 'pencil-2-5', name: 'Taśma ołówek 2,5 cm (Marszczenie 1:2)', ratio: 2 },
  { id: 'dragon-5', name: 'Taśma smok 5 cm (Marszczenie 1:2)', ratio: 2 },
];

export default function OrderForm({ productName }: OrderFormProps) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(productsConfig.products);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    rodWidth: '',
    height: '',
    tapeType: TAPE_TYPES[0].id,
    selectedProduct:
      productName || (products.length > 0 ? products[0].name : ''),
    selectedImageIndex: 0,
  });

  // Znajdź aktualnie wybrany produkt
  const selectedProduct = products.find(
    (product) => product.name === formData.selectedProduct,
  );

  // Ceny materiału i szycia bazujące na wybranym produkcie
  const MATERIAL_PRICE_PER_METER = selectedProduct
    ? selectedProduct.fabricPricePerMB
    : 0;
  const SEWING_PRICE_PER_METER = selectedProduct
    ? selectedProduct.sewingPricePerMB
    : 0;

  useEffect(() => {
    // Ustawienie productName jako domyślnego produktu jeśli został przekazany
    if (productName) {
      setFormData((prev) => ({
        ...prev,
        selectedProduct: productName,
      }));
    }
  }, [productName]);

  const calculatePrice = () => {
    const rodWidth = parseFloat(formData.rodWidth) || 0;
    const height = parseFloat(formData.height) || 0;
    const selectedTape = TAPE_TYPES.find(
      (tape) => tape.id === formData.tapeType,
    );

    if (!selectedTape || !rodWidth || !height || !selectedProduct) return 0;

    // Obliczanie szerokości materiału po marszczeniu
    const materialWidth = rodWidth * selectedTape.ratio;

    // Obliczanie metrów bieżących
    const meters = (materialWidth * height) / 10000; // konwersja z cm² na m²

    // Obliczanie ceny materiału
    const materialCost = meters * MATERIAL_PRICE_PER_METER;

    // Obliczanie kosztu szycia
    const sewingCost = meters * SEWING_PRICE_PER_METER;

    return Math.round(materialCost + sewingCost);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'selectedProduct' ? { selectedImageIndex: 0 } : {}),
    }));
  };

  const handleThumbnailClick = (imageIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedImageIndex: imageIndex,
    }));
  };

  const openImageModal = (imageSrc: string) => {
    setModalImageSrc(imageSrc);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const price = calculatePrice();
      const productId = uuidv4();

      // Zapisz dane klienta w Redux
      dispatch(
        setCustomerInfo({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
        }),
      );

      // Dodaj produkt do koszyka
      const cartItem: CartItem = {
        id: productId,
        name: formData.selectedProduct,
        price,
        quantity: 1,
        options: {
          width: formData.rodWidth,
          height: formData.height,
          embroidery: false,
          curtainRod: false,
        },
      };

      dispatch(addToCart(cartItem));

      // Utwórz sesję płatności
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalAmount: price,
          cancelRoute: '/cart',
          productIds: productId,
          currentRoute: '/cart',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Wystąpił błąd podczas przetwarzania płatności',
        );
      }

      // Przekieruj do strony płatności Stripe
      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='order-form-container min-h-screen flex flex-col lg:flex-row'>
      {/* Pasek kontaktowy */}
      <div className='contact-bar'>
        <div className='container mx-auto flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <span>Potrzebujesz pomocy?</span>
            <div className='flex items-center space-x-2'>
              <Image
                src='/mateusz.jpg'
                alt='Mateusz'
                width={32}
                height={32}
                className='rounded-full'
              />
              <span>ZADZWOŃ DO MATEUSZA</span>
              <a
                href='tel:531400230'
                className='text-royal-gold hover:text-gold transition-colors'
              >
                531 400 230
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lewa sekcja z tłem kalkulatora */}
      <div className='w-full lg:w-1/2 relative hidden lg:block'>
        <div className="absolute inset-0 bg-[url('/images/calculator.png')] bg-cover bg-center">
          <div className='absolute inset-0 bg-gradient-to-r from-deep-navy/80 to-deep-navy/40' />
        </div>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-white text-center p-8'>
            <h2 className='text-4xl font-light mb-4'>
              Oblicz koszt swoich zasłon
            </h2>
            <p className='text-lg opacity-90'>
              Wypełnij formularz, aby otrzymać dokładną wycenę
            </p>
          </div>
        </div>
      </div>

      {/* Prawa sekcja z formularzem i tłem lilii */}
      <div className='w-full lg:w-1/2 p-8 lg:p-12 relative mt-16 lg:mt-0'>
        <div className="absolute inset-0 bg-[url('/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_d4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_0-removebg-preview.png')] bg-contain bg-center opacity-10"></div>
        <form
          onSubmit={handleSubmit}
          className='form-section max-w-2xl mx-auto relative z-10'
        >
          <h1 className='form-heading mb-8'>Formularz zamówienia</h1>

          {/* NOWA KOLEJNOŚĆ: 1. Wybór produktu */}
          <div className='space-y-6 mb-8'>
            <h2 className='text-xl font-light text-deep-navy mb-4'>
              Wybór produktu
            </h2>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Typ materiału
              </label>
              <select
                name='selectedProduct'
                value={formData.selectedProduct}
                onChange={handleChange}
                className='form-input-focus w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white/90'
                required
              >
                {products.map((product) => (
                  <option key={product.name} value={product.name}>
                    {product.name} - {product.fabricPricePerMB.toFixed(2)} zł/mb
                  </option>
                ))}
              </select>
              {selectedProduct?.base && (
                <p className='mt-1 text-sm text-gray-500'>
                  Bazuje na: {selectedProduct.base}
                </p>
              )}
            </div>

            {/* Sekcja z miniaturkami materiałów */}
            {selectedProduct && (
              <div className='mt-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Przeglądaj materiał
                </label>
                <div className='flex space-x-2 mb-4'>
                  {selectedProduct.images.map((img, index) => (
                    <div
                      key={index}
                      className={`
                        cursor-pointer border-2 rounded overflow-hidden w-16 h-16 relative
                        ${
                          formData.selectedImageIndex === index
                            ? 'border-royal-gold'
                            : 'border-gray-200'
                        }
                      `}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <Image
                        src={`${selectedProduct.imagePath}/${img}`}
                        alt={`${selectedProduct.name} - miniatura ${index + 1}`}
                        fill
                        className='object-cover'
                      />
                    </div>
                  ))}
                </div>

                {selectedProduct.images.length > 0 && (
                  <div
                    className='relative w-full h-64 rounded-lg overflow-hidden cursor-pointer'
                    onClick={() =>
                      openImageModal(
                        `${selectedProduct.imagePath}/${
                          selectedProduct.images[formData.selectedImageIndex]
                        }`,
                      )
                    }
                  >
                    <Image
                      src={`${selectedProduct.imagePath}/${
                        selectedProduct.images[formData.selectedImageIndex]
                      }`}
                      alt={`${selectedProduct.name} - duży podgląd`}
                      fill
                      className='object-contain'
                    />
                    <div className='absolute bottom-2 right-2 bg-deep-navy/70 text-white text-xs px-2 py-1 rounded'>
                      Kliknij, aby powiększyć
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* NOWA KOLEJNOŚĆ: 2. Wymiary i taśma */}
          <div className='space-y-6 mb-8'>
            <h2 className='text-xl font-light text-deep-navy mb-4'>
              Wymiary i taśma
            </h2>
            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Rodzaj taśmy
                </label>
                <select
                  name='tapeType'
                  value={formData.tapeType}
                  onChange={handleChange}
                  className='form-input-focus w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white/90'
                  required
                >
                  {TAPE_TYPES.map((tape) => (
                    <option key={tape.id} value={tape.id}>
                      {tape.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Szerokość karnisza (cm)
                </label>
                <input
                  type='number'
                  name='rodWidth'
                  value={formData.rodWidth}
                  onChange={handleChange}
                  min='1'
                  className='form-input-focus w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white/90'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Wysokość dekoracji (cm)
                </label>
                <input
                  type='number'
                  name='height'
                  value={formData.height}
                  onChange={handleChange}
                  min='1'
                  className='form-input-focus w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white/90'
                  required
                />
              </div>
            </div>
          </div>

          {/* NOWA KOLEJNOŚĆ: 3. Szczegóły kalkulacji */}
          <div className='mb-8'>
            <div className='calculation-details bg-white/90 p-4 rounded-lg'>
              <h3 className='text-lg font-medium mb-3'>Szczegóły kalkulacji</h3>
              <div className='space-y-2'>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600'>Wybrany materiał:</span>
                  <span className='font-medium'>
                    {selectedProduct?.name || '-'}
                  </span>
                </div>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600'>Cena materiału:</span>
                  <span className='font-medium'>
                    {selectedProduct
                      ? `${selectedProduct.fabricPricePerMB.toFixed(2)} zł/mb`
                      : '-'}
                  </span>
                </div>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600'>Koszt szycia:</span>
                  <span className='font-medium'>
                    {selectedProduct
                      ? `${selectedProduct.sewingPricePerMB.toFixed(2)} zł/mb`
                      : '-'}
                  </span>
                </div>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600'>Szerokość materiału:</span>
                  <span className='font-medium'>
                    {formData.rodWidth
                      ? `${parseFloat(formData.rodWidth) * 2} cm`
                      : '-'}
                  </span>
                </div>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600'>Metry bieżące:</span>
                  <span className='font-medium'>
                    {formData.rodWidth && formData.height
                      ? `${(
                          (parseFloat(formData.rodWidth) *
                            2 *
                            parseFloat(formData.height)) /
                          10000
                        ).toFixed(2)} m²`
                      : '-'}
                  </span>
                </div>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600'>Koszt materiału:</span>
                  <span className='font-medium'>
                    {formData.rodWidth && formData.height && selectedProduct
                      ? `${(
                          ((parseFloat(formData.rodWidth) *
                            2 *
                            parseFloat(formData.height)) /
                            10000) *
                          selectedProduct.fabricPricePerMB
                        ).toFixed(2)} zł`
                      : '-'}
                  </span>
                </div>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600'>Koszt szycia:</span>
                  <span className='font-medium'>
                    {formData.rodWidth && formData.height && selectedProduct
                      ? `${(
                          ((parseFloat(formData.rodWidth) *
                            2 *
                            parseFloat(formData.height)) /
                            10000) *
                          selectedProduct.sewingPricePerMB
                        ).toFixed(2)} zł`
                      : '-'}
                  </span>
                </div>
              </div>
              <div className='pt-4 border-t border-gray-200 mt-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-lg font-medium text-deep-navy'>
                    Razem:
                  </span>
                  <span className='text-xl font-bold text-deep-navy'>
                    {calculatePrice()} zł
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Przewodnik pomiarowy */}
          <div className='mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100'>
            <div className='flex items-start'>
              <div className='mr-4 text-deep-navy'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
              </div>
              <div>
                <h4 className='text-sm font-medium text-deep-navy mb-1'>
                  Nie masz pewności jak zmierzyć okno?
                </h4>
                <p className='text-xs text-gray-600 mb-2'>
                  Sprawdź nasz przewodnik, który pomoże Ci dokonać poprawnych
                  pomiarów.
                </p>
                <a
                  href='/jak-mierzyc'
                  className='text-royal-gold hover:text-gold text-sm font-medium inline-flex items-center'
                >
                  Zobacz przewodnik
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 ml-1'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M14 5l7 7m0 0l-7 7m7-7H3'
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* NOWA KOLEJNOŚĆ: 4. Dane osobowe */}
          <div className='space-y-6 mb-8'>
            <h2 className='text-xl font-light text-deep-navy mb-4'>
              Dane osobowe
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Imię
                </label>
                <input
                  type='text'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                  className='form-input-focus w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white/90'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Nazwisko
                </label>
                <input
                  type='text'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                  className='form-input-focus w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white/90'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Email
                </label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='form-input-focus w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white/90'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Telefon
                </label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  className='form-input-focus w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white/90'
                  required
                />
              </div>
            </div>
          </div>

          {/* Przycisk zamówienia */}
          <button
            type='submit'
            disabled={isLoading}
            className='magic-button w-full py-3 px-6 text-white rounded-lg font-light text-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50'
          >
            {isLoading ? 'Przetwarzanie...' : 'Zamów teraz'}
          </button>

          {error && (
            <div className='mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm'>
              {error}
            </div>
          )}
        </form>
      </div>

      {/* Modal do powiększenia obrazu */}
      {showImageModal && (
        <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4'>
          <div className='relative w-full max-w-4xl h-[80vh]'>
            <button
              onClick={closeImageModal}
              className='absolute top-0 right-0 -mt-12 -mr-12 bg-white rounded-full p-2 text-black z-10'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
            <div className='relative w-full h-full'>
              <Image
                src={modalImageSrc}
                alt='Powiększony podgląd materiału'
                fill
                className='object-contain'
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
