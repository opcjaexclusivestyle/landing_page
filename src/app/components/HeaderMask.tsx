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
  const svgRef = useRef<HTMLImageElement>(null);
  const enterBtnRef = useRef<HTMLDivElement>(null);

  // Rejestracja pluginów GSAP
  useEffect(() => {
    if (!wrapperRef.current) return;

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Stworzenie animacji dla maski tekstowej - tak jak w przykładzie
    ScrollTrigger.create({
      trigger: '.wrapper',
      animation: gsap.fromTo(
        '.svg',
        { scale: 1, opacity: 1 },
        { scale: 50, transformOrigin: 'center center', duration: 1 },
      ),
      start: 'top top',
      end: 'bottom top',
      scrub: 0.7,
      pin: true,
      onLeave: function () {
        gsap.to('#enter', { opacity: 1, duration: 1 });
      },
      onEnter: function () {
        gsap.to('#enter', { opacity: 0, duration: 1 });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // Obsługa kliknięcia przycisku "Enter"
  const handleEnterClick = () => {
    if (onEnterClick) {
      // Dokładnie tak jak w przykładzie
      gsap.to('.wrapper', { opacity: 0, zIndex: 0, duration: 3 });

      gsap.to(window, {
        scrollTo: 0,
        duration: 1,
        ease: 'power2.inOut',
      });

      onEnterClick();
    }
  };

  return (
    <section className='wrapper' ref={wrapperRef}>
      <div className='sticky_layer'>
        <div className='landing_screen'>
          <div className='video-container'>
            <video autoPlay playsInline muted loop preload='auto'>
              <source src={videoSrc} />
            </video>
          </div>
          <div className='content-wrap'>
            <div className='zoom'>
              <img
                src={`/svg-${title.toLowerCase()}.svg`}
                loading='lazy'
                alt={title}
                className='svg'
                ref={svgRef}
              />
            </div>
          </div>
          <div
            className='btn btn-primary magic-button'
            id='enter'
            onClick={handleEnterClick}
            ref={enterBtnRef}
          >
            Odkryj
          </div>
        </div>
      </div>

      <style jsx>{`
        .wrapper {
          position: relative;
          top: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          z-index: 1;
        }

        .sticky_layer {
          justify-content: center;
          align-items: center;
          height: 100vh;
          display: flex;
          position: sticky;
          top: 0;
          overflow: hidden;
        }

        .landing_screen {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-container {
          width: 100%;
          height: 100vh;
          position: absolute;
          overflow: hidden;
        }

        video {
          object-fit: cover;
          z-index: -100;
          background-position: 50%;
          background-size: cover;
          width: 100%;
          height: 100%;
          margin: auto;
          position: absolute;
          top: -100%;
          bottom: -100%;
          left: -100%;
          right: -100%;
        }

        .content-wrap {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .zoom {
          flex-direction: column;
          justify-content: center;
          display: flex;
          position: relative;
          height: 100vh;
          align-items: center;
        }

        .svg {
          width: 100%;
          position: relative;
          box-shadow: inset 0 0 0 2px #eef7ff, 0 0 0 50vw rgba(0, 0, 0, 0.7);
          max-width: 800px;
        }

        #enter {
          position: absolute;
          right: 20px;
          bottom: 20px;
          opacity: 0;
          padding: 12px 30px;
          cursor: pointer;
        }
      `}</style>
    </section>
  );
}
