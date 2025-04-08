'use client';
import SimpleHeader from '../../components/SimpleHeader';
import Link from 'next/link';

export default function SimpleHeaderDemo() {
  return (
    <>
      {/* Przykład podstawowy */}
      <SimpleHeader
        videoSrc='/video/curtains.mp4'
        title='PROSTY NAGŁÓWEK'
        subtitle='Elegancki i funkcjonalny'
        description='Bez zbędnych efektów, bezpośrednie ładowanie treści'
        darkOverlay={true}
        height='60vh'
      />

      <div className='py-12 px-4 md:px-8 max-w-7xl mx-auto'>
        <h1 className='text-3xl md:text-4xl font-light text-center mb-8'>
          Przykłady komponentu SimpleHeader
        </h1>

        <div className='mb-8 text-center'>
          <Link
            href='/'
            className='text-blue-600 hover:text-blue-800 transition-colors duration-300'
          >
            Powrót do strony głównej
          </Link>
        </div>

        <div className='bg-gray-50 p-6 rounded-lg mb-12'>
          <h2 className='text-xl font-medium mb-4'>
            O komponencie SimpleHeader
          </h2>
          <p className='mb-4'>
            <strong>SimpleHeader</strong> to prosty, reuzywalny komponent
            nagłówka z filmem lub obrazem w tle oraz płynną animacją tekstu. W
            przeciwieństwie do innych komponentów nagłówkowych, nie zawiera
            przycisku CTA ani efektów maski i ładuje stronę bezpośrednio.
          </p>
          <p>
            Component można dostosować poprzez różne propsy, takie jak wysokość,
            kolor tekstu, wyrównanie, czy nakładkę przyciemniającą. Można
            również użyć obrazu zamiast wideo jako tła.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-12 mb-16'>
          {/* Przykład 1: Lewe wyrównanie */}
          <div className='border rounded-lg overflow-hidden'>
            <SimpleHeader
              imageSrc='/images/Firany.jpg'
              title='WYRÓWNANIE DO LEWEJ'
              subtitle='Tekst jest wyrównany do lewej strony'
              textAlign='left'
              height='40vh'
            />
            <div className='p-4 bg-white'>
              <h3 className='font-medium mb-2'>Wyrównanie do lewej</h3>
              <p className='text-gray-700 text-sm'>
                <code>textAlign='left'</code> - nagłówek z tekstem wyrównanym do
                lewej, używający obrazu zamiast wideo.
              </p>
            </div>
          </div>

          {/* Przykład 2: Bez nakładki */}
          <div className='border rounded-lg overflow-hidden'>
            <SimpleHeader
              videoSrc='/video/curtains.mp4'
              title='BEZ NAKŁADKI'
              subtitle='Tekst bezpośrednio na wideo'
              darkOverlay={false}
              height='40vh'
            />
            <div className='p-4 bg-white'>
              <h3 className='font-medium mb-2'>
                Bez nakładki przyciemniającej
              </h3>
              <p className='text-gray-700 text-sm'>
                <code>darkOverlay={false}</code> - nagłówek bez ciemnej nakładki
                na filmie.
              </p>
            </div>
          </div>

          {/* Przykład 3: Inny kolor tekstu */}
          <div className='border rounded-lg overflow-hidden'>
            <SimpleHeader
              imageSrc='/images/Rolety.jpg'
              title='KOLOR TEKSTU'
              subtitle='Możliwość zmiany koloru tekstu'
              description='Dostosuj wygląd do swojej palety kolorów'
              textColor='#ff9900'
              height='40vh'
            />
            <div className='p-4 bg-white'>
              <h3 className='font-medium mb-2'>Niestandardowy kolor tekstu</h3>
              <p className='text-gray-700 text-sm'>
                <code>textColor='#ff9900'</code> - nagłówek z tekstem w kolorze
                pomarańczowym.
              </p>
            </div>
          </div>
        </div>

        <div className='mt-12 text-center'>
          <p className='text-lg mb-4'>
            Możesz używać tego komponentu na różnych podstronach produktowych.
          </p>
          <div className='flex flex-wrap justify-center gap-4 mt-6'>
            <Link
              href='/firany'
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors'
            >
              Zobacz na stronie Firany
            </Link>
            <Link
              href='/rolety'
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors'
            >
              Zobacz na stronie Rolety
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
