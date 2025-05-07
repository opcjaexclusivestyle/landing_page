import BlogPostCard from '../components/BlogPostCard';
import BlogLayout from '../components/BlogLayout';
import { fetchBlogPosts } from '../../lib/supabase';
import Link from 'next/link';

export const metadata = {
  title: 'Blog - Inspiracje i porady wnętrzarskie',
  description:
    'Odkryj najnowsze trendy wnętrzarskie, porady ekspertów i inspirujące historie, które pomogą stworzyć wymarzony dom.',
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  // Pobieramy numer strony z parametrów URL lub używamy 1 jako domyślnej
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const postsPerPage = 6; // Liczba postów na stronę

  // Pobieramy wszystkie posty, aby znać ich całkowitą liczbę
  const allPosts = await fetchBlogPosts();
  const totalPosts = allPosts.length;

  // Obliczamy całkowitą liczbę stron
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Pobieramy tylko posty dla bieżącej strony
  const skip = (currentPage - 1) * postsPerPage;
  const posts = allPosts.slice(skip, skip + postsPerPage);

  // Funkcja generująca URL dla strony paginacji
  const getPageUrl = (pageNum: number) => {
    return `/blog?page=${pageNum}`;
  };

  // Funkcja generująca numery stron do wyświetlenia w paginacji
  const getPaginationNumbers = () => {
    const pageNumbers = [];
    const maxDisplayedPages = 5; // Maksymalna liczba przycisków numerycznych

    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxDisplayedPages / 2),
    );
    let endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);

    // Dostosowanie, jeśli jesteśmy blisko końca
    if (endPage - startPage + 1 < maxDisplayedPages) {
      startPage = Math.max(1, endPage - maxDisplayedPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

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

        {/* Siatka wpisów */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Komunikat gdy brak postów */}
        {posts.length === 0 && (
          <div className='text-center py-16'>
            <p className='text-gray-500'>Brak dostępnych postów.</p>
          </div>
        )}

        {/* Paginacja */}
        {totalPages > 1 && (
          <div className='mt-16 flex justify-center'>
            <nav className='inline-flex rounded-md shadow'>
              {/* Przycisk Poprzednia */}
              {currentPage > 1 ? (
                <Link
                  href={getPageUrl(currentPage - 1)}
                  className='py-2 px-4 bg-white text-gray-700 border border-gray-200 rounded-l-md hover:bg-gray-50'
                >
                  Poprzednia
                </Link>
              ) : (
                <span className='py-2 px-4 bg-gray-100 text-gray-400 border border-gray-200 rounded-l-md cursor-not-allowed'>
                  Poprzednia
                </span>
              )}

              {/* Numery stron */}
              {getPaginationNumbers().map((page) => (
                <Link
                  key={page}
                  href={getPageUrl(page)}
                  className={`py-2 px-4 border ${
                    currentPage === page
                      ? 'bg-royal-gold text-white border-royal-gold'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </Link>
              ))}

              {/* Przycisk Następna */}
              {currentPage < totalPages ? (
                <Link
                  href={getPageUrl(currentPage + 1)}
                  className='py-2 px-4 bg-white text-gray-700 border border-gray-200 rounded-r-md hover:bg-gray-50'
                >
                  Następna
                </Link>
              ) : (
                <span className='py-2 px-4 bg-gray-100 text-gray-400 border border-gray-200 rounded-r-md cursor-not-allowed'>
                  Następna
                </span>
              )}
            </nav>
          </div>
        )}
      </div>
    </BlogLayout>
  );
}
