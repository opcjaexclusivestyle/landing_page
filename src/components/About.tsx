import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageBoxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Zalety produktów
  const benefits = [
    'Produkt wyprodukowany w Polskiej szwalni',
    'PISEMNA GWARANCJA JAKOŚCI',
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animacja dla treści
    gsap.fromTo(
      contentRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      },
    );

    // Animacja dla obrazu
    gsap.fromTo(
      imageBoxRef.current,
      { x: 50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: imageBoxRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      },
    );

    // Animacja dla certyfikatu
    const certificateElement = document.querySelector('.certificate-badge');
    gsap.fromTo(
      certificateElement,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.7,
        delay: 0.5,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: imageBoxRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      },
    );

    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, []);

  return (
    <section className='about-section' ref={sectionRef}>
      <div className='bg-elements'></div>

      <div className='container'>
        <div className='row'>
          {/* Kolumna treści */}
          <div className='col-lg-6 col-md-12'>
            <div className='content-box' ref={contentRef}>
              <div className='title-area'>
                <p className='subtitle'>
                  Witamy w <span className='text-accent'>Zasłony i Rolety</span>
                </p>
                <div className='divider'></div>
                <h2>
                  Tworzymy Twoje Wnętrze{' '}
                  <span className='gradient-text'>Świeżym i Nowoczesnym</span>
                </h2>
              </div>

              <div className='description'>
                <p>
                  U nas znajdziesz szeroką gamę najwyższej jakości zasłon i
                  rolet dopasowanych do Twojego wnętrza. Nasze produkty łączą
                  elegancję z funkcjonalnością, zapewniając idealne rozwiązania
                  dekoracyjne.
                </p>
              </div>

              <div className='benefits-box'>
                <ul className='benefits-list'>
                  {benefits.map((benefit, index) => (
                    <li key={index}>
                      <span className='icon-check'></span>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <div className='oeko-info'>
                  <p>
                    Nasze materiały posiadają certyfikat OEKO-TEX, co gwarantuje
                    brak substancji szkodliwych mających wpływ na zdrowie.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolumna z obrazem */}
          <div className='col-lg-6 col-md-12'>
            <div className='image-wrapper' ref={imageBoxRef}>
              <div className='main-image'>
                <img
                  src='/images/about/about-1.jpg'
                  alt='O nas - Zasłony i Rolety'
                />
                <div className='image-overlay'></div>
              </div>

              <div className='certificate-badge'>
                <img
                  src='/images/certyfikat-jakosci.jpg'
                  alt='Pisemna gwarancja jakości'
                />
                <span>Gwarancja jakości</span>
              </div>

              <div className='decoration-element'></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Główne style sekcji */
        .about-section {
          position: relative;
          padding: 100px 0;
          background: linear-gradient(135deg, #f9f7ff 0%, #f4f9ff 100%);
          overflow: hidden;
        }

        /* Elementy tła */
        .bg-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('/images/sunlit.jpg') no-repeat center/cover;
          opacity: 0.05;
          filter: brightness(1.2);
          z-index: 0;
        }

        /* Układ strony */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 15px;
          position: relative;
          z-index: 1;
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -15px;
        }

        .col-lg-6 {
          flex: 0 0 50%;
          max-width: 50%;
          padding: 0 15px;
        }

        /* Blok treści */
        .content-box {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        /* Tytuł */
        .title-area {
          margin-bottom: 25px;
        }

        .subtitle {
          font-size: 18px;
          color: #8368d1;
          margin-bottom: 15px;
        }

        .highlight {
          position: relative;
          font-weight: 700;
        }

        .highlight::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 6px;
          background: rgba(131, 104, 209, 0.2);
          bottom: 0;
          left: 0;
          z-index: -1;
        }

        .text-accent {
          color: #555;
          font-weight: normal;
        }

        .divider {
          width: 70px;
          height: 3px;
          background: linear-gradient(90deg, #8368d1, #a893e9);
          margin-bottom: 18px;
          border-radius: 2px;
        }

        .title-area h2 {
          font-size: 36px;
          line-height: 1.3;
          color: #222;
          font-weight: 700;
          margin: 0;
        }

        .gradient-text {
          background: linear-gradient(90deg, #8368d1, #a893e9);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Opis */
        .description {
          margin-bottom: 30px;
        }

        .description p {
          font-size: 17px;
          line-height: 1.7;
          color: #555;
          border-left: 2px solid rgba(131, 104, 209, 0.3);
          padding: 5px 0 5px 20px;
        }

        /* Lista korzyści */
        .benefits-box {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          padding: 30px;
          flex-grow: 1;
          margin-top: auto;
        }

        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0 0 25px 0;
        }

        .benefits-list li {
          display: flex;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(215, 212, 230, 0.5);
          font-size: 16px;
          color: #333;
          font-weight: 500;
          transition: transform 0.3s;
        }

        .benefits-list li:last-child {
          border-bottom: none;
        }

        .benefits-list li:hover {
          transform: translateX(5px);
          color: #8368d1;
        }

        .icon-check {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: rgba(131, 104, 209, 0.1);
          border-radius: 50%;
          margin-right: 15px;
          position: relative;
        }

        .icon-check::before {
          content: '';
          width: 10px;
          height: 5px;
          border-left: 2px solid #8368d1;
          border-bottom: 2px solid #8368d1;
          transform: rotate(-45deg);
          position: relative;
          top: -1px;
        }

        .oeko-info {
          padding: 15px;
          background: rgba(131, 104, 209, 0.05);
          border-left: 3px solid #8368d1;
          border-radius: 5px;
        }

        .oeko-info p {
          font-size: 14px;
          line-height: 1.6;
          color: #555;
          margin: 0;
        }

        /* Blok obrazu */
        .image-wrapper {
          position: relative;
          height: 100%;
          padding-top: 20px;
          display: flex;
          justify-content: center;
        }

        .main-image {
          position: relative;
          width: 90%;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
          transform-style: preserve-3d;
          transition: transform 0.5s;
        }

        .main-image img {
          width: 100%;
          display: block;
          transition: all 0.5s;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(131, 104, 209, 0.1),
            rgba(168, 147, 233, 0.3)
          );
          opacity: 0;
          transition: opacity 0.5s;
        }

        .image-wrapper:hover .main-image {
          transform: perspective(1000px) rotateY(5deg);
        }

        .image-wrapper:hover .main-image img {
          transform: scale(1.05);
        }

        .image-wrapper:hover .image-overlay {
          opacity: 1;
        }

        /* Certyfikat */
        .certificate-badge {
          position: absolute;
          bottom: 30px;
          right: 0;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          z-index: 10;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s;
        }

        .certificate-badge:hover {
          transform: scale(1.1) rotate(5deg);
        }

        .certificate-badge img {
          width: 70%;
          height: auto;
          margin-bottom: 5px;
        }

        .certificate-badge span {
          font-size: 10px;
          font-weight: 600;
          color: #555;
          text-align: center;
          padding: 0 5px;
        }

        .decoration-element {
          position: absolute;
          top: -30px;
          right: -30px;
          width: 150px;
          height: 150px;
          border-radius: 75px;
          background: linear-gradient(
            135deg,
            rgba(168, 147, 233, 0.3),
            rgba(131, 104, 209, 0.1)
          );
          z-index: -1;
          filter: blur(20px);
        }

        /* Responsywność */
        @media (max-width: 991px) {
          .col-md-12 {
            flex: 0 0 100%;
            max-width: 100%;
          }

          .content-box {
            margin-bottom: 50px;
          }

          .title-area h2 {
            font-size: 32px;
          }

          .image-wrapper {
            padding-bottom: 50px;
          }
        }

        @media (max-width: 767px) {
          .about-section {
            padding: 70px 0;
          }

          .content-box {
            padding: 30px;
          }

          .title-area h2 {
            font-size: 28px;
          }

          .benefits-box {
            padding: 25px;
          }

          .certificate-badge {
            width: 100px;
            height: 100px;
            right: 10px;
          }
        }

        @media (max-width: 575px) {
          .about-section {
            padding: 50px 0;
          }

          .content-box {
            padding: 25px;
          }

          .title-area h2 {
            font-size: 24px;
          }

          .subtitle {
            font-size: 16px;
          }

          .description p {
            font-size: 15px;
          }

          .benefits-list li {
            font-size: 14px;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
