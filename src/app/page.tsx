'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Home() {
  const containerRef = useRef(null);
  const curtainSectionRef = useRef(null);
  const blindSectionRef = useRef(null);
  const curtainTextRef = useRef(null);
  const blindTextRef = useRef(null);
  const curtainImageRef = useRef(null);
  const blindImageRef = useRef(null);
  const dividerRef = useRef(null);
  const sunRef = useRef(null);
  const sunGlowRef = useRef(null);
  const sunTrailRef = useRef(null);
  const contactButtonRef = useRef(null);
  const navigationRef = useRef(null);
  const dividerStarsRef = useRef(null);

  const [activeSection, setActiveSection] = useState<
    'none' | 'curtain' | 'blind'
  >('none');

  // Rejestracja pluginu ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Główne animacje przy wczytywaniu strony
  useEffect(() => {
    const tl = gsap.timeline();

    // Początkowa animacja - powolne rozjaśnianie strony
    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: 'power2.inOut' },
    );

    // Złożona animacja dla sekcji firan
    tl.fromTo(
      curtainImageRef.current,
      { scale: 1.1, opacity: 0.7 },
      { scale: 1, opacity: 1, duration: 1.8, ease: 'power2.out' },
      '-=0.8',
    );

    tl.fromTo(
      curtainTextRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
      '-=1.4',
    );

    // Złożona animacja dla sekcji rolet
    tl.fromTo(
      blindImageRef.current,
      { scale: 1.1, opacity: 0.7 },
      { scale: 1, opacity: 1, duration: 1.8, ease: 'power2.out' },
      '-=1.8',
    );

    tl.fromTo(
      blindTextRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
      '-=1.4',
    );

    // Animacja nawigacji
    tl.fromTo(
      navigationRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'back.out(1.7)' },
      '-=1',
    );

    // Animacja przycisku kontaktowego
    tl.fromTo(
      contactButtonRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)' },
      '-=0.8',
    );

    // Animacja kreski dzielącej - teraz bardziej spektakularna
    tl.fromTo(
      dividerRef.current,
      { height: 0, opacity: 0 },
      {
        height: '100%',
        opacity: 1,
        duration: 2.5,
        ease: 'power3.inOut',
        onComplete: () => {
          // Po zakończeniu animacji kreski, dodajemy efekt światła przebiegającego przez nią
          gsap.fromTo(
            dividerRef.current,
            {
              backgroundImage:
                'linear-gradient(to bottom, var(--gold), rgba(255,255,255,0.9), var(--gold))',
              boxShadow: '0 0 20px 5px rgba(212,175,55,0.7)',
            },
            {
              backgroundImage:
                'linear-gradient(to bottom, var(--gold), rgba(255,255,255,1), var(--gold))',
              boxShadow: '0 0 40px 15px rgba(212,175,55,0.9)',
              duration: 1.5,
              repeat: 2,
              yoyo: true,
              ease: 'sine.inOut',
            },
          );
        },
      },
      '-=1.8',
    );

    // Animacja gwiazd na kresce
    gsap.set(dividerStarsRef.current, { opacity: 0 });

    tl.to(
      dividerStarsRef.current,
      {
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power2.out',
      },
      '-=1',
    );

    // Animacja gwiazd - ciągły ruch
    gsap.to('.divider-star', {
      y: '+=20',
      scale: 0.8,
      opacity: 0.7,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: {
        each: 0.3,
        from: 'random',
      },
    });

    // Animacje słońca
    // 1. Pulsowanie słońca
    gsap.to(sunRef.current, {
      scale: 1.2,
      opacity: 0.9,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // 2. Pulsowanie poświaty
    gsap.to(sunGlowRef.current, {
      opacity: 0.6,
      scale: 1.6,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // 3. Ruch słońca od prawej do lewej
    const sunMovement = gsap.timeline({
      repeat: -1,
      repeatDelay: 1,
      onUpdate: function () {
        // Aktualizacja śladu za słońcem
        if (sunTrailRef.current) {
          const sunPosition = gsap.getProperty(sunRef.current, 'y') as number;
          gsap.to(sunTrailRef.current, {
            height: window.innerHeight - sunPosition * 2,
            opacity: 0.3 - (sunPosition / window.innerHeight) * 0.2,
            duration: 0.1,
          });
        }
      },
    });

    sunMovement
      .to([sunRef.current, sunGlowRef.current], {
        y: '100%',
        duration: 15,
        ease: 'none',
      })
      .to([sunRef.current, sunGlowRef.current], {
        y: '-100%',
        duration: 0.1,
        immediateRender: false,
      });

    // 4. Zmiana koloru poświaty słońca
    gsap.to(sunGlowRef.current, {
      backgroundImage:
        'radial-gradient(circle, rgba(255,215,0,0.9) 0%, rgba(255,69,0,0.6) 60%, rgba(255,0,0,0) 100%)',
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Animacje dla efektu paralaksy przy przewijaniu
    gsap.to(curtainImageRef.current, {
      scrollTrigger: {
        trigger: curtainSectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
      y: 100,
      scale: 1.1,
    });

    gsap.to(blindImageRef.current, {
      scrollTrigger: {
        trigger: blindSectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
      y: 100,
      scale: 1.1,
    });
  }, []);

  // Funkcja obsługująca hover dla sekcji
  const handleSectionHover = (section: 'curtain' | 'blind') => {
    setActiveSection(section);

    if (section === 'curtain') {
      // Animacja obrazu - bardziej dynamiczna
      gsap.to(curtainImageRef.current, {
        scale: 1.08,
        filter: 'brightness(1.15) contrast(1.1)',
        duration: 1,
        ease: 'power2.out',
      });

      // Animacja tekstu - bardziej spektakularna
      gsap.to(curtainTextRef.current, {
        y: -20,
        scale: 1.05,
        textShadow:
          '0 10px 30px rgba(0,0,0,0.3), 0 0 100px rgba(255,255,255,0.2)',
        duration: 0.7,
        ease: 'back.out(1.5)',
      });

      // Efekt przechylenia kreski w stronę firan z dodatkowym "wybrzuszeniem"
      gsap.to(dividerRef.current, {
        rotation: -8,
        duration: 0.7,
        ease: 'elastic.out(1, 0.8)',
        scaleY: 1.05,
        boxShadow: '0 0 40px 15px rgba(212,175,55,0.7)',
      });

      // Animacja gwiazd na kresce - teraz bardziej spektakularna
      gsap.to('.divider-star-left', {
        scale: 1.8,
        opacity: 1,
        filter: 'brightness(1.8) drop-shadow(0 0 20px var(--royal-gold))',
        stagger: 0.1,
        duration: 0.4,
        ease: 'back.out(2)',
      });

      gsap.to('.divider-star-right', {
        scale: 0.5,
        opacity: 0.3,
        filter: 'brightness(0.6)',
        stagger: 0.1,
        duration: 0.4,
      });

      // Efekt dodatkowego światła od kreski
      gsap.to('.central-divider-additional', {
        opacity: 0.9,
        width: '10px',
        duration: 0.5,
      });

      // Efekt światła skierowanego w stronę firan - teraz bardziej spektakularny
      gsap.to([sunRef.current, sunGlowRef.current], {
        x: '-=100',
        scale: 1.8,
        filter: 'brightness(1.5) hue-rotate(-30deg)',
        boxShadow:
          '0 0 80px 40px rgba(255, 215, 0, 0.8), 0 0 120px 80px rgba(255, 165, 0, 0.4)',
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.to(sunTrailRef.current, {
        width: '350px',
        height: '70%',
        backgroundImage:
          'linear-gradient(to right, rgba(255,215,0,0.9), rgba(255,165,0,0.5), rgba(255,215,0,0))',
        duration: 0.7,
        ease: 'power2.out',
      });

      // Dodatkowy efekt gradientu po lewej stronie
      gsap.to('.left-side-gradient', {
        opacity: 0.8,
        duration: 0.5,
      });

      // Przyciemnienie prawej strony
      gsap.to(blindImageRef.current, {
        filter: 'brightness(0.7) saturate(0.8)',
        duration: 0.5,
      });
    } else if (section === 'blind') {
      // Animacja obrazu - bardziej dynamiczna
      gsap.to(blindImageRef.current, {
        scale: 1.08,
        filter: 'brightness(1.15) contrast(1.1)',
        duration: 1,
        ease: 'power2.out',
      });

      // Animacja tekstu - bardziej spektakularna
      gsap.to(blindTextRef.current, {
        y: -20,
        scale: 1.05,
        textShadow:
          '0 10px 30px rgba(0,0,0,0.3), 0 0 100px rgba(255,255,255,0.2)',
        duration: 0.7,
        ease: 'back.out(1.5)',
      });

      // Efekt przechylenia kreski w stronę rolet z dodatkowym "wybrzuszeniem"
      gsap.to(dividerRef.current, {
        rotation: 8,
        duration: 0.7,
        ease: 'elastic.out(1, 0.8)',
        scaleY: 1.05,
        boxShadow: '0 0 40px 15px rgba(212,175,55,0.7)',
      });

      // Animacja gwiazd na kresce - teraz bardziej spektakularna
      gsap.to('.divider-star-right', {
        scale: 1.8,
        opacity: 1,
        filter: 'brightness(1.8) drop-shadow(0 0 20px var(--royal-gold))',
        stagger: 0.1,
        duration: 0.4,
        ease: 'back.out(2)',
      });

      gsap.to('.divider-star-left', {
        scale: 0.5,
        opacity: 0.3,
        filter: 'brightness(0.6)',
        stagger: 0.1,
        duration: 0.4,
      });

      // Efekt dodatkowego światła od kreski
      gsap.to('.central-divider-additional', {
        opacity: 0.9,
        width: '10px',
        duration: 0.5,
      });

      // Efekt światła skierowanego w stronę rolet - teraz bardziej spektakularny
      gsap.to([sunRef.current, sunGlowRef.current], {
        x: '+=100',
        scale: 1.8,
        filter: 'brightness(1.5) hue-rotate(30deg)',
        boxShadow:
          '0 0 80px 40px rgba(255, 165, 0, 0.8), 0 0 120px 80px rgba(255, 140, 0, 0.4)',
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.to(sunTrailRef.current, {
        width: '350px',
        height: '70%',
        backgroundImage:
          'linear-gradient(to left, rgba(255,165,0,0.9), rgba(255,140,0,0.5), rgba(255,165,0,0))',
        duration: 0.7,
        ease: 'power2.out',
      });

      // Dodatkowy efekt gradientu po prawej stronie
      gsap.to('.right-side-gradient', {
        opacity: 0.8,
        duration: 0.5,
      });

      // Przyciemnienie lewej strony
      gsap.to(curtainImageRef.current, {
        filter: 'brightness(0.7) saturate(0.8)',
        duration: 0.5,
      });
    }
  };

  // Funkcja obsługująca wyjście z hovera
  const handleSectionLeave = (section: 'curtain' | 'blind') => {
    setActiveSection('none');

    if (section === 'curtain') {
      gsap.to(curtainImageRef.current, {
        scale: 1,
        filter: 'brightness(1) contrast(1) saturate(1)',
        duration: 1,
        ease: 'power2.out',
      });
      gsap.to(curtainTextRef.current, {
        y: 0,
        scale: 1,
        textShadow: '0 4px 10px rgba(0,0,0,0.1)',
        duration: 0.5,
        ease: 'power2.out',
      });
    } else if (section === 'blind') {
      gsap.to(blindImageRef.current, {
        scale: 1,
        filter: 'brightness(1) contrast(1) saturate(1)',
        duration: 1,
        ease: 'power2.out',
      });
      gsap.to(blindTextRef.current, {
        y: 0,
        scale: 1,
        textShadow: '0 4px 10px rgba(0,0,0,0.1)',
        duration: 0.5,
        ease: 'power2.out',
      });
    }

    // Przywrócenie gwiazd do normalnego stanu
    gsap.to('.divider-star', {
      scale: 1,
      opacity: 0.8,
      filter: 'brightness(1)',
      stagger: 0.1,
      duration: 0.3,
    });

    // Przywrócenie gradientów do normalnego stanu
    gsap.to('.left-side-gradient, .right-side-gradient', {
      opacity: 0,
      duration: 0.5,
    });

    // Przywrócenie dodatkowego światła od kreski
    gsap.to('.central-divider-additional', {
      opacity: 0.5,
      width: '1px',
      duration: 0.5,
    });

    // Przywrócenie kreski do normalnego stanu
    gsap.to(dividerRef.current, {
      rotation: 0,
      scaleY: 1,
      boxShadow: '0 0 30px 10px rgba(212,175,55,0.5)',
      duration: 0.7,
      ease: 'elastic.out(0.8, 0.5)',
    });

    // Przywrócenie słońca do normalnego stanu
    gsap.to([sunRef.current, sunGlowRef.current], {
      x: 0,
      scale: 1,
      filter: 'brightness(1) hue-rotate(0deg)',
      boxShadow:
        '0 0 60px 30px rgba(255, 215, 0, 0.6), 0 0 80px 50px rgba(255, 140, 0, 0.1)',
      duration: 0.8,
      ease: 'power2.out',
    });

    gsap.to(sunTrailRef.current, {
      width: '200px',
      height: '50%',
      backgroundImage:
        'linear-gradient(to right, rgba(255,215,0,0.4), rgba(255,215,0,0))',
      duration: 0.7,
      ease: 'power2.out',
    });
  };

  return (
    <main className='flex flex-col items-center justify-between'>
      {/* Górne menu nawigacyjne */}
      <nav
        ref={navigationRef}
        className='absolute top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center'
      >
        <div className='text-white text-2xl font-light tracking-widest'>
          <span className='text-[var(--gold)]'>Elegant</span> Curtains
        </div>

        <div className='flex space-x-10'>
          <Link
            href='/firany'
            className='text-white hover:text-[var(--gold)] transition-colors duration-300 text-lg font-light tracking-wider'
          >
            Firany
          </Link>
          <Link
            href='/rolety'
            className='text-white hover:text-[var(--gold)] transition-colors duration-300 text-lg font-light tracking-wider'
          >
            Rolety
          </Link>
          <Link
            href='/contact'
            className='text-white hover:text-[var(--gold)] transition-colors duration-300 text-lg font-light tracking-wider'
          >
            Kontakt
          </Link>
        </div>
      </nav>

      {/* Przycisk kontaktowy */}
      <div
        ref={contactButtonRef}
        className='absolute bottom-10 left-1/2 transform -translate-x-1/2 z-50'
      >
        <Link href='/contact' className='magic-button'>
          Umów Konsultację
        </Link>
      </div>

      <div
        ref={containerRef}
        className='min-h-screen w-full overflow-hidden flex'
      >
        {/* Sekcja Firany */}
        <section
          ref={curtainSectionRef}
          className='relative w-1/2 h-screen flex items-center justify-center overflow-hidden'
          onMouseEnter={() => handleSectionHover('curtain')}
          onMouseLeave={() => handleSectionLeave('curtain')}
        >
          {/* Obraz tła */}
          <div
            ref={curtainImageRef}
            className='absolute inset-0 w-full h-full z-0'
          >
            <Image
              src='/images/Firany.jpg'
              alt='Luksusowe firany'
              fill
              priority
              quality={100}
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                transformOrigin: 'center center',
                transition: 'filter 0.7s ease',
              }}
              className='w-full h-full'
            />

            {/* Gradient overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 transition-opacity duration-700 ${
                activeSection === 'curtain' ? 'opacity-50' : 'opacity-80'
              }`}
            />
          </div>

          {/* Tekst i przycisk */}
          <div
            ref={curtainTextRef}
            className='relative z-10 text-center p-12 max-w-xl'
          >
            <h2 className='text-6xl md:text-8xl mb-8 font-light tracking-widest text-white luxury-heading drop-shadow-lg'>
              Firany
            </h2>
            <p className='text-xl md:text-2xl mb-12 text-white font-light tracking-wide leading-relaxed drop-shadow-md max-w-md mx-auto'>
              Klasyczna elegancja i niepowtarzalny charakter. Odkryj tkaniny,
              które przemienią każde wnętrze w wyjątkową przestrzeń.
            </p>

            <Link href='/firany' className='magic-button'>
              ODKRYJ KOLEKCJĘ
            </Link>
          </div>
        </section>

        {/* Centralna kreska dzieląca sekcje */}
        <div className='relative h-screen z-40 flex justify-center items-center pointer-events-none'>
          {/* Efekty dodatkowe przy najechaniu - gradient boczny dla sekcji firan */}
          <div
            className='left-side-gradient absolute inset-0 w-1/3 right-auto opacity-0 pointer-events-none z-10'
            style={{
              background:
                'radial-gradient(ellipse at right, rgba(255,215,0,0.15), transparent 80%)',
            }}
          ></div>

          {/* Efekty dodatkowe przy najechaniu - gradient boczny dla sekcji rolet */}
          <div
            className='right-side-gradient absolute inset-0 w-1/3 left-auto right-0 opacity-0 pointer-events-none z-10'
            style={{
              background:
                'radial-gradient(ellipse at left, rgba(255,165,0,0.15), transparent 80%)',
            }}
          ></div>

          {/* Główna kreska dzieląca */}
          <div
            ref={dividerRef}
            className='w-[4px] h-0 bg-gradient-to-b from-[var(--gold)] via-[rgba(255,255,255,0.9)] to-[var(--gold)] rounded-full shadow-[0_0_30px_10px_rgba(212,175,55,0.5)] transition-all duration-500 gold-glow divine-divider'
            style={{ transformOrigin: 'center center' }}
          ></div>

          {/* Dodatkowe elementy kreski - oświetlenie boczne */}
          <div className='central-divider-additional absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.3)] to-transparent left-[-7px] opacity-50 transition-all duration-300'></div>
          <div className='central-divider-additional absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.3)] to-transparent right-[-7px] opacity-50 transition-all duration-300'></div>

          {/* Dodatkowe elementy kreski - małe koraliki */}
          <div className='absolute w-2 h-2 rounded-full bg-[var(--gold)] top-[25%] left-1/2 transform -translate-x-1/2 shadow-[0_0_10px_5px_rgba(255,215,0,0.5)]'></div>
          <div className='absolute w-3 h-3 rounded-full bg-[var(--gold)] top-[50%] left-1/2 transform -translate-x-1/2 shadow-[0_0_15px_5px_rgba(255,215,0,0.6)]'></div>
          <div className='absolute w-2 h-2 rounded-full bg-[var(--gold)] top-[75%] left-1/2 transform -translate-x-1/2 shadow-[0_0_10px_5px_rgba(255,215,0,0.5)]'></div>

          {/* Gwiazdy na kresce */}
          <div
            ref={dividerStarsRef}
            className='absolute h-full w-40 pointer-events-none'
          >
            {/* Gwiazdy po lewej stronie */}
            <div className='divider-star divider-star-left absolute w-8 h-8 left-0 top-1/4 transform -translate-x-full'>
              <div
                className='absolute inset-0 rotate-45 bg-[var(--royal-gold)] rounded opacity-80'
                style={{ boxShadow: '0 0 15px 5px var(--royal-gold)' }}
              ></div>
              <div
                className='absolute inset-0 -rotate-45 bg-[var(--royal-gold)] rounded opacity-80'
                style={{ boxShadow: '0 0 15px 5px var(--royal-gold)' }}
              ></div>
            </div>

            <div className='divider-star divider-star-left absolute w-5 h-5 left-0 top-2/3 transform -translate-x-full translate-x-3'>
              <div
                className='absolute inset-0 rotate-45 bg-[var(--royal-gold)] rounded opacity-80'
                style={{ boxShadow: '0 0 15px 5px var(--royal-gold)' }}
              ></div>
              <div
                className='absolute inset-0 -rotate-45 bg-[var(--royal-gold)] rounded opacity-80'
                style={{ boxShadow: '0 0 15px 5px var(--royal-gold)' }}
              ></div>
            </div>

            <div className='divider-star divider-star-left absolute w-4 h-4 left-0 top-[15%] transform -translate-x-full translate-x-6'>
              <div
                className='absolute inset-0 rotate-45 bg-[var(--royal-gold)] rounded opacity-80'
                style={{ boxShadow: '0 0 15px 5px var(--royal-gold)' }}
              ></div>
              <div
                className='absolute inset-0 -rotate-45 bg-[var(--royal-gold)] rounded opacity-80'
                style={{ boxShadow: '0 0 15px 5px var(--royal-gold)' }}
              ></div>
            </div>

            {/* Gwiazdy po prawej stronie */}
            <div className='divider-star divider-star-right absolute w-8 h-8 right-0 top-1/3 transform translate-x-full'>
              <div
                className='absolute inset-0 rotate-45 bg-[var(--royal-gold)] rounded opacity-80'
                style={{ boxShadow: '0 0 15px 5px var(--royal-gold)' }}
              ></div>
              <div
                className='absolute inset-0 -rotate-45 bg-[var(--royal-gold)] rounded opacity-80'
                style={{ boxShadow: '0 0 15px 5px var(--royal-gold)' }}
              ></div>
            </div>

            <div className='divider-star divider-star-right absolute w-5 h-5 right-0 top-3/4 transform translate-x-full translate-x-[-3px]'>
              <div
                className='absolute inset-0 rotate-45 bg-[var(--royal-gold)] rounded opacity-80'
                style={{ boxShadow: '0 0 15px 5px var(--royal-gold)' }}
              ></div>
              <div
                className='absolute inset-0 -rotate-45 bg-[var(--royal-gold)] rounded opacity-80'
                style={{ boxShadow: '0 0 15px 5px var(--royal-gold)' }}
              ></div>
            </div>

            <div className='divider-star divider-star-right absolute w-4 h-4 right-0 top-[15%] transform translate-x-full translate-x-[-6px]'>
              <div
                className='absolute inset-0 rotate-45 bg-[var(--royal-gold)] rounded opacity-80'
                style={{ boxShadow: '0 0 15px 5px var(--royal-gold)' }}
              ></div>
              <div
                className='absolute inset-0 -rotate-45 bg-[var(--royal-gold)] rounded opacity-80'
                style={{ boxShadow: '0 0 15px 5px var(--royal-gold)' }}
              ></div>
            </div>
          </div>

          {/* Ślad słońca */}
          <div
            ref={sunTrailRef}
            className='absolute h-1/2 w-[200px] bg-gradient-to-right from-[rgba(255,215,0,0.6)] to-transparent pointer-events-none sun-trail'
            style={{
              filter: 'blur(12px)',
              transform: 'translateX(-50%)',
            }}
          ></div>

          {/* Poświata słońca */}
          <div
            ref={sunGlowRef}
            className='absolute w-32 h-32 rounded-full z-20 pointer-events-none sun-glow'
            style={{
              background:
                'radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,165,0,0.5) 60%, rgba(255,140,0,0) 100%)',
              boxShadow: '0 0 80px 40px rgba(255,215,0,0.4)',
              filter: 'blur(6px)',
              transformOrigin: 'center center',
            }}
          ></div>

          {/* Element "słońca" poruszający się wzdłuż kreski */}
          <div
            ref={sunRef}
            className='absolute w-24 h-24 rounded-full z-30 pointer-events-none sun-effect'
            style={{
              background:
                'radial-gradient(circle, rgba(255,215,0,1) 0%, rgba(255,165,0,0.8) 70%, rgba(255,140,0,0.3) 100%)',
              boxShadow:
                '0 0 60px 30px rgba(255,215,0,0.6), inset 0 0 20px 8px rgba(255,255,255,0.8)',
              transformOrigin: 'center center',
            }}
          ></div>
        </div>

        {/* Sekcja Rolety */}
        <section
          ref={blindSectionRef}
          className='relative w-1/2 h-screen flex items-center justify-center overflow-hidden'
          onMouseEnter={() => handleSectionHover('blind')}
          onMouseLeave={() => handleSectionLeave('blind')}
        >
          {/* Obraz tła */}
          <div
            ref={blindImageRef}
            className='absolute inset-0 w-full h-full z-0'
          >
            <Image
              src='/images/Rolety.jpg'
              alt='Nowoczesne rolety'
              fill
              priority
              quality={100}
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                transformOrigin: 'center center',
                transition: 'filter 0.7s ease',
              }}
              className='w-full h-full'
            />

            {/* Gradient overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/70 transition-opacity duration-700 ${
                activeSection === 'blind' ? 'opacity-50' : 'opacity-80'
              }`}
            />
          </div>

          {/* Tekst i przycisk */}
          <div
            ref={blindTextRef}
            className='relative z-10 text-center p-12 max-w-xl'
          >
            <h2 className='text-6xl md:text-8xl mb-8 font-light tracking-widest text-white luxury-heading drop-shadow-lg'>
              Rolety
            </h2>
            <p className='text-xl md:text-2xl mb-12 text-white font-light tracking-wide leading-relaxed drop-shadow-md max-w-md mx-auto'>
              Minimalistyczny design, maksymalna funkcjonalność. Nowoczesne
              rozwiązania zaprojektowane z myślą o elegancji i wygodzie.
            </p>

            <Link href='/rolety' className='magic-button'>
              POZNAJ OFERTĘ
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
