'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FAQSection from '@/components/FAQSection';
import SimpleHeader from '../components/SimpleHeader';
import AnimatedRoletySection from '@/components/AnimatedRoletySection';
import Testimonials from '@/components/Testimonials';
import TestimonialsSection from '@/components/TestimonialsSection';
import RoletyInfoSection from '@/components/RoletyInfoSection';

const Rolety = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    windowType: '',
    windowWidth: '',
    windowHeight: '',
    windowQuantity: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Tutaj można dodać logikę wysyłania formularza
    console.log(formData);
    alert('Formularz został wysłany!');
  };

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    const formElement = document.getElementById('form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Nagłówek */}
      <SimpleHeader
        title='Zasłonex'
        description='Wybierz idealne rozwiązanie dla Twojego domu'
        videoSrc='/video/blinds.mp4'
      />

      {/* Sekcja kafelków z animacjami */}
      <AnimatedRoletySection onSelectType={handleSelectType} />

      {/* Sekcja informacyjna o roletach */}
      <RoletyInfoSection />

      <TestimonialsSection type='rolety' />
      {/* Sekcja formularza */}
      <section id='form-section' className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-extrabold text-gray-900'>
              {selectedType === 'rzymskie'
                ? 'Zamów rolety rzymskie'
                : selectedType === 'plisowane'
                ? 'Zamów rolety plisowane'
                : 'Zamów swoje idealne rolety'}
            </h2>
            <p className='mt-4 text-xl text-gray-600'>
              Wypełnij formularz, a nasz ekspert skontaktuje się z Tobą
            </p>
          </div>

          <div className='bg-white p-8 rounded-lg shadow-md mb-8'>
            <div className='mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200'>
              <div className='flex items-center'>
                <span className='text-blue-500 mr-3 text-xl'>📱</span>
                <p className='text-blue-800'>
                  <strong>
                    Chcesz porozmawiać z ekspertem w sprawie rolet do Twojego
                    domu?
                  </strong>
                  <br />
                  Zadzwoń teraz{' '}
                  <a
                    href='tel:531400230'
                    className='font-bold text-blue-700 hover:underline cursor-pointer'
                  >
                    531 400 230
                  </a>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Imię i nazwisko
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='phone'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Numer telefonu
                  </label>
                  <input
                    type='tel'
                    id='phone'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Adres e-mail
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='windowType'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Rodzaj okna
                  </label>
                  <select
                    id='windowType'
                    name='windowType'
                    value={formData.windowType}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
                    required
                  >
                    <option value=''>Wybierz rodzaj okna</option>
                    <option value='standardowe'>Okno standardowe</option>
                    <option value='dachowe'>Okno dachowe</option>
                    <option value='balkonowe'>Drzwi balkonowe</option>
                    <option value='inne'>Inne</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor='windowWidth'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Szerokość okna (cm)
                  </label>
                  <input
                    type='text'
                    id='windowWidth'
                    name='windowWidth'
                    value={formData.windowWidth}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
                  />
                </div>
                <div>
                  <label
                    htmlFor='windowHeight'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Wysokość okna (cm)
                  </label>
                  <input
                    type='text'
                    id='windowHeight'
                    name='windowHeight'
                    value={formData.windowHeight}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
                  />
                </div>
                <div>
                  <label
                    htmlFor='windowQuantity'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Ilość okien
                  </label>
                  <input
                    type='text'
                    id='windowQuantity'
                    name='windowQuantity'
                    value={formData.windowQuantity}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
                  />
                </div>
              </div>

              <div className='mt-6'>
                <label
                  htmlFor='message'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Dodatkowe informacje
                </label>
                <textarea
                  id='message'
                  name='message'
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
                ></textarea>
              </div>

              <div className='mt-8'>
                <button type='submit' className='premium-button'>
                  Wysyłam zapytanie
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Sekcja FAQ */}
      <FAQSection />
    </div>
  );
};

export default Rolety;
