import Image from 'next/image';
import Link from 'next/link';
import BlogLayout from '../../components/BlogLayout';
import BlogPostCard from '../../components/BlogPostCard';
import { getPostById, getRelatedPosts } from '../../../../lib/api';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { postId: string };
}) {
  const post = await getPostById(parseInt(params.postId));

  if (!post) {
    return {
      title: 'Nie znaleziono artykułu',
      description: 'Przepraszamy, ale ten artykuł nie istnieje',
    };
  }

  return {
    title: `${post.title} - Blog Wnętrzarski`,
    description: post.excerpt,
  };
}

export default async function SinglePostPage({
  params,
}: {
  params: { postId: string };
}) {
  const post = await getPostById(parseInt(params.postId));

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category);

  return (
    <BlogLayout>
      <article className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {/* Breadcrumbs */}
        <div className='mb-8 text-sm'>
          <Link href='/' className='text-gray-500 hover:text-primary'>
            Strona główna
          </Link>{' '}
          /{' '}
          <Link href='/blog' className='text-gray-500 hover:text-primary'>
            Blog
          </Link>{' '}
          / <span className='text-primary'>{post.title}</span>
        </div>

        {/* Nagłówek artykułu */}
        <header className='mb-12'>
          <div className='mb-4'>
            <Link
              href={`/blog/kategoria/${post.category.toLowerCase()}`}
              className='inline-block px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium'
            >
              {post.category}
            </Link>
          </div>

          <h1 className='text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
            {post.title}
          </h1>

          <div className='flex items-center text-gray-600 mb-8'>
            <div className='flex items-center'>
              <div className='relative h-12 w-12 rounded-full overflow-hidden mr-4'>
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className='object-cover'
                />
              </div>
              <div>
                <p className='font-medium text-gray-800'>{post.author.name}</p>
                <div className='flex items-center text-sm'>
                  <span>{post.publishDate}</span>
                  <span className='mx-2'>•</span>
                  <span>{post.readTime} min czytania</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Główne zdjęcie */}
        <div className='relative w-full h-[50vh] md:h-[60vh] mb-12 rounded-2xl overflow-hidden shadow-xl'>
          <Image
            src={post.image}
            alt={post.title}
            fill
            className='object-cover'
            priority
          />
        </div>

        {/* Treść artykułu */}
        <div className='prose prose-lg max-w-none'>
          <p className='text-xl text-gray-700 leading-relaxed mb-6'>
            {post.excerpt}
          </p>

          <h2>Wprowadzenie</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
            accumsan orci felis, vel hendrerit felis fermentum ac. Etiam
            scelerisque suscipit justo, at malesuada massa convallis ut. Nulla
            facilisi. Sed hendrerit pharetra lectus, vitae lobortis nibh
            volutpat vel.
          </p>

          <h2>Główne zasady projektowania wnętrz</h2>
          <p>
            Vivamus dictum, massa eget accumsan sollicitudin, dolor purus
            volutpat massa, in posuere magna mauris vel dui. Duis in faucibus
            eros. Suspendisse potenti.
          </p>

          <ul>
            <li>Harmonia i balans kolorów</li>
            <li>Praktyczne wykorzystanie przestrzeni</li>
            <li>Odpowiednie oświetlenie</li>
            <li>Dobór mebli proporcjonalnych do pomieszczenia</li>
          </ul>

          <p>
            Pellentesque in neque bibendum, aliquet ipsum sed, convallis enim.
            Sed tempor arcu id nibh tristique pharetra. Mauris imperdiet, magna
            in tincidunt ultrices, enim massa tempus urna, at gravida odio ipsum
            quis nisl.
          </p>

          <blockquote>
            "Projektowanie to nie tylko wygląd, ale przede wszystkim
            funkcjonalność. Piękne wnętrze to takie, w którym czujesz się
            dobrze."
          </blockquote>

          <h2>Podsumowanie</h2>
          <p>
            Fusce lacinia dolor quis justo sagittis placerat. Duis nec tincidunt
            ex. Suspendisse eleifend, risus a sagittis tempus, sem turpis porta
            sem, eget interdum est justo id nulla.
          </p>
        </div>

        {/* Tagi */}
        <div className='mt-12 pt-6 border-t border-gray-200'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>Tagi</h3>
          <div className='flex flex-wrap gap-2'>
            <Link
              href='/blog/tag/minimalizm'
              className='px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700'
            >
              minimalizm
            </Link>
            <Link
              href='/blog/tag/salon'
              className='px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700'
            >
              salon
            </Link>
            <Link
              href='/blog/tag/inspiracje'
              className='px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700'
            >
              inspiracje
            </Link>
          </div>
        </div>

        {/* Autor */}
        <div className='mt-12 p-8 bg-gray-50 rounded-2xl'>
          <div className='flex flex-col md:flex-row items-center'>
            <div className='relative h-20 w-20 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6'>
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className='object-cover'
              />
            </div>
            <div className='text-center md:text-left'>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>
                {post.author.name}
              </h3>
              <p className='text-gray-600 mb-4'>
                Projektant wnętrz z wieloletnim doświadczeniem. Specjalizuje się
                w stylu minimalistycznym i skandynawskim. Autor wielu artykułów
                o tematyce wnętrzarskiej.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Powiązane artykuły */}
      {relatedPosts.length > 0 && (
        <section className='mt-16 py-12 bg-gray-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className='text-3xl font-bold text-gray-900 mb-12 text-center'>
              Powiązane artykuły
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {relatedPosts.map((relatedPost) => (
                <BlogPostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
    </BlogLayout>
  );
}
