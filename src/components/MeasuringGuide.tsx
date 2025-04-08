import React, { useState, useRef, useEffect } from 'react';
import faqConfig from '@/config/faq.json';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

interface FAQItem {
  question: string;
  answer: string;
}

const MeasuringGuide: React.FC = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(true);
  const faqItems: FAQItem[] = faqConfig.faqItems;

  // Referencje do animowanych elementów
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const faqSectionRef = useRef<HTMLDivElement>(null);
  const flowerElements = useRef<(HTMLDivElement | null)[]>([]);
  const faqItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const borderPatternRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  useEffect(() => {
    // Rejestracja ScrollTrigger
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Animacja tytułu
      const titleTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      titleTimeline
        .fromTo(
          titleRef.current,
          { y: 50, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
        )
        .fromTo(
          '.title-decoration',
          { width: 0, opacity: 0 },
          { width: '100px', opacity: 1, duration: 0.8, ease: 'power2.inOut' },
          '-=0.6',
        )
        .fromTo(
          '.title-flower',
          { scale: 0, opacity: 0, rotate: -20 },
          {
            scale: 1,
            opacity: 0.25,
            rotate: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.5)',
          },
          '-=0.8',
        );

      // Animacja sekcji wideo
      const videoTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: videoSectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      videoTimeline
        .fromTo(
          videoSectionRef.current,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
        )
        .fromTo(
          '.video-content',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
          '-=0.8',
        );

      // Animacja sekcji FAQ
      const faqTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: faqSectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      faqTimeline
        .fromTo(
          faqSectionRef.current,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 },
        )
        .fromTo(
          '.faq-content',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
          '-=0.8',
        );

      // Animacja elementów FAQ
      faqItemRefs.current.forEach((item, index) => {
        if (!item) return;

        gsap.fromTo(
          item,
          { x: 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            delay: 0.15 * index + 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: faqSectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });

      // Animacja wzorów na obwódkach
      borderPatternRefs.current.forEach((pattern, index) => {
        if (!pattern) return;

        gsap.fromTo(
          pattern,
          { scale: 0, opacity: 0, rotate: -90 },
          {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 0.8,
            delay: 0.12 * index,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: pattern.parentElement,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });

      // Ulepszone animacje płatków kwiatów
      flowerElements.current.forEach((flower, index) => {
        if (!flower) return;

        // Początkowa randomizacja położenia
        gsap.set(flower, {
          x: Math.random() * 600 - 300,
          y: Math.random() * 600 - 300,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 1.2,
          opacity: 0,
        });

        // Animacja pojawiania się i unoszenia
        gsap.to(flower, {
          opacity: 0.3 + Math.random() * 0.15,
          duration: 1.5 + Math.random() * 2,
          delay: 0.3 + index * 0.15,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });

        // Ciągła animacja unoszenia - bardziej dynamiczna
        gsap.to(flower, {
          y: '+=' + (Math.random() * 120 - 60),
          x: '+=' + (Math.random() * 100 - 50),
          rotation: '+=' + (Math.random() * 70 - 35),
          duration: 10 + Math.random() * 20,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });

      // Dodatkowe animacje dla wzorów tła
      const bgPatterns = document.querySelectorAll('.bg-pattern');
      bgPatterns.forEach((pattern, index) => {
        gsap.fromTo(
          pattern,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 0.2 + Math.random() * 0.1,
            scale: 1,
            duration: 1.2,
            delay: 0.5 + index * 0.3,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });

      // Dodaj błyszczenie do kluczowych elementów
      gsap.to('.glow-effect', {
        boxShadow: '0 0 15px rgba(205, 175, 50, 0.6)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Delikatne animacje elementów ozdobnych
      gsap.to('.decorative-flourish', {
        rotate: '+=5',
        scale: 1.05,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Czyszczenie
      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }
  }, []);

  // Funkcja dodająca referencje do płatków kwiatów
  const addFlowerRef = (el: HTMLDivElement | null) => {
    if (el && !flowerElements.current.includes(el)) {
      flowerElements.current.push(el);
    }
  };

  // Funkcja dodająca referencje do elementów FAQ
  const addFaqItemRef = (el: HTMLDivElement | null, index: number) => {
    faqItemRefs.current[index] = el;
  };

  // Funkcja dodająca referencje do wzorów na obwódkach
  const addBorderPatternRef = (el: HTMLDivElement | null, index: number) => {
    borderPatternRefs.current[index] = el;
  };

  return (
    <div
      className='measuring-guide-section relative overflow-hidden py-16'
      ref={sectionRef}
    >
      {/* Rozbudowane tło sekcji */}
      <div className='absolute inset-0 bg-gradient-to-b from-deep-navy/10 via-gray-50 to-royal-gold/10 z-0'></div>

      {/* Dodatkowe wzory tła */}
      <div className='absolute top-0 left-0 w-full h-full opacity-5 z-0 bg-pattern-overlay'>
        <div className='bg-pattern absolute top-10 left-10 w-72 h-72 opacity-0 rotate-12'>
          <Image
            src='/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_d4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_0-removebg-preview.png'
            layout='fill'
            objectFit='contain'
            alt='Background pattern'
          />
        </div>
        <div className='bg-pattern absolute bottom-20 right-20 w-80 h-80 opacity-0 -rotate-12'>
          <Image
            src='/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_49aa16d2-bca9-49f0-892e-c45372365ece_3-removebg-preview.png'
            layout='fill'
            objectFit='contain'
            alt='Background pattern'
          />
        </div>
        <div className='bg-pattern absolute top-1/3 right-1/4 w-64 h-64 opacity-0 rotate-45'>
          <Image
            src='/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_d4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_3-removebg-preview.png'
            layout='fill'
            objectFit='contain'
            alt='Background pattern'
          />
        </div>
      </div>

      {/* Poprawione efekty gradientu */}
      <div className='absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-royal-gold/15 to-transparent opacity-70'></div>
      <div className='absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-deep-navy/15 to-transparent opacity-80'></div>
      <div className='absolute bottom-1/3 right-1/4 w-1/3 h-1/3 bg-gradient-radial from-royal-gold/10 to-transparent opacity-40 blur-xl'></div>

      {/* Więcej płatków kwiatów unoszących się w tle */}
      {[...Array(18)].map((_, i) => (
        <div
          key={i}
          ref={addFlowerRef}
          className='absolute flower-petal z-0 opacity-0'
        >
          <Image
            src={`/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_${
              i % 3 === 0
                ? 'd4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_0'
                : i % 3 === 1
                ? '49aa16d2-bca9-49f0-892e-c45372365ece_3'
                : 'd4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_3'
            }-removebg-preview.png`}
            width={60 + i * 8}
            height={60 + i * 8}
            alt='Flower petal'
          />
        </div>
      ))}

      <div className='max-w-6xl mx-auto mb-16 px-4 relative z-10'>
        <div className='title-container relative mb-20 text-center'>
          <h2
            ref={titleRef}
            className='text-3xl md:text-4xl text-deep-navy font-medium luxury-heading relative inline-block px-10 py-4'
          >
            JAK PRAWIDŁOWO ZMIERZYĆ OKNO
            <span className='title-decoration h-1.5 bg-gradient-to-r from-royal-gold/30 via-royal-gold to-royal-gold/30 absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-full glow-effect'></span>
          </h2>

          {/* Ulepszony kwiat przy tytule */}
          <div className='title-flower decorative-flourish absolute -top-16 -right-16 w-48 h-48 opacity-0 hidden lg:block'>
            <Image
              src='/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_d4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_0-removebg-preview.png'
              width={200}
              height={200}
              alt='Decorative flower'
              className='filter drop-shadow-lg'
            />
          </div>

          {/* Dodatkowy kwiat po lewej */}
          <div className='title-flower decorative-flourish absolute -top-12 -left-12 w-32 h-32 opacity-0 rotate-180 hidden lg:block'>
            <Image
              src='/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_49aa16d2-bca9-49f0-892e-c45372365ece_3-removebg-preview.png'
              width={150}
              height={150}
              alt='Decorative flower'
              className='filter drop-shadow-lg'
            />
          </div>

          {/* Dodatkowe dekoracyjne kwiaty przy tytule */}
          <div className='title-flower decorative-flourish absolute -bottom-12 left-1/4 w-28 h-28 opacity-0 -rotate-12 hidden lg:block'>
            <Image
              src='/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_d4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_3-removebg-preview.png'
              width={120}
              height={120}
              alt='Decorative flower'
              className='filter drop-shadow-lg'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Lewa kolumna z filmem instruktażowym - ulepszona */}
          <div
            className='video-section transform hover:scale-[1.02] transition-transform duration-500'
            ref={videoSectionRef}
          >
            <div className='rounded-xl shadow-2xl h-full relative overflow-hidden border-2 border-deep-navy/50 glow-effect'>
              {/* Tło z gradientem - bardziej intensywne */}
              <div className='absolute inset-0 bg-gradient-to-br from-deep-navy/95 via-deep-navy/90 to-deep-navy/80 z-0'></div>

              {/* Dodatkowe dekoracyjne wzory */}
              <div
                className='absolute inset-0 opacity-10 z-0'
                style={{
                  backgroundImage: `url('/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_d4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_3-removebg-preview.png')`,
                  backgroundSize: '200px',
                  backgroundRepeat: 'repeat',
                  backgroundPosition: 'center',
                  filter: 'blur(1px)',
                }}
              ></div>

              {/* Wzory na obwódce - większe i bardziej widoczne */}
              <div
                ref={(el) => addBorderPatternRef(el, 0)}
                className='pattern-1 absolute w-14 h-14 bg-royal-gold/50 rounded-full top-0 left-0 transform -translate-x-1/3 -translate-y-1/3 z-10'
              ></div>
              <div
                ref={(el) => addBorderPatternRef(el, 1)}
                className='pattern-2 absolute w-14 h-14 bg-royal-gold/50 rounded-full top-0 right-0 transform translate-x-1/3 -translate-y-1/3 z-10'
              ></div>
              <div
                ref={(el) => addBorderPatternRef(el, 2)}
                className='pattern-3 absolute w-14 h-14 bg-royal-gold/50 rounded-full bottom-0 left-0 transform -translate-x-1/3 translate-y-1/3 z-10'
              ></div>
              <div
                ref={(el) => addBorderPatternRef(el, 3)}
                className='pattern-4 absolute w-14 h-14 bg-royal-gold/50 rounded-full bottom-0 right-0 transform translate-x-1/3 translate-y-1/3 z-10'
              ></div>

              {/* Obwódka elementu - grubsza i bardziej ozdobna */}
              <div className='absolute inset-0 border-2 border-royal-gold/60 rounded-xl z-10'></div>
              <div className='absolute inset-0 border-4 border-dashed border-royal-gold/30 rounded-xl m-1 z-10'></div>

              {/* Ozdobny kwiat w prawym górnym rogu panelu */}
              <div className='absolute -top-8 -right-8 w-40 h-40 opacity-20 rotate-12 z-20 decorative-flourish'>
                <Image
                  src='/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_d4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_0-removebg-preview.png'
                  width={160}
                  height={160}
                  alt='Decorative flower'
                  className='filter drop-shadow-lg'
                />
              </div>

              {/* Dodatkowy kwiat w lewym dolnym rogu */}
              <div className='absolute -bottom-10 -left-10 w-36 h-36 opacity-20 -rotate-15 z-20 decorative-flourish'>
                <Image
                  src='/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_49aa16d2-bca9-49f0-892e-c45372365ece_3-removebg-preview.png'
                  width={140}
                  height={140}
                  alt='Decorative flower'
                  className='filter drop-shadow-lg'
                />
              </div>

              {/* Zawartość */}
              <div className='video-content relative z-20 p-8'>
                <h3 className='text-2xl font-medium mb-6 text-white tracking-wide'>
                  Film instruktażowy
                  <div className='h-0.5 w-24 bg-royal-gold/70 mt-2'></div>
                </h3>

                <div className='video-container relative z-30 mb-8'>
                  {/* Dodatkowy element podświetlający */}
                  <div className='absolute -inset-1 bg-gradient-to-r from-royal-gold/30 via-royal-gold/50 to-royal-gold/30 rounded-xl blur-sm'></div>

                  <div className='aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden relative border-4 border-royal-gold/70 shadow-[0_0_25px_rgba(205,175,50,0.5)] transform hover:scale-[1.02] transition-transform duration-300'>
                    <iframe
                      src='https://www.youtube.com/embed/XAzEJqNWTP8'
                      title='Jak mierzyć okna do zasłon i firan'
                      frameBorder='0'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                      className='absolute inset-0 w-full h-full z-10'
                    ></iframe>
                  </div>
                </div>

                <div className='space-y-5'>
                  <p className='text-gray-200 text-lg'>
                    Prawidłowe pomiary są kluczem do idealnie dopasowanych firan
                    i zasłon. Oglądając powyższy film, dowiesz się:
                  </p>
                  <ul className='list-disc pl-6 space-y-3 text-gray-200'>
                    <li className='text-lg font-light'>
                      Jak dokładnie zmierzyć szerokość i wysokość okna
                    </li>
                    <li className='text-lg font-light'>
                      Jakie dodatkowe wymiary wziąć pod uwagę przy różnych
                      typach karnisza
                    </li>
                    <li className='text-lg font-light'>
                      Jak uwzględnić marszczenie materiału w obliczeniach
                    </li>
                    <li className='text-lg font-light'>
                      Jakie są najczęstsze błędy przy pomiarach i jak ich
                      uniknąć
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Prawa kolumna z FAQ - bardziej wyrazista */}
          <div
            className='faq-section transform hover:scale-[1.02] transition-transform duration-500'
            ref={faqSectionRef}
          >
            <div className='rounded-xl shadow-2xl h-full relative overflow-hidden border-2 border-royal-gold/30'>
              {/* Tło z gradientem - bardziej intensywne */}
              <div className='absolute inset-0 bg-gradient-to-br from-royal-gold/20 via-royal-gold/10 to-royal-gold/5 z-0'></div>

              {/* Dodatkowa tekstura w tle */}
              <div
                className='absolute inset-0 opacity-5 z-0'
                style={{
                  backgroundImage:
                    'url("/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_d4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_0-removebg-preview.png")',
                  backgroundSize: '300px',
                  backgroundRepeat: 'repeat',
                }}
              ></div>

              {/* Wzory na obwódce - większe i bardziej widoczne */}
              <div
                ref={(el) => addBorderPatternRef(el, 4)}
                className='pattern-1 absolute w-12 h-12 bg-deep-navy/40 rounded-full top-0 left-0 transform -translate-x-1/3 -translate-y-1/3 z-10'
              ></div>
              <div
                ref={(el) => addBorderPatternRef(el, 5)}
                className='pattern-2 absolute w-12 h-12 bg-deep-navy/40 rounded-full top-0 right-0 transform translate-x-1/3 -translate-y-1/3 z-10'
              ></div>
              <div
                ref={(el) => addBorderPatternRef(el, 6)}
                className='pattern-3 absolute w-12 h-12 bg-deep-navy/40 rounded-full bottom-0 left-0 transform -translate-x-1/3 translate-y-1/3 z-10'
              ></div>
              <div
                ref={(el) => addBorderPatternRef(el, 7)}
                className='pattern-4 absolute w-12 h-12 bg-deep-navy/40 rounded-full bottom-0 right-0 transform translate-x-1/3 translate-y-1/3 z-10'
              ></div>

              {/* Obwódka elementu - grubsza i bardziej ozdobna */}
              <div className='absolute inset-0 border-2 border-deep-navy/40 rounded-xl z-10'></div>
              <div className='absolute inset-0 border-4 border-dashed border-deep-navy/15 rounded-xl m-1 z-10'></div>

              {/* Ozdobny kwiat - większy i bardziej widoczny */}
              <div className='absolute -top-12 -right-12 w-48 h-48 opacity-30 rotate-12 z-20'>
                <Image
                  src='/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_d4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_0-removebg-preview.png'
                  width={200}
                  height={200}
                  alt='Decorative flower'
                />
              </div>

              {/* Zawartość */}
              <div className='faq-content relative z-20 p-8'>
                <h3 className='text-2xl font-medium mb-8 text-deep-navy tracking-wide'>
                  Najczęściej zadawane pytania
                  <div className='h-0.5 w-24 bg-deep-navy/40 mt-2'></div>
                </h3>

                <div className='space-y-6'>
                  {faqItems.map((item, index) => (
                    <div
                      key={index}
                      ref={(el) => addFaqItemRef(el, index)}
                      className='border-b border-deep-navy/15 pb-5 last:border-0 last:pb-0 hover:bg-deep-navy/5 rounded-lg transition-colors duration-300'
                    >
                      <button
                        onClick={() => toggleItem(index)}
                        className='flex justify-between items-center w-full text-left font-medium text-gray-800 hover:text-deep-navy transition-colors py-3 px-3 group'
                      >
                        <span className='group-hover:translate-x-1 transition-transform duration-300 text-lg'>
                          {item.question}
                        </span>
                        <span className='transform transition-transform duration-300 ml-2 w-8 h-8 flex items-center justify-center bg-royal-gold/10 rounded-full group-hover:bg-royal-gold/20'>
                          {openItem === index ? (
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-5 w-5 text-royal-gold'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M5 15l7-7 7 7'
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-5 w-5 text-deep-navy'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M19 9l-7 7-7-7'
                              />
                            </svg>
                          )}
                        </span>
                      </button>
                      <div
                        className={`mt-2 text-gray-600 text-base leading-relaxed overflow-hidden transition-all duration-500 px-3 ${
                          openItem === index
                            ? 'max-h-96 opacity-100'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        {item.answer}
                      </div>
                    </div>
                  ))}
                </div>

                <div className='mt-8 pt-6 border-t border-deep-navy/20 relative'>
                  {/* Ozdobny kwiat na dole - większy */}
                  <div className='absolute -bottom-12 -left-12 w-36 h-36 opacity-30 -rotate-12 z-0'>
                    <Image
                      src='/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_49aa16d2-bca9-49f0-892e-c45372365ece_3-removebg-preview.png'
                      width={150}
                      height={150}
                      alt='Decorative flower'
                    />
                  </div>

                  <div className='bg-deep-navy/5 rounded-lg p-5 relative z-10 border border-deep-navy/10 transform hover:scale-[1.02] transition-transform duration-300'>
                    <p className='text-gray-700 mb-4 relative z-10 text-lg'>
                      Nadal masz pytania? Nie krępuj się skontaktować z naszym
                      zespołem ekspertów:
                    </p>
                    <div className='flex items-center space-x-5 relative z-10'>
                      <div className='w-14 h-14 rounded-full bg-deep-navy/15 flex items-center justify-center text-deep-navy'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-7 w-7'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                          />
                        </svg>
                      </div>
                      <div>
                        <p className='font-medium text-deep-navy text-lg'>
                          Zadzwoń do nas
                        </p>
                        <a
                          href='tel:531400230'
                          className='text-royal-gold hover:text-gold transition-colors text-xl font-bold'
                        >
                          531 400 230
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS dla animowanych elementów - ulepszony */}
      <style jsx>{`
        .pattern-1,
        .pattern-2,
        .pattern-3,
        .pattern-4 {
          opacity: 0;
          box-shadow: 0 0 25px 8px rgba(131, 104, 209, 0.2);
        }

        .flower-petal {
          pointer-events: none;
          position: absolute;
          will-change: transform;
          filter: drop-shadow(0px 0px 10px rgba(131, 104, 209, 0.25));
        }

        @keyframes floating {
          0%,
          100% {
            transform: translateY(0) rotate(0);
          }
          25% {
            transform: translateY(-15px) rotate(3deg);
          }
          50% {
            transform: translateY(-25px) rotate(5deg);
          }
          75% {
            transform: translateY(-10px) rotate(2deg);
          }
        }

        .decorative-flourish {
          filter: drop-shadow(0px 0px 12px rgba(131, 104, 209, 0.3));
          will-change: transform;
        }

        .luxury-heading {
          text-shadow: 0 2px 15px rgba(0, 0, 0, 0.18);
          letter-spacing: 1.2px;
        }

        .title-decoration {
          width: 0;
          box-shadow: 0 0 15px rgba(192, 155, 94, 0.6);
        }

        /* Ulepszony efekt błyszczenia obramowania */
        @keyframes borderGlow {
          0%,
          100% {
            box-shadow: 0 0 10px rgba(131, 104, 209, 0.3);
          }
          50% {
            box-shadow: 0 0 25px rgba(131, 104, 209, 0.7),
              0 0 40px rgba(192, 155, 94, 0.4);
          }
        }

        .video-section > div,
        .faq-section > div {
          animation: borderGlow 7s infinite;
        }

        .glow-effect {
          transition: box-shadow 0.5s ease-in-out;
        }

        /* Dodatkowy efekt odbłysków */
        @keyframes shineEffect {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .bg-pattern-overlay {
          opacity: 0.05;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MeasuringGuide;
