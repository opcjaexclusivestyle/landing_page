'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { setCustomerInfo } from '@/store/customerSlice';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { fetchCalculatorProducts, CalcProduct } from '@/lib/supabase';
import AccordionCertificates from './AccordionCertificates';

interface SimplifiedOrderFormProps {
  productName: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rodWidth: string;
  height: string;
  tapeType: string;
  quantity: number;
  comments: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
}

// Takie same typy taśm jak w oryginalnym komponencie
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

export default function SimplifiedOrderForm({
  productName,
}: SimplifiedOrderFormProps) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<CalcProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [tapeError, setTapeError] = useState<string | null>(
    'Wybierz rodzaj taśmy marszczącej, a kalkulator uwzględni nadmiar materiału, potrzebnego do uszycia dekoracji',
  );
  const [showTapeImage, setShowTapeImage] = useState(false);
  const [selectedTapeImage, setSelectedTapeImage] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    rodWidth: '',
    height: '',
    tapeType: '',
    quantity: 1,
    comments: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
  });

  // Pobieranie produktów tylko po to, aby znaleźć wybrany produkt
  useEffect(() => {
    async function loadProducts() {
      try {
        setProductsLoading(true);
        const productsData = await fetchCalculatorProducts();
        setProducts(productsData);
      } catch (err) {
        console.error('Błąd podczas ładowania produktów:', err);
      } finally {
        setProductsLoading(false);
      }
    }

    loadProducts();
  }, [productName]);

  // Znajdź aktualnie wybrany produkt
  const selectedProduct = products.find(
    (product) => product.name === productName,
  );

  // Znajdź aktualnie wybraną taśmę
  const selectedTape = TAPE_TYPES.find((tape) => tape.id === formData.tapeType);

  // Ceny materiału i szycia bazujące na wybranym produkcie
  const MATERIAL_PRICE_PER_METER = selectedProduct
    ? selectedProduct.fabricPricePerMB ||
      selectedProduct.fabric_price_per_mb ||
      0
    : 0;
  const SEWING_PRICE_PER_METER = selectedProduct
    ? selectedProduct.sewingPricePerMB ||
      selectedProduct.sewing_price_per_mb ||
      0
    : 0;

  // Obliczanie ceny tylko materiału (bez szycia)
  const calculateMaterialPrice = () => {
    const rodWidth = parseFloat(formData.rodWidth) || 0;
    const height = parseFloat(formData.height) || 0;

    if (!selectedTape || !selectedTape.ratio || !rodWidth || !height) return 0;

    // Obliczanie ilości potrzebnego materiału zgodnie z OrderForm
    const iloscMaterialu = (rodWidth * selectedTape.ratio) / 100; // konwersja z cm na metry

    // Obliczanie kosztu materiału
    const kosztMaterialu = iloscMaterialu * MATERIAL_PRICE_PER_METER;

    // Uwzględniamy ilość sztuk
    const totalMaterialCost = kosztMaterialu * formData.quantity;

    // Zaokrąglenie do 2 miejsc po przecinku
    return Math.round(totalMaterialCost * 100) / 100;
  };

  // Obliczanie pełnej ceny (materiał + szycie)
  const calculatePrice = () => {
    const rodWidth = parseFloat(formData.rodWidth) || 0;
    const height = parseFloat(formData.height) || 0;

    if (!selectedTape || !selectedTape.ratio || !rodWidth || !height) return 0;

    // Obliczanie ilości potrzebnego materiału
    const materialAmount = (rodWidth * selectedTape.ratio) / 100; // konwersja z cm na metry

    // Obliczanie kosztu materiału
    const materialCost = materialAmount * MATERIAL_PRICE_PER_METER;

    // Obliczanie metrów bieżących do szycia - obliczenie zgodne z OrderForm
    const szerokoscPoTasmie = rodWidth * selectedTape.ratio;
    const metryBiezaceSzycie = (2 * szerokoscPoTasmie + 2 * height) / 100; // konwersja z cm na metry

    // Obliczanie kosztu szycia
    const sewingCost = metryBiezaceSzycie * SEWING_PRICE_PER_METER;

    // Łączny koszt
    const totalCost = (materialCost + sewingCost) * formData.quantity;

    // Zaokrąglenie do 2 miejsc po przecinku
    return Math.round(totalCost * 100) / 100;
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',') + ' zł';
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === 'tapeType') {
      const selectedTape = TAPE_TYPES.find((tape) => tape.id === value);
      if (selectedTape && selectedTape.id) {
        setTapeError(null);
        if (selectedTape.imagePath) {
          setSelectedTapeImage(selectedTape.imagePath);
          setShowTapeImage(true);
        } else {
          setShowTapeImage(false);
        }
      } else {
        setTapeError(
          'Wybierz rodzaj taśmy marszczącej, a kalkulator uwzględni nadmiar materiału, potrzebnego do uszycia dekoracji',
        );
        setShowTapeImage(false);
      }
    }

    if (name === 'quantity') {
      const quantityValue = parseInt(value);
      setFormData({
        ...formData,
        [name]: quantityValue >= 1 ? quantityValue : 1,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.tapeType) {
      setTapeError('Proszę wybrać rodzaj taśmy marszczącej');
      return;
    }

    if (!formData.rodWidth || !formData.height) {
      alert('Proszę podać wymiary karniszy');
      return;
    }

    setIsLoading(true);

    try {
      // Zapisanie danych klienta do Redux store zgodnie z typem CustomerInfo
      dispatch(
        setCustomerInfo({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
        }),
      );

      // Dodanie produktu do koszyka
      const price = calculatePrice();
      dispatch(
        addToCart({
          id: uuidv4(),
          name: `${productName} - ${formData.rodWidth}x${formData.height}cm`,
          price,
          quantity: formData.quantity,
          options: {
            width: formData.rodWidth,
            height: formData.height,
            embroidery: false,
            curtainRod: false,
          },
        }),
      );

      // Wyświetlenie komunikatu o sukcesie
      setOrderSuccess(true);

      // Resetowanie formularza po udanym dodaniu do koszyka
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        rodWidth: '',
        height: '',
        tapeType: '',
        quantity: 1,
        comments: '',
        street: '',
        houseNumber: '',
        postalCode: '',
        city: '',
      });

      // Resetowanie stanu wyświetlania obrazka taśmy
      setShowTapeImage(false);
    } catch (error) {
      console.error('Błąd podczas składania zamówienia:', error);
      alert(
        'Wystąpił błąd podczas dodawania produktu do koszyka. Spróbuj ponownie.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Komunikat o sukcesie */}
      {orderSuccess && (
        <div className='p-4 mb-4 rounded-md bg-green-50 border border-green-200'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-green-400'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-green-800'>
                Produkt został dodany do koszyka!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Informacja o wybranym materiale */}
      <div className='bg-blue-50 p-4 rounded-lg mb-6'>
        <h3 className='font-semibold text-blue-800 mb-2'>Wybrany materiał</h3>
        <p className='text-lg'>{productName}</p>
      </div>

      {/* Formularz zamówienia */}
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Dane klienta */}

        {/* Wymiary i taśma */}
        <div className='space-y-4 pt-4 border-t border-gray-200'>
          <h3 className='text-lg font-medium text-gray-700'>Wymiary i taśma</h3>

          <div>
            <label
              htmlFor='tapeType'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Rodzaj taśmy marszczącej*
            </label>
            <select
              id='tapeType'
              name='tapeType'
              value={formData.tapeType}
              onChange={handleChange}
              required
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            >
              {TAPE_TYPES.map((tape) => (
                <option key={tape.id} value={tape.id}>
                  {tape.name}
                </option>
              ))}
            </select>
            {tapeError && (
              <p className='mt-1 text-sm text-amber-600'>{tapeError}</p>
            )}
            {showTapeImage && (
              <div className='mt-2'>
                <div className='relative h-32 w-full'>
                  <Image
                    src={selectedTapeImage}
                    alt='Taśma marszcząca'
                    fill
                    sizes='100vw'
                    className='object-contain'
                  />
                </div>
              </div>
            )}
          </div>

          {/* Wymiary - w jednej kolumnie */}
          <div className='space-y-4'>
            <div>
              <label
                htmlFor='rodWidth'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Szerokość karnisza (cm)*
              </label>
              <input
                type='number'
                id='rodWidth'
                name='rodWidth'
                value={formData.rodWidth}
                onChange={handleChange}
                min='1'
                required
                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
            </div>
            <div>
              <label
                htmlFor='height'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Wysokość firanki (cm)*
              </label>
              <input
                type='number'
                id='height'
                name='height'
                value={formData.height}
                onChange={handleChange}
                min='1'
                required
                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
            </div>
          </div>
        </div>

        {/* Ilość */}
        <div className='pt-4 border-t border-gray-200'>
          <label
            htmlFor='quantity'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Ilość sztuk
          </label>
          <input
            type='number'
            id='quantity'
            name='quantity'
            value={formData.quantity}
            onChange={handleChange}
            min='1'
            required
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
        </div>

        {/* Uwagi */}
        <div className='pt-4 border-t border-gray-200'>
          <label
            htmlFor='comments'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Uwagi do zamówienia
          </label>
          <textarea
            id='comments'
            name='comments'
            value={formData.comments}
            onChange={handleChange}
            rows={3}
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          ></textarea>
        </div>

        {/* Kalkulacja - pod inputami */}
        <div className='bg-gray-50 p-4 rounded-lg mt-4'>
          <h3 className='text-lg font-medium mb-3'>Szczegóły kalkulacji</h3>
          <div className='space-y-2'>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-600'>Wybrany materiał:</span>
              <span className='font-medium'>{productName}</span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-600'>Cena materiału (za mb):</span>
              <span className='font-medium'>
                {selectedProduct
                  ? formatPrice(MATERIAL_PRICE_PER_METER).replace(' zł', '') +
                    ' zł/mb'
                  : '-'}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-600'>Koszt szycia (za mb):</span>
              <span className='font-medium'>
                {selectedProduct
                  ? formatPrice(SEWING_PRICE_PER_METER).replace(' zł', '') +
                    ' zł/mb'
                  : '-'}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-600'>Szerokość materiału:</span>
              <span className='font-medium'>
                {formData.rodWidth && selectedTape?.ratio
                  ? `${(
                      parseFloat(formData.rodWidth) * selectedTape.ratio
                    ).toFixed(1)} cm`
                  : '-'}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-600'>Metry bieżące szycia:</span>
              <span className='font-medium'>
                {formData.rodWidth && formData.height && selectedTape?.ratio
                  ? (() => {
                      const szerokoscPoTasmie =
                        parseFloat(formData.rodWidth) * selectedTape.ratio;
                      const metryBiezace =
                        (2 * szerokoscPoTasmie +
                          2 * parseFloat(formData.height)) /
                        100;
                      return `${metryBiezace.toFixed(2)} mb`;
                    })()
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
                  ? (() => {
                      const materialAmount =
                        (parseFloat(formData.rodWidth) *
                          (selectedTape?.ratio || 0)) /
                        100;
                      const materialCost =
                        materialAmount *
                        MATERIAL_PRICE_PER_METER *
                        formData.quantity;
                      return formatPrice(materialCost);
                    })()
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
                  ? formatPrice(calculatePrice() - calculateMaterialPrice())
                  : '-'}
              </span>
            </div>
          </div>
          <div className='pt-4 border-t border-gray-200 mt-4'>
            <div className='flex justify-between items-center'>
              <span className='text-lg font-medium text-deep-navy'>
                Razem (materiał):
              </span>
              <span className='text-xl font-bold text-deep-navy'>
                {formatPrice(calculateMaterialPrice())}
              </span>
            </div>
            <div className='flex justify-between items-center mt-2'>
              <span className='text-lg font-medium text-deep-navy'>
                Razem (materiał + szycie):
              </span>
              <span className='text-xl font-bold text-deep-navy'>
                {formatPrice(calculatePrice())}
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

        {/* Przycisk złożenia zamówienia */}
        <button
          type='submit'
          disabled={isLoading}
          className='premium-button w-full py-4 px-6 text-white rounded-lg font-medium text-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 shadow-lg bg-deep-navy hover:bg-gradient-to-r hover:from-royal-gold hover:to-gold'
        >
          {isLoading ? 'Dodawanie do koszyka...' : 'Złóż zamówienie'}
        </button>

        {/* Certyfikaty - pod przyciskiem */}
        <div className='mt-6'>
          <AccordionCertificates />
        </div>
      </form>
    </div>
  );
}
