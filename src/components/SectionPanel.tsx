'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { SectionConfig } from '@/config/sections';

interface SectionPanelProps {
  section: SectionConfig;
  index: number;
  isMobile: boolean;
}

export default function SectionPanel({
  section,
  index,
  isMobile,
}: SectionPanelProps) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ScrollTrigger = require('gsap/ScrollTrigger').ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    if (!panelRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: panelRef.current,
        start: 'top bottom-=100',
        end: 'top center+=100',
        scrub: 0.5,
      },
    });

    tl.fromTo(
      panelRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5 },
    )
      .fromTo(
        panelRef.current.querySelector('h2'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3 },
        '-=0.2',
      )
      .fromTo(
        panelRef.current.querySelector('p'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3 },
        '-=0.1',
      )
      .fromTo(
        panelRef.current.querySelector('.premium-button'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3 },
        '-=0.1',
      );

    gsap.to(panelRef.current.querySelector('.panel-image'), {
      scrollTrigger: {
        trigger: panelRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
      y: isMobile ? 20 : 50,
      scale: isMobile ? 1.05 : 1.1,
    });
  }, [isMobile]);

  const borderClasses =
    index % 2 === 0
      ? 'border-r border-gray-800/30'
      : 'border-l border-gray-800/30';
  const topBottomBorder = index < 2 ? 'border-b' : 'border-t';

  return (
    <section
      ref={panelRef}
      className={`panel-section relative min-h-[50vh] overflow-hidden ${topBottomBorder} ${borderClasses}`}
    >
      <div className='panel-image absolute inset-0 w-full h-full z-0'>
        <Image
          src={section.image}
          alt={section.title}
          fill
          priority
          quality={100}
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            transformOrigin: 'center center',
          }}
          className='w-full h-full'
        />
        <div
          className={`absolute inset-0 bg-gradient-${section.gradientDirection} from-black/70 via-black/30 to-black/70`}
        />
      </div>

      <div className='relative z-10 text-center p-6 md:p-10 flex flex-col items-center justify-center h-full'>
        <h2 className='text-3xl md:text-5xl lg:text-6xl mb-4 font-light tracking-widest text-gray-800 luxury-heading drop-shadow-lg bg-white/50 px-6 py-3 rounded-lg inline-block'>
          {section.title}
        </h2>
        <p className='text-base md:text-lg lg:text-xl mb-6 md:mb-10 text-white font-light tracking-wide leading-relaxed drop-shadow-md max-w-md mx-auto'>
          {section.description}
        </p>

        <Link href={section.link} className='premium-button'>
          {section.buttonText}
        </Link>
      </div>
    </section>
  );
}
