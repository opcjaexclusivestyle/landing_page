'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SimpleHeader from '../components/SimpleHeader';
import MeasuringGuide from '../../components/MeasuringGuide';
import BlindsInquiryForm from '../../components/BlindsInquiryForm';

// Helper function to scroll to the form
const scrollToForm = () => {
  const formElement = document.getElementById('blinds-inquiry-form');
  if (formElement) {
    formElement.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function Rolety() {
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef(null);
  const descriptionRef = useRef(null);

  // Rejestracja pluginów GSAP
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Efekt animacji przy ładowaniu strony
  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(headerRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: 'power3.out',
    });

    tl.from(
      descriptionRef.current,
      {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.5',
    );
  }, []);

  return (
    <>
      {/* Używamy nowego komponentu SimpleHeader */}
      <SimpleHeader
        videoSrc='/video/curtains.mp4'
        title='ROLETY I ZASŁONY'
        subtitle='Estetyka i funkcjonalność dla Twoich okien'
        description='Odkryj rolety rzymskie, plisowane i klasyczne zasłony'
        height='60vh'
      />

      {/* Główna zawartość strony */}
      <div
        ref={contentRef}
        className='min-h-screen py-10 px-4 md:px-8 lg:px-16 bg-[var(--light-gold)] text-[var(--deep-navy)]'
      >
        {/* Nagłówek z przyciskiem powrotu */}
        <div
          className='mb-12 flex justify-between items-center'
          ref={headerRef}
        >
          <Link
            href='/'
            className='text-[var(--deep-navy)] hover:text-[var(--gold)] transition-colors'
          >
            &larr; Powrót do strony głównej
          </Link>
          <h1 className='text-4xl md:text-5xl lg:text-6xl text-center luxury-heading font-light text-[var(--deep-navy)]'>
            Rolety i Zasłony
          </h1>
          <div className='w-[100px]'></div> {/* Pusty element dla wyrównania */}
        </div>

        <div
          ref={descriptionRef}
          className='max-w-4xl mx-auto mb-16 text-center'
        >
          <p className='text-lg md:text-xl leading-relaxed mb-6'>
            Rolety to nie tylko praktyczne rozwiązanie chroniące przed
            nadmiernym światłem i zapewniające prywatność. To także ważny
            element dekoracyjny, który wpływa na atmosferę całego pomieszczenia.
            W naszej ofercie znajdziesz starannie wykonane rolety rzymskie oraz
            rolety plisowane, które łączą estetykę z funkcjonalnością na
            najwyższym poziomie.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
          <div className='border border-[var(--gold)] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-white flex flex-col items-center text-center'>
            <Image
              src='/images/placeholder-roman.jpg'
              alt='Rolety rzymskie'
              width={300}
              height={200}
              className='rounded mb-4 object-cover'
            />
            <h3 className='text-2xl font-semibold mb-2 text-[var(--deep-navy)]'>
              Rolety Rzymskie
            </h3>
            <p className='text-sm mb-4 text-[var(--gold)] font-medium'>
              Nowoczesność, wygoda, elegancja
            </p>
            <p className='text-base leading-relaxed mb-4 text-gray-700'>
              Doskonały kompromis między zasłoną a roletą. Układają się w
              miękkie fałdy, nadając wnętrzu przytulności. Precyzyjna regulacja
              światła i subtelny wygląd.
            </p>
            <button
              onClick={scrollToForm}
              className='mt-auto bg-[var(--deep-navy)] text-white py-2 px-6 rounded hover:bg-[var(--gold)] transition-colors'
            >
              Wyceń rolety rzymskie
            </button>
          </div>

          <div className='border border-[var(--gold)] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-white flex flex-col items-center text-center'>
            <Image
              src='/images/placeholder-pleated.jpg'
              alt='Rolety plisowane'
              width={300}
              height={200}
              className='rounded mb-4 object-cover'
            />
            <h3 className='text-2xl font-semibold mb-2 text-[var(--deep-navy)]'>
              Rolety Plisowane
            </h3>
            <p className='text-sm mb-4 text-[var(--gold)] font-medium'>
              Prywatność, design, komfort
            </p>
            <p className='text-base leading-relaxed mb-4 text-gray-700'>
              Wyjątkowa funkcjonalność i nowoczesna estetyka. Składane w
              harmonijkę, regulowane od góry i dołu. Idealne do nowoczesnych
              wnętrz i nietypowych okien.
            </p>
            <button
              onClick={scrollToForm}
              className='mt-auto bg-[var(--deep-navy)] text-white py-2 px-6 rounded hover:bg-[var(--gold)] transition-colors'
            >
              Wyceń rolety plisowane
            </button>
          </div>

          <div className='border border-[var(--gold)] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-white flex flex-col items-center text-center'>
            <Image
              src='/images/placeholder-curtains.jpg'
              alt='Zasłony'
              width={300}
              height={200}
              className='rounded mb-4 object-cover'
            />
            <h3 className='text-2xl font-semibold mb-2 text-[var(--deep-navy)]'>
              Zasłony
            </h3>
            <p className='text-sm mb-4 text-[var(--gold)] font-medium'>
              Klimat, dekoracja, funkcjonalność
            </p>
            <p className='text-base leading-relaxed mb-4 text-gray-700'>
              Klasyczne rozwiązanie, które dodaje ciepła i elegancji. Skutecznie
              regulują światło i temperaturę. Szeroka gama materiałów i kolorów
              do każdego stylu.
            </p>
            <Link
              href='/zaslony'
              className='mt-auto bg-[var(--deep-navy)] text-white py-2 px-6 rounded hover:bg-[var(--gold)] transition-colors block w-full'
            >
              Zobacz zasłony
            </Link>
          </div>
        </div>

        <div className='max-w-4xl mx-auto mb-16 text-center p-8 bg-white rounded-lg shadow-md border border-[var(--gold)]'>
          <h2 className='text-3xl font-semibold mb-4 text-[var(--deep-navy)]'>
            Profesjonalne Doradztwo i Bezpłatny Pomiar
          </h2>
          <p className='text-lg md:text-xl leading-relaxed mb-6 text-gray-700'>
            Stawiamy na profesjonalne podejście, dlatego chętnie zadzwonimy i
            doradzimy najlepsze rozwiązanie. Oferujemy bezpłatne pomiary na
            terenie Radomia i okolic, dzięki czemu możemy idealnie dobrać rolety
            rzymskie lub plisowane do Państwa okien.
          </p>
          <p className='text-lg md:text-xl leading-relaxed text-gray-700'>
            Wypełnij poniższy formularz, abyśmy mogli przygotować ofertę
            dopasowaną do Twoich potrzeb.
          </p>
        </div>

        <MeasuringGuide />

        <div className='text-center mb-8 mt-16'>
          <p className='text-lg md:text-xl font-semibold text-[var(--deep-navy)]'>
            Chcesz porozmawiać z ekspertem w sprawie rolet do Twojego domu?
          </p>
          <a
            href='tel:531400230'
            className='text-2xl md:text-3xl text-[var(--gold)] hover:underline font-bold'
          >
            Zadzwoń teraz 531 400 230
          </a>
        </div>

        <div id='blinds-inquiry-form'>
          <BlindsInquiryForm />
        </div>

        <div className='max-w-4xl mx-auto mt-16 p-8 bg-white rounded-lg shadow-md border border-[var(--gold)]'>
          <h2 className='text-3xl font-semibold mb-8 text-center text-[var(--deep-navy)]'>
            PYTANIA I ODPOWIEDZI
          </h2>

          <div className='space-y-6'>
            <div>
              <h3 className='text-2xl font-medium mb-4 text-[var(--deep-navy)]'>
                {' '}
                Rolety rzymskie
              </h3>
              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold text-lg text-gray-800'>
                    1. Czy rolety rzymskie można prać?
                  </h4>
                  <p className='text-gray-700'>
                    Tak, większość rolet rzymskich posiada materiał zdejmowany
                    na rzepy lub haczyki, co umożliwia pranie ręczne lub w
                    pralce – najlepiej w delikatnym programie i niskiej
                    temperaturze (do 30°C). Zawsze warto sprawdzić zalecenia
                    producenta.
                  </p>
                </div>
                <div>
                  <h4 className='font-semibold text-lg text-gray-800'>
                    2. Czy rolety rzymskie nadają się do kuchni lub łazienki?
                  </h4>
                  <p className='text-gray-700'>
                    Tak, ale najlepiej wybrać tkaniny odporne na wilgoć i łatwe
                    do czyszczenia. Do kuchni polecane są tkaniny syntetyczne
                    lub z powłoką teflonową, a do łazienki materiały o
                    właściwościach antygrzybicznych.
                  </p>
                </div>
                <div>
                  <h4 className='font-semibold text-lg text-gray-800'>
                    3. Jak montuje się rolety rzymskie?
                  </h4>
                  <p className='text-gray-700'>
                    Rolety rzymskie można montować na kilka sposobów: do ściany,
                    do sufitu lub bezinwazyjnie na ramę okna (przy pomocy
                    specjalnych uchwytów). Wybór zależy od preferencji i rodzaju
                    okna.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className='text-2xl font-medium mb-4 text-[var(--deep-navy)]'>
                🪟 Rolety plisowane
              </h3>
              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold text-lg text-gray-800'>
                    1. Czym różnią się rolety plisowane od tradycyjnych rolet?
                  </h4>
                  <p className='text-gray-700'>
                    Rolety plisowane składają się w harmonijkę i można je
                    regulować zarówno od góry, jak i od dołu, co daje większą
                    swobodę w zasłanianiu wybranej części okna. Są też bardziej
                    estetyczne i zajmują mniej miejsca.
                  </p>
                </div>
                <div>
                  <h4 className='font-semibold text-lg text-gray-800'>
                    2. Czy plisy nadają się do okien dachowych lub nietypowych
                    kształtów?
                  </h4>
                  <p className='text-gray-700'>
                    Tak, rolety plisowane są idealnym rozwiązaniem dla okien
                    dachowych, trapezowych, trójkątnych czy okrągłych. Można je
                    dopasować na wymiar niemal do każdego kształtu.
                  </p>
                </div>
                <div>
                  <h4 className='font-semibold text-lg text-gray-800'>
                    3. Jak czyścić rolety plisowane?
                  </h4>
                  <p className='text-gray-700'>
                    Najlepiej używać miękkiej ściereczki lub szczoteczki do
                    kurzu. W przypadku większych zabrudzeń można delikatnie
                    przetrzeć wilgotną ściereczką. Nie zaleca się całkowitego
                    zanurzania w wodzie, chyba że producent na to zezwala.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
