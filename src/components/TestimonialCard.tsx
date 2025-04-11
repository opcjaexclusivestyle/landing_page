import { Testimonial } from '@/lib/firebase';
import StarRating from './StarRating';
import { Timestamp } from 'firebase/firestore';
import { FaUser } from 'react-icons/fa';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

// Alternatywnie, możesz zdefiniować własny interfejs Timestamp
interface FirestoreTimestamp {
  toDate: () => Date;
  seconds: number;
  nanoseconds: number;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  // Funkcja formatująca datę
  const formatDate = (dateString: any) => {
    if (!dateString) return '';

    // Sprawdź, czy dateString ma metodę toDate (Firestore Timestamp)
    const date =
      typeof dateString === 'object' &&
      dateString !== null &&
      'toDate' in dateString
        ? dateString.toDate()
        : dateString instanceof Date
        ? dateString
        : new Date(String(dateString));

    if (!date || isNaN(date.getTime())) return '';

    // Format daty: DD.MM.YYYY
    return `${date.getDate().toString().padStart(2, '0')}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}.${date.getFullYear()}`;
  };

  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <div className='flex items-center mb-4'>
        <div className='bg-gray-200 rounded-full p-2 mr-3'>
          <FaUser className='text-gray-600' />
        </div>
        <div>
          <h3 className='font-bold text-lg'>{testimonial.name}</h3>
          {testimonial.createdAt && (
            <span className='text-sm text-gray-500'>
              {formatDate(testimonial.createdAt)}
            </span>
          )}
        </div>
      </div>
      <StarRating rating={testimonial.rating} />
      <p className='mt-2 text-gray-700'>{testimonial.content}</p>
    </div>
  );
};

export default TestimonialCard;
