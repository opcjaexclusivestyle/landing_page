'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { setCustomerInfo } from '@/store/customerSlice';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { fetchCalculatorProducts, CalcProduct } from '@/lib/supabase';

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
  }, []);

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
    if (!selectedTape || !selectedTape.ratio || !rodWidth) return 0;

    // Obliczanie ilości potrzebnego materiału
    const materialAmount = (rodWidth * selectedTape.ratio) / 100; // konwersja z cm na metry
    const materialCost = materialAmount * MATERIAL_PRICE_PER_METER;
    return Math.round(materialCost * 100) / 100;
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

    // Obliczanie kosztu szycia
    const sewingWidth = rodWidth / 100; // szerokość w metrach
    const sewingCost = sewingWidth * SEWING_PRICE_PER_METER;

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
    <form onSubmit={handleSubmit} className='space-y-6'>
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

      <div className='bg-blue-50 p-4 rounded-lg mb-6'>
        <h3 className='font-semibold text-blue-800 mb-2'>Wybrany materiał</h3>
        <p className='text-lg'>{productName}</p>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='form-group'>
          <label
            htmlFor='firstName'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Imię*
          </label>
          <input
            type='text'
            id='firstName'
            name='firstName'
            value={formData.firstName}
            onChange={handleChange}
            required
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
        </div>

        <div className='form-group'>
          <label
            htmlFor='lastName'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Nazwisko*
          </label>
          <input
            type='text'
            id='lastName'
            name='lastName'
            value={formData.lastName}
            onChange={handleChange}
            required
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='form-group'>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Email*
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
        </div>

        <div className='form-group'>
          <label
            htmlFor='phone'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Telefon*
          </label>
          <input
            type='tel'
            id='phone'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            required
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='form-group'>
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

        <div className='form-group'>
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

      <div className='form-group'>
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
                alt='Taśma marszćząca'
                fill
                sizes='100vw'
                className='object-contain'
              />
            </div>
          </div>
        )}
      </div>

      <div className='form-group'>
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

      <div className='form-group'>
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

      <div className='bg-gray-50 p-4 rounded-lg'>
        <div className='flex justify-between items-center'>
          <span className='text-gray-700'>Cena materiału:</span>
          <span className='font-medium'>
            {formatPrice(calculateMaterialPrice())}
          </span>
        </div>
        <div className='flex justify-between items-center mt-1'>
          <span className='text-gray-700'>Koszt szycia:</span>
          <span className='font-medium'>
            {formatPrice(calculatePrice() - calculateMaterialPrice())}
          </span>
        </div>
        <div className='flex justify-between items-center mt-3 text-lg font-bold'>
          <span>Całkowita cena:</span>
          <span className='text-indigo-700'>
            {formatPrice(calculatePrice())}
          </span>
        </div>
      </div>

      <button
        type='submit'
        disabled={isLoading}
        className='w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
      >
        {isLoading ? 'Dodawanie do koszyka...' : 'Dodaj do koszyka'}
      </button>
    </form>
  );
}
