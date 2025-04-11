'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Interfejs dla artykułu blogowego
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  publishDate: string;
  author: {
    name: string;
    avatar: string;
  };
  readTime: number;
}

interface BlogSectionProps {
  posts: BlogPost[];
  className?: string;
}

export default function BlogSection({
  posts,
  className = '',
}: BlogSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animacja nagłówka - alternatywa dla SplitText
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        {
          opacity: 0,
          y: 50,
          skewY: 2,
        },
        {
          opacity: 1,
          y: 0,
          skewY: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
          },
        },
      );
    }

    // Animacja podtytułu z opóźnieniem
    if (subheadingRef.current) {
      gsap.fromTo(
        subheadingRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: subheadingRef.current,
            start: 'top 85%',
          },
        },
      );
    }

    // Animacja pionowych linii dekoracyjnych
    const lines = document.querySelectorAll('.decorative-line');
    lines.forEach((line) => {
      gsap.fromTo(
        line,
        { height: 0 },
        {
          height: '100%',
          duration: 1.5,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: line,
            start: 'top 90%',
          },
        },
      );
    });

    // Animacja kart blogowych z efektem 3D
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      // Początkowa transformacja
      gsap.set(card, {
        opacity: 0,
        y: 80,
        rotationY: -15,
        transformPerspective: 1000,
      });

      // Animacja wejścia
      gsap.to(card, {
        opacity: 1,
        y: 0,
        rotationY: 0,
        duration: 1.2,
        delay: index * 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
      });
    });

    // Animacja przycisku
    const button = sectionRef.current?.querySelector('.read-more-button');
    if (button) {
      gsap.fromTo(
        button,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: button,
            start: 'top 90%',
          },
        },
      );
    }

    // Parallax efekt dla tła
    gsap.to('.parallax-bg', {
      y: '30%',
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`py-32 relative overflow-hidden ${className}`}
    >
      {/* Stylowe tło z efektem parallax */}
      <div className='parallax-bg absolute inset-0 pointer-events-none'>
        <div className='absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2'></div>
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2'></div>
      </div>

      {/* Ozdobne linie w tle */}
      <div className='absolute left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent decorative-line'></div>
      <div className='absolute left-3/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent decorative-line'></div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        {/* Nagłówek sekcji */}
        <div className='text-center max-w-3xl mx-auto mb-20'>
          <div className='inline-block mb-3 px-4 py-1 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-sm font-medium'>
            Nasz Blog
          </div>
          <h2
            ref={headingRef}
            className='text-black text-4xl md:text-5xl   mb-6 tracking-tight '
          >
            Inspiracje i porady
          </h2>
          <p
            ref={subheadingRef}
            className='text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed'
          >
            Odkryj najnowsze trendy wnętrzarskie, porady ekspertów i inspirujące
            historie, które pomogą stworzyć wymarzony dom pełen elegancji i
            stylu.
          </p>
        </div>

        {/* Siatka artykułów blogowych */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
          {posts.map((post, index) => (
            <div
              key={post.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className='group relative'
              onMouseEnter={() => setHoveredCard(post.id)}
              onMouseLeave={() => setHoveredCard(null)}
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

                  {/* Kategoria na górze zdjęcia - z linkiem do kategorii */}
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
                      <span className='inline-block h-3 w-3 rounded-full bg-primary mr-1'></span>
                      <span>{post.publishDate}</span>
                    </div>
                    <div>{post.readTime} min czytania</div>
                  </div>

                  <Link href={`/blog/${post.id}`}>
                    <h3 className='text-xl font-medium text-gray-900 mb-3 line-clamp-2 transition-colors duration-300 group-hover:text-primary'>
                      {post.title}
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
                      <Link
                        href={`/blog/${post.id}`}
                        className='premium-button'
                      >
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
                  hoveredCard === post.id ? 'opacity-100' : 'opacity-0'
                }`}
              ></div>
            </div>
          ))}
        </div>

        {/* Przycisk "Więcej artykułów" */}
        <div className='flex justify-center mt-16'>
          <Link
            href='/blog'
            className='read-more-button group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105'
          >
            <span className='premium-button'>
              Więcej artykułów
              <svg
                className='w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1'
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
            </span>
            <span className='absolute inset-0 z-0 bg-gradient-to-r from-primary/80 to-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
          </Link>
        </div>
      </div>

      {/* Dodatkowy element animowany na końcu strony */}
      <div className='mt-16 relative'>
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-gray-100/50'></div>

        <div className='container mx-auto text-center relative z-10 pt-10 pb-4'>
          <div className='flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8'>
            <div className='w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent'></div>
            <p className='text-gray-500 text-sm md:text-base italic'>
              Projektujemy z pasją, tworzymy z miłością
            </p>
            <div className='w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent'></div>
          </div>
        </div>
      </div>

      {/* Dekoracyjny element na dole */}
      <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent'></div>
    </section>
  );
}
