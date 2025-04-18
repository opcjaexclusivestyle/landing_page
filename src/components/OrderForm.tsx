'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { setCustomerInfo } from '@/store/customerSlice';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import productsConfig from '@/config/products.json';
import { fetchCalculatorProducts, CalcProduct } from '@/lib/supabase';
import AccordionCertificates from './AccordionCertificates';

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
  productType?: string;
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
  };
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
  productType,
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
        const productsData = await fetchCalculatorProducts();

        console.log('Surowe dane produktów z bazy:', productsData);

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

        console.log('Zmapowane produkty:', mappedProducts);
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
  }, []);

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

    // Obliczanie szerokości materiału po marszczeniu
    const materialWidth = rodWidth * selectedTape.ratio;

    // Dla kalkulacji samego materiału przyjmujemy wysokość 1 metra
    const defaultHeight = 100; // 1 metr w cm

    // Obliczanie metrów bieżących
    const meters = (materialWidth * defaultHeight) / 10000; // konwersja z cm² na m²

    // Obliczanie ceny materiału za metr bieżący
    const materialCost = meters * MATERIAL_PRICE_PER_METER;

    // Zaokrąglenie do 2 miejsc po przecinku
    return Math.round(materialCost * 100) / 100;
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

    // Obliczanie szerokości materiału po marszczeniu
    const materialWidth = rodWidth * selectedTape.ratio;

    // Obliczanie metrów bieżących
    const meters = (materialWidth * height) / 10000; // konwersja z cm² na m²

    // Obliczanie ceny materiału
    const materialCost = meters * MATERIAL_PRICE_PER_METER;

    // Obliczanie kosztu szycia - 4 zł za każde 0,5 mb
    const sewingUnits = Math.ceil(meters / 0.5); // Zaokrąglenie w górę do pełnych 0,5 mb
    const sewingCost = sewingUnits * 4;

    // Zaokrąglenie do 2 miejsc po przecinku
    return Math.round((materialCost + sewingCost) * 100) / 100;
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

    // Sprawdzanie, czy taśma została wybrana przed wpisaniem wymiarów
    if ((name === 'rodWidth' || name === 'height') && !formData.tapeType) {
      setTapeError(
        'Wybierz rodzaj taśmy marszczącej, a kalkulator uwzględni nadmiar materiału, potrzebnego do uszycia dekoracji',
      );
      return;
    } else if (name === 'tapeType' && value) {
      setTapeError(null);
      // Pokaż zdjęcie taśmy jeśli wybrano taśmę
      const tape = TAPE_TYPES.find((t) => t.id === value);
      if (tape && tape.imagePath) {
        setSelectedTapeImage(tape.imagePath);
        setShowTapeImage(true);
      } else {
        setShowTapeImage(false);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'selectedProduct' ? { selectedImageIndex: 0 } : {}),
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
    setIsLoading(true);
    setError(null);

    try {
      const price = calculatePrice();
      const productId = uuidv4();

      // Zapisz dane klienta w Redux
      dispatch(
        setCustomerInfo({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.street,
            houseNumber: formData.houseNumber,
            postalCode: formData.postalCode,
            city: formData.city,
          },
        }),
      );

      // Dodaj produkt do koszyka
      const cartItem: CartItem = {
        id: productId,
        name: formData.selectedProduct,
        price,
        quantity: formData.quantity,
        options: {
          width: formData.rodWidth,
          height: formData.height,
          embroidery: false,
          curtainRod: false,
        },
      };

      // Dodaj produkt do koszyka
      dispatch(addToCart(cartItem));

      // Przekieruj do koszyka
      window.location.href = '/cart';
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd',
      );
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className='order-form-container min-h-screen bg-gray-50'>
      {/* Pasek kontaktowy */}
      <div className='contact-bar bg-white border-b border-gray-200 py-2 sticky top-0 z-50'>
        <div className='container mx-auto flex items-center justify-between px-4'>
          <div className='flex items-center space-x-4'>
            <span>Potrzebujesz pomocy?</span>
            <div className='flex items-center space-x-2'>
              <Image
                src='/mateusz.jpg'
                alt='Mateusz'
                width={32}
                height={32}
                className='rounded-full'
              />
              <span>ZADZWOŃ DO MATEUSZA</span>
              <a
                href='tel:531400230'
                className='text-royal-gold hover:text-gold transition-colors'
              >
                531 400 230
              </a>
            </div>
          </div>
        </div>
      </div>

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
                          selectedProduct.alt_texts[formData.selectedImageIndex]
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
                          const currentImage = `${selectedProduct.imagePath}/${
                            selectedProduct.images[formData.selectedImageIndex]
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
                          {selectedProduct.images.map((img, index) => (
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
                                    : `${selectedProduct.name} - miniatura ${
                                        index + 1
                                      }`
                                }
                                fill
                                sizes='80px'
                                className='object-cover'
                                quality={60}
                              />
                            </div>
                          ))}
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
                    onMouseOver={() => handleProductHover(selectedProduct.name)}
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
                Kalkulator zamówienia
              </h1>

              {error && (
                <div className='bg-red-50 text-red-700 p-4 rounded-lg mb-4'>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* 1. Wybór produktu */}
                <div className='space-y-4'>
                  <h2 className='text-lg font-medium text-deep-navy'>
                    Wybór materiału
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
                            onMouseOver={() => handleProductHover(product.name)}
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
                      <select
                        name='tapeType'
                        value={formData.tapeType}
                        onChange={handleChange}
                        className={`form-input-focus w-full px-4 py-2 border rounded-lg focus:outline-none bg-white/90 ${
                          tapeError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
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
                        <p className='mt-1 text-sm text-red-600'>{tapeError}</p>
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
                          className={`form-input-focus w-full px-4 py-2 border rounded-lg focus:outline-none bg-white/90 ${
                            !formData.tapeType
                              ? 'bg-gray-100 cursor-not-allowed'
                              : ''
                          }`}
                          required
                          disabled={!formData.tapeType}
                        />
                        {formData.tapeType && formData.rodWidth && (
                          <div className='mt-2 p-2 bg-gray-50 rounded-lg'>
                            <div className='flex justify-between items-center'>
                              <span className='text-sm font-medium'>
                                Koszt materiału:
                              </span>
                              <span className='text-sm font-bold text-deep-navy'>
                                {formatPrice(calculateMaterialPrice())} zł/mb
                              </span>
                            </div>
                          </div>
                        )}
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
                          className={`form-input-focus w-full px-4 py-2 border rounded-lg focus:outline-none bg-white/90 ${
                            !formData.tapeType
                              ? 'bg-gray-100 cursor-not-allowed'
                              : ''
                          }`}
                          required
                          disabled={!formData.tapeType}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Szczegóły kalkulacji */}
                <div className='mb-8'>
                  <div className='calculation-details bg-white/90 p-4 rounded-lg'>
                    <h3 className='text-lg font-medium mb-3'>
                      Szczegóły kalkulacji
                    </h3>
                    <div className='space-y-2'>
                      <div className='flex justify-between items-center text-sm'>
                        <span className='text-gray-600'>Wybrany materiał:</span>
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
                                selectedProduct.fabricPricePerMB,
                              )} zł/mb`
                            : '-'}
                        </span>
                      </div>
                      <div className='flex justify-between items-center text-sm'>
                        <span className='text-gray-600'>
                          Koszt szycia (za mb):
                        </span>
                        <span className='font-medium'>
                          {selectedProduct
                            ? `${formatPrice(
                                selectedProduct.sewingPricePerMB,
                              )} zł/mb`
                            : '-'}
                        </span>
                      </div>
                      <div className='flex justify-between items-center text-sm'>
                        <span className='text-gray-600'>
                          Szerokość materiału:
                        </span>
                        <span className='font-medium'>
                          {formData.rodWidth && formData.tapeType
                            ? `${
                                parseFloat(formData.rodWidth) *
                                (selectedTape?.ratio || 0)
                              } cm`
                            : '-'}
                        </span>
                      </div>
                      <div className='flex justify-between items-center text-sm'>
                        <span className='text-gray-600'>
                          Ilość metrów bieżących:
                        </span>
                        <span className='font-medium'>
                          {formData.rodWidth &&
                          formData.height &&
                          formData.tapeType
                            ? `${formatPrice(
                                (parseFloat(formData.rodWidth) *
                                  (selectedTape?.ratio || 0) *
                                  parseFloat(formData.height)) /
                                  10000,
                              )} mb`
                            : '-'}
                        </span>
                      </div>
                      <div className='flex justify-between items-center text-sm'>
                        <span className='text-gray-600'>Koszt materiału:</span>
                        <span className='font-medium'>
                          {formData.rodWidth &&
                          formData.height &&
                          selectedProduct &&
                          formData.tapeType
                            ? `${formatPrice(
                                ((parseFloat(formData.rodWidth) *
                                  (selectedTape?.ratio || 0) *
                                  parseFloat(formData.height)) /
                                  10000) *
                                  selectedProduct.fabricPricePerMB,
                              )} zł`
                            : '-'}
                        </span>
                      </div>
                      <div className='flex justify-between items-center text-sm'>
                        <span className='text-gray-600'>Koszt szycia:</span>
                        <span className='font-medium'>
                          {formData.rodWidth &&
                          formData.height &&
                          selectedProduct &&
                          formData.tapeType
                            ? (() => {
                                const meters =
                                  (parseFloat(formData.rodWidth) *
                                    (selectedTape?.ratio || 0) *
                                    parseFloat(formData.height)) /
                                  10000;
                                const sewingUnits = Math.ceil(meters / 0.5);
                                return `${formatPrice(
                                  sewingUnits * 4,
                                )} zł (${sewingUnits} x 4 zł)`;
                              })()
                            : '-'}
                        </span>
                      </div>
                    </div>
                    <div className='pt-4 border-t border-gray-200 mt-4'>
                      <div className='flex justify-between items-center'>
                        <span className='text-lg font-medium text-deep-navy'>
                          Razem:
                        </span>
                        <span className='text-xl font-bold text-deep-navy'>
                          {formatPrice(calculatePrice())} zł
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Ilość sztuk */}
                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Ilość sztuk
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

                {/* 5. Certyfikaty */}
                <div className='mb-6'>
                  <AccordionCertificates />
                </div>

                {/* Przewodnik pomiarowy */}
                <div className='bg-gray-50 p-4 rounded-lg border border-gray-100'>
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

                {/* Sekcja danych osobowych */}
                <div className='space-y-6 mb-8 border-t border-gray-200 pt-6'>
                  <h2 className='text-lg font-medium text-deep-navy'>
                    Dane osobowe
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Imię
                      </label>
                      <input
                        type='text'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        className='form-input-focus w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Nazwisko
                      </label>
                      <input
                        type='text'
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                        className='form-input-focus w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Email
                      </label>
                      <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        className='form-input-focus w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Telefon
                      </label>
                      <input
                        type='tel'
                        name='phone'
                        value={formData.phone}
                        onChange={handleChange}
                        className='form-input-focus w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none'
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Dane do dostawy */}
                <div className='space-y-6 mb-8 border-t border-gray-200 pt-6'>
                  <h2 className='text-lg font-medium text-deep-navy'>
                    Dane do dostawy
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Ulica
                      </label>
                      <input
                        type='text'
                        name='street'
                        value={formData.street}
                        onChange={handleChange}
                        className='form-input-focus w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Numer domu/mieszkania
                      </label>
                      <input
                        type='text'
                        name='houseNumber'
                        value={formData.houseNumber}
                        onChange={handleChange}
                        className='form-input-focus w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Kod pocztowy
                      </label>
                      <input
                        type='text'
                        name='postalCode'
                        value={formData.postalCode}
                        onChange={handleChange}
                        className='form-input-focus w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Miasto
                      </label>
                      <input
                        type='text'
                        name='city'
                        value={formData.city}
                        onChange={handleChange}
                        className='form-input-focus w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none'
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Dodatkowe uwagi do zamówienia */}
                <div className='mb-8 border-t border-gray-200 pt-6'>
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
                  className='magic-button w-full py-4 px-6 text-white rounded-lg font-medium text-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 shadow-lg bg-deep-navy hover:bg-gradient-to-r hover:from-royal-gold hover:to-gold'
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
                    <span
                      className='flex items-center justify-center'
                      style={{ color: 'white' }}
                    >
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
                  )}
                </button>

                {error && (
                  <div className='mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm'>
                    {error}
                  </div>
                )}
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
  );
}
