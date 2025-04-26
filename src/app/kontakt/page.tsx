'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import dynamic from 'next/dynamic';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import SimpleHeader from '../components/SimpleHeader';

// Fix Leaflet icon issue
const MarkerIcon = () => {
  useEffect(() => {
    (async function init() {
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl:
          'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
    })();
  }, []);

  return null;
};

// Dynamicznie importuj MapContainer, aby uniknąć błędów SSR
const DynamicMap = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  {
    ssr: false,
  },
);

export default function Kontakt() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Dziękujemy za Twoją wiadomość! Odpowiemy jak najszybciej.');
    setName('');
    setEmail('');
    setMessage('');
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
        {/* Mapa w tle */}
        {mapReady && (
          <div className='absolute inset-0 z-0 opacity-75'>
            <DynamicMap
              center={position}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <MarkerIcon />
              <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={position}>
                <Popup>
                  Zasłonex
                  <br />
                  ul. Redutowa 9<br />
                  26-600 Radom
                </Popup>
              </Marker>
            </DynamicMap>
          </div>
        )}

        {/* Zawartość na pierwszym planie */}
        <div className='relative z-10 py-10 px-4 md:px-8 lg:px-16'>
          {/* Nagłówek z przyciskiem powrotu */}
          <div className='mb-12 flex justify-between items-center'>
            <Link
              href='/'
              className='bg-white px-5 py-3 rounded-lg text-[var(--deep-navy)] hover:text-[var(--gold)] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200'
            >
              &larr; Powrót do strony głównej
            </Link>
            <h1 className='text-4xl md:text-5xl lg:text-6xl text-center luxury-heading font-light text-[var(--deep-navy)] bg-white bg-opacity-90 px-8 py-4 rounded-lg shadow-lg'>
              Kontakt
            </h1>
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
                    <p className='text-lg'>531 400 230</p>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='bg-white bg-opacity-20 p-3 rounded-full'>
                    <FaEnvelope className='text-xl text-white' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-300'>EMAIL</p>
                    <p className='text-lg'>biuro@zaslonex.pl</p>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='bg-white bg-opacity-20 p-3 rounded-full'>
                    <FaClock className='text-xl text-white' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-300'>GODZINY OTWARCIA</p>
                    <p className='text-base'>
                      Poniedziałek - Piątek: 9:00 - 17:00
                      <br />
                      Sobota: 10:00 - 14:00
                      <br />
                      Niedziela: Zamknięte
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
            <div className='bg-white p-10 rounded-2xl shadow-2xl flex-1 min-w-[280px] md:min-w-[500px] backdrop-blur-sm bg-opacity-95'>
              <h3 className='text-2xl mb-6 text-[#0d2b45] font-medium'>
                Napisz do nas
              </h3>

              <p className='text-gray-700 mb-6'>
                Masz pytania? Wypełnij poniższy formularz, a odpowiemy
                najszybciej jak to możliwe (zazwyczaj w ciągu jednego dnia
                roboczego).
              </p>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='flex flex-col md:flex-row gap-6'>
                  <div className='flex-1'>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Imię i nazwisko
                    </label>
                    <input
                      type='text'
                      id='name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder='Twoje imię i nazwisko*'
                      className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all duration-200'
                      required
                    />
                  </div>
                  <div className='flex-1'>
                    <label
                      htmlFor='email'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Email
                    </label>
                    <input
                      type='email'
                      id='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='Twój e-mail*'
                      className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all duration-200'
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor='message'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Wiadomość
                  </label>
                  <textarea
                    id='message'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Twoja wiadomość*'
                    className='w-full border border-gray-300 rounded-lg px-4 py-3 h-40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all duration-200'
                    required
                  ></textarea>
                </div>

                <div className='text-center pt-4'>
                  <button
                    type='submit'
                    className='bg-gradient-to-r from-[#0d2b45] to-[#154267] text-white px-10 py-4 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-lg font-medium'
                  >
                    Wyślij wiadomość
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
