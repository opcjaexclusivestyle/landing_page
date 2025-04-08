import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const About: React.FC = () => {
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

  return (
    <section className='about-section' ref={sectionRef}>
      <div className='sunlit-overlay'></div>
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
                    Witamy w <span className='highlight'>Fauxis</span>{' '}
                    <span className='text-accent'>Zasłony i Rolety</span>
                  </p>
                  <div className='shape'></div>
                  <h2>
                    Tworzymy Twoje Wnętrze{' '}
                    <span className='gradient-text'>Świeżym i Nowoczesnym</span>
                  </h2>
                </div>
                <div className='text' ref={textRef}>
                  <p>
                    U nas znajdziesz szeroką gamę najwyższej jakości zasłon i
                    rolet dopasowanych do Twojego wnętrza. Nasze produkty łączą
                    elegancję z funkcjonalnością, zapewniając idealne
                    rozwiązania dekoracyjne i praktyczne dla każdego
                    pomieszczenia. Specjalizujemy się w dostarczaniu rozwiązań
                    szytych na miarę, które idealnie pasują do Twojej
                    przestrzeni.
                  </p>
                </div>
                <div className='inner-box' ref={listRef}>
                  <figure className='vector-image'>
                    <img
                      src='/images/about/vector-image-1.png'
                      alt='Element dekoracyjny'
                    />
                  </figure>
                  <div className='inner clearfix'>
                    <ul className='list-item'>
                      <li>
                        <span className='icon-wrapper'>
                          <span className='check-icon'></span>
                        </span>
                        Dostosuj Swój Projekt
                      </li>
                      <li>
                        <span className='icon-wrapper'>
                          <span className='check-icon'></span>
                        </span>
                        Jakość Bez Kompromisów
                      </li>
                    </ul>
                    <ul className='list-item pl-45'>
                      <li>
                        <span className='icon-wrapper'>
                          <span className='check-icon'></span>
                        </span>
                        Naturalne Kolory
                      </li>
                      <li>
                        <span className='icon-wrapper'>
                          <span className='check-icon'></span>
                        </span>
                        Najlepszy Wybór Zasłon i Rolet
                      </li>
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
                  <img
                    src='/images/about/vector-image-2.png'
                    alt='Element dekoracyjny'
                  />
                </figure>
                <div className='image-pattern'>
                  <div className='pattern-1'></div>
                  <div className='pattern-2'></div>
                  <div className='pattern-3'></div>
                  <div className='pattern-4'></div>
                </div>
                <figure className='image'>
                  <img
                    src='/images/about/about-1.jpg'
                    alt='O nas - Zasłony i Rolety'
                  />
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
          background: url('/images/sunlit.jpg') no-repeat;
          background-size: cover;
          background-position: center;
          opacity: 0.15;
          z-index: 0;
          filter: brightness(1.2) contrast(1.1);
        }

        .floral-bg {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 40%;
          height: 50%;
          background: url('/images/sunlit.jpg') no-repeat;
          background-size: cover;
          background-position: center;
          opacity: 0.04;
          z-index: 0;
          filter: blur(3px) brightness(1.2);
          transform: rotate(180deg);
        }

        .background-shapes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
          opacity: 0.6;
        }

        .circle-1,
        .circle-2,
        .square-1,
        .square-2 {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, #a893e9 0%, #8368d1 100%);
          opacity: 0.15;
        }

        .circle-1 {
          width: 300px;
          height: 300px;
          top: -150px;
          left: -100px;
          filter: blur(20px);
        }

        .circle-2 {
          width: 200px;
          height: 200px;
          bottom: -50px;
          right: 10%;
          filter: blur(15px);
        }

        .square-1,
        .square-2 {
          border-radius: 10px;
          transform: rotate(45deg);
        }

        .square-1 {
          width: 100px;
          height: 100px;
          top: 20%;
          right: -30px;
          background: linear-gradient(135deg, #f1c3fd 0%, #e389ff 100%);
          opacity: 0.1;
        }

        .square-2 {
          width: 150px;
          height: 150px;
          bottom: 10%;
          left: 5%;
          background: linear-gradient(135deg, #bcceff 0%, #8aa4ff 100%);
          opacity: 0.1;
        }

        .auto-container {
          position: relative;
          max-width: 1200px;
          padding: 0px 15px;
          margin: 0 auto;
          z-index: 2;
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

        /* Content Styles */
        .content_block_1 .content-box {
          position: relative;
          margin-right: -15px;
          backdrop-filter: blur(5px);
          background-color: rgba(255, 255, 255, 0.7);
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.05);
        }

        .content_block_1 .content-box .sec-title {
          margin-bottom: 30px;
        }

        .sec-title p {
          position: relative;
          display: block;
          font-size: 18px;
          line-height: 26px;
          color: #8368d1;
          font-weight: 500;
          margin-bottom: 15px;
          letter-spacing: 0.5px;
        }

        .text-accent {
          color: #555;
          font-weight: normal;
        }

        .highlight {
          font-weight: 700;
          position: relative;
          display: inline-block;
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
          transition: height 0.3s ease-in-out;
        }

        .highlight:hover::after {
          height: 100%;
        }

        .sec-title .shape {
          position: relative;
          display: block;
          width: 70px;
          height: 3px;
          background: linear-gradient(90deg, #8368d1 0%, #a893e9 100%);
          margin-bottom: 18px;
          border-radius: 2px;
          box-shadow: 0 3px 10px rgba(131, 104, 209, 0.2);
        }

        .sec-title h2 {
          position: relative;
          display: block;
          font-size: 40px;
          line-height: 1.3;
          color: #222222;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin: 0;
        }

        .gradient-text {
          background: linear-gradient(90deg, #8368d1 0%, #a893e9 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          position: relative;
          display: inline-block;
        }

        .content_block_1 .content-box .text {
          position: relative;
          margin-bottom: 55px;
        }

        .content_block_1 .content-box .text p {
          font-size: 17px;
          line-height: 1.8;
          margin-bottom: 0px;
          color: #555;
          position: relative;
          padding-left: 20px;
          border-left: 2px solid rgba(131, 104, 209, 0.3);
          padding-top: 5px;
          padding-bottom: 5px;
        }

        .content_block_1 .content-box .inner-box {
          position: relative;
          width: 100%;
          transform: translateZ(0);
          transition: transform 0.3s ease;
        }

        .content_block_1 .content-box .inner-box:hover {
          transform: translateY(-5px);
        }

        .content_block_1 .content-box .inner-box .vector-image {
          position: absolute;
          left: -140px;
          bottom: -25px;
          z-index: 1;
          filter: drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.1));
        }

        .content_block_1 .content-box .inner-box .inner {
          position: relative;
          display: block;
          background: rgba(255, 255, 255, 0.9);
          padding: 35px 40px 20px 40px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.07);
          border-radius: 10px;
          transition: all 0.3s ease;
          overflow: hidden;
          backdrop-filter: blur(5px);
        }

        .content_block_1 .content-box .inner-box .inner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(131, 104, 209, 0.05) 0%,
            rgba(168, 147, 233, 0.07) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .content_block_1 .content-box .inner-box .inner:hover {
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
        }

        .content_block_1 .content-box .inner-box .inner:hover::before {
          opacity: 1;
        }

        .content_block_1 .content-box .inner-box .inner .list-item {
          position: relative;
          display: inline-block;
        }

        .content_block_1 .content-box .inner-box .inner .list-item li {
          position: relative;
          display: flex;
          align-items: center;
          font-size: 16px;
          line-height: 28px;
          font-weight: 500;
          color: #333;
          padding-bottom: 20px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(215, 212, 230, 0.5);
          transition: all 0.3s ease;
        }

        .content_block_1
          .content-box
          .inner-box
          .inner
          .list-item
          li:last-child {
          border-bottom: none;
          margin-bottom: 0px;
        }

        .content_block_1 .content-box .inner-box .inner .list-item li:hover {
          color: #8368d1;
          transform: translateX(5px);
        }

        .icon-wrapper {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(131, 104, 209, 0.1);
          border-radius: 50%;
          margin-right: 15px;
          transition: all 0.3s ease;
        }

        .check-icon {
          display: block;
          width: 12px;
          height: 6px;
          border-left: 2px solid #8368d1;
          border-bottom: 2px solid #8368d1;
          transform: rotate(-45deg);
          position: relative;
          top: -2px;
          transition: all 0.3s ease;
        }

        .list-item li:hover .icon-wrapper {
          background: rgba(131, 104, 209, 0.3);
          transform: scale(1.1) rotate(10deg);
        }

        .list-item li:hover .check-icon {
          transform: rotate(-45deg) scale(1.2);
        }

        .pl-45 {
          padding-left: 45px !important;
        }

        /* Image Styles */
        .image_block_1 .image-box {
          position: relative;
          display: block;
          margin-top: 17px;
          perspective: 1000px;
        }

        .ml-55 {
          margin-left: 55px;
        }

        .image_block_1 .image-box .vector-image {
          position: absolute;
          top: -70px;
          right: -70px;
          z-index: 5;
          filter: drop-shadow(0px 5px 15px rgba(0, 0, 0, 0.15));
        }

        .image_block_1 .image-box .image {
          position: relative;
          display: block;
          overflow: hidden;
          border-radius: 10px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
          transform-style: preserve-3d;
          transition: all 0.5s ease;
          z-index: 3;
        }

        .image_block_1 .image-box .image img {
          width: 100%;
          transform: scale(1);
          transition: all 0.5s ease;
          border-radius: 10px;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(131, 104, 209, 0.1) 0%,
            rgba(168, 147, 233, 0.3) 100%
          );
          z-index: 4;
          opacity: 0;
          transition: all 0.5s ease;
          border-radius: 10px;
          pointer-events: none;
        }

        .image_block_1 .image-box:hover .image {
          transform: rotateY(5deg);
          z-index: 4;
        }

        .image_block_1 .image-box:hover .image img {
          transform: scale(1.05);
          filter: brightness(1.05);
        }

        .image_block_1 .image-box:hover .image-overlay {
          opacity: 1;
        }

        .image_block_1 .image-box:before {
          position: absolute;
          content: '';
          width: 90%;
          height: calc(100% - 60px);
          left: 5%;
          top: 30px;
          z-index: 2;
          transition: all 500ms ease;
          background: linear-gradient(135deg, #a893e9 0%, #8368d1 100%);
          opacity: 0.2;
          filter: blur(20px);
          border-radius: 20px;
        }

        .image_block_1 .image-box:hover:before {
          opacity: 0.3;
          width: 100%;
          left: 0;
          top: 0;
          height: 100%;
        }

        .image_block_1 .image-box .image:before {
          position: absolute;
          top: 0;
          left: -75%;
          display: block;
          content: '';
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 100%
          );
          transform: skewX(-25deg);
          z-index: 5;
        }

        .image_block_1 .image-box:hover .image:before {
          animation: shine 1.2s;
        }

        @keyframes shine {
          100% {
            left: 125%;
          }
        }

        .rotate-me {
          animation: rotate 15s linear infinite;
          filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1));
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .image_block_1 .image-box .image-pattern .pattern-1,
        .image_block_1 .image-box .image-pattern .pattern-2,
        .image_block_1 .image-box .image-pattern .pattern-3,
        .image_block_1 .image-box .image-pattern .pattern-4 {
          position: absolute;
          background: #fff;
          z-index: 4;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .image_block_1 .image-box .image-pattern .pattern-1 {
          left: 0px;
          bottom: 0px;
          width: 40px;
          height: 20px;
        }

        .image_block_1 .image-box .image-pattern .pattern-2 {
          left: 0px;
          bottom: 20px;
          width: 20px;
          height: 40px;
        }

        .image_block_1 .image-box .image-pattern .pattern-3 {
          right: 0px;
          top: 0px;
          width: 40px;
          height: 20px;
        }

        .image_block_1 .image-box .image-pattern .pattern-4 {
          right: 0px;
          top: 20px;
          width: 20px;
          height: 40px;
        }

        .image_block_1 .image-box:hover .image-pattern .pattern-1,
        .image_block_1 .image-box:hover .image-pattern .pattern-2,
        .image_block_1 .image-box:hover .image-pattern .pattern-3,
        .image_block_1 .image-box:hover .image-pattern .pattern-4 {
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
          z-index: 5;
        }

        @media only screen and (max-width: 1200px) {
          .content_block_1 .content-box .inner-box .inner .list-item {
            width: 100%;
          }

          .pl-45 {
            padding-left: 0px !important;
            margin-top: 15px;
          }
        }

        @media only screen and (max-width: 991px) {
          .about-section {
            padding: 100px 0px 100px 0px;
          }

          .content_block_1 .content-box {
            margin-right: 0px;
            margin-bottom: 60px;
            padding: 30px;
          }

          .image_block_1 .image-box {
            margin-top: 0px;
            max-width: 600px;
            margin: 0 auto;
          }

          .sec-title h2 {
            font-size: 36px;
          }

          .image_block_1 .image-box .vector-image {
            display: none;
          }

          .floral-bg {
            width: 100%;
            height: 40%;
            opacity: 0.03;
          }
        }

        @media only screen and (max-width: 767px) {
          .about-section {
            padding: 80px 0px 80px 0px;
          }

          .content_block_1 .content-box .inner-box .vector-image {
            display: none;
          }

          .ml-55 {
            margin-left: 0px;
          }

          .sec-title h2 {
            font-size: 32px;
            line-height: 1.3;
          }

          .content_block_1 .content-box .inner-box .inner {
            padding: 30px 25px 15px 25px;
          }
        }

        @media only screen and (max-width: 575px) {
          .about-section {
            padding: 70px 0px 70px 0px;
          }

          .content_block_1 .content-box {
            padding: 25px;
          }

          .sec-title h2 {
            font-size: 28px;
          }

          .sec-title p {
            font-size: 16px;
          }

          .content_block_1 .content-box .text p {
            font-size: 15px;
          }

          .content_block_1 .content-box .inner-box .inner .list-item li {
            font-size: 15px;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
