'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { setCustomerInfo } from '@/store/customerSlice';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import productsConfig from '@/config/products.json';
import {
  fetchCalculatorProducts,
  fetchCurtainProducts,
  CalcProduct,
} from '@/lib/supabase';
import AccordionCertificates from './AccordionCertificates';
import CarouselOfCurtains from './CarouselOfCurtains';
import FlyingPackage from './FlyingPackage';

interface Product {
  name: string;
  fabricPricePerMB: number;
  sewingPricePerMB: number;
  base?: string;
  imagePath: string;
  images: string[];
  description?: string;
  material?: string;
  composition?: string;
  alt_texts?: string[];
  pattern?: string;
  style_tags?: string[];
  maintenance?: string;
}

interface OrderFormProps {
  productName?: string;
  productType?: 'firany' | 'zaslony';
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rodWidth: string;
  height: string;
  tapeType: string;
  selectedProduct: string;
  selectedImageIndex: number;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  name: string;
  address: string;
  comments: string;
  quantity: number;
  productDetails: string;
  message: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  options: {
    width: string;
    height: string;
    embroidery: boolean;
    curtainRod: boolean;
    tapeType?: string;
  };
  productDetails?: string;
  message?: string;
}

const TAPE_TYPES = [
  { id: '', name: 'Wybierz rodzaj taśmy', ratio: 0, imagePath: '' },
  {
    id: 'pencil-8',
    name: 'Taśma ołówek 8 cm (Marszczenie 1:2)',
    ratio: 2,
    imagePath:
      'https://siyavnvmbwjhwgjwunjr.supabase.co/storage/v1/object/public/tasma/tamymarszczce/OLOWEK%208%20cm.jpg',
  },
  {
    id: 'pencil-2-5',
    name: 'Taśma ołówek 2,5 cm (Marszczenie 1:2)',
    ratio: 2,
    imagePath:
      'https://siyavnvmbwjhwgjwunjr.supabase.co/storage/v1/object/public/tasma/tamymarszczce/OLOWEK%202,5%20cm.jpg',
  },
  {
    id: 'dragon-5',
    name: 'Taśma smok 5 cm (Marszczenie 1:2)',
    ratio: 2,
    imagePath:
      'https://siyavnvmbwjhwgjwunjr.supabase.co/storage/v1/object/public/tasma/tamymarszczce/SMOK%205cm.jpg',
  },
];

export default function OrderForm({
  productName,
  productType = 'firany',
}: OrderFormProps) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [modalImageAlt, setModalImageAlt] = useState('');
  const [tapeError, setTapeError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTapeImage, setShowTapeImage] = useState(false);
  const [selectedTapeImage, setSelectedTapeImage] = useState('');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [cartAnimation, setCartAnimation] = useState(false);
  const [showFlyingPackage, setShowFlyingPackage] = useState(false);
  const [isPackageAnimating, setIsPackageAnimating] = useState(false);
  const [imgErrors, setImgErrors] = useState<{ [key: number]: boolean }>({});
  const [showTapeDropdown, setShowTapeDropdown] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    rodWidth: '',
    height: '',
    tapeType: '', // Początkowa wartość neutralna
    selectedProduct: productName || '',
    selectedImageIndex: 0,
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    name: '',
    address: '',
    comments: '',
    quantity: 1,
    productDetails: '',
    message: '',
  });

  useEffect(() => {
    async function loadProducts() {
      try {
        setProductsLoading(true);
        // W zależności od typu produktu, pobieramy odpowiednie dane
        const productsData =
          productType === 'zaslony'
            ? await fetchCurtainProducts()
            : await fetchCalculatorProducts();

        console.log(
          `Surowe dane produktów z bazy (${productType || 'firany'}):`,
          productsData,
        );

        // Sprawdźmy format obrazów
        if (productsData.length > 0) {
          console.log('Format danych obrazów:', {
            product: productsData[0],
          });
        }

        // Mapowanie pól z Supabase na interfejs Product
        const mappedProducts: Product[] = productsData.map((product) => ({
          name: product.name,
          fabricPricePerMB:
            product.fabricPricePerMB || product.fabric_price_per_mb || 0,
          sewingPricePerMB:
            product.sewingPricePerMB || product.sewing_price_per_mb || 0,
          base: product.base,
          imagePath: product.imagePath || product.image_path || '',
          images: Array.isArray(product.images) ? product.images : [],
          description: product.description || '',
          material: product.material || '',
          composition: product.composition || '',
          alt_texts: Array.isArray(product.alt_texts) ? product.alt_texts : [],
          pattern: product.pattern || '',
          style_tags: Array.isArray(product.style_tags)
            ? product.style_tags
            : [],
          maintenance: product.maintenance || '',
        }));

        console.log(
          `Zmapowane produkty (${productType || 'firany'}):`,
          mappedProducts,
        );
        setProducts(mappedProducts);

        // Jeśli nie ma aktualnie wybranego produktu, a mamy produkty, wybierz pierwszy
        if (!formData.selectedProduct && mappedProducts.length > 0) {
          setFormData((prev) => ({
            ...prev,
            selectedProduct: mappedProducts[0].name,
          }));
        }
      } catch (err) {
        console.error('Błąd podczas ładowania produktów:', err);
        setError('Nie udało się załadować produktów. Używam danych lokalnych.');

        // Fallback do danych z pliku JSON - użyjemy ich bez modyfikacji
        setProducts(productsConfig.products);

        // Jeśli nie ma aktualnie wybranego produktu, wybierz pierwszy z fallbacku
        if (!formData.selectedProduct && productsConfig.products.length > 0) {
          setFormData((prev) => ({
            ...prev,
            selectedProduct: productsConfig.products[0].name,
          }));
        }
      } finally {
        setProductsLoading(false);
      }
    }

    loadProducts();
  }, [productType]);

  // Znajdź aktualnie wybrany produkt
  const selectedProduct = products.find(
    (product) => product.name === formData.selectedProduct,
  );

  // Znajdź aktualnie wybraną taśmę
  const selectedTape = TAPE_TYPES.find((tape) => tape.id === formData.tapeType);

  // Ceny materiału i szycia bazujące na wybranym produkcie
  const MATERIAL_PRICE_PER_METER = selectedProduct
    ? selectedProduct.fabricPricePerMB
    : 0;
  const SEWING_PRICE_PER_METER = selectedProduct
    ? selectedProduct.sewingPricePerMB
    : 0;

  useEffect(() => {
    // Ustawienie productName jako domyślnego produktu jeśli został przekazany
    if (productName && products.length > 0) {
      setFormData((prev) => ({
        ...prev,
        selectedProduct: productName,
      }));
    }
  }, [productName, products]);

  // Obliczanie ceny tylko materiału (bez szycia)
  const calculateMaterialPrice = () => {
    const rodWidth = parseFloat(formData.rodWidth) || 0;
    const selectedTape = TAPE_TYPES.find(
      (tape) => tape.id === formData.tapeType,
    );

    if (!selectedTape || !selectedTape.ratio || !rodWidth || !selectedProduct)
      return 0;

    if (productType === 'zaslony') {
      // Dla zasłon: obliczamy dla jednej zasłony
      const szerokoscPoTasmieCm = rodWidth * selectedTape.ratio;
      const iloscMaterialuNaJednaZaslone = szerokoscPoTasmieCm / 2; // dzielimy przez 2 bo potrzebujemy tylko na jedną zasłonę
      const iloscMaterialuWM = iloscMaterialuNaJednaZaslone / 100; // konwersja z cm na metry
      // Mnożymy cenę materiału przez 2, bo w bazie jest za 0,5MB
      const kosztMaterialu = iloscMaterialuWM * (MATERIAL_PRICE_PER_METER * 2);
      return Math.round(kosztMaterialu * 100) / 100;
    } else {
      // Dla firan: zachowujemy obecną logikę
      const iloscMaterialu = (rodWidth * selectedTape.ratio) / 100; // konwersja z cm na metry
      const kosztMaterialu = iloscMaterialu * MATERIAL_PRICE_PER_METER;
      return Math.round(kosztMaterialu * 100) / 100;
    }
  };

  // Pełna kalkulacja ceny (materiał + szycie)
  const calculatePrice = () => {
    const rodWidth = parseFloat(formData.rodWidth) || 0;
    const height = parseFloat(formData.height) || 0;
    const selectedTape = TAPE_TYPES.find(
      (tape) => tape.id === formData.tapeType,
    );

    if (
      !selectedTape ||
      !selectedTape.ratio ||
      !rodWidth ||
      !height ||
      !selectedProduct
    )
      return 0;

    if (productType === 'zaslony') {
      // Dla zasłon:
      // 1. Obliczamy koszt materiału dla jednej zasłony
      const szerokoscPoTasmieCm = rodWidth * selectedTape.ratio;
      const iloscMaterialuNaJednaZaslone = szerokoscPoTasmieCm / 2; // dzielimy przez 2 bo potrzebujemy tylko na jedną zasłonę
      const iloscMaterialuWM = iloscMaterialuNaJednaZaslone / 100; // konwersja z cm na metry
      // Mnożymy cenę materiału przez 2, bo w bazie jest za 0,5MB
      const kosztMaterialu = iloscMaterialuWM * (MATERIAL_PRICE_PER_METER * 2);

      // 2. Obliczamy koszt szycia dla jednej zasłony (6 zł za metr bieżący)
      const metryBiezaceSzycie =
        (2 * iloscMaterialuNaJednaZaslone + 2 * height) / 100; // w metrach
      const kosztSzycia = metryBiezaceSzycie * 6;

      // 3. Łączny koszt dla jednej zasłony
      const kosztJednejZaslony = kosztMaterialu + kosztSzycia;

      // 4. Mnożymy przez ilość sztuk
      const cenaKoncowa = kosztJednejZaslony * formData.quantity;

      return Math.round(cenaKoncowa * 100) / 100;
    } else {
      // Dla firan: zachowujemy obecną logikę
      const iloscMaterialu = (rodWidth * selectedTape.ratio) / 100; // konwersja z cm na metry
      const kosztMaterialu = iloscMaterialu * MATERIAL_PRICE_PER_METER;

      // Obliczanie długości bieżącej szycia
      const szerokoscPoTasmieCm = rodWidth * selectedTape.ratio;
      const metryBiezaceSzycie = (2 * szerokoscPoTasmieCm + 2 * height) / 100;

      // Logika szycia dla FIRANEK: 4 zł za każde rozpoczęte 0.5 metra
      const sewingUnits = Math.ceil(metryBiezaceSzycie / 0.5);
      const kosztSzycia = sewingUnits * 4;

      // Całkowity koszt (materiał + szycie) * ilość sztuk
      return (
        Math.round((kosztMaterialu + kosztSzycia) * formData.quantity * 100) /
        100
      );
    }
  };

  // Funkcja pomocnicza do formatowania kwoty
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',');
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    // Sprawdź czy użytkownik wpisuje wymiary bez wybranej taśmy
    if (
      (name === 'rodWidth' || name === 'height') &&
      value !== '' &&
      !formData.tapeType
    ) {
      setTapeError(
        'Wybierz rodzaj taśmy marszczącej, a kalkulator uwzględni nadmiar materiału, potrzebnego do uszycia dekoracji',
      );
    }

    if (name === 'tapeType') {
      if (value === '') {
        // Jeśli użytkownik ma już wpisane wymiary, pokaż błąd
        if (formData.rodWidth || formData.height) {
          setTapeError(
            'Wybierz rodzaj taśmy marszczącej, a kalkulator uwzględni nadmiar materiału, potrzebnego do uszycia dekoracji',
          );
        }
        setShowTapeImage(false); // Ukryj obraz taśmy przy pustym wyborze
        setSelectedTapeImage('');
      } else {
        setTapeError(null); // Jeśli wybrano taśmę, usuń komunikat o błędzie
        const selected = TAPE_TYPES.find((tape) => tape.id === value);
        if (selected?.imagePath) {
          setSelectedTapeImage(selected.imagePath);
          setShowTapeImage(true);
        } else {
          setShowTapeImage(false);
          setSelectedTapeImage('');
        }
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailClick = (imageIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedImageIndex: imageIndex,
    }));
  };

  const openImageModal = (imageSrc: string, imageAlt?: string) => {
    console.log('Otwieranie modalu z obrazem:', imageSrc);

    if (!imageSrc) {
      console.error('Próba otwarcia modalu z pustym adresem obrazu');
      return;
    }

    setModalImageSrc(imageSrc);
    setModalImageAlt(imageAlt || 'Powiększony podgląd materiału');
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Sprawdź czy taśma została wybrana
    if (formData.tapeType === '') {
      setTapeError(
        'Wybierz rodzaj taśmy marszczącej, a kalkulator uwzględni nadmiar materiału, potrzebnego do uszycia dekoracji',
      );
      setIsPackageAnimating(false);
      return;
    }

    // Najpierw ustaw animację bez stanu ładowania
    setIsPackageAnimating(true);
    setError(null);

    try {
      // Po 1.5 sekundy dodaj do koszyka i zakończ cały proces
      setTimeout(() => {
        try {
          // Dodaj produkt do koszyka
          // calculatePrice() zwraca cenę za PARĘ lub sztukę (dla firan). Mnożymy przez quantity.
          const pricePerPair = calculatePrice();
          const totalPrice = pricePerPair * formData.quantity;

          const productId = uuidv4();
          const cartItem: CartItem = {
            id: productId,
            name: `${formData.selectedProduct} (${
              productType === 'zaslony' ? 'Zasłony' : 'Firany'
            })`, // Dodanie typu produktu do nazwy w koszyku
            price: totalPrice, // Łączna cena za wszystkie pary
            quantity: formData.quantity, // Ilość par
            options: {
              width: formData.rodWidth,
              height: formData.height,
              embroidery: false,
              curtainRod: false,
              tapeType: selectedTape?.name || 'N/A', // Dodanie typu taśmy do opcji
            },
            productDetails: `Szerokość karnisza: ${
              formData.rodWidth
            } cm, Wysokość: ${formData.height} cm, Taśma: ${
              selectedTape?.name || 'N/A'
            }`, // Dodanie szczegółów dla koszyka
            message: formData.comments, // Dodanie komentarzy do koszyka
          };

          // Dodaj produkt do koszyka
          dispatch(addToCart(cartItem));

          // Wyświetl komunikat o dodaniu do koszyka
          setError(
            `Produkt "${formData.selectedProduct}" (${formData.quantity} ${
              formData.quantity > 1 ? 'sztuk' : 'para'
            }) został dodany do koszyka. Możesz kontynuować zakupy.`,
          );

          // Zakończ animację i zresetuj stan
          setIsPackageAnimating(false);

          // Opcjonalnie zresetuj formularz po dodaniu do koszyka
          setFormData((prev) => ({
            ...prev,
            rodWidth: '',
            height: '',
            tapeType: '',
            quantity: 1,
            comments: '',
            // Nie resetuj selectedProduct ani selectedImageIndex, aby umożliwić szybkie dodanie podobnego produktu
          }));
          setTapeError(
            'Wybierz rodzaj taśmy marszczącej, a kalkulator uwzględni nadmiar materiału, potrzebnego do uszycia dekoracji',
          ); // Zresetuj komunikat o taśmie
          setShowTapeImage(false);
          setSelectedTapeImage('');
        } catch (error) {
          console.error('Błąd podczas dodawania do koszyka:', error);
          setError(
            error instanceof Error
              ? error.message
              : 'Wystąpił nieoczekiwany błąd',
          );
          setIsPackageAnimating(false);
        }
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd',
      );
      setIsPackageAnimating(false);
    }
  };

  // Funkcja obsługująca zakończenie animacji - nie jest już używana
  const handleAnimationComplete = () => {
    console.log('Animacja zakończona');
    // Ta funkcja nie jest już potrzebna, ale możemy ją zostawić dla kompatybilności
    setIsPackageAnimating(false);
  };

  // Nawigacja po miniaturkach
  const nextImage = () => {
    if (
      selectedProduct &&
      selectedProduct.images &&
      selectedProduct.images.length > 0
    ) {
      const newIndex =
        (formData.selectedImageIndex + 1) % selectedProduct.images.length;
      setFormData((prev) => ({
        ...prev,
        selectedImageIndex: newIndex,
      }));
    }
  };

  const prevImage = () => {
    if (
      selectedProduct &&
      selectedProduct.images &&
      selectedProduct.images.length > 0
    ) {
      const newIndex =
        (formData.selectedImageIndex -
          1 +
          (selectedProduct.images.length || 1)) %
        (selectedProduct.images.length || 1);
      setFormData((prev) => ({
        ...prev,
        selectedImageIndex: newIndex,
      }));
    }
  };

  // Funkcja wyświetlająca zdjęcie po najechaniu na nazwę produktu
  const handleProductHover = (productName: string) => {
    setHoveredProduct(productName);
  };

  const handleProductLeave = () => {
    setHoveredProduct(null);
  };

  // Funkcja znajdująca produkt po nazwie
  const getProductByName = (name: string) => {
    return products.find((product) => product.name === name);
  };

  // Funkcja zwracająca URL głównego zdjęcia produktu
  const getProductMainImage = (productName: string) => {
    const product = getProductByName(productName);
    if (product && product.images && product.images.length > 0) {
      return `${product.imagePath}/${product.images[0]}`;
    }
    return null;
  };

  // Dodaję nową funkcję do obsługi wyboru produktu z karuzeli
  const handleProductSelect = (productName: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedProduct: productName,
    }));
  };

  // Usunięto useEffect, który pokazywał błąd wyboru taśmy przy wprowadzaniu wymiarów

  return (
    <>
      {/* Zastępuję stary komponent karuzeli nowym */}
      {!productsLoading && products.length > 0 && (
        <div className='mb-6'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            Wybierz materiał{' '}
            {productType === 'zaslony' ? 'zasłonowy' : 'firanowy'}
          </h3>
          <CarouselOfCurtains
            products={products}
            selectedProduct={formData.selectedProduct}
            onProductSelect={handleProductSelect}
          />
        </div>
      )}
      <div className='order-form-container min-h-screen bg-gray-50'>
        {/* Pasek kontaktowy */}

        {/* Główny kontener - dwukolumnowy układ produktowy */}
        <div className='container mx-auto py-8 px-4 md:py-12'>
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Lewa kolumna - zdjęcie i detale produktu */}
            <div className='w-full lg:w-1/2'>
              <div className='sticky top-20 space-y-8'>
                {/* Sekcja zdjęcia */}
                {selectedProduct &&
                  selectedProduct.images &&
                  selectedProduct.images.length > 0 && (
                    <div className='bg-white p-4 rounded-lg shadow-sm'>
                      <div className='product-image-container relative w-full h-96 mb-4 rounded-lg overflow-hidden'>
                        <Image
                          src={`${selectedProduct.imagePath}/${
                            selectedProduct.images[formData.selectedImageIndex]
                          }`}
                          alt={
                            selectedProduct.alt_texts &&
                            selectedProduct.alt_texts[
                              formData.selectedImageIndex
                            ]
                              ? selectedProduct.alt_texts[
                                  formData.selectedImageIndex
                                ]
                              : `${selectedProduct.name} - podgląd`
                          }
                          fill
                          sizes='(max-width: 768px) 100vw, 600px'
                          className='object-contain'
                          quality={90}
                          onClick={() => {
                            const currentImage = `${
                              selectedProduct.imagePath
                            }/${
                              selectedProduct.images[
                                formData.selectedImageIndex
                              ]
                            }`;
                            openImageModal(
                              currentImage,
                              selectedProduct.alt_texts &&
                                selectedProduct.alt_texts[
                                  formData.selectedImageIndex
                                ]
                                ? selectedProduct.alt_texts[
                                    formData.selectedImageIndex
                                  ]
                                : `${selectedProduct.name} - duży podgląd`,
                            );
                          }}
                          priority
                        />
                        <div className='absolute bottom-2 right-2 bg-deep-navy/70 text-white text-xs px-2 py-1 rounded'>
                          Kliknij, aby powiększyć
                        </div>
                      </div>

                      {/* Miniatury - wyświetlane w formie galerii */}
                      {selectedProduct.images.length > 1 && (
                        <div className='product-thumbnails'>
                          <div className='flex gap-2 overflow-x-auto pb-2'>
                            {selectedProduct.images.map(
                              (img, index) =>
                                !imgErrors[index] && (
                                  <div
                                    key={index}
                                    className={`
                                    cursor-pointer border-2 rounded overflow-hidden w-20 h-20 relative flex-shrink-0
                                    ${
                                      formData.selectedImageIndex === index
                                        ? 'border-royal-gold'
                                        : 'border-gray-200'
                                    }
                                  `}
                                    onClick={() => handleThumbnailClick(index)}
                                  >
                                    <Image
                                      src={`${selectedProduct.imagePath}/${img}`}
                                      alt={
                                        selectedProduct.alt_texts &&
                                        selectedProduct.alt_texts[index]
                                          ? selectedProduct.alt_texts[index]
                                          : `${
                                              selectedProduct.name
                                            } - miniatura ${index + 1}`
                                      }
                                      fill
                                      sizes='80px'
                                      className='object-cover'
                                      quality={60}
                                      onError={() => {
                                        setImgErrors((prev) => ({
                                          ...prev,
                                          [index]: true,
                                        }));
                                      }}
                                    />
                                  </div>
                                ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                {/* Szczegóły produktu */}
                {selectedProduct && (
                  <div className='product-details bg-white p-6 rounded-lg shadow-sm'>
                    <h2
                      className='text-2xl font-medium text-deep-navy mb-4'
                      onMouseOver={() =>
                        handleProductHover(selectedProduct.name)
                      }
                      onMouseOut={handleProductLeave}
                      style={{ cursor: 'pointer' }}
                    >
                      {selectedProduct.name}
                    </h2>

                    {selectedProduct.description && (
                      <div className='mb-4'>
                        <h3 className='text-lg font-medium mb-2'>Opis</h3>
                        <p className='text-gray-700'>
                          {selectedProduct.description}
                        </p>
                      </div>
                    )}

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                      {selectedProduct.material && (
                        <div>
                          <h3 className='text-sm font-medium text-gray-700'>
                            Materiał
                          </h3>
                          <p className='text-gray-600'>
                            {selectedProduct.material}
                          </p>
                        </div>
                      )}

                      {selectedProduct.composition && (
                        <div>
                          <h3 className='text-sm font-medium text-gray-700'>
                            Skład
                          </h3>
                          <p className='text-gray-600'>
                            {selectedProduct.composition}
                          </p>
                        </div>
                      )}

                      {selectedProduct.pattern && (
                        <div>
                          <h3 className='text-sm font-medium text-gray-700'>
                            Wzór
                          </h3>
                          <p className='text-gray-600'>
                            {selectedProduct.pattern}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Tagi stylu */}
                    {selectedProduct.style_tags &&
                      selectedProduct.style_tags.length > 0 && (
                        <div className='mb-4'>
                          <h3 className='text-sm font-medium text-gray-700 mb-2'>
                            Style
                          </h3>
                          <div className='flex flex-wrap gap-2'>
                            {selectedProduct.style_tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className='inline-block px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full'
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Informacje o pielęgnacji */}
                    {selectedProduct.maintenance && (
                      <div className='p-3 bg-blue-50 rounded-md'>
                        <div className='flex items-start'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5 text-blue-600 mr-2 mt-0.5'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                            />
                          </svg>
                          <div>
                            <p className='text-sm font-medium text-blue-800'>
                              Pielęgnacja:
                            </p>
                            <p className='text-sm text-blue-700'>
                              {selectedProduct.maintenance}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Prawa kolumna - kalkulator i formularz */}
            <div className='w-full lg:w-1/2'>
              <div className='bg-white p-6 rounded-lg shadow-sm mb-6'>
                <h1 className='text-2xl font-medium text-deep-navy mb-6'>
                  Kalkulator zamówienia{' '}
                  {productType === 'zaslony' ? 'zasłon' : 'firan'}
                </h1>

                {error && (
                  <div
                    className={`mt-4 p-4 rounded-lg text-sm ${
                      error.includes('dodany do koszyka')
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {error}
                    {error.includes('dodany do koszyka') && (
                      <div className='mt-2'>
                        <a
                          href='/cart'
                          className='inline-flex items-center text-green-700 hover:text-green-900 font-medium'
                        >
                          Przejdź do koszyka
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-4 w-4 ml-1'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M14 5l7 7m0 0l-7 7m7-7H3'
                            />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-6'>
                  {/* 1. Wybór produktu */}
                  <div className='space-y-4'>
                    <h2 className='text-lg font-medium text-deep-navy'>
                      Wybór materiału{' '}
                      {productType === 'zaslony' ? 'zasłonowego' : 'firanowego'}
                    </h2>

                    {productsLoading ? (
                      <div className='flex items-center justify-center p-6'>
                        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-royal-gold'></div>
                        <span className='ml-3 text-gray-600'>
                          Ładowanie produktów...
                        </span>
                      </div>
                    ) : (
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Typ materiału
                        </label>
                        <select
                          name='selectedProduct'
                          value={formData.selectedProduct}
                          onChange={handleChange}
                          className='form-input-focus w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white/90'
                          required
                          onMouseOver={(e) => {
                            const option = e.target as HTMLSelectElement;
                            handleProductHover(option.value);
                          }}
                          onMouseOut={handleProductLeave}
                        >
                          {products.map((product) => (
                            <option
                              key={product.name}
                              value={product.name}
                              onMouseOver={() =>
                                handleProductHover(product.name)
                              }
                            >
                              {product.name} -{' '}
                              {formatPrice(product.fabricPricePerMB)} zł/mb
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* 2. Wymiary i taśma */}
                  <div className='space-y-4 pt-2'>
                    <h2 className='text-lg font-medium text-deep-navy'>
                      Wymiary i taśma
                    </h2>
                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Rodzaj taśmy
                        </label>
                        {/* Custom Select with Thumbnails */}
                        <div className='relative'>
                          <div
                            className={`form-input-focus w-full px-4 py-2 border rounded-lg focus:outline-none bg-white/90 cursor-pointer flex items-center justify-between ${
                              tapeError ? 'border-red-500' : 'border-gray-300'
                            }`}
                            onClick={() => setShowTapeDropdown((prev) => !prev)}
                          >
                            {formData.tapeType ? (
                              <div className='flex items-center gap-3'>
                                {TAPE_TYPES.find(
                                  (t) => t.id === formData.tapeType,
                                )?.imagePath && (
                                  <div className='relative h-8 w-12 flex-shrink-0'>
                                    <Image
                                      src={
                                        TAPE_TYPES.find(
                                          (t) => t.id === formData.tapeType,
                                        )?.imagePath || ''
                                      }
                                      alt='Wybrana taśma'
                                      fill
                                      className='object-contain'
                                    />
                                  </div>
                                )}
                                <span>
                                  {TAPE_TYPES.find(
                                    (t) => t.id === formData.tapeType,
                                  )?.name || 'Wybierz rodzaj taśmy'}
                                </span>
                              </div>
                            ) : (
                              <span>Wybierz rodzaj taśmy</span>
                            )}
                            <svg
                              className='h-5 w-5 text-gray-400'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d={
                                  showTapeDropdown
                                    ? 'M5 15l7-7 7 7'
                                    : 'M19 9l-7 7-7-7'
                                }
                              />
                            </svg>
                          </div>

                          {/* Dropdown Options */}
                          {showTapeDropdown && (
                            <div className='absolute z-30 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
                              {TAPE_TYPES.map((tape) => (
                                <div
                                  key={tape.id}
                                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                                    tape.id === '' ? 'text-gray-400' : ''
                                  } ${
                                    tape.id === formData.tapeType
                                      ? 'bg-gray-100'
                                      : ''
                                  }`}
                                  onClick={() => {
                                    if (tape.id !== '') {
                                      handleChange({
                                        target: {
                                          name: 'tapeType',
                                          value: tape.id,
                                        },
                                      } as React.ChangeEvent<HTMLSelectElement>);
                                      setShowTapeDropdown(false);
                                    }
                                  }}
                                >
                                  <div className='flex items-center gap-3'>
                                    {tape.imagePath && (
                                      <div className='relative h-10 w-16 flex-shrink-0'>
                                        <Image
                                          src={tape.imagePath}
                                          alt={tape.name}
                                          fill
                                          className='object-contain'
                                        />
                                      </div>
                                    )}
                                    <span>{tape.name}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Hidden native select for form submission */}
                        <select
                          name='tapeType'
                          value={formData.tapeType}
                          onChange={handleChange}
                          className='sr-only'
                          required
                          aria-hidden='true'
                        >
                          {TAPE_TYPES.map((tape) => (
                            <option
                              key={tape.id}
                              value={tape.id}
                              disabled={tape.id === ''}
                            >
                              {tape.name}
                            </option>
                          ))}
                        </select>
                        {tapeError && (
                          <p className='mt-1 text-sm text-red-600'>
                            {tapeError}
                          </p>
                        )}

                        {/* Wyświetlanie zdjęcia taśmy */}
                        {showTapeImage && selectedTapeImage && (
                          <div className='mt-2 p-2 bg-gray-50 rounded-lg'>
                            <p className='text-sm font-medium text-gray-700 mb-2'>
                              Podgląd wybranej taśmy:
                            </p>
                            <div className='relative w-full h-48 rounded overflow-hidden'>
                              <Image
                                src={selectedTapeImage}
                                alt={selectedTape?.name || 'Wybrana taśma'}
                                fill
                                sizes='(max-width: 768px) 100vw, 300px'
                                className='object-contain'
                                onError={(e) => {
                                  console.error(
                                    'Nie można załadować obrazu taśmy:',
                                    selectedTapeImage,
                                  );
                                  setShowTapeImage(false);
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className='flex flex-row gap-4'>
                        <div className='w-1/2'>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Szerokość karnisza (cm)
                          </label>
                          <input
                            type='number'
                            name='rodWidth'
                            value={formData.rodWidth}
                            onChange={handleChange}
                            min='1'
                            className='form-input-focus w-full px-4 py-2 border rounded-lg focus:outline-none bg-white/90'
                            required
                          />
                        </div>
                        <div className='w-1/2'>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Wysokość dekoracji (cm)
                          </label>
                          <input
                            type='number'
                            name='height'
                            value={formData.height}
                            onChange={handleChange}
                            min='1'
                            className='form-input-focus w-full px-4 py-2 border rounded-lg focus:outline-none bg-white/90'
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Szczegóły kalkulacji */}
                  <div className='mb-8'>
                    <div className='calculation-details bg-white/90 p-4 rounded-lg'>
                      <h3 className='text-lg font-medium mb-3'>
                        Szczegóły kalkulacji{' '}
                        {productType === 'zaslony' ? '(za sztukę)' : ''}
                      </h3>
                      <div className='space-y-2'>
                        <div className='flex justify-between items-center text-sm'>
                          <span className='text-gray-600'>
                            Wybrany materiał:
                          </span>
                          <span className='font-medium'>
                            {selectedProduct?.name || '-'}
                          </span>
                        </div>
                        <div className='flex justify-between items-center text-sm'>
                          <span className='text-gray-600'>
                            Cena materiału (za mb):
                          </span>
                          <span className='font-medium'>
                            {selectedProduct
                              ? `${formatPrice(
                                  productType === 'zaslony'
                                    ? selectedProduct.fabricPricePerMB * 2 // Mnożymy przez 2 dla zasłon
                                    : selectedProduct.fabricPricePerMB,
                                )} zł/mb`
                              : '-'}
                          </span>
                        </div>
                        <div className='flex justify-between items-center text-sm'>
                          <span className='text-gray-600'>Rodzaj taśmy:</span>
                          <span className='font-medium'>
                            {selectedTape?.name || '-'}
                          </span>
                        </div>
                        <div className='flex justify-between items-center text-sm'>
                          <span className='text-gray-600'>
                            Szerokość materiału:
                          </span>
                          <span className='font-medium'>
                            {formData.rodWidth && formData.tapeType
                              ? `${formatPrice(
                                  parseFloat(formData.rodWidth) *
                                    (selectedTape?.ratio || 0),
                                )} cm`
                              : '-'}
                          </span>
                        </div>
                        <div className='flex justify-between items-center text-sm'>
                          <span className='text-gray-600'>
                            Wysokość{' '}
                            {productType === 'zaslony' ? 'zasłony' : 'firany'}:
                          </span>
                          <span className='font-medium'>
                            {formData.height ? `${formData.height} cm` : '-'}
                          </span>
                        </div>
                        <div className='flex justify-between items-center text-sm'>
                          <span className='text-gray-600'>
                            Materiał potrzebny na sztukę
                          </span>
                          <span className='font-medium'>
                            {formData.rodWidth &&
                            formData.tapeType &&
                            selectedTape
                              ? `${formatPrice(
                                  productType === 'zaslony'
                                    ? (parseFloat(formData.rodWidth) *
                                        selectedTape.ratio) /
                                        2
                                    : parseFloat(formData.rodWidth) *
                                        selectedTape.ratio,
                                )} cm`
                              : '-'}
                          </span>
                        </div>
                        <div className='flex justify-between items-center text-sm'>
                          <span className='text-gray-600'>Sztuk: </span>
                          <span className='font-medium'>
                            {formData.quantity}
                          </span>
                        </div>
                        <div className='flex justify-between items-center text-sm'>
                          <span className='text-gray-600'>Koszt szycia:</span>
                          <span className='font-medium'>
                            {formData.rodWidth &&
                            formData.height &&
                            selectedProduct &&
                            formData.tapeType &&
                            selectedTape
                              ? (() => {
                                  if (productType === 'zaslony') {
                                    // Dla zasłon: koszt szycia dla jednej sztuki
                                    const szerokoscPoTasmieCm =
                                      parseFloat(formData.rodWidth) *
                                      selectedTape.ratio;
                                    const iloscMaterialuNaJednaZaslone =
                                      szerokoscPoTasmieCm / 2;
                                    const metryBiezaceSzycie =
                                      (2 * iloscMaterialuNaJednaZaslone +
                                        2 * parseFloat(formData.height)) /
                                      100;
                                    return `${formatPrice(
                                      metryBiezaceSzycie * 6,
                                    )} zł`;
                                  } else {
                                    // Dla firan: koszt szycia dla pary
                                    const szerokoscPoTasmieCm =
                                      parseFloat(formData.rodWidth) *
                                      selectedTape.ratio;
                                    const metryBiezaceSzycie =
                                      (2 * szerokoscPoTasmieCm +
                                        2 * parseFloat(formData.height)) /
                                      100;
                                    const sewingUnits = Math.ceil(
                                      metryBiezaceSzycie / 0.5,
                                    );
                                    return `${formatPrice(sewingUnits * 4)} zł`;
                                  }
                                })()
                              : '-'}
                          </span>
                        </div>
                      </div>
                      <div className='pt-4 border-t border-gray-200 mt-4'>
                        <div className='flex justify-between items-center mt-2'>
                          <span className='text-lg font-medium text-deep-navy'>
                            {productType === 'zaslony'
                              ? `Razem (za ${formData.quantity} ${
                                  formData.quantity > 1 ? 'sztuki' : 'sztukę'
                                }):`
                              : `Razem (za ${formData.quantity} ${
                                  formData.quantity > 1 ? 'sztuki' : 'sztukę'
                                }):`}
                          </span>
                          <span className='text-xl font-bold text-deep-navy'>
                            {formatPrice(calculatePrice())} zł
                          </span>
                        </div>
                        {calculatePrice() > 399 && (
                          <div className='mt-2 text-green-600 font-medium'>
                            Darmowa dostawa
                          </div>
                        )}
                        <div className='mt-2 text-gray-500 text-sm'>
                          Darmowa dostawa od 399 zł
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. Ilość sztuk */}
                  <div className='mb-6'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      sztuk
                    </label>
                    <input
                      type='number'
                      name='quantity'
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      min='1'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                    />
                  </div>

                  {/* 5. Certyfikaty w nowym układzie */}
                  <AccordionCertificates />

                  {/* Przewodnik pomiarowy */}
                  <div className='bg-gray-50 p-4 rounded-lg border border-gray-100 mb-8'>
                    <div className='flex items-start'>
                      <div className='mr-4 text-deep-navy'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-6 w-6'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className='text-sm font-medium text-deep-navy mb-1'>
                          Nie masz pewności jak zmierzyć okno?
                        </h4>
                        <p className='text-xs text-gray-600 mb-2'>
                          Sprawdź nasz przewodnik, który pomoże Ci dokonać
                          poprawnych pomiarów.
                        </p>
                        <a
                          href='/jak-mierzyc'
                          className='text-royal-gold hover:text-gold text-sm font-medium inline-flex items-center'
                        >
                          Zobacz przewodnik
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-4 w-4 ml-1'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M14 5l7 7m0 0l-7 7m7-7H3'
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Dodatkowe uwagi do zamówienia */}
                  <div className='mb-8'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Dodatkowe uwagi do zamówienia
                    </label>
                    <textarea
                      name='comments'
                      value={formData.comments}
                      onChange={handleChange}
                      rows={3}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                    />
                  </div>

                  {/* Przycisk dodania do koszyka */}
                  <button
                    type='submit'
                    disabled={isLoading}
                    className='premium-button relative w-full py-8 px-6 text-white rounded-lg font-medium text-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 shadow-lg bg-deep-navy hover:bg-gradient-to-r hover:from-royal-gold hover:to-gold overflow-visible'
                    style={{ minHeight: '80px' }}
                  >
                    {isLoading ? (
                      <span className='flex items-center justify-center'>
                        <svg
                          className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        Przetwarzanie...
                      </span>
                    ) : (
                      <>
                        <span className='flex items-center justify-center relative z-10'>
                          Dodaj do koszyka
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5 ml-2'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                            />
                          </svg>
                        </span>
                        {isPackageAnimating && (
                          <FlyingPackage isAnimating={isPackageAnimating} />
                        )}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Modal do powiększenia obrazu */}
        {showImageModal && (
          <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4'>
            <div className='relative w-full max-w-4xl h-[80vh]'>
              <button
                onClick={closeImageModal}
                className='absolute top-0 right-0 -mt-12 -mr-12 bg-white rounded-full p-2 text-black z-10'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
              <div className='relative w-full h-full'>
                {/* Dodanie obsługi błędów ładowania obrazu */}
                {modalImageSrc && (
                  <div className='relative w-full h-full'>
                    <Image
                      src={modalImageSrc}
                      alt={modalImageAlt}
                      fill
                      sizes='(max-width: 1200px) 100vw, 1200px'
                      className='object-contain'
                      quality={90}
                      priority
                      onError={(e) => {
                        console.error('Błąd ładowania obrazu:', modalImageSrc);
                        alert(`Nie można załadować obrazu: ${modalImageSrc}`);
                        closeImageModal();
                      }}
                    />
                  </div>
                )}
                {!modalImageSrc && (
                  <div className='flex items-center justify-center w-full h-full text-white'>
                    Nie można załadować obrazu
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Panel podglądu produktu po najechaniu kursorem */}
        {hoveredProduct && (
          <div className='fixed top-1/4 left-10 z-40 bg-white rounded-lg shadow-lg p-4 max-w-xs'>
            <h4 className='text-sm font-medium mb-2'>{hoveredProduct}</h4>
            {getProductMainImage(hoveredProduct) && (
              <div className='relative w-full h-60'>
                <Image
                  src={getProductMainImage(hoveredProduct) as string}
                  alt={`Podgląd materiału ${hoveredProduct}`}
                  fill
                  sizes='300px'
                  className='object-contain'
                  quality={80}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
