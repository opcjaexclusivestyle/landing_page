'use client';
import { useState } from 'react';
import OrderForm from '@/components/OrderForm';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Tutaj możesz pobrać szczegóły produktu na podstawie ID
  const productName = 'Zasłona dekoracyjna Premium';

  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h1 className='text-3xl font-semibold mb-4'>{productName}</h1>

        {/* Szczegóły produktu */}
        <div className='mb-8'>{/* ... */}</div>

        {/* Przycisk "Zamów teraz" */}
        <div className='text-center mb-8'>
          <button
            onClick={() => setShowOrderForm(true)}
            className='px-6 py-3 bg-[var(--deep-navy)] text-white rounded-md hover:bg-[var(--gold)] transition-colors'
          >
            Zamów teraz
          </button>
        </div>

        {/* Formularz zamówienia (pokazywany po kliknięciu przycisku) */}
        {showOrderForm && (
          <div className='mt-8'>
            <OrderForm productName={productName} productType='Zasłony' />
          </div>
        )}
      </div>
    </div>
  );
}
