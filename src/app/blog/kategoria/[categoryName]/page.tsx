import BlogLayout from '../../../components/BlogLayout';
import BlogPostCard from '../../../components/BlogPostCard';
import { fetchBlogPostsByCategory } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: { categoryName: string };
}) {
  const categoryName = decodeURIComponent(params.categoryName);
  const posts = await fetchBlogPostsByCategory(categoryName);

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
  searchParams,
}: {
  params: { categoryName: string };
  searchParams: { page?: string };
}) {
  const categoryName = decodeURIComponent(params.categoryName);

  // Pobieramy numer strony z parametrów URL lub używamy 1 jako domyślnej
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const postsPerPage = 6; // Liczba postów na stronę

  // Pobieramy wszystkie posty z kategorii
  const allPosts = await fetchBlogPostsByCategory(categoryName);

  if (!allPosts.length) {
    notFound();
  }

  // Obliczamy całkowitą liczbę stron
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Pobieramy tylko posty dla bieżącej strony
  const skip = (currentPage - 1) * postsPerPage;
  const posts = allPosts.slice(skip, skip + postsPerPage);

  // Funkcja generująca URL dla strony paginacji
  const getPageUrl = (pageNum: number) => {
    return `/blog/kategoria/${categoryName}?page=${pageNum}`;
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
