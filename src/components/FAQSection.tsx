'use client';
import { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  title = 'Najczęściej zadawane pytania',
  subtitle = 'Znajdź odpowiedzi na najczęstsze pytania dotyczące naszych produktów i usług',
  className = '',
}: FAQSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Przykładowe dane FAQ
  const faqItems: FAQItem[] = [
    {
      question:
        'Jak obliczyć ilość materiału potrzebnego do zawieszenia zasłony lub firany?',
      answer:
        'Wystarczy, że zmierzysz długość karnisza w miejscu, gdzie planujesz zawiesić zasłonę lub firanę. Następnie wpisz tę wartość w nasz kalkulator, a on automatycznie wyliczy odpowiednią ilość materiału, by uzyskać efektowne, eleganckie fale w Twoim oknie.',
    },
    {
      question: 'Czy mogę zamówić próbkę materiału przed zakupem?',
      answer:
        'Tak, oferujemy możliwość zamówienia próbek materiałów. Skontaktuj się z nami telefonicznie, a wyślemy Ci wybrane próbki, abyś mógł ocenić kolor i strukturę materiału we własnym domu.',
    },
    {
      question: 'Jak mogę otrzymać 20% rabatu na kolejne zakupy?',
      answer:
        'To proste! Odmień swoje wnętrze z naszymi firanami lub zasłonami i pochwal się efektem! Prześlij nam zdjęcia pomieszczenia przed i po metamorfozie, a my nagrodzimy Cię 20% rabatem na kolejne zakupy. Zainspiruj innych swoją aranżacją i zgarnij zniżkę na kolejne piękne dodatki do domu!',
    },
    {
      question: 'Od jakiej kwoty mogę skorzystać z darmowej dostawy?',
      answer:
        'Darmowa dostawa przysługuje przy zamówieniach od 399 zł! Zrób zakupy już teraz i skorzystaj z tej wygodnej opcji – nie przepłacaj za przesyłkę!',
    },
    {
      question: 'Jaka taśma marszcząca będzie najlepsza?',
      answer:
        'W naszym sklepie znajdziesz starannie wyselekcjonowany asortyment taśm marszczących – oferujemy najczęściej wybierane i najpopularniejsze modele w Polsce. Dzięki temu masz pewność, że każdy z naszych produktów to sprawdzony i topowy wybór. Do zasłon najczęściej polecana jest taśma ołówkowa o szerokości 8 cm, która zapewnia elegancki wygląd i równomierne marszczenie. Dla osób preferujących bardziej dyskretne rozwiązania, idealna będzie taśma ołówkowa 2,5 cm – doskonale sprawdzi się tam, gdzie taśma ma pozostać niewidoczna. Z kolei do firan szczególnie polecana jest taśma SMOK o szerokości 5 cm. To uniwersalne rozwiązanie, które pasuje do każdego wnętrza i pięknie eksponuje lekkość tkaniny. Dla miłośników nowoczesnego designu doskonałym wyborem będzie taśma wave. To wyjątkowe rozwiązanie, które tworzy idealnie regularne fale, niezależnie od rodzaju tkaniny. Taśma wave świetnie sprawdza się w eleganckich, przestronnych wnętrzach – szczególnie w salonach i pokojach dziennych, gdzie liczy się efekt lekkości, harmonii i nowoczesnej estetyki.',
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
        },
        {
          opacity: 1,
          y: 0,
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

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Przełączanie stanu rozwinięcia elementu FAQ
  const toggleItem = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section
      id='faq'
      ref={sectionRef}
      className={`py-20 bg-gray-50 ${className}`}
    >
      <div className='container mx-auto px-4'>
        {/* Nagłówek sekcji */}
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <h2
            ref={headingRef}
            className='text-3xl font-bold text-gray-900 mb-4'
          >
            {title}
          </h2>
          <p ref={subheadingRef} className='text-gray-600 text-lg'>
            {subtitle}
          </p>
        </div>

        {/* Lista pytań FAQ */}
        <div className='max-w-3xl mx-auto space-y-4'>
          {faqItems.map((item, index) => (
            <div
              key={index}
              className='faq-item bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300'
            >
              <button
                onClick={() => toggleItem(index)}
                className='w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50'
              >
                <span className='font-medium text-gray-900'>
                  {item.question}
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                    expandedIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedIndex === index
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className='px-6 py-4 text-gray-600 bg-gray-50 border-t border-gray-100'>
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
