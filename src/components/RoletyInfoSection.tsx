import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const RoletyInfoSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const romaRef = useRef<HTMLDivElement>(null);
  const plisaRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Inicjalizacja animacji dla całej sekcji
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
      },
    );

    // Animacja nagłówków
    const headings = sectionRef.current?.querySelectorAll('h2');
    headings?.forEach((heading) => {
      gsap.fromTo(
        heading,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: heading,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          ease: 'back.out(1.7)',
        },
      );
    });

    // Animacja bloków tekstowych
    textRefs.current.forEach((textRef, index) => {
      if (textRef) {
        const paragraphs = textRef.querySelectorAll('p');
        gsap.fromTo(
          paragraphs,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            duration: 0.8,
            scrollTrigger: {
              trigger: textRef,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
            ease: 'power2.out',
          },
        );
      }
    });

    // Animacja obrazów
    imageRefs.current.forEach((imgRef, index) => {
      if (imgRef) {
        gsap.fromTo(
          imgRef,
          {
            opacity: 0,
            scale: 0.9,
            rotation: index === 0 ? -3 : 3,
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.2,
            scrollTrigger: {
              trigger: imgRef,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
            ease: 'power3.out',
          },
        );
      }
    });

    // Efekt paralaksy dla pierwszej sekcji
    if (romaRef.current) {
      const romaTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: romaRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      romaTimeline.fromTo(
        romaRef.current.querySelector('.bg-gray-50'),
        { backgroundPosition: '0% 0%' },
        { backgroundPosition: '0% 20%', ease: 'none' },
      );
    }

    // Efekt paralaksy dla drugiej sekcji
    if (plisaRef.current) {
      const plisaTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: plisaRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      plisaTimeline.fromTo(
        plisaRef.current.querySelector('.bg-gray-50'),
        { backgroundPosition: '0% 0%' },
        { backgroundPosition: '0% -20%', ease: 'none' },
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className='py-16 bg-gray-50 overflow-hidden'
      style={{
        backgroundImage:
          'radial-gradient(circle at 10% 20%, rgba(216, 241, 230, 0.2) 0%, rgba(233, 226, 226, 0.1) 90%)',
      }}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div ref={romaRef} className='mb-20 relative'>
          <div className='absolute w-32 h-32 bg-blue-50 rounded-full -left-10 -top-10 blur-2xl opacity-60 animate-pulse'></div>
          <div
            className='absolute w-24 h-24 bg-amber-50 rounded-full right-20 bottom-20 blur-xl opacity-40 animate-pulse'
            style={{ animationDuration: '7s' }}
          ></div>

          <h2 className='text-3xl font-extrabold text-gray-900 mb-10 relative'>
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400'>
              Rolety rzymskie – nowoczesność, wygoda, elegancja
            </span>
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-16'>
            <div
              ref={(el) => {
                textRefs.current[0] = el;
              }}
              className='relative z-10'
            >
              <p className='text-lg text-gray-700 mb-6'>
                Rolety rzymskie to idealne połączenie funkcjonalności i
                elegancji. Wykonane z wysokiej jakości tkanin, oferują doskonałą
                kontrolę światła, zapewniając jednocześnie stylowy wygląd
                Twojego wnętrza.
              </p>
              <p className='text-lg text-gray-700 mb-6'>
                Dzięki szerokiej gamie materiałów i wzorów, rolety rzymskie
                można idealnie dopasować do każdego stylu wnętrza - od
                klasycznego po nowoczesny. Ich charakterystyczne poziome fałdy
                tworzą elegancką, miękką linię, która dodaje przytulności
                każdemu pomieszczeniu.
              </p>
              <p className='text-lg text-gray-700'>
                Nasze rolety rzymskie są wykonane z najwyższej jakości
                materiałów, które zapewniają trwałość i niezawodność przez wiele
                lat użytkowania.
              </p>
            </div>
            <div
              ref={(el) => {
                imageRefs.current[0] = el;
              }}
              className='relative'
            >
              <div className='absolute w-full h-full bg-gradient-to-tr from-blue-100 to-amber-50 rounded-2xl -rotate-2 scale-105 blur-sm'></div>
              <Image
                src='/images/rolety/roman.png'
                alt='Rolety rzymskie w nowoczesnym wnętrzu'
                width={600}
                height={400}
                className='w-full h-auto rounded-lg shadow-xl relative z-10'
              />
              <div className='absolute -right-4 -bottom-4 w-24 h-24 bg-blue-100 rounded-full opacity-70 blur-md'></div>
            </div>
          </div>
        </div>

        <div ref={plisaRef} className='relative'>
          <div
            className='absolute w-36 h-36 bg-amber-50 rounded-full -right-10 -top-10 blur-2xl opacity-50 animate-pulse'
            style={{ animationDuration: '10s' }}
          ></div>
          <div
            className='absolute w-20 h-20 bg-blue-50 rounded-full left-20 bottom-20 blur-xl opacity-60 animate-pulse'
            style={{ animationDuration: '8s' }}
          ></div>

          <h2 className='text-3xl font-extrabold text-gray-900 mb-10 relative'>
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-400'>
              Rolety plisowane – prywatność, design, komfort
            </span>
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-16'>
            <div
              ref={(el) => {
                imageRefs.current[1] = el;
              }}
              className='order-2 md:order-1 relative'
            >
              <div className='absolute w-full h-full bg-gradient-to-bl from-amber-100 to-blue-50 rounded-2xl rotate-2 scale-105 blur-sm'></div>
              <Image
                src='/images/rolety/pleated.png'
                alt='Rolety plisowane w nowoczesnym wnętrzu'
                width={600}
                height={400}
                className='w-full h-auto rounded-lg shadow-xl relative z-10'
              />
              <div className='absolute -left-4 -bottom-4 w-24 h-24 bg-amber-100 rounded-full opacity-70 blur-md'></div>
            </div>
            <div
              ref={(el) => {
                textRefs.current[1] = el;
              }}
              className='order-1 md:order-2 relative z-10'
            >
              <p className='text-lg text-gray-700 mb-6'>
                Rolety plisowane to nowoczesne rozwiązanie, które łączy w sobie
                funkcjonalność i estetykę. Ich charakterystyczna harmonijkowa
                struktura pozwala na precyzyjną regulację światła, zapewniając
                jednocześnie prywatność i ochronę przed słońcem.
              </p>
              <p className='text-lg text-gray-700 mb-6'>
                Dzięki specjalnej konstrukcji, rolety plisowane idealnie
                sprawdzają się w oknach o nietypowych kształtach, takich jak
                okna dachowe czy trójkątne. Możliwość montażu bez wiercenia
                czyni je doskonałym wyborem dla nowoczesnych wnętrz.
              </p>
              <p className='text-lg text-gray-700'>
                Oferujemy szeroki wybór tkanin o różnych właściwościach - od
                transparentnych po całkowicie zaciemniające, a także tkaniny o
                właściwościach termoizolacyjnych, które pomagają utrzymać
                komfortową temperaturę w pomieszczeniu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoletyInfoSection;
