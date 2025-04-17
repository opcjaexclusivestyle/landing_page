import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Certification.css'; // Korzystamy z istniejących stylów

const AccordionCertificates = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  const certifications = [
    {
      title: 'PRODUKT POLSKI',
      description:
        'Wszystkie nasze firany są produkowane w Polskiej szwalni przez doświadczonych rzemieślników, co gwarantuje najwyższą jakość wykonania i wsparcie lokalnej gospodarki.',
      iconType: 'poland',
    },
    {
      title: 'PISEMNA GWARANCJA JAKOŚCI',
      description:
        'Do każdego zakupionego produktu dołączamy pisemną gwarancję z pieczęcią, potwierdzającą autentyczność i jakość naszych wyrobów oraz dającą pewność satysfakcji.',
      iconType: 'warranty',
    },
    {
      title: 'CERTYFIKAT OEKO-TEX',
      description:
        'Nasze produkty są wolne od szkodliwych substancji chemicznych. Przebadane pod kątem bezpieczeństwa dla skóry człowieka z bezpośrednim długotrwałym kontaktem z tkaniną. Co potwierdza międzynarodowy certyfikat OEKO-TEX.',
      iconType: 'eco',
    },
  ];

  const renderIcon = (type) => {
    switch (type) {
      case 'poland':
        return <div className='poland-shape'></div>;
      case 'warranty':
        return (
          <div className='warranty-card'>
            <div className='warranty-card-text'>GWARANCJA JAKOŚCI</div>
            <div className='warranty-seal'></div>
          </div>
        );
      case 'eco':
        return <div className='eco-icon'></div>;
      default:
        return null;
    }
  };

  return (
    <div className='certificates-accordion mb-8 rounded-lg border border-gray-200 overflow-hidden'>
      <button
        onClick={toggleAccordion}
        className='w-full bg-gray-50 py-3 px-4 text-left flex justify-between items-center hover:bg-gray-100 transition-colors'
      >
        <div className='flex items-center'>
          <svg
            className='h-5 w-5 text-deep-navy mr-2'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <span className='font-medium text-deep-navy'>
            Gwarancja Najwyższej Jakości
          </span>
        </div>
        <svg
          className={`h-5 w-5 text-deep-navy transform transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='overflow-hidden'
          >
            <div className='p-4 bg-white'>
              <p className='text-sm text-gray-600 mb-6'>
                Nasze firany i zasłony to synonim najwyższej jakości i polskiego
                rzemiosła. Każdy produkt przechodzi rygorystyczną kontrolę
                jakości, aby zapewnić naszym klientom tylko najlepsze wyroby
                tekstylne do ich domów.
              </p>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className='certificate-item bg-white py-4 px-3 flex flex-col h-full'
                  >
                    <div className='certificate-icon h-20 flex items-center justify-center mb-3'>
                      {renderIcon(cert.iconType)}
                    </div>
                    <h3 className='text-base font-medium mb-2'>{cert.title}</h3>
                    <p className='text-sm text-gray-600'>{cert.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccordionCertificates;
