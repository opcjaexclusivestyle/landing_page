'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import dynamicImport from 'next/dynamic';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import ContactForm from '../components/ContactForm';
import SimpleHeader from '../components/SimpleHeader';

// Ustawienie dla Next.js - strona będzie renderowana dynamicznie
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Dynamicznie importuj komponenty Leaflet
const DynamicMap = dynamicImport(
  () =>
    import('react-leaflet').then((mod) => {
      // Sprawdzenie czy window istnieje (czy jesteśmy w przeglądarce)
      if (typeof window === 'undefined') {
        return () => <div>Mapa dostępna po załadowaniu strony</div>;
      }

      return import('leaflet').then((L) => {
        // Fix Leaflet icon issues
        // @ts-ignore - ikona Leaflet ma właściwość _getIconUrl
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl:
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl:
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });

        // Zwróć komponent mapy
        const { MapContainer, TileLayer, Marker, Popup } = mod;
        const MapComponent = (props: any) => (
          <MapContainer {...props}>
            <TileLayer
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={props.center}>
              <Popup>
                Zasłonex
                <br />
                ul. Redutowa 9<br />
                26-600 Radom
              </Popup>
            </Marker>
          </MapContainer>
        );
        return MapComponent;
      });
    }),
  { ssr: false, loading: () => <div>Ładowanie mapy...</div> },
);

export default function Kontakt() {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const handleFormSubmit = (formData: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }) => {
    alert('Dziękujemy za Twoją wiadomość! Odpowiemy jak najszybciej.');
    console.log('Form data:', formData);
    // Tutaj można dodać logikę wysyłania formularza, np. do API
  };

  // Położenie firmy (Radom)
  const position: [number, number] = [51.3993, 21.147];

  return (
    <>
      <SimpleHeader
        title='Kontakt'
        imageSrc='/contactpage.png'
        description='Kontakt z nami'
      />

      <div className='min-h-screen bg-gradient-to-br from-[#f0f7fd] to-[#e1edf9] relative'>
        {/* Mapa na górze jako pasek */}
        {mapReady && (
          <div className='w-full h-[400px] sm:h-[450px] md:h-[500px] relative z-0'>
            <DynamicMap
              center={position}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            />
          </div>
        )}

        {/* Zawartość, która nachodzi na mapę */}
        <div className='px-4 md:px-8 lg:px-16 relative z-10 -mt-[150px] sm:-mt-[200px] md:-mt-[250px]'>
          {/* Nagłówek z przyciskiem powrotu */}
          <div className='mb-12 flex justify-between items-center'>
            <Link
              href='/'
              className='bg-white px-5 py-3 rounded-lg text-[var(--deep-navy)] hover:text-[var(--gold)] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200'
            >
              &larr; Powrót do strony głównej
            </Link>

            <div className='w-[100px]'></div>
          </div>

          {/* Kontener dla informacji kontaktowych i formularza */}
          <div className='flex flex-wrap gap-10 justify-center max-w-7xl mx-auto'>
            {/* Informacje kontaktowe */}
            <div className='bg-gradient-to-br from-[#0d2b45] to-[#154267] text-white p-8 rounded-2xl shadow-2xl w-full md:w-[420px] transform transition-all duration-300 hover:scale-[1.01]'>
              <h2 className='text-3xl mb-5 luxury-heading font-light'>
                Zasłonex
              </h2>
              <hr className='border-white opacity-30 my-5' />

              <div className='space-y-6'>
                <div className='flex items-center gap-4'>
                  <div className='bg-white bg-opacity-20 p-3 rounded-full'>
                    <FaMapMarkerAlt className='text-xl text-white' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-300'>ADRES</p>
                    <p className='text-lg'>ul. Redutowa 9, 26-600 Radom</p>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='bg-white bg-opacity-20 p-3 rounded-full'>
                    <FaPhone className='text-xl text-white' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-300'>TELEFON</p>
                    <p className='text-lg'>+48 531 005 929</p>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='bg-white bg-opacity-20 p-3 rounded-full'>
                    <FaEnvelope className='text-xl text-white' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-300'>EMAIL</p>
                    <p className='text-lg'>zaslonex.info@gmial.com</p>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='bg-white bg-opacity-20 p-3 rounded-full'>
                    <FaClock className='text-xl text-white' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-300'>GODZINY OTWARCIA</p>
                    <p className='text-base'>
                      Poniedziałek - Piątek: 8:00 – 16:00
                      <br />
                      Sobota- Niedziela: Zamknięte
                    </p>
                  </div>
                </div>
              </div>

              {/* Zdjęcie */}
              <div className='mt-8 overflow-hidden rounded-xl shadow-lg'>
                <img
                  src='logo_zaslonex.svg'
                  alt='Zasłonex'
                  className='w-full h-auto object-cover transform transition-transform duration-700 hover:scale-110'
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://via.placeholder.com/400x200?text=Zdjęcie+Zasłonex';
                  }}
                />
              </div>
            </div>

            {/* Formularz kontaktowy */}
            <ContactForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      </div>
    </>
  );
}
