import { useState, useEffect, useRef } from 'react';
import { addTestimonial, testSupabaseConnection } from '@/lib/supabase';
import StarRating from './StarRating';
import Script from 'next/script';

interface TestimonialFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  type?: string;
}

interface ErrorWithMessage {
  message: string;
  // inne właściwości błędu, jeśli są znane
}

declare global {
  interface Window {
    grecaptcha: {
      enterprise: {
        ready: (callback: () => void) => void;
        execute: (
          siteKey: string,
          options: { action: string },
        ) => Promise<string>;
      };
    };
  }
}

const TestimonialForm = ({
  onSuccess,
  onCancel,
  type,
}: TestimonialFormProps) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<string>(
    'Sprawdzanie połączenia...',
  );
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const nextRippleId = useRef(0);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const siteKey =
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
    '6Lf30CUrAAAAAMLoyk2w8_HgpqxbmYVZgZ_v4m96';

  // Obsługa efektu falowania (ripple effect)
  const handleRippleEffect = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (submitBtnRef.current) {
      const button = submitBtnRef.current;
      const rect = button.getBoundingClientRect();

      // Oblicz pozycję kliknięcia względem przycisku
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Dodaj nowy ripple
      const id = nextRippleId.current++;
      setRipples((prev) => [...prev, { x, y, id }]);

      // Usuń ripple po animacji
      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
      }, 800);
    }
  };

  // Test połączenia przy ładowaniu komponentu
  useEffect(() => {
    async function checkConnection() {
      try {
        const result = await testSupabaseConnection();
        if (result.success) {
          setConnectionStatus('Połączenie z bazą danych aktywne');
        } else {
          setConnectionStatus(
            `Problem z połączeniem: ${
              (result.error as ErrorWithMessage)?.message || 'Nieznany błąd'
            }`,
          );
        }
      } catch (err) {
        setConnectionStatus(`Błąd podczas sprawdzania połączenia: ${err}`);
      }
    }

    checkConnection();
  }, []);

  const executeRecaptcha = async () => {
    try {
      return await new Promise<string>((resolve, reject) => {
        if (
          typeof window === 'undefined' ||
          !window.grecaptcha ||
          !window.grecaptcha.enterprise
        ) {
          reject('reCAPTCHA nie jest dostępna');
          return;
        }

        window.grecaptcha.enterprise.ready(async () => {
          try {
            const token = await window.grecaptcha.enterprise.execute(siteKey, {
              action: 'SUBMIT_TESTIMONIAL',
            });
            resolve(token);
          } catch (error) {
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Błąd podczas wykonywania reCAPTCHA:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Walidacja
    if (!name || !content || rating < 1) {
      setError('Proszę wypełnić wszystkie wymagane pola');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Uzyskaj token reCAPTCHA
      const token = await executeRecaptcha();

      if (!token) {
        throw new Error(
          'Nie udało się zweryfikować, że nie jesteś robotem. Spróbuj ponownie.',
        );
      }

      await addTestimonial({
        name,
        location,
        rating,
        content,
        type,
        captcha: token,
      });

      setSuccessMessage(
        'Dziękujemy za dodanie opinii! Zostanie ona opublikowana po weryfikacji.',
      );

      // Reset formularza
      setName('');
      setLocation('');
      setRating(5);
      setContent('');
      setCaptchaToken(null);

      // Callback po pomyślnym dodaniu
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (err) {
      console.error('Błąd podczas dodawania opinii:', err);
      setError(
        'Wystąpił błąd podczas dodawania opinii. Proszę spróbować ponownie.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <div className='bg-green-50 border border-green-200 p-6 rounded-lg text-center'>
        <div className='text-green-600 text-xl mb-4'>✓</div>
        <p className='text-green-800'>{successMessage}</p>
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`}
        strategy='afterInteractive'
      />

      <div className='bg-gray-50 p-6 rounded-lg shadow-md'>
        <h3 className='text-2xl font-semibold text-gray-800 mb-6'>
          Podziel się swoją opinią
        </h3>

        {/* Status połączenia - do diagnostyki */}
        <div
          className={`p-2 mb-4 text-sm ${
            connectionStatus.includes('aktywne')
              ? 'bg-green-50 text-green-700'
              : 'bg-yellow-50 text-yellow-700'
          }`}
        >
          {connectionStatus}
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6'>
            {error}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='name' className='block text-gray-700 mb-2'>
              Imię i nazwisko <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brown-400'
              required
            />
          </div>

          <div className='mb-4'>
            <label htmlFor='location' className='block text-gray-700 mb-2'>
              Miejscowość
            </label>
            <input
              type='text'
              id='location'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brown-400'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 mb-2'>
              Ocena <span className='text-red-500'>*</span>
            </label>
            <StarRating
              rating={rating}
              editable={true}
              onChange={setRating}
              size='lg'
            />
          </div>

          <div className='mb-6'>
            <label htmlFor='content' className='block text-gray-700 mb-2'>
              Twoja opinia <span className='text-red-500'>*</span>
            </label>
            <textarea
              id='content'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brown-400 min-h-[100px]'
              required
            />
          </div>

          <p className='text-xs text-gray-400 mb-4'>
            Ta strona jest chroniona przez reCAPTCHA Enterprise, stosują się do
            niej
            <a
              href='https://policies.google.com/privacy'
              className='text-blue-500 hover:underline ml-1'
              target='_blank'
              rel='noopener noreferrer'
            >
              polityka prywatności
            </a>
            <span className='mx-1'>i</span>
            <a
              href='https://policies.google.com/terms'
              className='text-blue-500 hover:underline'
              target='_blank'
              rel='noopener noreferrer'
            >
              warunki korzystania z usługi
            </a>
            <span className='mx-1'>Google.</span>
          </p>

          <div className='flex justify-end space-x-4'>
            <button
              type='button'
              onClick={onCancel}
              className='px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-200'
              disabled={isSubmitting}
            >
              Anuluj
            </button>
            <button
              type='submit'
              className={`px-6 py-2 bg-[var(--primary-color)] rounded-md text-white 
                shadow-md hover:shadow-lg hover:bg-opacity-90 
                active:transform active:scale-95
                transition-all duration-300 relative overflow-hidden
                ${isSubmitting ? 'pl-10' : ''}`}
              disabled={isSubmitting}
              ref={submitBtnRef}
              onClick={handleRippleEffect}
            >
              {isSubmitting && (
                <span className='absolute left-0 inset-y-0 flex items-center justify-center w-10'>
                  <svg
                    className='animate-spin h-5 w-5 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                </span>
              )}
              <span
                className={`${isSubmitting ? 'animate-pulse' : ''} text-black`}
              >
                {isSubmitting ? 'Wysyłanie...' : 'Wyślij opinię'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default TestimonialForm;
