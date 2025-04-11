import BlogLayout from '@/components/BlogLayout';
import BlogPostCard from '@/components/BlogPostCard';
import { getPostsByCategory } from '@/lib/api';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { categoryName: string };
}) {
  const categoryName = decodeURIComponent(params.categoryName);
  const posts = await getPostsByCategory(categoryName);

  if (!posts.length) {
    return {
      title: 'Kategoria nie znaleziona',
      description: 'Przepraszamy, nie znaleźliśmy artykułów w tej kategorii',
    };
  }

  return {
    title: `${categoryName} - Blog Wnętrzarski`,
    description: `Artykuły z kategorii ${categoryName.toLowerCase()} - znajdź inspiracje i porady z tej dziedziny.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { categoryName: string };
}) {
  const categoryName = decodeURIComponent(params.categoryName);
  const posts = await getPostsByCategory(categoryName);

  if (!posts.length) {
    notFound();
  }

  return (
    <BlogLayout>
      <div className='container mx-auto px-4 py-16 sm:px-6 lg:px-8'>
        <header className='text-center mb-16'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
            {categoryName}
          </h1>
          <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
            Odkryj nasze najlepsze artykuły z kategorii{' '}
            {categoryName.toLowerCase()}. Znajdź tutaj inspiracje i praktyczne
            porady wnętrzarskie.
          </p>
        </header>

        {/* Siatka wpisów */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {posts.length > 9 && (
          <div className='mt-16 flex justify-center'>
            <nav className='inline-flex rounded-md shadow'>
              <a
                href='#'
                className='py-2 px-4 bg-white text-gray-700 border border-gray-200 rounded-l-md hover:bg-gray-50'
              >
                Poprzednia
              </a>
              <a
                href='#'
                className='py-2 px-4 bg-primary text-white border border-primary'
              >
                1
              </a>
              <a
                href='#'
                className='py-2 px-4 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              >
                2
              </a>
              <a
                href='#'
                className='py-2 px-4 bg-white text-gray-700 border border-gray-200 rounded-r-md hover:bg-gray-50'
              >
                Następna
              </a>
            </nav>
          </div>
        )}
      </div>
    </BlogLayout>
  );
}
