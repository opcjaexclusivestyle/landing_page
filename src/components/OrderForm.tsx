'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { setCustomerInfo } from '@/store/customerSlice';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

interface OrderFormProps {
  productName: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rodWidth: string;
  height: string;
  tapeType: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  options: {
    rodWidth: string;
    height: string;
    tapeType: string;
  };
}

const TAPE_TYPES = [
  { id: 'pencil-8', name: 'Taśma ołówek 8 cm (Marszczenie 1:2)', ratio: 2 },
  { id: 'pencil-2-5', name: 'Taśma ołówek 2,5 cm (Marszczenie 1:2)', ratio: 2 },
  { id: 'dragon-5', name: 'Taśma smok 5 cm (Marszczenie 1:2)', ratio: 2 },
];

const MATERIAL_PRICE_PER_METER = 60; // zł za 1MB
const SEWING_PRICE_PER_METER = 8; // zł za 1MB

export default function OrderForm({ productName }: OrderFormProps) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    rodWidth: '',
    height: '',
    tapeType: TAPE_TYPES[0].id,
  });

  const calculatePrice = () => {
    const rodWidth = parseFloat(formData.rodWidth) || 0;
    const height = parseFloat(formData.height) || 0;
    const selectedTape = TAPE_TYPES.find(
      (tape) => tape.id === formData.tapeType,
    );

    if (!selectedTape || !rodWidth || !height) return 0;

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
    }));
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
        name: productName,
        price,
        quantity: 1,
        options: {
          rodWidth: formData.rodWidth,
          height: formData.height,
          tapeType: formData.tapeType,
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
    <div className='order-form-container min-h-screen flex'>
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

      {/* Lewa sekcja z tłem */}
      <div className='w-1/2 relative hidden lg:block'>
        <div className="absolute inset-0 bg-[url('/calculator.png')] bg-cover bg-center">
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

      {/* Prawa sekcja z formularzem */}
      <div className='w-full lg:w-1/2 p-8 lg:p-12 relative mt-16'>
        <form
          onSubmit={handleSubmit}
          className='form-section max-w-2xl mx-auto'
        >
          <h1 className='form-heading mb-8'>Formularz zamówienia</h1>

          {/* Dane osobowe */}
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
                  className='form-input-focus w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none'
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
                  className='form-input-focus w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none'
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
                  className='form-input-focus w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none'
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
                  className='form-input-focus w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none'
                  required
                />
              </div>
            </div>
          </div>

          {/* Wymiary i taśma */}
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
                  className='form-input-focus w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none'
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
                  className='form-input-focus w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none'
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
                  className='form-input-focus w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none'
                  required
                />
              </div>
            </div>
          </div>

          {/* Szczegóły kalkulacji */}
          <div className='mb-8'>
            <div className='calculation-details'>
              <h3>Szczegóły kalkulacji</h3>
              <div className='space-y-2'>
                <div className='calculation-row'>
                  <span className='text-gray-600'>Szerokość materiału:</span>
                  <span className='font-medium'>
                    {formData.rodWidth
                      ? `${parseFloat(formData.rodWidth) * 2} cm`
                      : '-'}
                  </span>
                </div>
                <div className='calculation-row'>
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
                <div className='calculation-row'>
                  <span className='text-gray-600'>Koszt materiału:</span>
                  <span className='font-medium'>
                    {formData.rodWidth && formData.height
                      ? `${(
                          ((parseFloat(formData.rodWidth) *
                            2 *
                            parseFloat(formData.height)) /
                            10000) *
                          MATERIAL_PRICE_PER_METER
                        ).toFixed(2)} zł`
                      : '-'}
                  </span>
                </div>
                <div className='calculation-row'>
                  <span className='text-gray-600'>Koszt szycia:</span>
                  <span className='font-medium'>
                    {formData.rodWidth && formData.height
                      ? `${(
                          ((parseFloat(formData.rodWidth) *
                            2 *
                            parseFloat(formData.height)) /
                            10000) *
                          SEWING_PRICE_PER_METER
                        ).toFixed(2)} zł`
                      : '-'}
                  </span>
                </div>
              </div>
              <div className='pt-4 border-t border-gray-200'>
                <div className='calculation-row'>
                  <span className='text-lg font-medium text-deep-navy'>
                    Razem:
                  </span>
                  <span className='calculation-total'>
                    {calculatePrice()} zł
                  </span>
                </div>
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
    </div>
  );
}
