import Image from 'next/image';
import { Testimonial } from '@/lib/firebase';
import StarRating from './StarRating';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  // Domyślne avatary dla osób, które nie mają zdjęcia profilowego
  const defaultAvatars = [
    '/images/testimonial-1.jpg',
    '/images/testimonial-2.jpg',
    '/images/testimonial-3.jpg',
  ];

  // Losowy avatar na podstawie imienia (ale stały dla danego imienia)
  const getRandomAvatar = (name: string) => {
    const index =
      name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      defaultAvatars.length;
    return testimonial.avatar || defaultAvatars[index];
  };

  return (
    <div className='bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 transition-transform duration-300'>
      <div className='flex items-center mb-4'>
        <div className='w-12 h-12 bg-gray-300 rounded-full overflow-hidden mr-4'>
          <Image
            src={getRandomAvatar(testimonial.name)}
            alt={testimonial.name}
            width={48}
            height={48}
            className='w-full h-full object-cover'
          />
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
        {testimonial.createdAt?.toDate().toLocaleDateString('pl-PL', {
          year: 'numeric',
          month: 'long',
        })}
      </div>
    </div>
  );
};

export default TestimonialCard;
