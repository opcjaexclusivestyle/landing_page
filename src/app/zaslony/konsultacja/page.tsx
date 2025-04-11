'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function Konsultacja() {
  const [decorationType, setDecorationType] = useState('');
  const [rodWidth, setRodWidth] = useState('');
  const [height, setHeight] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const headerRef = useRef(null);
  const messageRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(headerRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: 'power3.out',
    });

    tl.from(
      messageRef.current,
      {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.5',
    );

    tl.from(
      formRef.current,
      {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.4',
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email: 'brak@email.com', // Jeśli nie zbierasz maila, dodaj placeholder
          phone,
          message: 'Prośba o konsultację w sprawie zasłon',
          formType: 'Formularz konsultacji zasłon',
          // Dodatkowe dane specyficzne dla formularza
          decorationType,
          rodWidth,
          height,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd');
      }

      alert(
        'Dziękujemy za przesłanie formularza! Nasz specjalista skontaktuje się z Tobą wkrótce.',
      );

      // Resetuj formularz
      setDecorationType('');
      setRodWidth('');
      setHeight('');
      setName('');
      setPhone('');
    } catch (error) {
      console.error('Błąd:', error);
      alert(
        'Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie później.',
      );
    }
  };

  return (
    <div className='min-h-screen py-10 px-4 md:px-8 lg:px-16 bg-[var(--light-gold)]'>
      {/* Nagłówek z przyciskiem powrotu */}
      <div className='mb-12 flex justify-between items-center' ref={headerRef}>
        <Link
          href='/zaslony'
          className='text-[var(--deep-navy)] hover:text-[var(--gold)] transition-colors'
        >
          &larr; Powrót do zasłon
        </Link>
        <h1 className='text-4xl md:text-5xl lg:text-6xl text-center luxury-heading font-light text-[var(--deep-navy)]'>
          Konsultacja
        </h1>
        <div className='w-[100px]'></div> {/* Pusty element dla wyrównania */}
      </div>

      {/* Wiadomość wstępna */}
      <div
        className='max-w-4xl mx-auto mb-16 text-center text-black'
        ref={messageRef}
      >
        <p className='text-lg md:text-xl leading-relaxed p-6 bg-white rounded-lg shadow-md'>
          Nasz specjalista pomoże Ci dopasować odpowiednie zasłony do Twojego
          wnętrza. Wypełnij formularz poniżej, a skontaktujemy się z Tobą, aby
          omówić szczegóły i przedstawić najlepsze rozwiązania dla Twojego domu.
        </p>
      </div>

      {/* Formularz konsultacji */}
      <div className='max-w-3xl mx-auto mb-16' ref={formRef}>
        <form
          onSubmit={handleSubmit}
          className='bg-white p-6 rounded-lg shadow-md'
        >
          {/* Typ dekoracji */}
          <div className='mb-6'>
            <label
              htmlFor='decorationType'
              className='block text-gray-700 mb-2 font-medium'
            >
              Jaki rodzaj dekoracji okiennej Cię interesuje?
            </label>
            <select
              id='decorationType'
              value={decorationType}
              onChange={(e) => setDecorationType(e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
              required
            >
              <option value=''>Wybierz...</option>
              <option value='klasyczne-zaslony'>Klasyczne zasłony</option>
              <option value='zaslony-zaciemniajace'>
                Zasłony zaciemniające
              </option>
              <option value='tkaniny-dekoracyjne'>Tkaniny dekoracyjne</option>
              <option value='kombinacja'>Kombinacja różnych elementów</option>
              <option value='nie-wiem'>Nie wiem, potrzebuję porady</option>
            </select>
          </div>

          {/* Szerokość karnisza */}
          <div className='mb-6'>
            <label
              htmlFor='rodWidth'
              className='block text-gray-700 mb-2 font-medium'
            >
              Szerokość karnisza (cm):
            </label>
            <input
              type='number'
              id='rodWidth'
              value={rodWidth}
              onChange={(e) => setRodWidth(e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
              required
              min='20'
              max='500'
              placeholder='np. 220'
            />
            <p className='text-sm text-gray-500 mt-1'>
              Podaj szerokość karnisza lub okna, na którym mają być zawieszone
              zasłony
            </p>
          </div>

          {/* Wysokość */}
          <div className='mb-6'>
            <label
              htmlFor='height'
              className='block text-gray-700 mb-2 font-medium'
            >
              Wysokość od zaczepu zasłony do podłogi (cm):
            </label>
            <input
              type='number'
              id='height'
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
              required
              min='20'
              max='400'
              placeholder='np. 250'
            />
          </div>

          {/* Dane kontaktowe */}
          <div className='mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='name'
                className='block text-gray-700 mb-2 font-medium'
              >
                Imię i nazwisko:
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
            <div>
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
                pattern='[0-9]{9}'
                placeholder='np. 123456789'
              />
            </div>
          </div>

          {/* Przycisk wysyłania */}
          <div className='text-center'>
            <button
              type='submit'
              className='bg-[var(--deep-navy)] text-white px-8 py-3 rounded-md hover:bg-[var(--gold)] transition-colors text-lg font-medium'
            >
              WYSYŁAM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
