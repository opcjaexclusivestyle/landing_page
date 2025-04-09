import { useState } from 'react';
import { addTestimonial } from '@/lib/firebase';
import StarRating from './StarRating';
import { Timestamp } from 'firebase/firestore';

interface TestimonialFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const TestimonialForm = ({ onSuccess, onCancel }: TestimonialFormProps) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      await addTestimonial({
        name,
        location,
        rating,
        content,
        createdAt: Timestamp.now(),
      });

      setSuccessMessage(
        'Dziękujemy za dodanie opinii! Zostanie ona opublikowana po weryfikacji.',
      );

      // Reset formularza
      setName('');
      setLocation('');
      setRating(5);
      setContent('');

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
    <div className='bg-gray-50 p-6 rounded-lg shadow-md'>
      <h3 className='text-2xl font-semibold text-gray-800 mb-6'>
        Podziel się swoją opinią
      </h3>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6'>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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

        <div className='flex justify-end space-x-4'>
          <button
            type='button'
            onClick={onCancel}
            className='px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100'
            disabled={isSubmitting}
          >
            Anuluj
          </button>
          <button
            type='submit'
            className='px-6 py-2 bg-brown-500 rounded-md text-white hover:bg-brown-600 transition-colors'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Wysyłanie...' : 'Wyślij opinię'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestimonialForm;
