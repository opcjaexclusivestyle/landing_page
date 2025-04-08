import React from 'react';

const MeasuringGuide = () => {
  return (
    <div className='max-w-3xl mx-auto mb-16'>
      <h2 className='text-2xl md:text-3xl mb-4 text-center luxury-heading'>
        JAK MIERZYĆ
      </h2>

      <div className='bg-white p-6 rounded-lg shadow-md text-center'>
        <div className='aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden mb-6'>
          {/* Tutaj będzie osadzony film */}
          <div className='p-16'>
            <p className='text-xl mb-4'>Filmy instruktażowe</p>
            <p className='text-gray-500'>
              W tym miejscu wkrótce pojawią się filmy instruktażowe pokazujące,
              jak prawidłowo mierzyć okna dla różnych typów dekoracji.
            </p>
          </div>
        </div>

        <p className='text-lg leading-relaxed text-gray-700'>
          Prawidłowe pomiary są kluczem do idealnie dopasowanych firan i zasłon.
          Nasi specjaliści przygotowują szczegółowe instrukcje, które pomogą Ci
          dokonać precyzyjnych pomiarów.
        </p>
      </div>
    </div>
  );
};

export default MeasuringGuide;
