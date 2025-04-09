import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface KeyFactor {
  icon: string;
  title: string;
  description: string;
}

interface KeyFactorsSectionProps {
  title: string;
  subtitle: string;
  description: string;
  factors: KeyFactor[];
  imageSrc: string;
  imageAlt: string;
  experienceBadgeText?: string;
  experienceBadgeYears?: string;
  experienceBadgeIcon?: string;
  backgroundImage?: string;
  flowerImages?: string[];
}

const KeyFactorsSectionReusable: React.FC<KeyFactorsSectionProps> = ({
  title,
  subtitle,
  description,
  factors,
  imageSrc,
  imageAlt,
  experienceBadgeText = 'Lat doświadczenia',
  experienceBadgeYears = '15+',
  experienceBadgeIcon = '/images/icons/star-icon.png',
  backgroundImage = '/images/background/light-pattern.jpg',
  flowerImages = [
    '/images/flowers/flower-1.png',
    '/images/flowers/flower-2.png',
    '/images/flowers/flower-3.png',
  ],
}) => {
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

    // Animacja opisu
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

    // Animacja czynników
    factorRefs.current.forEach((factor, index) => {
      if (!factor) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: factor,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        factor,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.1 * index,
          ease: 'power2.out',
        },
      );

      // Ikona
      tl.fromTo(
        factor.querySelector('.factor-icon'),
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
        },
        '-=0.4',
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className='key-factors-section relative overflow-hidden py-20'
    >
      {/* Tło */}
      <div
        ref={backgroundRef}
        className='absolute inset-0 z-0'
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Unoszące się kwiaty */}
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={`flower-${index}`}
          ref={(el) => {
            floatingFlowersRef.current[index] = el;
          }}
          className='absolute z-0'
          style={{
            pointerEvents: 'none',
          }}
        >
          <Image
            src={flowerImages[index % flowerImages.length]}
            alt=''
            width={100}
            height={100}
            className='opacity-20'
          />
        </div>
      ))}

      <div className='container mx-auto px-4 relative z-10'>
        {/* Nagłówek sekcji */}
        <div ref={titleRef} className='mb-12 text-center'>
          <p className='text-[var(--primary-color)] uppercase tracking-widest mb-2 font-light'>
            {subtitle}
          </p>
          <div className='flex justify-center items-center mb-4'>
            <div className='shape h-[1px] w-[70px] bg-[var(--primary-color)] opacity-60'></div>
          </div>
          <h2 className='text-3xl md:text-4xl font-light text-gray-800 max-w-2xl mx-auto leading-tight'>
            {title}
          </h2>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          {/* Kolumna ze zdjęciem */}
          <div className='relative' ref={imageBoxRef}>
            <div className='relative rounded-lg overflow-hidden shadow-xl'>
              <div ref={imageMaskRef} className='relative z-10'>
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  width={600}
                  height={700}
                  className='w-full h-auto object-cover'
                />
              </div>

              {/* Wzory na rogach */}
              <div
                ref={(el) => {
                  patternRefs.current[0] = el;
                }}
                className='absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[var(--primary-color)] z-20'
              ></div>
              <div
                ref={(el) => {
                  patternRefs.current[1] = el;
                }}
                className='absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[var(--primary-color)] z-20'
              ></div>
              <div
                ref={(el) => {
                  patternRefs.current[2] = el;
                }}
                className='absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[var(--primary-color)] z-20'
              ></div>
              <div
                ref={(el) => {
                  patternRefs.current[3] = el;
                }}
                className='absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[var(--primary-color)] z-20'
              ></div>
            </div>

            {/* Odznaka z doświadczeniem */}
            <div
              ref={experienceBadgeRef}
              className='absolute -right-6 bottom-16 w-28 h-28 rounded-full bg-white shadow-lg flex flex-col items-center justify-center transform rotate-12 z-30'
            >
              <div className='w-6 h-6 mb-1'>
                <Image
                  src={experienceBadgeIcon}
                  alt='Doświadczenie'
                  width={24}
                  height={24}
                />
              </div>
              <div className='text-3xl font-bold text-[var(--primary-color)]'>
                {experienceBadgeYears}
              </div>
              <div className='text-xs text-gray-600 text-center px-2'>
                {experienceBadgeText}
              </div>
            </div>
          </div>

          {/* Kolumna z treścią */}
          <div ref={contentRef} className='content-column'>
            <div className='text mb-8'>
              <p className='text-gray-600 leading-relaxed'>{description}</p>
            </div>

            {/* Czynniki */}
            <div className='space-y-6'>
              {factors.map((factor, index) => (
                <div
                  key={`factor-${index}`}
                  ref={(el) => {
                    factorRefs.current[index] = el;
                  }}
                  className='factor-item flex items-start bg-white bg-opacity-80 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300'
                >
                  <div className='factor-icon w-12 h-12 flex items-center justify-center rounded-full bg-[var(--primary-color)] bg-opacity-10 mr-4 flex-shrink-0'>
                    <Image
                      src={factor.icon}
                      alt={factor.title}
                      width={24}
                      height={24}
                      className='w-6 h-6 object-contain'
                    />
                  </div>
                  <div>
                    <h3 className='text-lg font-medium text-gray-800 mb-1'>
                      {factor.title}
                    </h3>
                    <p className='text-gray-600 text-sm'>
                      {factor.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .key-factors-section {
          background-color: #f9f7ff;
        }
      `}</style>
    </section>
  );
};

export default KeyFactorsSectionReusable;
