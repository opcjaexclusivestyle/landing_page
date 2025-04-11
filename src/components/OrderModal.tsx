'use client';
import { useEffect, useRef } from 'react';
import OrderForm from './OrderForm';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  productType?: string;
}

export default function OrderModal({
  isOpen,
  onClose,
  productName,
  productType,
}: OrderModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Obsługa klawisza ESC do zamykania modalu
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Blokuje przewijanie strony
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto'; // Przywraca przewijanie
    };
  }, [isOpen, onClose]);

  // Kliknięcie poza formularzem zamyka modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className='bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center p-4 border-b'>
          <h2 className='text-2xl font-semibold'>Zamówienie</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-800'
          >
            ✕
          </button>
        </div>

        <div className='p-4'>
          <OrderForm productName={productName} productType={productType} />
        </div>
      </div>
    </div>
  );
}
