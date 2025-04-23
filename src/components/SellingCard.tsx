'use client';
import Image from 'next/image';

export interface Card {
  id: number;
  title: string;
  description: string;
  image: string;
  price?: number;
  oldPrice?: number;
  discount?: number;
  buttonText?: string;
  buttonLink?: string;
  additionalInfo?: string;
}

interface SellingCardProps {
  card: Card;
  showPrice?: boolean;
  buttonVariant?: 'primary' | 'secondary' | 'outline';
  onCardClick?: (card: Card) => void;
}

export default function SellingCard({
  card,
  showPrice = true,
  buttonVariant = 'primary',
  onCardClick,
}: SellingCardProps) {
  const getButtonClass = () => {
    switch (buttonVariant) {
      case 'primary':
        return 'premium-button';
      case 'secondary':
        return 'bg-secondary text-white hover:bg-secondary/90';
      case 'outline':
        return 'border-2 border-primary text-primary hover:bg-primary hover:text-white';
      default:
        return 'premium-button';
    }
  };

  return (
    <div
      className='rounded-lg overflow-hidden shadow-lg border border-gray-100 transform transition-transform duration-300 hover:-translate-y-2 bg-white'
      onClick={() => onCardClick?.(card)}
    >
      <div className='relative h-72 overflow-hidden'>
        <Image
          src={card.image}
          alt={card.title}
          fill
          className='object-cover transition-transform duration-700 hover:scale-105'
        />

        {card.discount && (
          <div className='absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold'>
            -{card.discount}%
          </div>
        )}
      </div>

      <div className='p-6 bg-white'>
        <h3 className='font-medium text-gray-800 mb-2'>{card.title}</h3>
        <p className='text-sm text-gray-700 mb-3 h-20 leading-relaxed overflow-hidden'>
          {card.description}
        </p>

        {showPrice && card.price && (
          <div className='space-y-2 mb-4'>
            <div className='flex items-center'>
              <p className='text-primary font-semibold text-2xl'>
                {card.price.toFixed(2)} zł
              </p>
              {card.oldPrice && (
                <p className='ml-2 text-sm text-gray-400 line-through'>
                  {card.oldPrice.toFixed(2)} zł
                </p>
              )}
            </div>
          </div>
        )}

        {card.additionalInfo && (
          <p className='text-xs text-gray-500 mb-4'>{card.additionalInfo}</p>
        )}

        {card.buttonText && (
          <button
            className={`w-full py-2 px-4 rounded-md transition-colors duration-300 ${getButtonClass()}`}
            onClick={(e) => {
              e.stopPropagation();
              if (card.buttonLink) {
                window.location.href = card.buttonLink;
              }
            }}
          >
            {card.buttonText}
          </button>
        )}
      </div>
    </div>
  );
}
