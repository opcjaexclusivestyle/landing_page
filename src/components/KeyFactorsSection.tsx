import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const KeyFactorsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageBoxRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const factorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const patternRefs = useRef<(HTMLDivElement | null)[]>([]);
  const experienceBadgeRef = useRef<HTMLDivElement>(null);
  const floatingFlowersRef = useRef<(HTMLDivElement | null)[]>([]);
  const imageMaskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animacja tła
    gsap.fromTo(
      backgroundRef.current,
      { opacity: 0, scale: 1.1 },
      {
        opacity: 0.18,
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

    // Animacja maski zdjęcia
    if (imageMaskRef.current) {
      gsap.fromTo(
        imageMaskRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          delay: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: imageBoxRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    }

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
        opacity: 0.15 + Math.random() * 0.1,
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

    // Animacja tytułu - bardziej złożona
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
          onComplete: () => {
            if (titleRef.current?.querySelector('h2')) {
              gsap.to(titleRef.current?.querySelector('h2'), {
                textShadow:
                  '0 0 10px rgba(131, 104, 209, 0.3), 0 0 20px rgba(131, 104, 209, 0.1)',
                repeat: 1,
                yoyo: true,
                duration: 1.5,
              });
            }
          },
        },
        '-=0.5',
      );

    // Animacja wzorów na ramce zdjęcia
    patternRefs.current.forEach((pattern, index) => {
      if (!pattern) return;

      gsap.fromTo(
        pattern,
        {
          scale: 0,
          opacity: 0,
          rotation: -90,
        },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.6,
          delay: 0.1 * index,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: imageBoxRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    });

    // Animacja odznaki doświadczenia
    gsap.fromTo(
      experienceBadgeRef.current,
      {
        scale: 0,
        opacity: 0,
        rotation: -45,
      },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 1,
        delay: 0.6,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: imageBoxRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      },
    );

    // Animacja zawartości z większym rozdzieleniem elementów
    if (contentRef.current?.querySelector('.text')) {
      gsap.fromTo(
        contentRef.current.querySelector('.text'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    }

    // Animacja zdjęcia - bardziej złożona
    const imageTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: imageBoxRef.current,
        start: 'top 70%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });

    if (
      imageBoxRef.current?.querySelector('.frame-border') &&
      imageBoxRef.current?.querySelector('.inner-frame')
    ) {
      imageTimeline
        .fromTo(
          imageBoxRef.current.querySelector('.frame-border'),
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' },
        )
        .fromTo(
          imageBoxRef.current.querySelector('.inner-frame'),
          { x: -80, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
          '-=0.5',
        );
    }

    // Animacja elementów z efektem kaskadowym
    factorRefs.current.forEach((factor, index) => {
      if (!factor) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: factor,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        factor,
        {
          y: 50,
          opacity: 0,
          rotationY: -15,
          transformOrigin: 'left center',
        },
        {
          y: 0,
          opacity: 1,
          rotationY: 0,
          duration: 0.7,
          delay: 0.15 * index,
          ease: 'power3.out',
        },
      );

      // Animacja ikony po pojawieniu się faktora
      tl.fromTo(
        factor.querySelector('.factor-icon'),
        {
          scale: 0.5,
          opacity: 0,
          y: 20,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'back.out(1.7)',
        },
        '-=0.3',
      );

      // Efekt hover dla ikon - bardziej złożony
      const icon = factor.querySelector('.factor-icon');
      const title = factor.querySelector('.factor-title');
      const description = factor.querySelector('.factor-description');
      const innerBox = factor.querySelector('.inner-box');

      factor.addEventListener('mouseenter', () => {
        gsap.to(icon, {
          y: -15,
          scale: 1.15,
          filter: 'drop-shadow(0 15px 15px rgba(0, 0, 0, 0.15))',
          duration: 0.4,
          ease: 'back.out(1.7)',
        });

        gsap.to(title, {
          color: '#8368d1',
          scale: 1.05,
          duration: 0.3,
          transformOrigin: 'left center',
          ease: 'power2.out',
        });

        gsap.to(description, {
          opacity: 0.9,
          x: 5,
          duration: 0.3,
          ease: 'power2.out',
        });

        gsap.to(innerBox, {
          boxShadow: '0 10px 30px rgba(131, 104, 209, 0.15)',
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
          scale: 1.03,
          duration: 0.4,
          ease: 'power2.out',
        });
      });

      factor.addEventListener('mouseleave', () => {
        gsap.to(icon, {
          y: 0,
          scale: 1,
          filter: 'none',
          duration: 0.4,
          ease: 'power2.out',
        });

        gsap.to(title, {
          color: 'var(--deep-navy)',
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });

        gsap.to(description, {
          opacity: 0.7,
          x: 0,
          duration: 0.3,
          ease: 'power2.out',
        });

        gsap.to(innerBox, {
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
          background: 'rgba(255,255,255,0.7)',
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      });
    });

    // Parallax effect dla obrazka przy przewijaniu
    if (imageBoxRef.current?.querySelector('.featured-image')) {
      gsap.to(imageBoxRef.current.querySelector('.featured-image'), {
        y: -30,
        scale: 1.05,
        scrollTrigger: {
          trigger: imageBoxRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Usunięcie event listenerów
      factorRefs.current.forEach((factor) => {
        if (!factor) return;
        factor.removeEventListener('mouseenter', () => {});
        factor.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  // Dane o kluczowych atutach
  const factorsData = [
    {
      id: 'french',
      title: 'Francuskie wzory',
      description: 'Eleganckie rozwiązania inspirowane stylem paryskim',
      icon: '/images/genre/french.png',
    },
    {
      id: 'italian',
      title: 'Włoskie motywy',
      description: 'Wyrafinowane detale i wyjątkowa estetyka',
      icon: '/images/genre/italian.jpg.png',
    },
    {
      id: 'luxury',
      title: 'Luksusowe materiały',
      description: 'Tkaniny najwyższej jakości dla wymagających klientów',
      icon: '/images/genre/luxury.png',
    },
    {
      id: 'modern',
      title: 'Nowoczesny design',
      description: 'Minimalistyczne wzornictwo dla współczesnych wnętrz',
      icon: '/images/genre/modern.png',
    },
    {
      id: 'layered',
      title: 'Warstwowe kompozycje',
      description: 'Wielowymiarowe aranżacje o bogatej teksturze',
      icon: '/images/genre/layered.png',
    },
    {
      id: 'scalopowe',
      title: 'Wzory muszlowe',
      description: 'Fantazyjne kształty inspirowane naturą',
      icon: '/images/genre/scalopowe.png',
    },
  ];

  return (
    <section
      className='key-factors-section py-24 relative overflow-hidden'
      ref={sectionRef}
    >
      {/* Tło kwiatowe główne */}
      <div
        ref={backgroundRef}
        className='absolute inset-0 opacity-0 z-0'
        style={{
          backgroundImage:
            'url(/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_d4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_0-removebg-preview.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(3px) brightness(1.2)',
        }}
      ></div>

      {/* Unoszące się kwiaty dekoracyjne */}
      <div className='floating-flowers-container absolute inset-0 overflow-hidden pointer-events-none z-[1]'>
        {[...Array(8)].map((_, i) => (
          <div
            key={`flower-${i}`}
            ref={(el) => {
              if (el) floatingFlowersRef.current[i] = el;
            }}
            className='floating-flower absolute'
          >
            <Image
              src={`/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_d4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_${
                i % 3
              }-removebg-preview.png`}
              width={100}
              height={100}
              alt=''
              style={{ opacity: 0.2 }}
            />
          </div>
        ))}
      </div>

      <div className='auto-container relative z-10'>
        <div className='sec-title text-center' ref={titleRef}>
          <p className='tracking-wider'>Co nas wyróżnia</p>
          <div className='shape mx-auto'></div>
          <h2 className='font-serif'>Nasze Kluczowe Atuty</h2>
        </div>

        <div className='row clearfix mt-14'>
          {/* Lewa kolumna ze zdjęciem */}
          <div className='col-lg-6 col-md-12 col-sm-12 image-column flex justify-center'>
            <div className='image-box relative mb-8' ref={imageBoxRef}>
              {/* Ozdobna maska wokół zdjęcia w stylu About */}
              <div className='image-mask-container' ref={imageMaskRef}>
                <div className='image-mask-top absolute -top-10 left-1/2 transform -translate-x-1/2 w-[110%] h-20 z-[1]'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='100%'
                    height='100%'
                    viewBox='0 0 200 40'
                    preserveAspectRatio='none'
                  >
                    <path
                      d='M0,40 L200,40 L200,20 C150,40 50,0 0,20 L0,40 Z'
                      fill='var(--gold)'
                      opacity='0.3'
                    />
                    <path
                      d='M0,40 L200,40 L200,25 C150,45 50,5 0,25 L0,40 Z'
                      fill='var(--gold)'
                      opacity='0.2'
                    />
                  </svg>
                </div>

                <div className='image-mask-right absolute top-1/2 -right-8 transform -translate-y-1/2 h-[110%] w-16 z-[1]'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='100%'
                    height='100%'
                    viewBox='0 0 30 200'
                    preserveAspectRatio='none'
                  >
                    <path
                      d='M0,0 L0,200 L15,200 C-5,150 35,50 15,0 L0,0 Z'
                      fill='var(--gold)'
                      opacity='0.3'
                    />
                    <path
                      d='M0,0 L0,200 L10,200 C-10,150 30,50 10,0 L0,0 Z'
                      fill='var(--gold)'
                      opacity='0.2'
                    />
                  </svg>
                </div>

                <div className='image-mask-bottom absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-[110%] h-20 z-[1]'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='100%'
                    height='100%'
                    viewBox='0 0 200 40'
                    preserveAspectRatio='none'
                  >
                    <path
                      d='M0,0 L200,0 L200,20 C150,0 50,40 0,20 L0,0 Z'
                      fill='var(--gold)'
                      opacity='0.3'
                    />
                    <path
                      d='M0,0 L200,0 L200,15 C150,-5 50,35 0,15 L0,0 Z'
                      fill='var(--gold)'
                      opacity='0.2'
                    />
                  </svg>
                </div>

                <div className='image-mask-left absolute top-1/2 -left-8 transform -translate-y-1/2 h-[110%] w-16 z-[1]'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='100%'
                    height='100%'
                    viewBox='0 0 30 200'
                    preserveAspectRatio='none'
                  >
                    <path
                      d='M30,0 L30,200 L15,200 C35,150 -5,50 15,0 L30,0 Z'
                      fill='var(--gold)'
                      opacity='0.3'
                    />
                    <path
                      d='M30,0 L30,200 L20,200 C40,150 0,50 20,0 L30,0 Z'
                      fill='var(--gold)'
                      opacity='0.2'
                    />
                  </svg>
                </div>

                {/* Ozdobne narożniki */}
                <div className='absolute -top-12 -left-12 w-28 h-28 z-[2]'>
                  <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M100,0 L100,40 C100,40 60,40 40,40 C20,40 0,60 0,100 L0,100 L0,0 L100,0 Z'
                      fill='var(--gold)'
                      opacity='0.25'
                    />
                    <path
                      d='M0,0 L100,0 L100,10 L10,10 L10,100 L0,100 L0,0 Z'
                      fill='var(--gold)'
                      opacity='0.5'
                    />
                  </svg>
                </div>

                <div className='absolute -top-12 -right-12 w-28 h-28 z-[2]'>
                  <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M0,0 L0,40 C0,40 40,40 60,40 C80,40 100,60 100,100 L100,100 L100,0 L0,0 Z'
                      fill='var(--gold)'
                      opacity='0.25'
                    />
                    <path
                      d='M100,0 L0,0 L0,10 L90,10 L90,100 L100,100 L100,0 Z'
                      fill='var(--gold)'
                      opacity='0.5'
                    />
                  </svg>
                </div>

                <div className='absolute -bottom-12 -left-12 w-28 h-28 z-[2]'>
                  <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M100,100 L100,60 C100,60 60,60 40,60 C20,60 0,40 0,0 L0,0 L0,100 L100,100 Z'
                      fill='var(--gold)'
                      opacity='0.25'
                    />
                    <path
                      d='M0,100 L100,100 L100,90 L10,90 L10,0 L0,0 L0,100 Z'
                      fill='var(--gold)'
                      opacity='0.5'
                    />
                  </svg>
                </div>

                <div className='absolute -bottom-12 -right-12 w-28 h-28 z-[2]'>
                  <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M0,100 L0,60 C0,60 40,60 60,60 C80,60 100,40 100,0 L100,0 L100,100 L0,100 Z'
                      fill='var(--gold)'
                      opacity='0.25'
                    />
                    <path
                      d='M100,100 L0,100 L0,90 L90,90 L90,0 L100,0 L100,100 Z'
                      fill='var(--gold)'
                      opacity='0.5'
                    />
                  </svg>
                </div>
              </div>

              <div className='frame-box'>
                <div className='frame-border'></div>
                <div className='inner-frame'>
                  <Image
                    src='/images/kitchen.jpg'
                    alt='Unikalne wzory zasłon'
                    width={550}
                    height={700}
                    className='featured-image'
                  />
                </div>

                <div
                  ref={(el) => {
                    if (el) patternRefs.current[0] = el;
                  }}
                  className='frame-pattern pattern-1'
                ></div>
                <div
                  ref={(el) => {
                    if (el) patternRefs.current[1] = el;
                  }}
                  className='frame-pattern pattern-2'
                ></div>
                <div
                  ref={(el) => {
                    if (el) patternRefs.current[2] = el;
                  }}
                  className='frame-pattern pattern-3'
                ></div>
                <div
                  ref={(el) => {
                    if (el) patternRefs.current[3] = el;
                  }}
                  className='frame-pattern pattern-4'
                ></div>
              </div>

              <div className='experience-badge' ref={experienceBadgeRef}>
                <div className='inner'>
                  <h2>
                    15<span className='plus-sign'>+</span>
                  </h2>
                  <p>
                    Lat
                    <br />
                    Doświadczenia
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Prawa kolumna z atutami */}
          <div className='col-lg-6 col-md-12 col-sm-12 content-column'>
            <div className='content-box ps-lg-4 pr-lg-2' ref={contentRef}>
              <div className='text mb-6'>
                <p className='text-lg leading-relaxed'>
                  Nasza firma specjalizuje się w dostarczaniu wysokiej jakości
                  zasłon i rolet, które łączą w sobie innowacyjny design,
                  najlepsze materiały i profesjonalną obsługę klienta.
                </p>
              </div>

              <div className='row factors-row'>
                {factorsData.map((factor, index) => (
                  <div
                    key={factor.id}
                    className='col-md-6 factor-block'
                    ref={(el) => {
                      factorRefs.current[index] = el;
                    }}
                  >
                    <div className='inner-box'>
                      <div className='factor-icon'>
                        <Image
                          src={factor.icon}
                          alt={factor.title}
                          width={80}
                          height={80}
                          className='icon-image'
                        />
                      </div>
                      <h4 className='factor-title'>{factor.title}</h4>
                      <p className='factor-description'>{factor.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Styl sekcji */
        .key-factors-section {
          position: relative;
          background-color: rgba(255, 255, 255, 0.8);
          overflow: hidden;
          perspective: 1000px;
        }

        .auto-container {
          position: static;
          max-width: 1200px;
          padding: 0px 15px;
          margin: 0 auto;
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          margin-right: -15px;
          margin-left: -15px;
        }

        .clearfix::after {
          display: block;
          clear: both;
          content: '';
        }

        /* Tytuł sekcji */
        .sec-title {
          margin-bottom: 40px;
          transform-style: preserve-3d;
        }

        .sec-title p {
          position: relative;
          display: block;
          font-size: 18px;
          line-height: 26px;
          color: #8368d1;
          font-weight: 500;
          margin-bottom: 12px;
          letter-spacing: 1px;
        }

        .sec-title .shape {
          position: relative;
          display: block;
          width: 70px;
          height: 3px;
          background: linear-gradient(90deg, #dddddd, #8368d1, #dddddd);
          margin-bottom: 15px;
          border-radius: 1.5px;
        }

        .sec-title h2 {
          position: relative;
          display: block;
          font-size: 42px;
          line-height: 1.2;
          color: var(--deep-navy);
          font-weight: 700;
          transform: translateZ(20px);
          letter-spacing: 1px;
        }

        .mx-auto {
          margin-left: auto;
          margin-right: auto;
        }

        /* Kolumny */
        .content-column,
        .image-column {
          position: relative;
          min-height: 1px;
          padding-right: 15px;
          padding-left: 15px;
        }

        .col-lg-6 {
          flex: 0 0 50%;
          max-width: 50%;
        }

        .col-md-6 {
          flex: 0 0 50%;
          max-width: 50%;
        }

        @media (max-width: 991px) {
          .col-md-12 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }

        @media (max-width: 767px) {
          .col-sm-12 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }

        /* Ramka zdjęcia */
        .image-box {
          position: relative;
          margin-right: 20px;
          padding-top: 20px;
          padding-right: 20px;
          transform-style: preserve-3d;
          margin-top: 40px;
        }

        .frame-box {
          position: relative;
          overflow: hidden;
          transform-style: preserve-3d;
        }

        .frame-border {
          position: absolute;
          top: 20px;
          right: 20px;
          bottom: -20px;
          left: -20px;
          border: 3px solid var(--gold);
          z-index: 1;
          transform: translateZ(5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .inner-frame {
          position: relative;
          z-index: 2;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          transform: translateZ(10px);
        }

        .featured-image {
          width: 100%;
          height: auto;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .frame-box:hover .featured-image {
          transform: scale(1.08);
        }

        .frame-pattern {
          position: absolute;
          background: var(--gold);
          z-index: 3;
          transform: translateZ(15px);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        }

        .pattern-1 {
          top: -10px;
          left: -10px;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          transform-origin: center center;
        }

        .pattern-2 {
          bottom: -30px;
          left: 20%;
          width: 25px;
          height: 25px;
          border-radius: 5px;
          transform: translateZ(15px) rotate(45deg);
          transform-origin: center center;
        }

        .pattern-3 {
          top: 10%;
          right: -15px;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          transform-origin: center center;
        }

        .pattern-4 {
          bottom: 30%;
          right: -10px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          transform-origin: center center;
        }

        /* Odznaka doświadczenia */
        .experience-badge {
          position: absolute;
          right: 30px;
          bottom: 30px;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gold), var(--royal-gold));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 4;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2),
            inset 0 2px 10px rgba(255, 255, 255, 0.5);
          transform: translateZ(25px);
        }

        .experience-badge .inner {
          text-align: center;
        }

        .experience-badge h2 {
          font-size: 42px;
          line-height: 1;
          margin: 0;
          font-weight: 700;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .plus-sign {
          font-size: 28px;
          margin-left: 2px;
          margin-top: -15px;
        }

        .experience-badge p {
          font-size: 15px;
          line-height: 1.2;
          margin: 5px 0 0;
          letter-spacing: 0.5px;
        }

        /* Bloki atutów */
        .factors-row {
          margin-top: 30px;
        }

        .factor-block {
          margin-bottom: 30px;
          transition: all 0.4s ease;
        }

        .factor-block .inner-box {
          padding: 22px 18px;
          transition: all 0.4s ease;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .factor-icon {
          position: relative;
          display: inline-block;
          margin-bottom: 15px;
          transition: all 0.4s ease;
          transform-origin: center bottom;
        }

        .icon-image {
          height: auto;
          transition: all 0.4s ease;
          filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.1));
        }

        .factor-title {
          font-size: 22px;
          line-height: 1.3;
          color: var(--deep-navy);
          margin-bottom: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .factor-description {
          font-size: 15px;
          line-height: 1.6;
          color: var(--dark-grey);
          margin-bottom: 0;
          opacity: 0.7;
          transition: all 0.3s ease;
        }

        .ps-lg-4 {
          padding-left: 1.5rem;
        }

        /* Unosząca się dekoracja kwiatowa */
        .floating-flower {
          pointer-events: none;
        }

        /* Animacja dekoracyjnych elementów */
        .image-mask-container {
          position: absolute;
          top: -20px;
          right: -20px;
          bottom: -20px;
          left: -20px;
          pointer-events: none;
          z-index: 5;
        }

        /* Responsywność */
        @media only screen and (max-width: 991px) {
          .image-box {
            margin-right: 0;
            margin-bottom: 40px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }

          .ps-lg-4 {
            padding-left: 0;
          }

          .sec-title h2 {
            font-size: 36px;
          }
        }

        @media only screen and (max-width: 767px) {
          .sec-title h2 {
            font-size: 30px;
            line-height: 1.3;
          }

          .factor-block {
            margin-bottom: 20px;
          }

          .factor-title {
            font-size: 20px;
          }

          .experience-badge {
            width: 110px;
            height: 110px;
          }

          .experience-badge h2 {
            font-size: 36px;
          }
        }
      `}</style>
    </section>
  );
};

export default KeyFactorsSection;
