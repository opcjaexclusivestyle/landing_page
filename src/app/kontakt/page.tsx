'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function Kontakt() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const headerRef = useRef(null);
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
      formRef.current,
      {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.5',
    );
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Tutaj będzie obsługa wysyłania formularza
    alert('Dziękujemy za Twoją wiadomość! Odpowiemy jak najszybciej.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className='min-h-screen py-10 px-4 md:px-8 lg:px-16 bg-[var(--light-gold)] text-black'>
      {/* Nagłówek z przyciskiem powrotu */}
      <div className='mb-12 flex justify-between items-center' ref={headerRef}>
        <Link
          href='/'
          className='text-[var(--deep-navy)] hover:text-[var(--gold)] transition-colors'
        >
          &larr; Powrót do strony głównej
        </Link>
        <h1 className='text-4xl md:text-5xl lg:text-6xl text-center luxury-heading font-light text-[var(--deep-navy)]'>
          Kontakt
        </h1>
        <div className='w-[100px]'></div> {/* Pusty element dla wyrównania */}
      </div>

      {/* Formularz kontaktowy */}
      <div className='max-w-2xl mx-auto' ref={formRef}>
        <div className='bg-white p-8 rounded-lg shadow-md'>
          <div className='mb-8 text-center'>
            <p className='text-lg text-gray-700 mb-2'>
              Masz pytania? Skontaktuj się z nami!
            </p>
            <p className='text-gray-600'>
              Wypełnij formularz, a odpowiemy najszybciej jak to możliwe.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='mb-6'>
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

            <div className='mb-6'>
              <label
                htmlFor='email'
                className='block text-gray-700 mb-2 font-medium'
              >
                Email:
              </label>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                required
              />
            </div>

            <div className='mb-6'>
              <label
                htmlFor='message'
                className='block text-gray-700 mb-2 font-medium'
              >
                Wiadomość:
              </label>
              <textarea
                id='message'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className='w-full border border-gray-300 rounded-md px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                required
              ></textarea>
            </div>

            <div className='text-center'>
              <button
                type='submit'
                className='bg-[var(--deep-navy)] text-white px-8 py-3 rounded-md hover:bg-[var(--gold)] transition-colors text-lg font-medium'
              >
                Wyślij
              </button>
            </div>
          </form>
        </div>

        {/* Informacje kontaktowe */}
        <div className='mt-12 bg-white p-8 rounded-lg shadow-md'>
          <h2 className='text-2xl mb-6 text-center luxury-heading'>
            Informacje kontaktowe
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <h3 className='text-lg font-medium mb-3'>Adres:</h3>
              <p className='text-gray-700'>
                Firma Firany i Rolety
                <br />
                ul. Przykładowa 123
                <br />
                00-000 Warszawa
              </p>
            </div>

            <div>
              <h3 className='text-lg font-medium mb-3'>Kontakt:</h3>
              <p className='text-gray-700 mb-2'>Telefon: +48 123 456 789</p>
              <p className='text-gray-700'>Email: kontakt@firany-rolety.pl</p>
            </div>
          </div>

          <div className='mt-8'>
            <h3 className='text-lg font-medium mb-3'>Godziny otwarcia:</h3>
            <p className='text-gray-700'>
              Poniedziałek - Piątek: 9:00 - 17:00
              <br />
              Sobota: 10:00 - 14:00
              <br />
              Niedziela: Zamknięte
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
