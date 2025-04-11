import Link from 'next/link';
import BlogLayout from '@/components/BlogLayout';

export default function NotFound() {
  return (
    <BlogLayout>
      <div className='min-h-[60vh] flex flex-col items-center justify-center px-4 py-16'>
        <h1 className='text-6xl font-bold text-gray-900 mb-4'>404</h1>
        <h2 className='text-2xl font-medium text-gray-700 mb-8'>
          Strona nie znaleziona
        </h2>
        <p className='text-gray-600 text-center max-w-md mb-12'>
          Przepraszamy, ale strona której szukasz nie istnieje lub została
          przeniesiona.
        </p>
        <div className='flex flex-col sm:flex-row gap-4'>
          <Link
            href='/blog'
            className='px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition'
          >
            Wróć do bloga
          </Link>
          <Link
            href='/'
            className='px-6 py-3 bg-white text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition'
          >
            Strona główna
          </Link>
        </div>
      </div>
    </BlogLayout>
  );
}
