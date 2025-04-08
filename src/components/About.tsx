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
      <div className='auto-container'>
        <div className='row clearfix'>
          <div className='col-lg-6 col-md-12 col-sm-12 content-column'>
            <div className='content_block_1'>
              <div className='content-box' ref={contentBoxRef}>
                <div className='sec-title' ref={titleRef}>
                  <p>Witamy w Fauxis Zasłony i Rolety</p>
                  <div className='shape'></div>
                  <h2>Tworzymy Twoje Wnętrze Świeżym i Nowoczesnym</h2>
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
                      <li>Dostosuj Swój Projekt</li>
                      <li>Jakość Bez Kompromisów</li>
                    </ul>
                    <ul className='list-item pl-45'>
                      <li>Naturalne Kolory</li>
                      <li>Najlepszy Wybór Zasłon i Rolet</li>
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
          padding: 120px 0px 100px 0px;
          overflow: hidden;
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
        }

        .content_block_1 .content-box .sec-title {
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
          font-size: 36px;
          line-height: 48px;
          color: #222222;
          font-weight: 700;
        }

        .content_block_1 .content-box .text {
          position: relative;
          margin-bottom: 49px;
        }

        .content_block_1 .content-box .text p {
          font-size: 16px;
          line-height: 26px;
          margin-bottom: 0px;
        }

        .content_block_1 .content-box .inner-box {
          position: relative;
          width: 100%;
        }

        .content_block_1 .content-box .inner-box .vector-image {
          position: absolute;
          left: -140px;
          bottom: -25px;
          z-index: 1;
        }

        .content_block_1 .content-box .inner-box .inner {
          position: relative;
          display: block;
          background: #fff;
          padding: 31px 35px 16px 35px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .content_block_1 .content-box .inner-box .inner .list-item {
          position: relative;
          display: inline-block;
        }

        .content_block_1 .content-box .inner-box .inner .list-item li {
          position: relative;
          display: block;
          font-size: 15px;
          line-height: 28px;
          font-weight: 500;
          color: #333;
          padding-bottom: 18px;
          margin-bottom: 18px;
          padding-left: 35px;
          border-bottom: 1px solid #d7d4e6;
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

        .content_block_1 .content-box .inner-box .inner .list-item li:before {
          position: absolute;
          content: '\\2713';
          font-family: sans-serif;
          left: 0px;
          top: 4px;
          font-size: 22px;
          line-height: 20px;
          color: #8368d1;
        }

        .pl-45 {
          padding-left: 45px !important;
        }

        /* Image Styles */
        .image_block_1 .image-box {
          position: relative;
          display: block;
          margin-top: 17px;
        }

        .ml-55 {
          margin-left: 55px;
        }

        .image_block_1 .image-box .vector-image {
          position: absolute;
          top: -70px;
          right: -70px;
          z-index: 1;
        }

        .image_block_1 .image-box .image {
          position: relative;
          display: block;
          overflow: hidden;
        }

        .image_block_1 .image-box .image img {
          width: 100%;
          transform: scale(1);
          transition: all 0.5s ease;
        }

        .image_block_1 .image-box:hover .image img {
          transform: scale(1.05);
        }

        .image_block_1 .image-box:before {
          position: absolute;
          content: '';
          width: 100%;
          height: calc(100% - 40px);
          left: 20px;
          top: -20px;
          z-index: -1;
          transition: all 500ms ease;
          border: 2px solid #8368d1;
        }

        .image_block_1 .image-box:hover:before {
          left: 0px;
          top: 0px;
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
            rgba(255, 255, 255, 0.3) 100%
          );
          transform: skewX(-25deg);
          z-index: 2;
        }

        .image_block_1 .image-box:hover .image:before {
          animation: shine 1s;
        }

        @keyframes shine {
          100% {
            left: 125%;
          }
        }

        .rotate-me {
          animation: rotate 15s linear infinite;
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .image_block_1 .image-box .image-pattern .pattern-1 {
          position: absolute;
          left: 0px;
          bottom: 0px;
          width: 40px;
          height: 20px;
          background: #fff;
          z-index: 1;
        }

        .image_block_1 .image-box .image-pattern .pattern-2 {
          position: absolute;
          left: 0px;
          bottom: 20px;
          width: 20px;
          height: 40px;
          background: #fff;
          z-index: 1;
        }

        .image_block_1 .image-box .image-pattern .pattern-3 {
          position: absolute;
          right: 0px;
          top: 0px;
          width: 40px;
          height: 20px;
          background: #fff;
          z-index: 1;
        }

        .image_block_1 .image-box .image-pattern .pattern-4 {
          position: absolute;
          right: 0px;
          top: 20px;
          width: 20px;
          height: 40px;
          background: #fff;
          z-index: 1;
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
          .content_block_1 .content-box {
            margin-right: 0px;
            margin-bottom: 40px;
          }

          .image_block_1 .image-box {
            margin-top: 0px;
            max-width: 600px;
            margin: 0 auto;
          }

          .image_block_1 .image-box .vector-image {
            display: none;
          }
        }

        @media only screen and (max-width: 767px) {
          .about-section {
            padding: 70px 0px 70px 0px;
          }

          .content_block_1 .content-box .inner-box .vector-image {
            display: none;
          }

          .ml-55 {
            margin-left: 0px;
          }

          .sec-title h2 {
            font-size: 28px;
            line-height: 38px;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
