'use client';
import { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

// Interfejs dla pojedynczego elementu FAQ
interface FAQItem {
  question: string;
  answer: string;
}

// Interfejs dla komponentu FAQSection
interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function FAQSection({
  title = 'Najczęściej zadawane pytania o rolety',
  subtitle = 'Znajdź odpowiedzi na najczęstsze pytania dotyczące rolet rzymskich i plisowanych',
  className = '',
}: FAQSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const borderPatternRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Przykładowe dane FAQ
  const faqItems: FAQItem[] = [
    {
      question: 'Czy rolety rzymskie można prać?',
      answer:
        'Tak, większość rolet rzymskich posiada materiał zdejmowany na rzepy lub haczyki, co umożliwia pranie ręczne lub w pralce – najlepiej w delikatnym programie i niskiej temperaturze (do 30°C). Zawsze warto sprawdzić zalecenia producenta.',
    },
    {
      question: 'Czy rolety rzymskie nadają się do kuchni lub łazienki?',
      answer:
        'Tak, ale najlepiej wybrać tkaniny odporne na wilgoć i łatwe do czyszczenia. Do kuchni polecane są tkaniny syntetyczne lub z powłoką teflonową, a do łazienki materiały o właściwościach antygrzybicznych.',
    },
    {
      question: 'Jak montuje się rolety rzymskie?',
      answer:
        'Rolety rzymskie można montować na kilka sposobów: do ściany, do sufitu lub bezinwazyjnie na ramę okna (przy pomocy specjalnych uchwytów). Wybór zależy od preferencji i rodzaju okna.',
    },
    {
      question: 'Czym różnią się rolety plisowane od tradycyjnych rolet?',
      answer:
        'Rolety plisowane składają się w harmonijkę i można je regulować zarówno od góry, jak i od dołu, co daje większą swobodę w zasłanianiu wybranej części okna. Są też bardziej estetyczne i zajmują mniej miejsca.',
    },
    {
      question:
        'Czy plisy nadają się do okien dachowych lub nietypowych kształtów?',
      answer:
        'Tak, rolety plisowane są idealnym rozwiązaniem dla okien dachowych, trapezowych, trójkątnych czy okrągłych. Można je dopasować na wymiar niemal do każdego kształtu.',
    },
    {
      question: 'Jak czyścić rolety plisowane?',
      answer:
        'Najlepiej używać miękkiej ściereczki lub szczoteczki do kurzu. W przypadku większych zabrudzeń można delikatnie przetrzeć wilgotną ściereczką. Nie zaleca się całkowitego zanurzania w wodzie, chyba że producent na to zezwala.',
    },
  ];

  // Obsługa animacji przy przewijaniu strony
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animacja nagłówka
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
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

    // Animacja elementów FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
      gsap.fromTo(
        item,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.1 * index,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
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

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Przełączanie stanu rozwinięcia elementu FAQ
  const toggleItem = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Funkcja dodająca referencje do wzorów na obwódkach
  const addBorderPatternRef = (el: HTMLDivElement | null, index: number) => {
    borderPatternRefs.current[index] = el;
  };

  return (
    <section
      id='faq'
      ref={sectionRef}
      className={`py-20 relative overflow-hidden ${className}`}
    >
      {/* Tło sekcji */}
      <div className='absolute inset-0 bg-gradient-to-b from-deep-navy/10 via-gray-50 to-royal-gold/10 z-0'></div>

      {/* Dodatkowe wzory tła */}
      <div className='absolute top-0 left-0 w-full h-full opacity-5 z-0'>
        <div className='absolute top-10 left-10 w-72 h-72 opacity-0 rotate-12'>
          <Image
            src='/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_d4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_0-removebg-preview.png'
            layout='fill'
            objectFit='contain'
            alt='Background pattern'
          />
        </div>
      </div>

      <div className='container mx-auto px-4 relative z-10'>
        {/* Nagłówek sekcji */}
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <h2
            ref={headingRef}
            className='text-3xl md:text-4xl text-deep-navy font-medium luxury-heading relative inline-block px-10 py-4'
          >
            {title}
            <span className='title-decoration h-1.5 bg-gradient-to-r from-royal-gold/30 via-royal-gold to-royal-gold/30 absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-full glow-effect'></span>
          </h2>
          <p ref={subheadingRef} className='text-gray-600 text-lg mt-4'>
            {subtitle}
          </p>
        </div>

        {/* Lista pytań FAQ */}
        <div className='max-w-3xl mx-auto'>
          <div className='rounded-xl shadow-2xl relative overflow-hidden border-2 border-royal-gold/30'>
            {/* Tło z gradientem */}
            <div className='absolute inset-0 bg-gradient-to-br from-royal-gold/20 via-royal-gold/10 to-royal-gold/5 z-0'></div>

            {/* Wzory na obwódce */}
            <div
              ref={(el) => addBorderPatternRef(el, 0)}
              className='pattern-1 absolute w-12 h-12 bg-deep-navy/40 rounded-full top-0 left-0 transform -translate-x-1/3 -translate-y-1/3 z-10'
            ></div>
            <div
              ref={(el) => addBorderPatternRef(el, 1)}
              className='pattern-2 absolute w-12 h-12 bg-deep-navy/40 rounded-full top-0 right-0 transform translate-x-1/3 -translate-y-1/3 z-10'
            ></div>
            <div
              ref={(el) => addBorderPatternRef(el, 2)}
              className='pattern-3 absolute w-12 h-12 bg-deep-navy/40 rounded-full bottom-0 left-0 transform -translate-x-1/3 translate-y-1/3 z-10'
            ></div>
            <div
              ref={(el) => addBorderPatternRef(el, 3)}
              className='pattern-4 absolute w-12 h-12 bg-deep-navy/40 rounded-full bottom-0 right-0 transform translate-x-1/3 translate-y-1/3 z-10'
            ></div>

            {/* Obwódka elementu */}
            <div className='absolute inset-0 border-2 border-deep-navy/40 rounded-xl z-10'></div>
            <div className='absolute inset-0 border-4 border-dashed border-deep-navy/15 rounded-xl m-1 z-10'></div>

            <div className='relative z-20 p-8'>
              <div className='space-y-6'>
                {faqItems.map((item, index) => (
                  <div
                    key={index}
                    className='faq-item border-b border-deep-navy/15 pb-5 last:border-0 last:pb-0 hover:bg-deep-navy/5 rounded-lg transition-colors duration-300'
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className='flex justify-between items-center w-full text-left font-medium text-gray-800 hover:text-deep-navy transition-colors py-3 px-3 group'
                    >
                      <span className='group-hover:translate-x-1 transition-transform duration-300 text-lg'>
                        {item.question}
                      </span>
                      <span className='transform transition-transform duration-300 ml-2 w-8 h-8 flex items-center justify-center bg-royal-gold/10 rounded-full group-hover:bg-royal-gold/20'>
                        <ChevronDownIcon
                          className={`w-5 h-5 text-deep-navy transition-transform duration-300 ${
                            expandedIndex === index
                              ? 'transform rotate-180'
                              : ''
                          }`}
                        />
                      </span>
                    </button>
                    <div
                      className={`mt-2 text-gray-600 text-base leading-relaxed overflow-hidden transition-all duration-500 px-3 ${
                        expandedIndex === index
                          ? 'max-h-96 opacity-100'
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      {item.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS dla animowanych elementów */}
      <style jsx>{`
        .pattern-1,
        .pattern-2,
        .pattern-3,
        .pattern-4 {
          opacity: 0;
          box-shadow: 0 0 25px 8px rgba(131, 104, 209, 0.2);
        }

        .luxury-heading {
          text-shadow: 0 2px 15px rgba(0, 0, 0, 0.18);
          letter-spacing: 1.2px;
        }

        .title-decoration {
          width: 0;
          box-shadow: 0 0 15px rgba(192, 155, 94, 0.6);
        }

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

        .faq-item {
          animation: borderGlow 7s infinite;
        }

        .glow-effect {
          transition: box-shadow 0.5s ease-in-out;
        }
      `}</style>
    </section>
  );
}
