'use client';
import { useState } from 'react';
import OrderModal from '@/components/OrderModal';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const productName = 'Zasłona dekoracyjna Premium';

  return (
    <div className='container mx-auto py-8 px-4'>
      {/* ... szczegóły produktu ... */}

      <button
        onClick={() => setIsOrderModalOpen(true)}
        className='px-6 py-3 bg-[var(--deep-navy)] text-white rounded-md hover:bg-[var(--gold)] transition-colors'
      >
        Zamów teraz
      </button>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        productName={productName}
        productType='Zasłony'
      />
    </div>
  );
}
