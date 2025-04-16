import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  publishDate: string;
  readTime: number;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
}

interface BlogSectionProps {
  posts: BlogPost[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  return (
    <section className='py-16 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold mb-4'>Nasz Blog</h2>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Odkryj najnowsze trendy wnętrzarskie, porady ekspertów i inspirujące
            historie, które pomogą stworzyć wymarzony dom.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {posts.map((post) => (
            <article
              key={post.id}
              className='bg-white rounded-xl shadow-md overflow-hidden'
            >
              <div className='relative h-48'>
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className='object-cover'
                />
              </div>
              <div className='p-6'>
                <div className='flex justify-between items-center mb-3'>
                  <span className='text-sm text-primary font-medium'>
                    {post.category}
                  </span>
                  <span className='text-xs text-gray-500'>
                    {post.readTime} min czytania
                  </span>
                </div>
                <h3 className='text-xl font-semibold mb-2'>{post.title}</h3>
                <p className='text-gray-600 mb-4'>{post.excerpt}</p>
                <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                  <div className='flex items-center'>
                    <div className='w-8 h-8 relative mr-2'>
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        fill
                        className='rounded-full object-cover'
                      />
                    </div>
                    <span className='text-sm font-medium'>
                      {post.author.name}
                    </span>
                  </div>
                  <span className='text-xs text-gray-500'>
                    {post.publishDate}
                  </span>
                </div>
                <div className='mt-6'>
                  <Link
                    href={`/blog/${post.id}`}
                    className='text-primary font-medium hover:underline'
                  >
                    Czytaj więcej &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className='text-center mt-12'>
          <Link
            href='/blog'
            className='inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors'
          >
            Zobacz wszystkie artykuły
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
