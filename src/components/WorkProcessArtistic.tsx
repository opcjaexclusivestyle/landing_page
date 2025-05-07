import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProcessStepCard, { ProcessStep } from './ProcessStepCard';

const WorkProcessArtistic: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const flowerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const processSteps: ProcessStep[] = [
    {
      icon: '✂️',
      title: 'Tkanina zostaje precyzyjnie przycięta',
      description:
        'Maszyna tnie materiał dokładnie na wymiar, który wybrałeś – z milimetrową dokładnością.',
      color: '#D4B996', // Złoty odcień
      accent: '#8D6E63', // Brązowy akcent
    },
    {
      icon: '🧵',
      title: 'Do akcji wkraczają nasze krawcowe',
      description:
        'Tkanina trafia w ręce doświadczonych specjalistek, które dbają o każdy detal i staranne przeszycia.',
      color: '#CDC1B4', // Beżowy odcień
      accent: '#A1887F', // Jasny brązowy akcent
    },
    {
      icon: '🔍',
      title: 'Kontrola jakości',
      description:
        'Każdy element jest dokładnie sprawdzany – zarówno jakość szycia, jak i samego materiału.',
      color: '#B79B8C', // Jasny brązowy
      accent: '#795548', // Ciemny brązowy akcent
    },
    {
      icon: '📦',
      title: 'Czas na pakowanie',
      description:
        'Gotowy produkt składamy z troską i pakujemy tak, by dotarł do Ciebie w perfekcyjnym stanie.',
      color: '#B2A396', // Delikatny beż
      accent: '#6D4C41', // Głęboki brązowy akcent
    },
    {
      icon: '🚚',
      title: 'Wysyłka w drogę!',
      description:
        'Przekazujemy paczkę kurierowi, a Ty możesz na bieżąco śledzić trasę swojej przesyłki.',
      color: '#C5B9AC', // Piaskowy odcień
      accent: '#5D4037', // Bardzo ciemny brąz
    },
    {
      icon: '✨',
      title: 'Gotowe!',
      description:
        'Ciesz się swoimi nowymi pięknymi zasłonami, które doskonale dopełnią wystrój Twojego wnętrza.',
      color: '#E6CCB2', // Złotawy odcień
      accent: '#4E342E', // Najciemniejszy brąz
    },
  ];

  // Funkcja do określenia liczby kafelków widocznych na różnych rozmiarach ekranu
  const getVisibleTiles = () => {
    if (typeof window === 'undefined') return 3; // Fallback dla SSR
    if (window.innerWidth >= 1024) return 3; // Desktop
    if (window.innerWidth >= 768) return 2; // Tablet
    return 1; // Mobilka
  };

  const [visibleTiles, setVisibleTiles] = useState(getVisibleTiles());

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Przygotowanie animacji tła
    gsap.fromTo(
      backgroundRef.current,
      { opacity: 0, scale: 1.1 },
      {
        opacity: 0.15,
        scale: 1,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 10%',
          scrub: 1,
        },
      },
    );

    // Animacja unoszących się kwiatów
    flowerRefs.current.forEach((flower, index) => {
      if (!flower) return;

      const delay = index * 0.15;
      const duration = 15 + Math.random() * 15;
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * 500 + 100;
      const rotateStart = Math.random() * 360;
      const scaleStart = 0.4 + Math.random() * 0.8;

      // Ustawienie początkowej pozycji
      gsap.set(flower, {
        x: startX,
        y: startY,
        rotation: rotateStart,
        scale: scaleStart,
        opacity: 0,
      });

      // Animacja pojawiania się
      gsap.to(flower, {
        opacity: 0.15 + Math.random() * 0.1,
        duration: 2,
        delay: delay,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });

      // Animacja unoszenia się z płynnym ruchem
      gsap.to(flower, {
        y: startY - (100 + Math.random() * 200),
        x: startX + (Math.random() * 100 - 50),
        rotation: rotateStart + (Math.random() * 180 - 90),
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // Animacja tytułu
    const titleElements = titleRef.current?.querySelectorAll('.animate-in');
    if (titleElements) {
      gsap.fromTo(
        titleElements,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    }

    // Animacja linii procesu i kroków
    if (stepsContainerRef.current) {
      gsap.fromTo(
        progressRef.current,
        { width: '0%' },
        {
          width: '100%',
          duration: 1.5,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: stepsContainerRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      // Animacja poszczególnych etapów
      stepsRef.current.forEach((step, index) => {
        if (!step) return;

        gsap.fromTo(
          step,
          {
            opacity: 0,
            scale: 0.9,
            x: index % 2 === 0 ? -20 : 20,
          },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 0.7,
            delay: 0.3 + index * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: stepsContainerRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });
    }

    // Dostosowanie liczby widocznych kafelków do rozmiaru ekranu
    const handleResize = () => {
      setVisibleTiles(getVisibleTiles());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Funkcja zmieniająca aktywny krok
  const handleStepChange = (index: number) => {
    const maxStartIndex = Math.max(0, processSteps.length - visibleTiles);
    if (index >= 0 && index <= maxStartIndex) {
      // Animacja podświetlenia wybranego kroku
      if (stepsRef.current[index]) {
        gsap.to(stepsRef.current[index], {
          scale: 1.05,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut',
        });
      }

      setActiveStep(index);
    }
  };

  // Obliczenie szerokości paska postępu
  const progressWidth = `${
    (Math.min(activeStep + visibleTiles, processSteps.length) /
      processSteps.length) *
    100
  }%`;

  return (
    <section
      ref={sectionRef}
      className='relative py-24 px-4 md:px-8 lg:px-16 overflow-hidden bg-gradient-to-b from-white to-[#FAF7F2]'
    >
      {/* Artystyczne tło z gradientem i kwiatami */}
      <div
        ref={backgroundRef}
        className='absolute inset-0 z-0'
        style={{
          // backgroundImage:
          //   'url(/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_49aa16d2-bca9-49f0-892e-c45372365ece_3-removebg-preview.png)',

          backgroundImage: 'url(/images/background-flower.jpg)',

          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'overlay',
        }}
      ></div>

      {/* Unoszące się kwiaty */}
      {[...Array(18)].map((_, i) => (
        <div
          key={`floating-flower-${i}`}
          ref={(el) => {
            flowerRefs.current[i] = el;
          }}
          className='absolute z-0 pointer-events-none'
        >
          {/* <Image
            src='/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_d4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_0-removebg-preview.png'
            width={80}
            height={80}
            alt=''
            className='opacity-20'
          /> */}
        </div>
      ))}

      {/* Ozdobny motyw na górze */}
      <div className='absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#F7F3ED] to-transparent z-0'></div>

      {/* Tytuł z artystyczną typografią */}
      <div ref={titleRef} className='relative z-10 text-center mb-20'>
        <div className='inline-block mb-3'>
          <span className='animate-in text-[var(--primary-color)] tracking-[0.2em] uppercase text-sm font-light mb-2 inline-block'>
            Proces tworzenia
          </span>
        </div>

        {/* <div className='flex justify-center items-center mb-6'>
          <div className='h-0.5 w-12 bg-[var(--primary-color)] opacity-30'></div>
          <div className='mx-4'>
            <Image
              src='/images/flower-icon.png'
              width={30}
              height={30}
              alt=''
              className='opacity-70 animate-in'
            />
          </div>
          <div className='h-0.5 w-12 bg-[var(--primary-color)] opacity-30'></div>
        </div> */}

        <h2 className='animate-in text-5xl md:text-6xl font-light text-[#8D6E63] max-w-4xl mx-auto leading-tight font-serif'>
          Jak pracujemy
        </h2>

        <p className='animate-in text-gray-600 max-w-2xl mx-auto mt-6 italic font-light'>
          Każda tkanina przechodzi przez ręce naszych specjalistów, tworząc
          prawdziwe dzieło sztuki
        </p>
      </div>

      {/* Pozioma karuzela z krokami */}
      <div
        ref={stepsContainerRef}
        className='relative z-10 max-w-7xl mx-auto px-4 md:px-8'
      >
        {/* Linia procesu z paskiem postępu */}
        <div className='relative h-1 bg-[#DCD2C8] rounded-full mb-16 overflow-hidden'>
          <div
            ref={progressRef}
            className='absolute top-0 left-0 h-full bg-[var(--primary-color)]'
            style={{
              width: progressWidth,
              transition: 'width 0.5s ease-in-out',
            }}
          ></div>

          {/* Znaczniki etapów */}
          <div className='absolute top-0 left-0 w-full h-full flex justify-between'>
            {processSteps.map((_, i) => (
              <button
                key={`step-marker-${i}`}
                onClick={() => handleStepChange(i)}
                className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                  i <= activeStep
                    ? 'bg-[var(--primary-color)] border-[var(--primary-color)]'
                    : 'bg-white border-[#DCD2C8]'
                }`}
                style={{ transform: 'translateX(-50%)' }}
                aria-label={`Krok ${i + 1}: ${processSteps[i].title}`}
              />
            ))}
          </div>
        </div>

        {/* Karty kroków */}
        <div className='relative overflow-hidden'>
          <div
            className='transition-all duration-500 ease-in-out flex'
            style={{
              transform: `translateX(-${activeStep * (100 / visibleTiles)}%)`,
            }}
          >
            {processSteps.map((step, index) => (
              <ProcessStepCard
                key={`step-card-${index}`}
                ref={(el) => {
                  stepsRef.current[index] = el;
                }}
                step={step}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Nawigacja mobilna */}
        <div className='mt-12 flex justify-center gap-2'>
          {Array.from({
            length: Math.ceil(processSteps.length / visibleTiles),
          }).map((_, i) => (
            <button
              key={`mobile-dot-${i}`}
              onClick={() => handleStepChange(i * visibleTiles)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                Math.floor(activeStep / visibleTiles) === i
                  ? 'bg-[var(--primary-color)] scale-125'
                  : 'bg-[#DCD2C8]'
              }`}
              aria-label={`Przejdź do grupy kroków ${i + 1}`}
            />
          ))}
        </div>

        {/* Przyciski nawigacyjne */}
        <div className='mt-12 flex justify-center gap-4'>
          <button
            onClick={() =>
              handleStepChange(
                activeStep === 0
                  ? Math.max(0, processSteps.length - visibleTiles)
                  : Math.max(0, activeStep - visibleTiles),
              )
            }
            className='w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border border-[#DCD2C8] hover:bg-[var(--primary-color)]/10 transition-colors'
            aria-label='Poprzednia grupa'
          >
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M15 18L9 12L15 6'
                stroke='#8D6E63'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>

          <button
            onClick={() =>
              handleStepChange(
                activeStep + visibleTiles <=
                  Math.max(0, processSteps.length - visibleTiles)
                  ? activeStep + visibleTiles
                  : 0,
              )
            }
            className='w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border border-[#DCD2C8] hover:bg-[var(--primary-color)]/10 transition-colors'
            aria-label='Następna grupa'
          >
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M9 6L15 12L9 18'
                stroke='#8D6E63'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default WorkProcessArtistic;
