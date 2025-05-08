import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import TestimonialForm from './TestimonialForm';
import { fetchTestimonials } from '@/lib/supabase';

interface TestimonialsSectionProps {
  type?: string;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ type }) => {
  const [showForm, setShowForm] = useState(false);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(0);
  const itemsPerPage = 4;

  // Nasłuchiwanie na zmianę szerokości okna
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWindowWidth(window.innerWidth);
      }
    };

    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    const loadTestimonials = async () => {
      setIsLoading(true);
      setCurrentPage(1);
      try {
        const data = await fetchTestimonials(type);
        if (data && data.length > 0) {
          setTestimonials(data);
        } else {
          // Fallback na przykładowe dane
          setTestimonials([
            {
              name: 'Hrabina Eleonora z Bluszczowa',
              role: 'Kolekcjonerka ekscentrycznych tkanin',
              image: '/images/testimonials/testimonial1.jpg',
              quote:
                'Moje koty i ja jesteśmy zachwyceni! Te zasłony doskonale maskują moją kolekcję wypchanych sów, które obserwują wszystkich gości z dezaprobatą. Na materiał nie przyczepiają się nawet włosy z moich siedemnastu perskich kotów!',
              rating: 5,
            },
            {
              name: 'Pan Teodor Zagubiony',
              role: 'Emerytowany badacz zjawisk paranormalnych',
              image: '/images/testimonials/testimonial2.jpg',
              quote:
                'Przez pięćdziesiąt lat badałem paranormalne zjawiska, ale dopiero te zasłony skutecznie blokują telepatyczne sygnały z kosmosu! Gdy je zamykam, moje aluminiowe nakrycie głowy mogę wreszcie odłożyć do szafy. Polecam z czystym sumieniem!',
            },
            {
              name: 'Kunegunda Tajemnicza',
              role: 'Wróżbitka i hodowczyni storczyków',
              image: '/images/testimonials/testimonial3.jpg',
              quote:
                'Moje storczyki drżały z zachwytu, gdy wniesiono te zasłony do pokoju wróżb! Klienci są teraz bardziej skupieni podczas seansów, a moja kryształowa kula odbija piękne wzory materiału. Nawet duchy przodków chwalą ich elegancję!',
            },
            {
              name: 'Baron Modest von Elegancki',
              role: 'Koneser win i właściciel siedmiu fortepianów',
              image: '/images/testimonials/testimonial4.jpg',
              quote:
                'Czy zasłony mogą poprawić akustykę? Tak! Moje fortepiany brzmią idealnie, odkąd zawiesiłem te cudeńka. Moje winnice również wydają się bardziej produktywne, choć może to nie mieć związku. W każdym razie, gdy gram nokturny Chopina o świcie, materiał faluje w rytm muzyki!',
            },
          ]);
        }
      } catch (error) {
        console.error('Błąd podczas pobierania opinii:', error);
        // Ustaw przykładowe dane w przypadku błędu
        setTestimonials([
          {
            name: 'Hrabina Eleonora z Bluszczowa',
            role: 'Kolekcjonerka ekscentrycznych tkanin',
            image: '/images/testimonials/testimonial1.jpg',
            quote:
              'Moje koty i ja jesteśmy zachwyceni! Te zasłony doskonale maskują moją kolekcję wypchanych sów, które obserwują wszystkich gości z dezaprobatą. Na materiał nie przyczepiają się nawet włosy z moich siedemnastu perskich kotów!',
            rating: 5,
          },
          {
            name: 'Pan Teodor Zagubiony',
            role: 'Emerytowany badacz zjawisk paranormalnych',
            image: '/images/testimonials/testimonial2.jpg',
            quote:
              'Przez pięćdziesiąt lat badałem paranormalne zjawiska, ale dopiero te zasłony skutecznie blokują telepatyczne sygnały z kosmosu! Gdy je zamykam, moje aluminiowe nakrycie głowy mogę wreszcie odłożyć do szafy. Polecam z czystym sumieniem!',
          },
          {
            name: 'Kunegunda Tajemnicza',
            role: 'Wróżbitka i hodowczyni storczyków',
            image: '/images/testimonials/testimonial3.jpg',
            quote:
              'Moje storczyki drżały z zachwytu, gdy wniesiono te zasłony do pokoju wróżb! Klienci są teraz bardziej skupieni podczas seansów, a moja kryształowa kula odbija piękne wzory materiału. Nawet duchy przodków chwalą ich elegancję!',
          },
          {
            name: 'Baron Modest von Elegancki',
            role: 'Koneser win i właściciel siedmiu fortepianów',
            image: '/images/testimonials/testimonial4.jpg',
            quote:
              'Czy zasłony mogą poprawić akustykę? Tak! Moje fortepiany brzmią idealnie, odkąd zawiesiłem te cudeńka. Moje winnice również wydają się bardziej produktywne, choć może to nie mieć związku. W każdym razie, gdy gram nokturny Chopina o świcie, materiał faluje w rytm muzyki!',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTestimonials();
  }, [type]);

  const handleFormSuccess = () => {
    setShowForm(false);
    setCurrentPage(1);
    loadTestimonials();
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const currentTestimonials = testimonials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getGridColumns = () => {
    if (typeof window === 'undefined') return 'grid-cols-1';
    if (windowWidth < 640) return 'grid-cols-1';
    if (windowWidth < 1024) return 'grid-cols-2';
    return 'grid-cols-2';
  };

  return (
    <section className='relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-16 overflow-hidden'>
      {/* Tło z kwiatami */}
      <div
        className='absolute inset-0 z-0 opacity-10 transition-opacity duration-500'
        style={{
          backgroundImage: 'url(/images/floral-pattern.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Tytuł sekcji */}
      <div className='relative z-10 text-center mb-10 sm:mb-16 animate-fade-in'>
        <div className='flex justify-center items-center mb-3 sm:mb-4'>
          <div className='shape h-[1px] w-[50px] sm:w-[70px] bg-[var(--primary-color)] opacity-60'></div>
        </div>
        <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-black max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto leading-tight px-4'>
          Wyjątkowe opinie naszych wyjątkowych klientów
        </h2>
      </div>

      {/* Treść zależna od wybranego widoku */}
      {showForm ? (
        <div className='relative z-10 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto animate-fade-in'>
          <TestimonialForm
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
            type={type}
          />
        </div>
      ) : (
        <div
          className={`relative z-10 grid ${getGridColumns()} gap-4 sm:gap-6 md:gap-8 max-w-md sm:max-w-2xl lg:max-w-6xl mx-auto`}
        >
          {isLoading ? (
            <div className='col-span-full flex justify-center items-center py-16 sm:py-20'>
              <div className='animate-pulse flex flex-col items-center'>
                <div className='h-8 w-8 sm:h-10 sm:w-10 bg-[var(--primary-color)] opacity-60 rounded-full'></div>
                <p className='mt-4 text-gray-600 text-sm sm:text-base'>
                  Ładowanie opinii...
                </p>
              </div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className='col-span-full text-center py-10 animate-fade-in'>
              <p className='text-gray-600 mb-4'>
                Bądź pierwszą osobą, która doda opinię!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className='mt-2 px-6 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-md'
              >
                Dodaj swoją opinię
              </button>
            </div>
          ) : (
            currentTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id || index}
                className='bg-white/80 backdrop-blur-sm p-5 sm:p-6 md:p-8 rounded-lg shadow-md border border-[var(--light-gold)] transition-all duration-500 hover:shadow-lg hover:-translate-y-2 hover:bg-white/90 animate-fade-in'
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className='flex flex-col sm:flex-row sm:items-start mb-4 sm:mb-6'>
                  <div className='relative mb-3 sm:mb-0'>
                    <div className='w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[var(--primary-color)]'>
                      <Image
                        src={
                          testimonial.image ||
                          '/images/testimonials/default.jpg'
                        }
                        width={64}
                        height={64}
                        alt={testimonial.name}
                        className='object-cover w-full h-full'
                        priority={index < 2}
                        onError={(e) => {
                          e.currentTarget.src =
                            '/images/testimonials/default.jpg';
                        }}
                      />
                    </div>
                    <div className='absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-[var(--primary-color)] rounded-full flex items-center justify-center'>
                      <span className='text-white text-base sm:text-xl'>"</span>
                    </div>
                  </div>
                  <div className='sm:ml-4'>
                    <h3 className='text-base sm:text-lg font-medium text-gray-800'>
                      {testimonial.name}
                    </h3>
                    <p className='text-xs sm:text-sm text-gray-600 italic'>
                      {testimonial.role || testimonial.location || ''}
                    </p>
                  </div>
                </div>
                <p className='text-sm sm:text-base text-gray-700 leading-relaxed line-clamp-4 sm:line-clamp-none'>
                  {testimonial.quote ||
                    testimonial.content ||
                    testimonial.message}
                </p>
                <div className='mt-3 sm:mt-4 flex'>
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns='http://www.w3.org/2000/svg'
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        i < (testimonial.rating || 5)
                          ? 'text-yellow-500'
                          : 'text-gray-300'
                      }`}
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                  ))}
                </div>
                <div className='mt-2 sm:mt-3 text-right'>
                  <p className='text-[10px] sm:text-xs text-gray-500'>
                    {new Date(testimonial.created_at).toLocaleDateString(
                      'pl-PL',
                    )}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Paginacja */}
      {totalPages > 1 && (
        <div className='col-span-full mt-8 sm:mt-10 flex flex-col items-center animate-fade-in'>
          <p className='text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3'>
            Wyświetlanie {(currentPage - 1) * itemsPerPage + 1} -{' '}
            {Math.min(currentPage * itemsPerPage, testimonials.length)} z{' '}
            {testimonials.length} opinii
          </p>

          <div className='flex flex-wrap justify-center space-x-1 sm:space-x-2'>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors'
              }`}
            >
              &laquo;
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base ${
                  currentPage === index + 1
                    ? 'bg-[var(--primary-color)] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors'
              }`}
            >
              &raquo;
            </button>
          </div>
        </div>
      )}

      {/* Przyciski przełączania widoku */}
      <div className='flex flex-wrap justify-center mt-4 sm:mt-6 space-x-0 space-y-2 sm:space-y-0 sm:space-x-4 animate-fade-in'>
        <button
          onClick={() => setShowForm(false)}
          className={`
            luxury-button
            px-4 sm:px-5 py-2 rounded-md transition-all duration-300 transform hover:scale-105 ${
              !showForm
                ? 'bg-[var(--deep-navy)] text-white shadow-md'
                : 'bg-[var(--beige)] text-[var(--deep-navy)] hover:bg-[var(--deep-gold)]'
            } w-full sm:w-auto`}
        >
          Zobacz opinie
        </button>
        <button
          onClick={() => setShowForm(true)}
          className={`
            luxury-button
            px-4 sm:px-5 py-2 rounded-md transition-all duration-300 transform hover:scale-105 ${
              showForm
                ? 'bg-[var(--deep-navy)] text-white shadow-md'
                : 'bg-[var(--beige)] text-[var(--deep-navy)] hover:bg-[var(--deep-gold)]'
            } w-full sm:w-auto`}
        >
          Dodaj opinię
        </button>
      </div>

      {/* Ozdobny element */}
      <div className='relative z-10 mt-10 sm:mt-16 flex justify-center animate-fade-in'>
        <div className='w-16 sm:w-24 h-[1px] bg-[var(--primary-color)] opacity-50'></div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
