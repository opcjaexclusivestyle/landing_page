import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

interface HeaderProps {
  videoSrc: string;
  mainTitle: string;
  subTitle?: string;
  description?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  height?: string;
  textColor?: string;
  textShadow?: string;
  initialScale?: number;
  finalScale?: number;
  animationDuration?: number;
}

export default function Header({
  videoSrc,
  mainTitle,
  subTitle = '',
  description = '',
  ctaText = 'Zobacz więcej',
  onCtaClick,
  height = '100vh',
  textColor = 'white',
  textShadow = '2px 2px 8px rgba(0, 0, 0, 0.7)',
  initialScale = 1,
  finalScale = 10,
  animationDuration = 3,
}: HeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const rectRef = useRef<SVGRectElement>(null);
  const ctaBtnRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const subTitleRef = useRef<HTMLDivElement>(null);
  const mainTitleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headerRef.current || !textRef.current || !rectRef.current) return;

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Główna animacja
    const tl = gsap.timeline();

    // Animacja tekstu SVG
    tl.fromTo(
      textRef.current,
      { scale: initialScale },
      {
        scale: finalScale,
        transformOrigin: 'center center',
        ease: 'power1.inOut',
        duration: animationDuration,
      },
    );

    // Zanikanie maski
    tl.to(
      rectRef.current,
      { opacity: 0, duration: animationDuration / 3 },
      `-=${animationDuration / 6}`,
    );

    // Animacja elementów tekstowych
    if (subTitleRef.current) {
      tl.fromTo(
        subTitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.3',
      );
    }

    if (mainTitleRef.current) {
      tl.fromTo(
        mainTitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.4',
      );
    }

    if (descriptionRef.current) {
      tl.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.4',
      );
    }

    // Konfiguracja ScrollTrigger
    ScrollTrigger.create({
      trigger: headerRef.current,
      animation: tl,
      start: 'top top',
      end: '+=1500',
      scrub: true,
      pin: true,
      onLeave: function () {
        if (ctaBtnRef.current) {
          gsap.to(ctaBtnRef.current, { opacity: 1, duration: 1 });
        }
      },
      onEnter: function () {
        if (ctaBtnRef.current) {
          gsap.to(ctaBtnRef.current, { opacity: 0, duration: 1 });
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [initialScale, finalScale, animationDuration]);

  const handleCtaClick = () => {
    if (onCtaClick) {
      gsap.to(headerRef.current, { opacity: 0, zIndex: 0, duration: 1.5 });
      gsap.to(window, {
        scrollTo: 0,
        duration: 1,
        ease: 'power2.inOut',
      });
      onCtaClick();
    }
  };

  return (
    <div className='header' ref={headerRef}>
      {/* Tło wideo */}
      <div className='video-background'>
        {videoSrc && (
          <video autoPlay muted loop playsInline>
            <source src={videoSrc} type='video/mp4' />
            Twoja przeglądarka nie obsługuje wideo HTML5.
          </video>
        )}
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
            <rect width='100%' height='100%' fill='white' />
            <text
              ref={textRef}
              x='50%'
              y='50%'
              textAnchor='middle'
              dominantBaseline='middle'
              fontSize='250'
              fontWeight='900'
              fontFamily='Arial, sans-serif'
              fill='black'
              letterSpacing='10'
            >
              {mainTitle}
            </text>
          </mask>
        </defs>

        <rect
          ref={rectRef}
          width='100%'
          height='100%'
          fill='black'
          mask='url(#text-mask)'
        />
      </svg>

      {/* Animowany tekst */}
      <div className='text-content' ref={textContentRef}>
        {subTitle && (
          <div className='text-line sub-title' ref={subTitleRef}>
            {subTitle}
          </div>
        )}
        {mainTitle && (
          <div className='text-line main-title' ref={mainTitleRef}>
            {mainTitle}
          </div>
        )}
        {description && (
          <div className='text-line description' ref={descriptionRef}>
            {description}
          </div>
        )}
      </div>

      {/* Przycisk CTA */}
      {ctaText && (
        <div
          className='cta-button'
          ref={ctaBtnRef}
          onClick={handleCtaClick}
          role='button'
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleCtaClick();
            }
          }}
        >
          {ctaText}
        </div>
      )}

      <style jsx>{`
        .header {
          position: relative;
          width: 100%;
          height: ${height};
          overflow: hidden;
        }

        .video-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          background-color: #000;
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
          width: 90%;
          max-width: 1200px;
        }

        .text-line {
          opacity: 0;
          color: ${textColor};
          text-shadow: ${textShadow};
        }

        .sub-title {
          font-size: clamp(1.5rem, 4vw, 3rem);
          font-weight: 300;
          margin-bottom: clamp(0.5rem, 2vw, 1rem);
          letter-spacing: 2px;
        }

        .main-title {
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 700;
          margin-bottom: clamp(0.5rem, 2vw, 1rem);
          letter-spacing: 3px;
        }

        .description {
          font-size: clamp(1rem, 3vw, 2.5rem);
          font-weight: 400;
          font-style: italic;
          letter-spacing: 1px;
        }

        .cta-button {
          position: absolute;
          right: 20px;
          bottom: 20px;
          padding: clamp(8px, 2vw, 12px) clamp(15px, 4vw, 30px);
          background-color: rgba(255, 255, 255, 0.8);
          color: black;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          z-index: 10;
          opacity: 0;
          transition: all 0.3s ease;
          font-size: clamp(0.8rem, 2vw, 1rem);
          text-align: center;
        }

        .cta-button:hover {
          background-color: white;
          transform: scale(1.05);
        }

        /* Responsywność dla urządzeń mobilnych */
        @media (max-width: 768px) {
          .text-content {
            width: 95%;
          }

          .cta-button {
            left: 50%;
            transform: translateX(-50%);
            right: auto;
            width: 80%;
            max-width: 300px;
          }

          .cta-button:hover {
            transform: translateX(-50%) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
