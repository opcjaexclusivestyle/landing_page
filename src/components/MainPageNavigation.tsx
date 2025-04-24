'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { sectionsConfig } from '@/config/sections';
import SectionPanel from './SectionPanel';

export default function MainPageNavigation() {
  const containerRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const ScrollTrigger = require('gsap/ScrollTrigger').ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom-=100',
          end: 'top center',
          scrub: 0.5,
        },
      },
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className='grid grid-cols-1 md:grid-cols-2 mt-16 md:mt-20 min-h-screen opacity-0'
    >
      {sectionsConfig.map((section, index) => (
        <SectionPanel
          key={section.id}
          section={section}
          index={index}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}
