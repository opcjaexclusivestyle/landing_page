import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TypesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const typeItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animacja tytułu i opisu
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
        titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      )
      .fromTo(
        descriptionRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.4',
      );

    // Animacja typów zasłon
    typeItemsRef.current.forEach((item, index) => {
      if (!item) return;

      const image = item.querySelector('.type-image');
      const caption = item.querySelector('.type-caption');

      gsap.fromTo(
        item,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.2 + index * 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      // Efekt hover
      item.addEventListener('mouseenter', () => {
        gsap.to(image, {
          scale: 1.05,
          duration: 0.3,
        });

        gsap.to(caption, {
          y: 0,
          opacity: 1,
          background: '#8368d1',
          duration: 0.3,
        });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(image, {
          scale: 1,
          duration: 0.3,
        });

        gsap.to(caption, {
          y: 0,
          opacity: 0.9,
          background: 'var(--deep-navy)',
          duration: 0.3,
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
    <section className='about-section types-section py-20' ref={sectionRef}>
      <div className='auto-container'>
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
                        transition: 'transform 0.3s ease',
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
                        transition: 'all 0.3s ease',
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
          background-color: #f9f9f9;
          overflow: hidden;
        }

        .types-section {
          background-color: var(--light-cream);
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
          border-radius: 5px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .type-image-figure {
          position: relative;
          margin: 0;
          overflow: hidden;
          border-radius: 5px;
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
        }
      `}</style>
    </section>
  );
};

export default TypesSection;
