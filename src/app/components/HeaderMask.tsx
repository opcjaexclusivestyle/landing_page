import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

interface HeaderMaskProps {
  videoSrc: string;
  title: string;
  onEnterClick?: () => void;
}

export default function HeaderMask({
  videoSrc,
  title,
  onEnterClick,
}: HeaderMaskProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const rectRef = useRef<SVGRectElement>(null);
  const enterBtnRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);

  // Rejestracja pluginów GSAP
  useEffect(() => {
    if (!wrapperRef.current || !textRef.current || !rectRef.current) return;

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Animacja powiększania tekstu w SVG i zanikania maski
    const tl = gsap.timeline();

    // Powiększamy tekst - napis FIRANY
    tl.fromTo(
      textRef.current,
      { scale: 1 },
      {
        scale: 20,
        transformOrigin: 'center center',
        ease: 'power1.inOut',
        duration: 3,
      },
    );

    // Na końcu animacji sprawiamy, że maska znika - zostaje tylko film
    tl.to(
      rectRef.current,
      { opacity: 0, duration: 1 },
      '-=0.5', // zaczynamy zanikanie pod koniec powiększania
    );

    // Pokazujemy dodatkowy tekst, linia po linii
    tl.fromTo(
      line1Ref.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.3',
    );

    tl.fromTo(
      line2Ref.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.4',
    );

    tl.fromTo(
      line3Ref.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.4',
    );

    ScrollTrigger.create({
      trigger: wrapperRef.current,
      animation: tl,
      start: 'top top',
      end: '+=2500', // wydłużamy czas trwania efektu dla dodatkowego tekstu
      scrub: true,
      pin: true,
      onLeave: function () {
        gsap.to(enterBtnRef.current, { opacity: 1, duration: 1 });
      },
      onEnter: function () {
        gsap.to(enterBtnRef.current, { opacity: 0, duration: 1 });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // Obsługa kliknięcia przycisku "Enter"
  const handleEnterClick = () => {
    if (onEnterClick) {
      gsap.to(wrapperRef.current, { opacity: 0, zIndex: 0, duration: 3 });
      gsap.to(window, {
        scrollTo: 0,
        duration: 1,
        ease: 'power2.inOut',
      });
      onEnterClick();
    }
  };

  return (
    <div className='header-mask' ref={wrapperRef}>
      {/* Film w tle */}
      <div className='video-background'>
        <video autoPlay muted loop playsInline>
          <source src={videoSrc} type='video/mp4' />
        </video>
      </div>

      {/* SVG jako maska */}
      <svg
        className='mask-svg'
        ref={svgRef}
        viewBox='0 0 1920 1080'
        preserveAspectRatio='xMidYMid slice'
      >
        <defs>
          <mask id='text-mask'>
            {/* Czarne tło maski */}
            <rect width='100%' height='100%' fill='white' />
            {/* Biały tekst, który będzie przezroczysty */}
            <text
              ref={textRef}
              x='50%'
              y='50%'
              textAnchor='middle'
              dominantBaseline='middle'
              fontSize='400'
              fontWeight='900'
              fontFamily='Arial, sans-serif'
              fill='black'
              letterSpacing='20'
            >
              {title}
            </text>
          </mask>
        </defs>

        {/* Prostokąt z czarnym kolorem, używający maski tekstowej */}
        <rect
          ref={rectRef}
          width='100%'
          height='100%'
          fill='black'
          mask='url(#text-mask)'
        />
      </svg>

      {/* Dodatkowy tekst, który pojawi się po zniknięciu maski */}
      <div className='text-content' ref={textContentRef}>
        <div className='text-line line-1' ref={line1Ref}>
          Elegancja i jakość
        </div>
        <div className='text-line line-2' ref={line2Ref}>
          Fabryczne Zasłony
        </div>
        <div className='text-line line-3' ref={line3Ref}>
          Odkryj najnowsze trendy
        </div>
      </div>

      <style jsx>{`
        .header-mask {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        .video-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .video-background video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mask-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
        }

        .text-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 3;
          width: 80%;
        }

        .text-line {
          opacity: 0;
          color: white;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
        }

        .line-1 {
          font-size: 3.5rem;
          font-weight: 300;
          margin-bottom: 1rem;
          letter-spacing: 2px;
        }

        .line-2 {
          font-size: 5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          letter-spacing: 3px;
        }

        .line-3 {
          font-size: 2.5rem;
          font-weight: 400;
          font-style: italic;
          letter-spacing: 1px;
        }

        .enter-button {
          position: absolute;
          right: 20px;
          bottom: 20px;
          padding: 12px 30px;
          background-color: rgba(255, 255, 255, 0.8);
          color: black;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .enter-button:hover {
          background-color: white;
        }
      `}</style>
    </div>
  );
}
