import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TestimonialForm from './TestimonialForm';
import { fetchTestimonials } from '@/lib/supabase';

const TestimonialsSection: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const testimonialRefs = useRef<(HTMLDivElement | null)[]>([]);
  const floatingFlowersRef = useRef<(HTMLDivElement | null)[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animacja tła
    gsap.fromTo(
      backgroundRef.current,
      { opacity: 0, scale: 1.1 },
      {
        opacity: 0.15,
        scale: 1,
        duration: 1.5,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
        },
      },
    );

    // Animacja kwiatów unoszących się w tle
    floatingFlowersRef.current.forEach((flower, index) => {
      if (!flower) return;

      // Początkowa randomizacja położenia
      gsap.set(flower, {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * 500 - 200,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1,
        opacity: 0,
      });

      // Animacja pojawiania się i unoszenia
      gsap.to(flower, {
        opacity: 0.12 + Math.random() * 0.1,
        duration: 1 + Math.random() * 2,
        delay: 0.5 + index * 0.2,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Ciągła animacja unoszenia
      gsap.to(flower, {
        y: '+=' + (Math.random() * 80 - 40),
        x: '+=' + (Math.random() * 80 - 40),
        rotation: '+=' + (Math.random() * 40 - 20),
        duration: 10 + Math.random() * 15,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    // Animacja tytułu
    const titleTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top 75%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });

    titleTimeline
      .fromTo(
        titleRef.current?.querySelector('p') || '',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      )
      .fromTo(
        titleRef.current?.querySelector('.shape') || '',
        { width: 0, opacity: 0 },
        { width: '70px', opacity: 1, duration: 0.8, ease: 'power3.inOut' },
        '-=0.3',
      )
      .fromTo(
        titleRef.current?.querySelector('h2') || '',
        { y: 50, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
        },
        '-=0.5',
      );

    // Animacja testimoniali
    testimonialRefs.current.forEach((testimonial, index) => {
      if (!testimonial) return;

      gsap.fromTo(
        testimonial,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.2 * index,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: testimonial,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    });
  }, []);

  useEffect(() => {
    const loadTestimonials = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTestimonials();
        if (data && data.length > 0) {
          setTestimonials(data);
          console.log('data', data);
        } else {
          // Fallback na przykładowe dane, gdy nie ma opinii w bazie
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
  }, []);

  const handleFormSuccess = () => {
    setShowForm(false);

    // Odświeżenie listy opinii po dodaniu nowej
    const loadTestimonials = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTestimonials();
        if (data && data.length > 0) {
          console.log('data', data);
          setTestimonials(data);
        }
      } catch (error) {
        console.error('Błąd podczas pobierania opinii:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTestimonials();
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <section
      ref={sectionRef}
      className='relative py-20 px-4 md:px-8 lg:px-16 overflow-hidden'
    >
      {/* Tło z kwiatami */}
      <div
        ref={backgroundRef}
        className='absolute inset-0 z-0 opacity-10'
        style={{
          backgroundImage: 'url(/images/floral-pattern.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Unoszące się kwiaty */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`flower-${i}`}
          ref={(el) => {
            floatingFlowersRef.current[i] = el;
          }}
          className='absolute z-0'
          style={{
            pointerEvents: 'none',
          }}
        >
          <Image
            src={`/images/flowers/flower-${(i % 5) + 1}.png`}
            width={60}
            height={60}
            alt=''
            className='opacity-10'
          />
        </div>
      ))}

      {/* Tytuł sekcji */}
      <div ref={titleRef} className='relative z-10 text-center mb-16'>
        <p className='text-[var(--primary-color)] uppercase tracking-widest mb-2 font-light'>
          Historie naszych klientów
        </p>
        <div className='flex justify-center items-center mb-4'>
          <div className='shape h-[1px] w-[70px] bg-[var(--primary-color)] opacity-60'></div>
        </div>
        <h2 className='text-4xl md:text-5xl font-light text-gray-800 max-w-4xl mx-auto leading-tight'>
          Wyjątkowe opinie naszych wyjątkowych klientów
        </h2>

        {/* Przyciski przełączania widoku */}
        <div className='flex justify-center mt-6 space-x-4'>
          <button
            onClick={() => setShowForm(false)}
            className={`px-5 py-2 rounded-md transition-colors ${
              !showForm
                ? 'bg-[var(--primary-color)] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Zobacz opinie
          </button>
          <button
            onClick={() => setShowForm(true)}
            className={`px-5 py-2 rounded-md transition-colors ${
              showForm
                ? 'bg-[var(--primary-color)] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Dodaj opinię
          </button>
        </div>
      </div>

      {/* Treść zależna od wybranego widoku */}
      {showForm ? (
        <div className='relative z-10 max-w-2xl mx-auto'>
          <TestimonialForm
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <div className='relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto'>
          {isLoading ? (
            // Loader podczas ładowania opinii
            <div className='col-span-2 flex justify-center items-center py-20'>
              <div className='animate-pulse flex flex-col items-center'>
                <div className='h-10 w-10 bg-[var(--primary-color)] opacity-60 rounded-full'></div>
                <p className='mt-4 text-gray-600'>Ładowanie opinii...</p>
              </div>
            </div>
          ) : testimonials.length === 0 ? (
            // Komunikat, gdy nie ma opinii
            <div className='col-span-2 text-center py-10'>
              <p className='text-gray-600'>
                Bądź pierwszą osobą, która doda opinię!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className='mt-4 px-6 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-opacity-90 transition-colors'
              >
                Dodaj swoją opinię
              </button>
            </div>
          ) : (
            // Wyświetlanie opinii
            testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id || index}
                ref={(el) => {
                  testimonialRefs.current[index] = el;
                }}
                className='bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-md border border-[var(--light-gold)] transition-transform duration-500 hover:shadow-lg hover:-translate-y-2'
              >
                <div className='flex items-start mb-6'>
                  <div className='relative'>
                    <div className='w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--primary-color)]'>
                      <Image
                        src={
                          testimonial.image ||
                          '/images/testimonials/default.jpg'
                        }
                        width={64}
                        height={64}
                        alt={testimonial.name}
                        className='object-cover'
                        onError={(e) => {
                          e.currentTarget.src =
                            '/images/testimonials/default.jpg';
                        }}
                      />
                    </div>
                    <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--primary-color)] rounded-full flex items-center justify-center'>
                      <span className='text-white text-xl'>"</span>
                    </div>
                  </div>
                  <div className='ml-4'>
                    <h3 className='text-lg font-medium text-gray-800'>
                      {testimonial.name}
                    </h3>
                    <p className='text-sm text-gray-600 italic'>
                      {testimonial.role || testimonial.location || ''}
                    </p>
                  </div>
                </div>
                <p className='text-gray-700 leading-relaxed'>
                  {testimonial.quote ||
                    testimonial.content ||
                    testimonial.message}
                </p>
                <div className='mt-4 flex'>
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns='http://www.w3.org/2000/svg'
                      className={`h-5 w-5 ${
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
                {/* Data dodania opinii */}
                <div className='mt-3 text-right'>
                  <p className='text-xs text-gray-500'>
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

      {/* Ozdobny element */}
      <div className='relative z-10 mt-16 flex justify-center'>
        <div className='w-24 h-[1px] bg-[var(--primary-color)] opacity-50'></div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
