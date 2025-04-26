import { motion } from 'framer-motion';

interface FlyingPackageProps {
  isAnimating: boolean;
  onAnimationComplete?: () => void; // Opcjonalny callback
}

export default function FlyingPackage({
  isAnimating,
  onAnimationComplete,
}: FlyingPackageProps) {
  // Ścieżki do plików animacji
  const paczkaPath = '/demo/animacja/paczka.svg';
  const strzalkaPath = '/demo/animacja/strzalka.svg';
  const koszykPath = '/demo/animacja/koszyk.svg';

  return (
    <div className='absolute inset-0 overflow-visible pointer-events-none'>
      {/* Paczka lecąca do koszyka - teraz z wyraźnym widokiem wpadania do koszyka */}
      <motion.img
        src={paczkaPath}
        alt='Paczka'
        className='absolute w-16 h-16 z-30'
        initial={{ x: '-40%', y: '0%', scale: 0, opacity: 0, rotate: 0 }}
        animate={
          isAnimating
            ? {
                // Zmieniona ścieżka lotu - teraz kończy się dokładnie w koszyku (right: 3)
                x: [
                  '-40%',
                  '-20%',
                  '0%',
                  '20%',
                  '40%',
                  '60%',
                  '72%',
                  '72%',
                  '72%',
                ],
                // Dodana parabola w locie - na końcu paczka wpada do koszyka
                y: [
                  '0%',
                  '-20%',
                  '-30%',
                  '-20%',
                  '-10%',
                  '-5%',
                  '0%',
                  '5%',
                  '10%',
                ],
                // Większa skala na początku, zmniejszenie przy koszyku, ale nie do zera od razu
                scale: [0, 1.2, 1.2, 1.1, 1, 0.9, 0.8, 0.6, 0],
                // Dłuższa widoczność - teraz paczka jest widoczna aż do momentu "wpadnięcia"
                opacity: [0, 1, 1, 1, 1, 1, 1, 0.7, 0],
                // Obracanie podczas lotu z dodatkowym obrotem przy wpadaniu
                rotate: [0, -10, 10, -5, 5, 10, 15, 30, 45],
              }
            : {}
        }
        transition={{
          duration: 1.3,
          ease: 'easeInOut',
          times: [0, 0.1, 0.3, 0.5, 0.7, 0.8, 0.85, 0.9, 1],
        }}
        onAnimationComplete={() => onAnimationComplete?.()}
      />

      {/* Strzałka wskazująca kierunek lotu */}
      <motion.img
        src={strzalkaPath}
        alt='Strzałka'
        className='absolute w-12 h-12 z-10'
        initial={{ x: '-30%', y: '0%', opacity: 0, scale: 0.2 }}
        animate={
          isAnimating
            ? {
                x: ['-30%', '-10%', '10%', '30%', '50%'],
                y: ['0%', '-15%', '-25%', '-15%', '0%'],
                opacity: [0, 0.7, 0.8, 0.7, 0],
                scale: [0.2, 0.6, 0.7, 0.6, 0.4],
              }
            : {}
        }
        transition={{
          duration: 1,
          ease: 'easeInOut',
          times: [0, 0.25, 0.5, 0.75, 1],
          delay: 0.1,
        }}
      />

      {/* Koszyk w prawym rogu przycisku, czekający na paczkę */}
      <motion.img
        src={koszykPath}
        alt='Koszyk'
        className='absolute w-14 h-14 right-3 z-20'
        style={{ top: 'calc(50% - 30px)' }}
        initial={{ scale: 0.8 }}
        animate={
          isAnimating
            ? {
                // Trzęsienie koszyka teraz rozpoczyna się dokładnie w momencie wpadnięcia paczki
                x: [
                  '0%',
                  '0%',
                  '0%',
                  '0%',
                  '0%',
                  '0%',
                  '2%',
                  '-2%',
                  '1%',
                  '-1%',
                  '0%',
                ],
                y: [
                  '0%',
                  '0%',
                  '0%',
                  '0%',
                  '0%',
                  '0%',
                  '-5%',
                  '2%',
                  '-3%',
                  '1%',
                  '0%',
                ],
                scale: [0.8, 0.8, 0.8, 0.8, 0.8, 0.9, 1.2, 1.1, 1, 0.95, 0.9],
              }
            : {}
        }
        transition={{
          duration: 1.3,
          times: [0, 0.5, 0.6, 0.7, 0.8, 0.85, 0.88, 0.91, 0.94, 0.97, 1],
          ease: 'easeInOut',
        }}
      />

      {/* Efekt paczki "wewnątrz" koszyka - małe kawałki widoczne ponad krawędzią koszyka */}
      <motion.img
        src={paczkaPath}
        alt='Paczka w koszyku'
        className='absolute w-10 h-10 right-4 z-15'
        style={{ top: 'calc(50% - 36px)' }}
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={
          isAnimating
            ? {
                // Pojawia się, gdy główna paczka znika i widać jej fragment zza koszyka
                scale: [0, 0, 0, 0, 0, 0, 0, 0.5, 0.4, 0],
                opacity: [0, 0, 0, 0, 0, 0, 0, 0.9, 0.8, 0],
                rotate: [0, 0, 0, 0, 0, 0, 0, 15, 30, 45],
              }
            : {}
        }
        transition={{
          duration: 1.3,
          times: [0, 0.5, 0.6, 0.7, 0.8, 0.82, 0.85, 0.87, 0.92, 1],
          ease: 'easeInOut',
        }}
      />

      {/* Efekt "zapadania się" paczki w koszyku */}
      <motion.div
        className='absolute w-16 h-16 rounded-full bg-white/70 blur-md z-15'
        style={{ right: '8%', top: 'calc(50% - 28px)' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={
          isAnimating
            ? {
                scale: [0, 0, 0, 0, 0, 0, 0, 2.5, 1.5, 0],
                opacity: [0, 0, 0, 0, 0, 0, 0, 0.8, 0.4, 0],
              }
            : {}
        }
        transition={{
          duration: 1.3,
          times: [0, 0.5, 0.6, 0.7, 0.8, 0.82, 0.85, 0.87, 0.92, 1],
          ease: 'easeOut',
        }}
      />

      {/* Małe gwiazdki "odprysków" przy dotarciu do koszyka */}
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          className='absolute w-3 h-3 rounded-full bg-yellow-300 z-25'
          style={{ right: '12%', top: 'calc(50% - 6px)' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={
            isAnimating
              ? {
                  x: [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    (index - 2) * 15, // Rozrzut w poziomie
                    (index - 2) * 25,
                  ],
                  y: [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    (Math.random() - 0.5) * 30, // Losowy rozrzut w pionie
                    (Math.random() - 0.5) * 50,
                  ],
                  scale: [0, 0, 0, 0, 0, 0, 0, 1, 0],
                  opacity: [0, 0, 0, 0, 0, 0, 0, 0.9, 0],
                }
              : {}
          }
          transition={{
            duration: 1.3,
            times: [0, 0.5, 0.6, 0.7, 0.8, 0.82, 0.85, 0.9, 1],
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
