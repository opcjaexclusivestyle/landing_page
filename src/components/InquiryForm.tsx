import React, { useState } from 'react';

const InquiryForm = () => {
  const [decorationType, setDecorationType] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
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
      setDecorationType('');
      setWidth('');
      setHeight('');
      setPhone('');
      setName('');
    } catch (error) {
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

      <div className='bg-white p-6 rounded-lg shadow-md mb-8 text-center'>
        <p className='text-lg leading-relaxed text-gray-700'>
          Nasz specjalista pomoże Ci dopasować do Twoich oczekiwań wymarzoną
          firankę bądź zasłonę i znajdzie dla Ciebie najlepsze rozwiązanie,
          które funkcjonalnie uatrakcyjni Twoje wnętrze.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded-lg shadow-md'
      >
        <div className='mb-6'>
          <label
            htmlFor='decorationType'
            className='block text-gray-700 mb-2 font-medium'
          >
            Jakiej dekoracji szuka Pani/Pan do swojego okna?
          </label>
          <input
            type='text'
            id='decorationType'
            value={decorationType}
            onChange={(e) => setDecorationType(e.target.value)}
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
            required
          />
        </div>

        <div className='mb-6'>
          <label
            htmlFor='width'
            className='block text-gray-700 mb-2 font-medium'
          >
            Proszę zmierzyć i podać szerokość części użytkowej swojego karnisza:
          </label>
          <input
            type='text'
            id='width'
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
            required
            placeholder='np. 240 cm'
          />
        </div>

        <div className='mb-6'>
          <label
            htmlFor='height'
            className='block text-gray-700 mb-2 font-medium'
          >
            Proszę zmierzyć i podać wysokość, od połowy żabki do podłogi:
          </label>
          <input
            type='text'
            id='height'
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
            required
            placeholder='np. 260 cm'
          />
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Wysyłanie...' : 'WYSYŁAM'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;
