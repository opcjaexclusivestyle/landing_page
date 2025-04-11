import BlogPostCard from '../../components/BlogPostCard';
import BlogLayout from '../../components/BlogLayout';
import { getAllPosts } from '../../lib/api';

export const metadata = {
  title: 'Blog - Inspiracje i porady wnętrzarskie',
  description:
    'Odkryj najnowsze trendy wnętrzarskie, porady ekspertów i inspirujące historie, które pomogą stworzyć wymarzony dom.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <BlogLayout>
      <div className='container mx-auto px-4 py-16 sm:px-6 lg:px-8'>
        <header className='text-center mb-16'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
            Inspiracje i porady wnętrzarskie
          </h1>
          <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
            Odkryj najnowsze trendy wnętrzarskie, porady ekspertów i inspirujące
            historie, które pomogą stworzyć wymarzony dom pełen elegancji i
            stylu.
          </p>
        </header>

        {/* Filtry kategorii */}
        <div className='flex flex-wrap justify-center gap-3 mb-12'>
          <button className='px-4 py-2 rounded-full bg-primary text-white'>
            Wszystkie
          </button>
          <button className='px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800'>
            Inspiracje
          </button>
          <button className='px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800'>
            Porady
          </button>
          <button className='px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800'>
            Trendy
          </button>
        </div>

        {/* Siatka wpisów */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Paginacja */}
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
              className='py-2 px-4 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            >
              3
            </a>
            <a
              href='#'
              className='py-2 px-4 bg-white text-gray-700 border border-gray-200 rounded-r-md hover:bg-gray-50'
            >
              Następna
            </a>
          </nav>
        </div>
      </div>
    </BlogLayout>
  );
}
