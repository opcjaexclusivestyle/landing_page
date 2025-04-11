import { Testimonial } from '@/lib/firebase';
import StarRating from './StarRating';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  // Funkcja formatująca datę z formatu ISO string
  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return '';

    try {
      const date =
        typeof dateString === 'string'
          ? new Date(dateString)
          : dateString instanceof Date
          ? dateString
          : dateString.toDate?.();

      if (!date || isNaN(date.getTime())) return '';

      return date.toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Błąd podczas formatowania daty:', error);
      return '';
    }
  };

  // Pobierz sformatowaną datę
  const formattedDate = testimonial.createdAt
    ? formatDate(testimonial.createdAt)
    : '';

  return (
    <div className='bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 transition-transform duration-300'>
      <div className='flex items-center mb-4'>
        <div className='w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4'>
          <span className='text-gray-600 font-bold'>
            {testimonial.name.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className='font-bold text-gray-900'>{testimonial.name}</h3>
          <p className='text-gray-600 text-sm'>{testimonial.location}</p>
        </div>
      </div>

      <div className='mb-4'>
        <StarRating rating={testimonial.rating} />
      </div>

      <p className='text-gray-700 italic'>"{testimonial.content}"</p>

      <div className='mt-4 text-right text-xs text-gray-500'>
        {formattedDate}
      </div>
    </div>
  );
};

export default TestimonialCard;
