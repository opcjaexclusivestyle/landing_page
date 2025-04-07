'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeaderMask from '../components/HeaderMask';

export default function Rolety() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [price, setPrice] = useState(0);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [showContent, setShowContent] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const circle1Ref = useRef<SVGSVGElement>(null);
  const headerRef = useRef(null);
  const descriptionRef = useRef(null);
  const faqRef = useRef(null);
  const videoRef = useRef(null);
  const formRef = useRef(null);

  // Rejestracja pluginów GSAP
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Animacja po kliknięciu przycisku "Odkryj"
  const handleEnterClick = () => {
    setShowContent(true);
    gsap.to(window, {
      scrollTo: 0,
      duration: 1,
      ease: 'power2.inOut',
    });

    if (layer1Ref.current && circle1Ref.current) {
      const tl = gsap.timeline();
      tl.to(circle1Ref.current, {
        scale: 2000,
        duration: 2,
        transformOrigin: '50% 50%',
        ease: 'power3.inOut',
      });

      tl.to(
        '.layer-1-first',
        {
          opacity: 1,
          duration: 1,
          y: -50,
        },
        1,
      );
    }
  };

  // Animacja warstw przy przewijaniu
  useEffect(() => {
    if (showContent && contentRef.current) {
      // Animacja przewijania dla warstw
      const layerTimeline = gsap.timeline();
      layerTimeline.to('.triggerLetter', {
        scale: 200,
        duration: 1,
      });

      ScrollTrigger.create({
        animation: layerTimeline,
        trigger: '.layers',
        start: 'top top',
        end: '+=300%',
        scrub: true,
        pin: true,
        anticipatePin: 1,
      });

      // Animacja głównej zawartości
      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        delay: 0.5,
        ease: 'power3.out',
      });
    }
  }, [showContent]);

  // Efekty animacji przy ładowaniu zawartości
  useEffect(() => {
    if (showContent) {
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

      tl.from(
        [faqRef.current, videoRef.current, formRef.current],
        {
          opacity: 0,
          y: 50,
          stagger: 0.3,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.4',
      );
    }
  }, [showContent]);

  // Produkty rolet
  const products = [
    { id: 'dzien-noc-premium', name: 'Dzień-Noc Premium', price: 280 },
    { id: 'klasyczne-rolety', name: 'Klasyczne Rolety', price: 220 },
    { id: 'rolety-rzymskie', name: 'Rolety Rzymskie', price: 350 },
    { id: 'system-elektryczny', name: 'System Elektryczny', price: 450 },
  ];

  // FAQ
  const faqItems = [
    {
      question: 'Jakie są zalety rolet Dzień-Noc?',
      answer:
        'Rolety Dzień-Noc oferują wyjątkową kontrolę nad promieniami słonecznymi, pozwalając na regulację natężenia światła bez całkowitego zaciemnienia pomieszczenia. Są idealne do pomieszczeń, gdzie potrzebna jest elastyczna kontrola światła.',
    },
    {
      question: 'Czy rolety można zamontować samodzielnie?',
      answer:
        'Większość naszych rolet oferuje prosty system montażu, który można wykonać samodzielnie. Do każdego produktu dołączamy szczegółową instrukcję montażu. Oferujemy również usługę profesjonalnego montażu za dodatkową opłatą.',
    },
    {
      question: 'Jak dbać o rolety?',
      answer:
        'Rolety można czyścić przy pomocy miękkiej ściereczki i delikatnych środków czyszczących. W przypadku trudnych zabrudzeń, zalecamy kontakt z naszym serwisem w celu konsultacji najlepszej metody czyszczenia dla danego typu rolet.',
    },
    {
      question: 'Ile czasu zajmuje realizacja zamówienia?',
      answer:
        'Standardowy czas realizacji to 7-14 dni roboczych. W przypadku produktów spersonalizowanych lub systemów elektrycznych, czas może się wydłużyć do 3 tygodni.',
    },
  ];

  // Obliczanie ceny na podstawie wybranych opcji
  useEffect(() => {
    if (selectedProduct && width && height) {
      const selectedProductObj = products.find((p) => p.id === selectedProduct);
      if (selectedProductObj) {
        // Obliczanie ceny na podstawie wymiarów i wybranego produktu
        const area = (parseFloat(width) / 100) * (parseFloat(height) / 100); // m²
        const basePrice = selectedProductObj.price;
        const calculatedPrice = Math.round(basePrice * area);
        setPrice(calculatedPrice < basePrice ? basePrice : calculatedPrice);
      }
    } else {
      setPrice(0);
    }
  }, [selectedProduct, width, height]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Tutaj będzie obsługa wysyłania formularza
    alert(
      'Twoje zamówienie zostało przyjęte! Wkrótce skontaktujemy się z Tobą.',
    );
  };

  return (
    <>
      {/* Header z animowaną maską */}
      <HeaderMask
        videoSrc='/video/curtains.mp4' // Można użyć tego samego wideo lub dodać nowe
        title='ROLETY'
        onEnterClick={handleEnterClick}
      />

      {/* Warstwy przejściowe */}
      {showContent && (
        <section className='layers relative'>
          <div
            ref={layer1Ref}
            className='text_wapper layer-1 h-screen w-full flex items-center justify-center'
          >
            <h1 className='layer-1-first text-6xl text-white opacity-0'>
              Nowoczesne <span className='triggerLetter'>R</span>olety
            </h1>
            <svg
              ref={circle1Ref}
              id='layer1circle'
              width='1'
              height='1'
              viewBox='0 0 268 269'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='absolute'
            >
              <circle cx='134' cy='134.378' r='134' fill='var(--amber)' />
            </svg>
          </div>
        </section>
      )}

      {/* Główna zawartość strony - widoczna po przejściu animacji */}
      <div
        ref={contentRef}
        className={`min-h-screen py-10 px-4 md:px-8 lg:px-16 bg-[var(--light-gold)] ${
          showContent ? 'opacity-100' : 'opacity-0 -translate-y-10'
        }`}
        style={{ transition: 'opacity 0.5s ease, transform 0.5s ease' }}
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
            Rolety
          </h1>
          <div className='w-[100px]'></div> {/* Pusty element dla wyrównania */}
        </div>

        {/* Opis */}
        <div
          className='max-w-4xl mx-auto mb-16 text-center'
          ref={descriptionRef}
        >
          <p className='text-lg md:text-xl leading-relaxed mb-6'>
            Nasze rolety łączą nowoczesny design z funkcjonalnością, oferując
            idealne rozwiązanie dla każdego wnętrza. Wykonane z wysokiej jakości
            materiałów, zapewniają doskonałą kontrolę światła i prywatności,
            jednocześnie stanowiąc elegancki element dekoracyjny.
          </p>
          <p className='text-lg md:text-xl leading-relaxed'>
            Wybierz spośród szerokiej gamy wzorów i kolorów, aby dopasować
            rolety do swojego stylu i potrzeb. Od prostych, minimalistycznych
            rozwiązań, po zaawansowane systemy sterowane elektronicznie - mamy
            wszystko, czego potrzebujesz.
          </p>
        </div>

        {/* FAQ */}
        <div className='max-w-3xl mx-auto mb-16' ref={faqRef}>
          <h2 className='text-2xl md:text-3xl mb-8 text-center luxury-heading'>
            Często zadawane pytania
          </h2>
          <div className='space-y-6'>
            {faqItems.map((item, index) => (
              <div key={index} className='border-b border-[var(--gold)] pb-4'>
                <h3 className='text-xl font-medium mb-2'>{item.question}</h3>
                <p className='text-gray-700'>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Film instruktażowy */}
        <div className='max-w-3xl mx-auto mb-16' ref={videoRef}>
          <h2 className='text-2xl md:text-3xl mb-8 text-center luxury-heading'>
            Jak mierzyć okna do rolet?
          </h2>
          <div className='aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden'>
            {/* Tutaj będzie osadzony film */}
            <div className='text-center p-8'>
              <p className='text-xl mb-4'>Film instruktażowy</p>
              <p>
                Dowiedz się, jak prawidłowo zmierzyć okno, aby dobrać idealny
                rozmiar rolet
              </p>
            </div>
          </div>
        </div>

        {/* Formularz zamówienia */}
        <div className='max-w-3xl mx-auto mb-16' ref={formRef}>
          <h2 className='text-2xl md:text-3xl mb-8 text-center luxury-heading'>
            Zamów swoje wymarzone rolety
          </h2>
          <form
            onSubmit={handleSubmit}
            className='bg-white p-6 rounded-lg shadow-md'
          >
            {/* Wybór produktu */}
            <div className='mb-6'>
              <label className='block text-gray-700 mb-2 font-medium'>
                Wybierz produkt:
              </label>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`border p-4 rounded-lg cursor-pointer transition-all ${
                      selectedProduct === product.id
                        ? 'border-[var(--gold)] bg-[var(--light-gold)]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedProduct(product.id)}
                  >
                    <div className='h-40 bg-gray-100 mb-3 rounded flex items-center justify-center'>
                      {/* Tutaj będzie zdjęcie produktu */}
                      <p className='text-gray-500'>Zdjęcie produktu</p>
                    </div>
                    <h3 className='font-medium'>{product.name}</h3>
                    <p className='text-sm text-gray-500'>
                      Od {product.price} zł
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Wymiary */}
            <div className='mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='width'
                  className='block text-gray-700 mb-2 font-medium'
                >
                  Szerokość (cm):
                </label>
                <input
                  type='number'
                  id='width'
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                  required
                  min='20'
                  max='500'
                />
              </div>
              <div>
                <label
                  htmlFor='height'
                  className='block text-gray-700 mb-2 font-medium'
                >
                  Wysokość (cm):
                </label>
                <input
                  type='number'
                  id='height'
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                  required
                  min='20'
                  max='400'
                />
              </div>
            </div>

            {/* Cena */}
            {price > 0 && (
              <div className='mb-6 p-4 bg-[var(--light-gold)] rounded-md'>
                <h3 className='text-lg font-medium mb-2'>Wycena</h3>
                <p className='text-2xl font-medium text-[var(--deep-navy)]'>
                  {price} zł
                </p>
                <p className='text-sm text-gray-500'>
                  *Cena zawiera podatek VAT i koszty dostawy
                </p>
              </div>
            )}

            {/* Dane kontaktowe */}
            <div className='mb-6'>
              <h3 className='text-lg font-medium mb-4'>Dane kontaktowe</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-gray-700 mb-2 font-medium'
                  >
                    Imię i nazwisko:
                  </label>
                  <input
                    type='text'
                    id='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='city'
                    className='block text-gray-700 mb-2 font-medium'
                  >
                    Miasto:
                  </label>
                  <input
                    type='text'
                    id='city'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='postalCode'
                    className='block text-gray-700 mb-2 font-medium'
                  >
                    Kod pocztowy:
                  </label>
                  <input
                    type='text'
                    id='postalCode'
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='street'
                    className='block text-gray-700 mb-2 font-medium'
                  >
                    Ulica:
                  </label>
                  <input
                    type='text'
                    id='street'
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='houseNumber'
                    className='block text-gray-700 mb-2 font-medium'
                  >
                    Numer domu/mieszkania:
                  </label>
                  <input
                    type='text'
                    id='houseNumber'
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                    required
                  />
                </div>
              </div>
            </div>

            {/* Przycisk zamówienia */}
            <div className='text-center'>
              <button
                type='submit'
                className='magic-button'
                disabled={!selectedProduct || !width || !height || !name}
              >
                Złóż zamówienie
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
