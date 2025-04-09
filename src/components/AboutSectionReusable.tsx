import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface AboutSectionReusableProps {
  title?: string;
  subtitle?: string;
  highlightText?: string;
  accentText?: string;
  gradientText?: string;
  description?: string;
  features?: string[];
  imageSrc?: string;
  imageAlt?: string;
  vectorImage1?: string;
  vectorImage2?: string;
  sunlitOverlayImage?: string;
}

const AboutSectionReusable: React.FC<AboutSectionReusableProps> = ({
  title = 'Tworzymy Twoje Wnętrze',
  subtitle = 'Witamy w',
  highlightText = 'Fauxis',
  accentText = 'Zasłony i Rolety',
  gradientText = 'Świeżym i Nowoczesnym',
  description = 'U nas znajdziesz szeroką gamę najwyższej jakości zasłon i rolet dopasowanych do Twojego wnętrza. Nasze produkty łączą elegancję z funkcjonalnością, zapewniając idealne rozwiązania dekoracyjne i praktyczne dla każdego pomieszczenia. Specjalizujemy się w dostarczaniu rozwiązań szytych na miarę, które idealnie pasują do Twojej przestrzeni.',
  features = [
    'Dostosuj Swój Projekt',
    'Jakość Bez Kompromisów',
    'Naturalne Kolory',
    'Najlepszy Wybór Zasłon i Rolet',
  ],
  imageSrc = '/images/about/about-1.jpg',
  imageAlt = 'O nas - Zasłony i Rolety',
  vectorImage1 = '/images/about/vector-image-1.png',
  vectorImage2 = '/images/about/vector-image-2.png',
  sunlitOverlayImage = '/images/sunlit.jpg',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageBoxRef = useRef<HTMLDivElement>(null);
  const contentBoxRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Rejestrujemy plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Animacja dla contentu
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
        textRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.4',
      )
      .fromTo(
        listRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.4',
      );

    // Animacja dla obrazu
    const imageTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: imageBoxRef.current,
        start: 'top 70%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });

    imageTimeline.fromTo(
      imageBoxRef.current,
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power2.out' },
    );

    // Czyszczenie
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Dzielimy listę cech na dwie równe części
  const halfLength = Math.ceil(features.length / 2);
  const firstHalfFeatures = features.slice(0, halfLength);
  const secondHalfFeatures = features.slice(halfLength);

  return (
    <section className='about-section' ref={sectionRef}>
      <div
        className='sunlit-overlay'
        style={{
          background: `url(${sunlitOverlayImage}) no-repeat`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      <div className='floral-bg'></div>
      <div className='background-shapes'>
        <div className='circle-1'></div>
        <div className='circle-2'></div>
        <div className='square-1'></div>
        <div className='square-2'></div>
      </div>
      <div className='auto-container'>
        <div className='row clearfix'>
          <div className='col-lg-6 col-md-12 col-sm-12 content-column'>
            <div className='content_block_1'>
              <div className='content-box' ref={contentBoxRef}>
                <div className='sec-title' ref={titleRef}>
                  <p>
                    {subtitle}{' '}
                    <span className='highlight'>{highlightText}</span>{' '}
                    <span className='text-accent'>{accentText}</span>
                  </p>
                  <div className='shape'></div>
                  <h2>
                    {title}{' '}
                    <span className='gradient-text'>{gradientText}</span>
                  </h2>
                </div>
                <div className='text' ref={textRef}>
                  <p>{description}</p>
                </div>
                <div className='inner-box' ref={listRef}>
                  <figure className='vector-image'>
                    <img src={vectorImage1} alt='Element dekoracyjny' />
                  </figure>
                  <div className='inner clearfix'>
                    <ul className='list-item'>
                      {firstHalfFeatures.map((feature, index) => (
                        <li key={`feature-first-${index}`}>
                          <span className='icon-wrapper'>
                            <span className='check-icon'></span>
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <ul className='list-item pl-45'>
                      {secondHalfFeatures.map((feature, index) => (
                        <li key={`feature-second-${index}`}>
                          <span className='icon-wrapper'>
                            <span className='check-icon'></span>
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-lg-6 col-md-12 col-sm-12 image-column'>
            <div className='image_block_1'>
              <div className='image-box ml-55' ref={imageBoxRef}>
                <figure className='vector-image rotate-me'>
                  <img src={vectorImage2} alt='Element dekoracyjny' />
                </figure>
                <div className='image-pattern'>
                  <div className='pattern-1'></div>
                  <div className='pattern-2'></div>
                  <div className='pattern-3'></div>
                  <div className='pattern-4'></div>
                </div>
                <figure className='image'>
                  <img src={imageSrc} alt={imageAlt} />
                  <div className='image-overlay'></div>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* About Section Styles */
        .about-section {
          position: relative;
          padding: 140px 0px 120px 0px;
          overflow: hidden;
          background: linear-gradient(135deg, #f9f7ff 0%, #f4f9ff 100%);
        }

        .sunlit-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.15;
          z-index: 0;
          filter: brightness(1.2) contrast(1.1);
        }

        .floral-bg {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: url('/images/background/floral-bg.png') no-repeat;
          background-position: bottom right;
          background-size: 40% auto;
          opacity: 0.08;
          z-index: 0;
        }

        .background-shapes .circle-1 {
          position: absolute;
          top: 15%;
          left: 8%;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            var(--primary-color-light) 0%,
            var(--primary-color) 100%
          );
          opacity: 0.2;
        }

        .background-shapes .circle-2 {
          position: absolute;
          bottom: 25%;
          left: 18%;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: var(--accent-color);
          opacity: 0.6;
        }

        .background-shapes .square-1 {
          position: absolute;
          top: 40%;
          right: 15%;
          width: 30px;
          height: 30px;
          transform: rotate(45deg);
          background: var(--primary-color);
          opacity: 0.15;
        }

        .background-shapes .square-2 {
          position: absolute;
          top: 20%;
          right: 10%;
          width: 15px;
          height: 15px;
          transform: rotate(45deg);
          background: var(--accent-color);
          opacity: 0.1;
        }

        .auto-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 15px;
          position: relative;
          z-index: 1;
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          margin-right: -15px;
          margin-left: -15px;
        }

        .clearfix::after {
          content: '';
          clear: both;
          display: table;
        }

        .col-lg-6 {
          position: relative;
          width: 50%;
          padding-right: 15px;
          padding-left: 15px;
        }

        @media (max-width: 992px) {
          .col-lg-6 {
            width: 100%;
          }
        }

        .col-md-12 {
          position: relative;
          width: 100%;
          padding-right: 15px;
          padding-left: 15px;
        }

        .col-sm-12 {
          position: relative;
          width: 100%;
          padding-right: 15px;
          padding-left: 15px;
        }

        .content-column {
          margin-bottom: 30px;
        }

        .content_block_1 {
          position: relative;
        }

        .content-box {
          position: relative;
          margin-right: 30px;
        }

        .sec-title {
          position: relative;
          margin-bottom: 35px;
        }

        .sec-title p {
          position: relative;
          font-size: 18px;
          line-height: 28px;
          color: var(--primary-color);
          font-weight: 500;
          margin-bottom: 10px;
        }

        .sec-title .highlight {
          font-weight: 700;
        }

        .sec-title .text-accent {
          color: var(--accent-color);
          font-weight: 500;
        }

        .sec-title .shape {
          position: relative;
          width: 70px;
          height: 1px;
          background: var(--primary-color);
          margin-bottom: 15px;
        }

        .sec-title h2 {
          position: relative;
          font-size: 40px;
          line-height: 50px;
          font-weight: 500;
          color: #071a33;
          margin: 0;
        }

        .sec-title .gradient-text {
          background: linear-gradient(
            135deg,
            var(--primary-color-light) 0%,
            var(--primary-color) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 600;
        }

        .text {
          position: relative;
          margin-bottom: 35px;
        }

        .text p {
          font-size: 16px;
          line-height: 28px;
          color: #777777;
          margin: 0;
        }

        .inner-box {
          position: relative;
          padding-left: 70px;
        }

        .inner-box .vector-image {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          margin: 0;
        }

        .inner-box .inner {
          position: relative;
        }

        .list-item {
          position: relative;
          display: inline-block;
          padding: 0;
          margin: 0;
        }

        .list-item li {
          position: relative;
          display: block;
          padding-left: 30px;
          margin-bottom: 12px;
          font-size: 16px;
          line-height: 26px;
          color: #071a33;
          font-weight: 500;
        }

        .list-item li:last-child {
          margin-bottom: 0;
        }

        .list-item li .icon-wrapper {
          position: absolute;
          top: 2px;
          left: 0;
          width: 22px;
          height: 22px;
          line-height: 22px;
          text-align: center;
          border-radius: 50%;
          background: var(--primary-color);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        }

        .list-item li .check-icon {
          position: relative;
          display: inline-block;
          width: 12px;
          height: 8px;
          border-left: 2px solid #fff;
          border-bottom: 2px solid #fff;
          transform: rotate(-45deg);
        }

        .pl-45 {
          padding-left: 45px;
        }

        .image-column {
          margin-bottom: 30px;
        }

        .image_block_1 {
          position: relative;
        }

        .image-box {
          position: relative;
        }

        .ml-55 {
          margin-left: 55px;
        }

        .image-box .vector-image {
          position: absolute;
          top: -25px;
          right: -20px;
          z-index: 1;
          animation: rotate-me 20s linear infinite;
        }

        @keyframes rotate-me {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .image-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
        }

        .image-pattern .pattern-1 {
          position: absolute;
          top: -15px;
          left: -15px;
          width: 80px;
          height: 80px;
          border-top: 4px solid var(--primary-color);
          border-left: 4px solid var(--primary-color);
        }

        .image-pattern .pattern-2 {
          position: absolute;
          bottom: -15px;
          left: -15px;
          width: 80px;
          height: 80px;
          border-bottom: 4px solid var(--primary-color);
          border-left: 4px solid var(--primary-color);
        }

        .image-pattern .pattern-3 {
          position: absolute;
          top: -15px;
          right: -15px;
          width: 80px;
          height: 80px;
          border-top: 4px solid var(--primary-color);
          border-right: 4px solid var(--primary-color);
        }

        .image-pattern .pattern-4 {
          position: absolute;
          bottom: -15px;
          right: -15px;
          width: 80px;
          height: 80px;
          border-bottom: 4px solid var(--primary-color);
          border-right: 4px solid var(--primary-color);
        }

        .image-box .image {
          position: relative;
          margin: 0;
          overflow: hidden;
          background: #000;
        }

        .image-box .image img {
          width: 100%;
          transition: all 500ms ease;
        }

        .image-box:hover .image img {
          opacity: 0.7;
          transform: scale(1.05);
        }

        .image-box .image .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.6) 0%,
            rgba(0, 0, 0, 0) 100%
          );
        }
      `}</style>
    </section>
  );
};

export default AboutSectionReusable;
