import MeasuringGuide from '@/components/MeasuringGuide';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Jak mierzyć okna do zasłon i firan | Przewodnik',
  description:
    'Dowiedz się, jak prawidłowo zmierzyć okna, aby idealnie dopasować firanki i zasłony. Profesjonalne porady i wskazówki.',
};

export default function HowToMeasurePage() {
  return (
    <main className='min-h-screen flex flex-col'>
      <Navbar />

      <div className='pt-28 pb-16 flex-grow'>
        <div className='container mx-auto'>
          <div className='text-center mb-12'>
            <h1 className='text-3xl md:text-4xl font-light text-deep-navy mb-4'>
              Jak mierzyć okna
            </h1>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Prawidłowe pomiary to klucz do idealnie dopasowanych dekoracji
              okiennych. Skorzystaj z naszego przewodnika, aby uniknąć
              najczęstszych błędów.
            </p>
          </div>

          <MeasuringGuide />
        </div>
      </div>

      <Footer />
    </main>
  );
}
