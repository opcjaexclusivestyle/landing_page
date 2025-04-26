import { motion } from 'framer-motion';

interface FlyingPackageProps {
  isAnimating: boolean;
  onAnimationComplete?: () => void; // Opcjonalny callback
}

export default function FlyingPackage({
  isAnimating,
  onAnimationComplete,
}: FlyingPackageProps) {
  // Alternatywne ścieżki do plików animacji
  const paczkaPath = '/demo/animacja/paczka.svg';
  const strzalkaPath = '/demo/animacja/strzalka.svg';
  const koszykPath = '/demo/animacja/koszyk.svg';

  return (
    <div className='absolute inset-0 overflow-visible pointer-events-none'>
      {/* Paczka startująca z lewej strony przycisku */}
      <motion.img
        src={paczkaPath}
        alt='Paczka'
        className='absolute w-16 h-16 z-10'
        initial={{ x: '10%', y: '50%', scale: 0, opacity: 0, rotate: 0 }}
        animate={
          isAnimating
            ? {
                x: ['10%', '40%', '80%'],
                y: ['50%', '30%', '50%'],
                scale: [0, 1.5, 0.7],
                opacity: [0, 1, 0],
                rotate: [0, -10, 45],
              }
            : {}
        }
        transition={{
          duration: 1.2,
          ease: 'easeInOut',
          times: [0, 0.5, 1],
        }}
        onAnimationComplete={() => onAnimationComplete?.()}
      />

      {/* Błysk efektu */}
      <motion.div
        className='absolute w-10 h-10 bg-yellow-400 rounded-full z-5'
        initial={{ x: '80%', y: '50%', scale: 0, opacity: 0 }}
        animate={
          isAnimating
            ? {
                scale: [0, 2.5, 0],
                opacity: [0, 0.8, 0],
              }
            : {}
        }
        transition={{
          duration: 0.7,
          delay: 0.9,
          ease: 'easeOut',
        }}
      />

      {/* Strzałka podążająca za paczką */}
      <motion.img
        src={strzalkaPath}
        alt='Strzałka'
        className='absolute w-12 h-12'
        initial={{ x: '5%', y: '50%', opacity: 0, scale: 0.2 }}
        animate={
          isAnimating
            ? {
                x: ['5%', '25%', '60%'],
                y: ['50%', '40%', '50%'],
                opacity: [0, 1, 0],
                scale: [0.2, 0.8, 0.3],
              }
            : {}
        }
        transition={{
          duration: 1,
          ease: 'easeInOut',
          times: [0, 0.5, 1],
          delay: 0.1,
        }}
      />

      {/* Koszyk w prawym rogu przycisku, który "łapie" paczkę */}
      <motion.img
        src={koszykPath}
        alt='Koszyk'
        className='absolute w-14 h-14 right-3'
        initial={{ y: '50%', scale: 0.8 }}
        animate={
          isAnimating
            ? {
                scale: [0.8, 1.3, 1],
                y: ['50%', '45%', '50%'],
              }
            : {}
        }
        transition={{
          duration: 0.6,
          delay: 0.8,
          times: [0, 0.6, 1],
          ease: 'easeInOut',
        }}
      />

      {/* Efekt "wpadnięcia" do koszyka */}
      <motion.div
        className='absolute w-12 h-12 right-4 rounded-full bg-white/70 blur-sm'
        style={{ top: 'calc(50% - 16px)' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={
          isAnimating
            ? {
                scale: [0, 2.5, 0],
                opacity: [0, 0.8, 0],
              }
            : {}
        }
        transition={{
          duration: 0.5,
          delay: 0.9,
          ease: 'easeOut',
        }}
      />
    </div>
  );
}
