import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface SimpleHeaderProps {
  videoSrc?: string;
  imageSrc?: string;
  title: string;
  subtitle?: string;
  description?: string;
  height?: string;
  darkOverlay?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;
}

export default function SimpleHeader({
  videoSrc,
  imageSrc,
  title,
  subtitle = '',
  description = '',
  height = '70vh',
  darkOverlay = true,
  textAlign = 'center',
  textColor = 'white',
}: SimpleHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Ensure the header element exists
    if (!headerRef.current) return;

    // Create a new GSAP timeline
    const tl = gsap.timeline();
    
    // Only add animations for elements that exist in the DOM
    // Animacja tytułu
    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' },
      );
    }

    // Animacja podtytułu - only if element exists
    if (subtitleRef.current && subtitle) {
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.5',
      );
    }

    // Animacja opisu - only if element exists
    if (descriptionRef.current && description) {
      tl.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.5',
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={headerRef} className='header-container' style={{ height }}>
      {/* Tło wideo lub obrazu */}
      <div className='background'>
        {videoSrc ? (
          <video autoPlay muted loop playsInline className='video-bg'>
            <source src={videoSrc} type='video/mp4' />
            Twoja przeglądarka nie obsługuje wideo HTML5.
          </video>
        ) : imageSrc ? (
          <img src={imageSrc} alt='Tło nagłówka' className='image-bg' />
        ) : null}

        {darkOverlay && <div className='overlay'></div>}
      </div>

      {/* Zawartość tekstowa */}
      <div className={`content text-${textAlign}`}>
        {title && (
          <h1 ref={titleRef} className='title' style={{ color: textColor }}>
            {title}
          </h1>
        )}

        {subtitle && (
          <h2
            ref={subtitleRef}
            className='subtitle'
            style={{ color: textColor }}
          >
            {subtitle}
          </h2>
        )}

        {description && (
          <p
            ref={descriptionRef}
            className='description'
            style={{ color: textColor }}
          >
            {description}
          </p>
        )}
      </div>

      <style jsx>{`
        .header-container {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .video-bg,
        .image-bg {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.5),
            rgba(0, 0, 0, 0.3)
          );
          z-index: 2;
        }

        .content {
          position: absolute;
          z-index: 3;
          width: 90%;
          max-width: 1200px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          padding: 2rem;
        }

        .title {
          font-size: clamp(2.5rem, 5vw, 5rem);
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
          letter-spacing: 2px;
        }

        .subtitle {
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          font-weight: 400;
          margin-bottom: 1.5rem;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
          letter-spacing: 1px;
        }

        .description {
          font-size: clamp(1rem, 2vw, 1.5rem);
          font-weight: 300;
          max-width: 800px;
          margin: 0 auto;
          text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
          line-height: 1.6;
        }

        .text-left {
          text-align: left;
        }

        .text-center {
          text-align: center;
        }

        .text-right {
          text-align: right;
        }

        @media (max-width: 768px) {
          .content {
            width: 95%;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
