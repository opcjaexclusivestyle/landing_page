import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TypesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const typeItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const flowerElements = useRef<(HTMLDivElement | null)[]>([]);
  const largeFlowerRef = useRef<HTMLDivElement>(null);
  const secondLargeFlowerRef = useRef<HTMLDivElement>(null);

  // Generowanie losowych pozycji dla kwiatów
  const generateRandomPositions = () => {
    return Array(15)
      .fill(null)
      .map(() => ({
        width: 70 + Math.random() * 120,
        height: 70 + Math.random() * 120,
        top: Math.random() * 100,
        left: Math.random() * 100,
        rotation: Math.random() * 360,
        scale: 0.7 + Math.random() * 0.6,
      }));
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Generowanie pozycji kwiatów
    const positions = generateRandomPositions();

    // Animacja dużego kwiatu w tle
    gsap.fromTo(
      largeFlowerRef.current,
      {
        opacity: 0,
        scale: 1.2,
        rotation: -10,
      },
      {
        opacity: 0.25,
        scale: 1,
        rotation: 0,
        duration: 1.5,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
        },
      },
    );

    // Animacja drugiego dużego kwiatu w tle
    gsap.fromTo(
      secondLargeFlowerRef.current,
      {
        opacity: 0,
        scale: 1.2,
        rotation: 10,
      },
      {
        opacity: 0.2,
        scale: 1,
        rotation: 0,
        duration: 1.5,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
        },
      },
    );

    // Animacja tła
    gsap.fromTo(
      backgroundRef.current,
      { opacity: 0, scale: 1.1 },
      {
        opacity: 0.95, // Zwiększona widoczność tła
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

    // Animacja kwiatów
    if (sectionRef.current && flowerElements.current.length > 0) {
      const flowers = flowerElements.current.filter(Boolean);

      flowers.forEach((flower, index) => {
        if (flower) {
          // Ustawianie początkowych pozycji
          gsap.set(flower, {
            width: positions[index].width,
            height: positions[index].height,
            top: `${positions[index].top}%`,
            left: `${positions[index].left}%`,
            opacity: 0,
            rotation: positions[index].rotation,
            scale: positions[index].scale,
            position: 'absolute',
            pointerEvents: 'none',
          });

          // Animacja wejścia
          gsap.to(flower, {
            opacity: index % 3 === 0 ? 0.3 : 0.2, // Zwiększona widoczność
            duration: 1,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          });

          // Delikatne unoszenie się
          gsap.to(flower, {
            y: '+=' + (Math.random() * 30 - 15),
            rotation: '+=' + (Math.random() * 15 - 7),
            duration: 8 + Math.random() * 10,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }
      });
    }

    // Animacja tytułu i opisu - bardziej złożona
    const contentTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });

    contentTimeline
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
      )
      .fromTo(
        descriptionRef.current?.querySelector('.text') || '',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.4',
      );

    // Animacja typów zasłon - bardziej efektowna
    typeItemsRef.current.forEach((item, index) => {
      if (!item) return;

      const image = item.querySelector('.type-image');
      const caption = item.querySelector('.type-caption');
      const container = item.querySelector('.type-image-figure');

      gsap.fromTo(
        item,
        { y: 70, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 0.2 + index * 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      // Efekt hover - bardziej wyraźny
      item.addEventListener('mouseenter', () => {
        gsap.to(image, {
          scale: 1.08,
          filter: 'brightness(1.15) contrast(1.05)',
          duration: 0.4,
          ease: 'power2.out',
        });

        gsap.to(container, {
          boxShadow: '0 15px 35px rgba(131, 104, 209, 0.4)',
          duration: 0.4,
        });

        gsap.to(caption, {
          y: 0,
          opacity: 1,
          background: '#8368d1',
          color: 'white',
          paddingTop: '15px',
          paddingBottom: '15px',
          duration: 0.4,
        });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(image, {
          scale: 1,
          filter: 'brightness(1) contrast(1)',
          duration: 0.4,
          ease: 'power2.out',
        });

        gsap.to(container, {
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          duration: 0.4,
        });

        gsap.to(caption, {
          y: 0,
          opacity: 0.9,
          background: 'var(--deep-navy)',
          color: 'white',
          paddingTop: '12px',
          paddingBottom: '12px',
          duration: 0.4,
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Usunięcie event listenerów
      typeItemsRef.current.forEach((item) => {
        if (!item) return;
        item.removeEventListener('mouseenter', () => {});
        item.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  // Dane typów zasłon
  const typesData = [
    {
      id: 'jedwabne',
      title: 'Jedwabne',
      description: 'Elegancja • Luksus • Blask',
      image: '/images/type/silk.jpg',
    },
    {
      id: 'gladkie',
      title: 'Gładkie',
      description: 'Minimalizm • Prostota • Nowoczesność',
      image: '/images/type/plain.jpg',
    },
    {
      id: 'kwiatowe',
      title: 'Kwiatowe',
      description: 'Natura • Wzór • Harmonia',
      image: '/images/type/floral.jpg',
    },
  ];

  return (
    <section
      className='about-section types-section py-20 relative'
      ref={sectionRef}
    >
      {/* Tło z gradientem */}
      <div
        ref={backgroundRef}
        className='absolute inset-0 z-0'
        style={{
          background:
            'linear-gradient(to right, rgba(249, 247, 242, 0.92), rgba(255, 255, 255, 0.85))',
          opacity: 0,
        }}
      ></div>

      {/* Duży kwiat tła */}
      <div
        ref={largeFlowerRef}
        className='absolute z-0 right-0 top-0 w-[45%] h-[45%]'
        style={{
          opacity: 0,
          transform: 'rotate(-10deg)',
        }}
      >
        <Image
          src='/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_49aa16d2-bca9-49f0-892e-c45372365ece_3-removebg-preview.png'
          alt=''
          fill
          style={{
            objectFit: 'contain',
            objectPosition: 'right top',
            filter: 'brightness(0.95) sepia(0.15) hue-rotate(210deg)',
          }}
        />
      </div>

      {/* Drugi duży kwiat tła */}
      <div
        ref={secondLargeFlowerRef}
        className='absolute z-0 left-0 bottom-0 w-[40%] h-[40%]'
        style={{
          opacity: 0,
          transform: 'rotate(10deg)',
        }}
      >
        <Image
          src='/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_d4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_3-removebg-preview.png'
          alt=''
          fill
          style={{
            objectFit: 'contain',
            objectPosition: 'left bottom',
            filter: 'brightness(0.95) sepia(0.15) hue-rotate(215deg)',
          }}
        />
      </div>

      {/* Dekoracyjne elementy kwiatowe - więcej kwiatów */}
      {Array(15)
        .fill(null)
        .map((_, i) => (
          <div
            key={`flower-${i}`}
            ref={(el) => {
              if (el) flowerElements.current[i] = el;
            }}
            className='absolute z-0'
          >
            <Image
              src={
                i % 3 === 0
                  ? '/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_d4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_0-removebg-preview.png'
                  : i % 3 === 1
                  ? '/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_49aa16d2-bca9-49f0-892e-c45372365ece_3-removebg-preview.png'
                  : '/images/background-flower/u8283414962_Detailed_blue_line_drawing_of_lily_flowers_on_whi_d4c0efab-3cd7-42e9-be57-ae5d5f0d8f2a_3-removebg-preview.png'
              }
              alt=''
              width={200}
              height={200}
              style={{
                objectFit: 'contain',
                opacity: 0,
                filter: 'brightness(0.95) sepia(0.15) hue-rotate(215deg)',
              }}
            />
          </div>
        ))}

      <div className='auto-container relative z-10'>
        <div className='row clearfix'>
          {/* Kolumna z opisem */}
          <div className='col-lg-3 col-md-12 col-sm-12 content-column'>
            <div className='content-box' ref={descriptionRef}>
              <div className='sec-title' ref={titleRef}>
                <p>Odkryj nasze kolekcje</p>
                <div className='shape'></div>
                <h2>Rodzaje Zasłon</h2>
              </div>
              <div className='text'>
                <p>Oferujemy zasłony dopasowane do różnych stylów wnętrz.</p>
              </div>
            </div>
          </div>

          {/* Kolumny z typami zasłon */}
          {typesData.map((type, index) => (
            <div
              key={type.id}
              className='col-lg-3 col-md-4 col-sm-12 type-column'
              ref={(el) => {
                typeItemsRef.current[index] = el;
              }}
            >
              <div className='type-box'>
                <div className='type-image-container'>
                  <figure className='type-image-figure'>
                    <Image
                      src={type.image}
                      alt={type.title}
                      width={300}
                      height={400}
                      className='type-image'
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '300px',
                        transformOrigin: 'center center',
                        transition: 'all 0.4s ease',
                        borderRadius: '8px',
                      }}
                    />
                    <div
                      className='type-caption'
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'var(--deep-navy)',
                        color: 'white',
                        padding: '12px',
                        opacity: 0.9,
                        transition: 'all 0.4s ease',
                        borderBottomLeftRadius: '8px',
                        borderBottomRightRadius: '8px',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '20px',
                          marginBottom: '5px',
                          fontWeight: '600',
                        }}
                      >
                        {type.title}
                      </h3>
                      <p style={{ fontSize: '14px', margin: 0 }}>
                        {type.description}
                      </p>
                    </div>
                  </figure>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        /* Styl sekcji podobny do About */
        .about-section {
          position: relative;
          padding: 90px 0;
          background-color: transparent;
          overflow: hidden;
        }

        .types-section {
          background-color: transparent; /* Zmienione na transparent, ponieważ używamy gradientu w tle */
        }

        .auto-container {
          position: static;
          max-width: 1200px;
          padding: 0px 15px;
          margin: 0 auto;
          backdrop-filter: blur(4px);
          border-radius: 15px;
          padding: 25px;
          background-color: rgba(255, 255, 255, 0.65);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
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

        .content-column,
        .type-column {
          position: relative;
          min-height: 1px;
          padding-right: 15px;
          padding-left: 15px;
        }

        .col-lg-3 {
          flex: 0 0 25%;
          max-width: 25%;
        }

        @media (max-width: 991px) {
          .col-md-12 {
            flex: 0 0 100%;
            max-width: 100%;
          }

          .col-md-4 {
            flex: 0 0 33.333333%;
            max-width: 33.333333%;
          }
        }

        @media (max-width: 767px) {
          .col-sm-12 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }

        /* Styl dla treści */
        .content-box {
          position: relative;
          margin-right: 20px;
        }

        .sec-title {
          margin-bottom: 22px;
        }

        .sec-title p {
          position: relative;
          display: block;
          font-size: 16px;
          line-height: 26px;
          color: #8368d1;
          font-weight: 500;
          margin-bottom: 10px;
        }

        .sec-title .shape {
          position: relative;
          display: block;
          width: 70px;
          height: 2px;
          background: #dddddd;
          margin-bottom: 10px;
        }

        .sec-title h2 {
          position: relative;
          display: block;
          font-size: 30px;
          line-height: 40px;
          color: var(--deep-navy);
          font-weight: 700;
        }

        .content-box .text {
          position: relative;
          margin-bottom: 30px;
        }

        .content-box .text p {
          font-size: 16px;
          line-height: 26px;
          margin-bottom: 15px;
          color: var(--dark-grey);
        }

        /* Styl dla typów zasłon */
        .type-box {
          position: relative;
          margin-bottom: 30px;
        }

        .type-image-container {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          transition: all 0.4s ease;
        }

        .type-image-figure {
          position: relative;
          margin: 0;
          overflow: hidden;
          border-radius: 8px;
        }

        @media only screen and (max-width: 991px) {
          .content-box {
            margin-right: 0;
            margin-bottom: 40px;
          }

          .type-box {
            max-width: 350px;
            margin: 0 auto 30px;
          }
        }

        @media only screen and (max-width: 767px) {
          .about-section {
            padding: 70px 0;
          }

          .sec-title h2 {
            font-size: 26px;
            line-height: 36px;
          }

          .auto-container {
            backdrop-filter: blur(3px);
            padding: 15px;
          }
        }
      `}</style>
    </section>
  );
};

export default TypesSection;
