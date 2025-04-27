'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
  isSpecial?: boolean;
  linkTo?: string;
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
  const [imageError, setImageError] = useState(false);

  if (!card) {
    return <div className='bg-white rounded-lg shadow-md p-6'>Loading...</div>;
  }

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

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(card);
    } else if (card.buttonLink) {
      window.location.href = card.buttonLink;
    }
  };

  // Function to fix image path issues
  const getProperImagePath = (imagePath: string) => {
    if (!imagePath) return '/placeholder-image.jpg';

    // Fix dla ścieżek pochodzących z obiektu colors
    // (sprawdzamy, czy to URL zawierający supabase storage)
    if (imagePath.includes('supabase.co/storage')) {
      return imagePath;
    }

    // Fix for image_path/image[0] format
    if (imagePath.includes('[')) {
      return imagePath.replace(/\[(\d+)\]/g, '$1');
    }

    return imagePath;
  };

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col cursor-pointer hover:translate-y-[-5px] transition-transform duration-300'
      onClick={handleCardClick}
    >
      {/* {card.discount && (
        <div className='absolute top-2 right-2 bg-primary text-white text-sm px-2 py-1 rounded-md z-10'>
          -{card.discount}%
        </div>
      )} */}

      <div className='relative w-full h-48 md:h-64 rounded-t-lg overflow-hidden'>
        {card.image && !imageError ? (
          <Image
            src={getProperImagePath(card.image)}
            alt={card.title || 'Product image'}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            priority
            onError={handleImageError}
          />
        ) : (
          <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
            <span className='text-gray-400'>No image</span>
          </div>
        )}
      </div>

      <div className='p-6 flex flex-col flex-grow'>
        <h3 className='text-xl font-semibold text-gray-800 mb-3'>
          {card.title}
        </h3>
        <p className='text-gray-600 text-sm mb-4 flex-grow'>
          {card.description}
        </p>

        {showPrice && card.price !== undefined && (
          <div className='flex items-baseline mt-2 mb-4'>
            <span className='text-xl text-gray-900 font-bold'>
              {card.price.toFixed(2)} zł
            </span>
            {/* {card.oldPrice && (
              <span className='ml-2 text-sm text-gray-500 line-through'>
                {card.oldPrice.toFixed(2)} zł
              </span>
            )} */}
          </div>
        )}

        {/* {card.additionalInfo && (
          <div className='text-xs text-gray-500 mt-1 mb-4 whitespace-pre-line'>
            {card.additionalInfo}
          </div>
        )} */}

        {card.buttonText && (
          <button
            className={`mt-auto w-full py-2 px-4 rounded-md transition-colors ${getButtonClass()}`}
            onClick={(e) => {
              e.stopPropagation();
              if (card.buttonLink) {
                window.location.href = card.buttonLink;
              } else if (card.linkTo) {
                window.location.href = card.linkTo;
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
