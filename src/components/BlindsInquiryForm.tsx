import React, { useState } from 'react';
import Image from 'next/image';

const blindTypes = [
  {
    id: 'roman',
    name: 'Rolety rzymskie',
    image: '/images/genre/french.png', // Tymczasowe zdjęcie, należy zamienić na właściwe
  },
  {
    id: 'pleated',
    name: 'Rolety plisowane',
    image: '/images/genre/italian.jpg.png', // Tymczasowe zdjęcie, należy zamienić na właściwe
  },
  {
    id: 'blinds',
    name: 'Żaluzje',
    image: '/images/genre/luxury.png', // Tymczasowe zdjęcie, należy zamienić na właściwe
  },
  {
    id: 'traditional',
    name: 'Tradycyjne zasłony',
    image: '/images/genre/modern.png', // Tymczasowe zdjęcie, należy zamienić na właściwe
  },
];

const BlindsInquiryForm = () => {
  const [selectedBlindType, setSelectedBlindType] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // W rzeczywistej aplikacji tutaj byłby kod wysyłający dane do API
      // Poniżej jest symulacja wysłania danych i otrzymania odpowiedzi
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitStatus({
        message:
          'Dziękujemy za zgłoszenie! Nasz specjalista skontaktuje się z Tobą wkrótce.',
        isError: false,
      });

      // Resetowanie formularza
      setSelectedBlindType('');
      setPhone('');
      setCity('');
      setPostalCode('');
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Błąd podczas wysyłania formularza:', error);
      setSubmitStatus({
        message:
          'Wystąpił problem podczas wysyłania zgłoszenia. Spróbuj ponownie później.',
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='max-w-3xl mx-auto mb-16'>
      <h2 className='text-2xl md:text-3xl mb-4 text-center luxury-heading'>
        FORMULARZ ZGŁOSZENIOWY
      </h2>

      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded-lg shadow-md'
      >
        <div className='mb-6'>
          <label className='block text-gray-700 mb-2 font-medium'>
            Jakie rolety chciałby Pan/Pani w swoim domu/mieszkaniu?
          </label>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {blindTypes.map((type) => (
              <div
                key={type.id}
                className={`border p-4 rounded-lg cursor-pointer transition-all ${
                  selectedBlindType === type.id
                    ? 'border-[var(--gold)] bg-[var(--light-gold)]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedBlindType(type.id)}
              >
                <div className='h-40 bg-gray-100 mb-3 rounded flex items-center justify-center overflow-hidden'>
                  <Image
                    src={type.image}
                    alt={type.name}
                    width={150}
                    height={150}
                    className='object-contain'
                  />
                </div>
                <h3 className='font-medium text-center'>{type.name}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className='mb-6'>
          <label
            htmlFor='phone'
            className='block text-gray-700 mb-2 font-medium'
          >
            Numer telefonu:
          </label>
          <input
            type='tel'
            id='phone'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
            required
            placeholder='xxx-xxx-xxx'
          />
        </div>

        <div className='mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='city'
              className='block text-gray-700 mb-2 font-medium'
            >
              Miasto:
            </label>
            <input
              type='text'
              id='city'
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
              required
            />
          </div>
          <div>
            <label
              htmlFor='postalCode'
              className='block text-gray-700 mb-2 font-medium'
            >
              Kod pocztowy:
            </label>
            <input
              type='text'
              id='postalCode'
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
              required
              placeholder='xx-xxx'
            />
          </div>
        </div>

        <div className='mb-6'>
          <label
            htmlFor='name'
            className='block text-gray-700 mb-2 font-medium'
          >
            Imię:
          </label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
            required
          />
        </div>

        <div className='mb-6'>
          <label
            htmlFor='email'
            className='block text-gray-700 mb-2 font-medium'
          >
            Adres e-mail:
          </label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
            required
            placeholder='adres@example.com'
          />
        </div>

        {submitStatus && (
          <div
            className={`mb-6 p-4 rounded-md ${
              submitStatus.isError
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <div className='text-center'>
          <button
            type='submit'
            className='magic-button'
            disabled={isSubmitting || !selectedBlindType}
          >
            {isSubmitting ? 'Wysyłanie...' : 'WYSYŁAM'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlindsInquiryForm;
