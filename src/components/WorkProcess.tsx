import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const WorkProcess: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const floatingFlowersRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Dane kroków procesu
  const processSteps = [
    {
      icon: '✂️',
      title: 'Tkanina zostaje precyzyjnie przycięta',
      description:
        'Maszyna tnie materiał dokładnie na wymiar, który wybrałeś – z milimetrową dokładnością.',
    },
    {
      icon: '🧵',
      title: 'Do akcji wkraczają nasze krawcowe',
      description:
        'Tkanina trafia w ręce doświadczonych specjalistek, które dbają o każdy detal i staranne przeszycia.',
    },
    {
      icon: '🔍',
      title: 'Kontrola jakości',
      description:
        'Każdy element jest dokładnie sprawdzany – zarówno jakość szycia, jak i samego materiału.',
    },
    {
      icon: '📦',
      title: 'Czas na pakowanie',
      description:
        'Gotowy produkt składamy z troską i pakujemy tak, by dotarł do Ciebie w perfekcyjnym stanie.',
    },
    {
      icon: '🚚',
      title: 'Wysyłka w drogę!',
      description:
        'Przekazujemy paczkę kurierowi, a Ty możesz na bieżąco śledzić trasę swojej przesyłki.',
    },
    {
      icon: '✨',
      title: 'Gotowe!',
      description:
        'Twoje nowe zasłony, firany lub rolety są gotowe do montażu i będą służyć przez wiele lat.',
    },
  ];

  // Przełączanie kroków
  const nextStep = () => {
    setCurrentStep((prev) => (prev === processSteps.length - 1 ? 0 : prev + 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev === 0 ? processSteps.length - 1 : prev - 1));
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animacja tła
    gsap.fromTo(
      backgroundRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.5,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      },
    );

    // Animacja kwiatów unoszących się w tle
    floatingFlowersRef.current.forEach((flower, index) => {
      if (!flower) return;

      // Początkowa randomizacja położenia
      gsap.set(flower, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * 500,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1,
        opacity: 0,
      });

      // Animacja pojawiania się i unoszenia
      gsap.to(flower, {
        opacity: 0.3 + Math.random() * 0.2, // Zwiększona widoczność
        duration: 1 + Math.random() * 2,
        delay: 0.5 + index * 0.2,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      // Ciągła animacja unoszenia
      gsap.to(flower, {
        y: '-=' + (50 + Math.random() * 100),
        x: '+=' + (Math.random() * 50 - 25),
        rotation: '+=' + (Math.random() * 40 - 20),
        duration: 15 + Math.random() * 15,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    // Animacja tytułu
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        },
      },
    );

    // Animacja kroków procesu
    gsap.fromTo(
      carouselRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
        scrollTrigger: {
          trigger: carouselRef.current,
          start: 'top 80%',
        },
      },
    );

    // Auto-przewijanie
    const interval = setInterval(() => {
      nextStep();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className='relative py-16 md:py-24 overflow-hidden'
    >
      {/* Tło z kwiatowym wzorem */}
      <div
        ref={backgroundRef}
        className='absolute inset-0 bg-white/70 z-0'
        style={{
          backgroundImage:
            'url(/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_49aa16d2-bca9-49f0-892e-c45372365ece_3-removebg-preview.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Unoszące się kwiaty */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`flower-${i}`}
          ref={(el) => (floatingFlowersRef.current[i] = el)}
          className='absolute z-10 pointer-events-none'
        >
          <Image
            src='/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_49aa16d2-bca9-49f0-892e-c45372365ece_3-removebg-preview.png'
            width={80}
            height={80}
            alt=''
            className='object-contain'
          />
        </div>
      ))}

      <div className='container relative mx-auto px-4 z-20'>
        {/* Tytuł sekcji */}
        <div ref={titleRef} className='text-center mb-12 md:mb-16'>
          <p className='text-[var(--primary-color)] uppercase tracking-widest mb-2 font-light'>
            Proces produkcji
          </p>
          <h2 className='text-3xl md:text-5xl font-light text-gray-800 mb-3'>
            Jak pracujemy
          </h2>
          <div className='w-20 h-0.5 bg-[var(--primary-color)]/60 mx-auto'></div>
        </div>

        {/* Karuzela z krokami procesu */}
        <div ref={carouselRef} className='max-w-4xl mx-auto relative'>
          {/* Przyciski nawigacyjne */}
          <button
            onClick={prevStep}
            className='absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-5 md:-translate-x-10 z-30 w-10 h-10 bg-white/80 rounded-full shadow-md flex items-center justify-center border border-[var(--primary-color)]/20 text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10 transition-colors'
            aria-label='Poprzedni krok'
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M12.5 15L7.5 10L12.5 5'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>

          <button
            onClick={nextStep}
            className='absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-5 md:translate-x-10 z-30 w-10 h-10 bg-white/80 rounded-full shadow-md flex items-center justify-center border border-[var(--primary-color)]/20 text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10 transition-colors'
            aria-label='Następny krok'
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M7.5 5L12.5 10L7.5 15'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>

          {/* Karty kroków - równe w jednej linii */}
          <div className='overflow-hidden rounded-xl shadow-lg border border-[var(--light-gold)]/30'>
            <div
              className='flex transition-transform duration-500 ease-in-out'
              style={{
                transform: `translateX(-${currentStep * 33.33}%)`,
              }}
            >
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  ref={(el) => (stepsRef.current[index] = el)}
                  className='w-full md:w-1/3 flex-shrink-0 p-1'
                >
                  <div
                    className={`bg-white/90 backdrop-blur-sm p-6 md:p-8 min-h-[220px] rounded-lg shadow-sm border transition-all duration-300 h-full relative ${
                      index === currentStep
                        ? 'border-[var(--primary-color)] shadow-md scale-[1.02]'
                        : 'border-[var(--light-gold)]/30'
                    }`}
                  >
                    {/* Elegancki efekt podświetlenia */}
                    {index === currentStep && (
                      <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary-color)]/30 via-[var(--primary-color)] to-[var(--primary-color)]/30 rounded-t-lg'></div>
                    )}

                    {/* Kwiat w tle karty */}
                    <div className='absolute bottom-0 right-0 w-32 h-32 opacity-10 pointer-events-none'>
                      <Image
                        src='/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_49aa16d2-bca9-49f0-892e-c45372365ece_3-removebg-preview.png'
                        width={128}
                        height={128}
                        alt=''
                        className='object-contain'
                      />
                    </div>

                    <div className='flex flex-col items-center md:items-start gap-6 relative z-10'>
                      {/* Ikona z numerem */}
                      <div
                        className={`w-20 h-20 rounded-full flex flex-col items-center justify-center flex-shrink-0 border transition-all duration-300 ${
                          index === currentStep
                            ? 'bg-[var(--primary-color)]/20 border-[var(--primary-color)]'
                            : 'bg-[var(--primary-color)]/10 border-[var(--light-gold)]/40'
                        }`}
                      >
                        <span className='text-3xl mb-1'>{step.icon}</span>
                        <span className='absolute -bottom-2 -right-2 w-6 h-6 bg-[var(--primary-color)] rounded-full text-white text-xs flex items-center justify-center font-medium shadow-sm'>
                          {index + 1}
                        </span>
                      </div>

                      {/* Treść - wycentrowana dla większej elegancji */}
                      <div className='flex-1 text-center w-full'>
                        <h3
                          className={`text-xl md:text-2xl font-light mb-3 leading-tight transition-colors duration-300 ${
                            index === currentStep
                              ? 'text-[var(--primary-color)]'
                              : 'text-gray-700'
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p className='text-gray-700 text-sm md:text-base leading-relaxed'>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Eleganckie wskaźniki kroków */}
          <div className='flex justify-center mt-8 space-x-3'>
            {processSteps.map((_, index) => (
              <button
                key={`indicator-${index}`}
                onClick={() => setCurrentStep(index)}
                className={`transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 h-3 bg-[var(--primary-color)] rounded-full'
                    : 'w-3 h-3 bg-[var(--primary-color)]/30 rounded-full hover:bg-[var(--primary-color)]/50'
                }`}
                aria-label={`Przejdź do kroku ${index + 1}`}
              />
            ))}
          </div>

          {/* Stylowa numeracja kroków */}
          <div className='text-center mt-6'>
            <span className='inline-block px-4 py-1 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] font-medium border border-[var(--primary-color)]/20'>
              {currentStep + 1} / {processSteps.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkProcess;
