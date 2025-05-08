'use client';
import Link from 'next/link';
import SimpleHeader from '../components/SimpleHeader';
import OrderForm from '../../components/OrderForm';
import MeasuringGuide from '../../components/MeasuringGuide';
import TestimonialsSection from '../../components/TestimonialsSection';
import WorkProcessArtistic from '../../components/WorkProcessArtistic';

export default function Firany() {
  return (
    <>
      <SimpleHeader
        videoSrc='/video/curtains.mp4'
        title='Firany'
        subtitle='Elegancja i styl'
        description='Odkryj kolekcję luksusowych firan'
        height='60vh'
      />

      <div className='min-h-screen py-10 px-4 md:px-8 lg:px-16 bg-[var(--light-gold)]'>
        <div className='mb-8 flex justify-between items-center animate-fade-in'>
          <Link
            href='/'
            className='text-gray-600 hover:text-gray-800 transition-colors duration-300 flex-1 text-left'
          >
            &larr; Powrót do strony głównej
          </Link>
          <div className='flex-1'></div>
        </div>

        <div className='space-y-16 animate-fade-in'>
          <WorkProcessArtistic />
          <TestimonialsSection type='firany' />
          <OrderForm />
          <MeasuringGuide />
        </div>
      </div>
    </>
  );
}
