'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

// Zdefiniowanie interfejsu BlogPost bezpośrednio w tym pliku
interface BlogPost {
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

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Funkcja do renderowania tytułu z Markdown bez paragrafów
  const renderTitleWithoutParagraphs = (title: string) => {
    return (
      <ReactMarkdown
        components={{
          // Usuwamy znaczniki <p> i style z tytułu
          p: ({ children }) => <>{children}</>,
        }}
      >
        {title}
      </ReactMarkdown>
    );
  };

  return (
    <div
      className='group relative'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2'>
        {/* Zdjęcie posta */}
        <div className='relative h-64 overflow-hidden'>
          <Image
            src={post.image}
            alt={post.title}
            fill
            className='object-cover transition-transform duration-1000 group-hover:scale-110'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>

          {/* Kategoria na górze zdjęcia */}
          <Link
            href={`/blog/kategoria/${post.category.toLowerCase()}`}
            className='absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800 hover:bg-white'
          >
            {post.category}
          </Link>
        </div>

        {/* Treść */}
        <div className='p-6 bg-white relative z-10'>
          <div className='flex items-center text-xs text-gray-500 mb-3 space-x-4'>
            <div className='flex items-center'>
              <span className='inline-block h-3 w-3 rounded-full bg-royal-gold mr-1'></span>
              <span>{post.publishDate}</span>
            </div>
            <div>{post.readTime} min czytania</div>
          </div>

          <Link href={`/blog/${post.id}`} className='block'>
            <h3 className='text-xl font-medium text-gray-900 mb-3 line-clamp-2 transition-colors duration-300 group-hover:text-royal-gold'>
              {renderTitleWithoutParagraphs(post.title)}
            </h3>
          </Link>

          <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
            {post.excerpt}
          </p>

          {/* Autor */}
          <div className='flex items-center mt-6 pt-4 border-t border-gray-100'>
            <div className='relative h-10 w-10 rounded-full overflow-hidden mr-3'>
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className='object-cover'
              />
            </div>
            <span className='text-sm font-medium text-gray-700'>
              {post.author.name}
            </span>

            <div className='ml-auto'>
              <Link href={`/blog/${post.id}`} className='premium-button'>
                Czytaj więcej
                <svg
                  className='w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M14 5l7 7m0 0l-7 7m7-7H3'
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Element dekoracyjny widoczny przy hover */}
      <div
        className={`absolute -bottom-3 -right-3 h-24 w-24 rounded-full bg-primary/10 blur-xl transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      ></div>
    </div>
  );
}
