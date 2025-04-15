'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

// Typy danych
interface SizeVariant {
  id: string;
  label: string;
  beddingSize?: string;
  pillowSize?: string;
  price: number;
}

interface ColorVariant {
  color: string;
  name: string;
  images: string[];
}

interface ProductFormData {
  name: string;
  description: string;
  regularPrice: number;
  currentPrice: number;
  lowestPrice: number;
  sizes: SizeVariant[];
  colors: ColorVariant[];
  sheetPrices: { [key: string]: number };
  benefits: string[];
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Stan formularza
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    regularPrice: 0,
    currentPrice: 0,
    lowestPrice: 0,
    sizes: [
      {
        id: '1',
        label: 'Komplet standard',
        beddingSize: '160x200',
        pillowSize: '70x80',
        price: 0,
      },
    ],
    colors: [
      { color: 'white', name: 'Biały', images: [] },
      { color: 'beige', name: 'Beżowy', images: [] },
    ],
    sheetPrices: {
      '160x200': 0,
      '180x200': 0,
      '220x200': 0,
    },
    benefits: [''],
  });

  // Funkcje obsługujące zmiany w formularzu
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Dla pól numerycznych konwertujemy wartość na liczbę
    if (['regularPrice', 'currentPrice', 'lowestPrice'].includes(name)) {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Zarządzanie wariantami rozmiaru
  const handleSizeChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index] = {
      ...updatedSizes[index],
      [field]: field === 'price' ? parseFloat(value as string) || 0 : value,
    };

    setFormData({
      ...formData,
      sizes: updatedSizes,
    });
  };

  const addSizeVariant = () => {
    const newId = (formData.sizes.length + 1).toString();
    setFormData({
      ...formData,
      sizes: [
        ...formData.sizes,
        { id: newId, label: '', beddingSize: '', pillowSize: '', price: 0 },
      ],
    });
  };

  const removeSizeVariant = (index: number) => {
    if (formData.sizes.length > 1) {
      const updatedSizes = formData.sizes.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        sizes: updatedSizes,
      });
    }
  };

  // Zarządzanie wariantami koloru
  const handleColorChange = (
    index: number,
    field: string,
    value: string | string[],
  ) => {
    const updatedColors = [...formData.colors];
    updatedColors[index] = {
      ...updatedColors[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      colors: updatedColors,
    });
  };

  const addColorVariant = () => {
    setFormData({
      ...formData,
      colors: [...formData.colors, { color: '', name: '', images: [] }],
    });
  };

  const removeColorVariant = (index: number) => {
    if (formData.colors.length > 1) {
      const updatedColors = formData.colors.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        colors: updatedColors,
      });
    }
  };

  // Zarządzanie korzyściami
  const handleBenefitChange = (index: number, value: string) => {
    const updatedBenefits = [...formData.benefits];
    updatedBenefits[index] = value;

    setFormData({
      ...formData,
      benefits: updatedBenefits,
    });
  };

  const addBenefit = () => {
    setFormData({
      ...formData,
      benefits: [...formData.benefits, ''],
    });
  };

  const removeBenefit = (index: number) => {
    if (formData.benefits.length > 1) {
      const updatedBenefits = formData.benefits.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        benefits: updatedBenefits,
      });
    }
  };

  // Zarządzanie cenami prześcieradeł
  const handleSheetPriceChange = (size: string, price: string) => {
    setFormData({
      ...formData,
      sheetPrices: {
        ...formData.sheetPrices,
        [size]: parseFloat(price) || 0,
      },
    });
  };

  const addSheetSize = () => {
    // Pokazuje prosty prompt o podanie nowego rozmiaru
    const newSize = prompt('Podaj nowy rozmiar prześcieradła (np. 200x220):');
    if (newSize && !formData.sheetPrices[newSize]) {
      setFormData({
        ...formData,
        sheetPrices: {
          ...formData.sheetPrices,
          [newSize]: 0,
        },
      });
    }
  };

  const removeSheetSize = (size: string) => {
    const updatedSheetPrices = { ...formData.sheetPrices };
    delete updatedSheetPrices[size];

    setFormData({
      ...formData,
      sheetPrices: updatedSheetPrices,
    });
  };

  // Obsługa przesyłania obrazów
  const handleImageUpload = async (
    colorIndex: number,
    files: FileList | null,
  ) => {
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${colorIndex}-${i}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // Przesyłanie do Supabase Storage
        const { data, error } = await supabase.storage
          .from('images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) throw error;

        // Pobieranie publicznego URL
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      }

      // Aktualizacja stanu kolorów o nowe obrazy
      const updatedColors = [...formData.colors];
      updatedColors[colorIndex] = {
        ...updatedColors[colorIndex],
        images: [...updatedColors[colorIndex].images, ...uploadedUrls],
      };

      setFormData({
        ...formData,
        colors: updatedColors,
      });
    } catch (error) {
      console.error('Błąd podczas przesyłania obrazów:', error);
      setError('Wystąpił błąd podczas przesyłania obrazów. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (colorIndex: number, imageIndex: number) => {
    const updatedColors = [...formData.colors];
    updatedColors[colorIndex] = {
      ...updatedColors[colorIndex],
      images: updatedColors[colorIndex].images.filter(
        (_, i) => i !== imageIndex,
      ),
    };

    setFormData({
      ...formData,
      colors: updatedColors,
    });
  };

  // Zapisywanie produktu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Walidacja
    if (!formData.name || formData.currentPrice <= 0) {
      setError('Wypełnij przynajmniej nazwę produktu i aktualną cenę.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Transformacja danych do formatu odpowiedniego dla bazy
      const productData = {
        name: formData.name,
        description: formData.description,
        regular_price: formData.regularPrice,
        current_price: formData.currentPrice,
        lowest_price: formData.lowestPrice,
        sizes: formData.sizes,
        color_variants: formData.colors,
        sheet_prices: formData.sheetPrices,
        benefits: formData.benefits.filter((benefit) => benefit.trim() !== ''),
        main_image: formData.colors[0]?.images[0] || null,
        created_at: new Date().toISOString(),
      };

      // Zapisywanie do Supabase
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();

      if (error) throw error;

      setSuccess(true);
      // Po pomyślnym zapisie przekieruj do listy produktów po krótkim opóźnieniu
      setTimeout(() => {
        router.push('/admin/produkty');
      }, 2000);
    } catch (error) {
      console.error('Błąd podczas zapisywania produktu:', error);
      setError('Wystąpił błąd podczas zapisywania produktu. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className='text-3xl font-bold text-[var(--deep-navy)] mb-8'>
        Dodaj nowy produkt
      </h1>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6'>
          {error}
        </div>
      )}

      {success && (
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6'>
          Produkt został pomyślnie dodany! Za chwilę nastąpi przekierowanie...
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-8'>
        {/* Podstawowe informacje o produkcie */}
        <div className='bg-white shadow rounded-lg p-6'>
          <h2 className='text-xl font-medium text-gray-800 mb-4'>
            Podstawowe informacje
          </h2>

          <div className='grid grid-cols-1 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Nazwa produktu <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Opis produktu
              </label>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Cena regularna
                </label>
                <input
                  type='number'
                  name='regularPrice'
                  value={formData.regularPrice || ''}
                  onChange={handleInputChange}
                  min='0'
                  step='0.01'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Cena aktualna <span className='text-red-500'>*</span>
                </label>
                <input
                  type='number'
                  name='currentPrice'
                  value={formData.currentPrice || ''}
                  onChange={handleInputChange}
                  min='0'
                  step='0.01'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Najniższa cena z 30 dni
                </label>
                <input
                  type='number'
                  name='lowestPrice'
                  value={formData.lowestPrice || ''}
                  onChange={handleInputChange}
                  min='0'
                  step='0.01'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Warianty rozmiaru */}
        <div className='bg-white shadow rounded-lg p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-medium text-gray-800'>
              Warianty rozmiaru
            </h2>
            <button
              type='button'
              onClick={addSizeVariant}
              className='px-4 py-2 bg-[var(--gold)] hover:bg-[var(--deep-gold)] text-white rounded-md'
            >
              Dodaj wariant
            </button>
          </div>

          {formData.sizes.map((size, index) => (
            <div
              key={size.id}
              className='p-4 border border-gray-200 rounded-md mb-4'
            >
              <div className='flex justify-between items-start mb-4'>
                <h3 className='font-medium'>Wariant {index + 1}</h3>
                {formData.sizes.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeSizeVariant(index)}
                    className='text-red-600 hover:text-red-800'
                  >
                    Usuń
                  </button>
                )}
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Etykieta
                  </label>
                  <input
                    type='text'
                    value={size.label}
                    onChange={(e) =>
                      handleSizeChange(index, 'label', e.target.value)
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Rozmiar poszwy
                  </label>
                  <input
                    type='text'
                    value={size.beddingSize || ''}
                    onChange={(e) =>
                      handleSizeChange(index, 'beddingSize', e.target.value)
                    }
                    placeholder='np. 160x200'
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Rozmiar poszewki
                  </label>
                  <input
                    type='text'
                    value={size.pillowSize || ''}
                    onChange={(e) =>
                      handleSizeChange(index, 'pillowSize', e.target.value)
                    }
                    placeholder='np. 70x80'
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Cena
                  </label>
                  <input
                    type='number'
                    value={size.price || ''}
                    onChange={(e) =>
                      handleSizeChange(index, 'price', e.target.value)
                    }
                    min='0'
                    step='0.01'
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Warianty koloru */}
        <div className='bg-white shadow rounded-lg p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-medium text-gray-800'>
              Warianty koloru
            </h2>
            <button
              type='button'
              onClick={addColorVariant}
              className='px-4 py-2 bg-[var(--gold)] hover:bg-[var(--deep-gold)] text-white rounded-md'
            >
              Dodaj kolor
            </button>
          </div>

          {formData.colors.map((colorVariant, index) => (
            <div
              key={index}
              className='p-4 border border-gray-200 rounded-md mb-4'
            >
              <div className='flex justify-between items-start mb-4'>
                <h3 className='font-medium'>Kolor {index + 1}</h3>
                {formData.colors.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeColorVariant(index)}
                    className='text-red-600 hover:text-red-800'
                  >
                    Usuń
                  </button>
                )}
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Kolor (kod)
                  </label>
                  <input
                    type='text'
                    value={colorVariant.color}
                    onChange={(e) =>
                      handleColorChange(index, 'color', e.target.value)
                    }
                    placeholder='np. white, #FF5733'
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Nazwa koloru
                  </label>
                  <input
                    type='text'
                    value={colorVariant.name}
                    onChange={(e) =>
                      handleColorChange(index, 'name', e.target.value)
                    }
                    placeholder='np. Biały, Czerwony'
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                  />
                </div>
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Zdjęcia
                </label>
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={(e) => handleImageUpload(index, e.target.files)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                />
              </div>

              {/* Wyświetlanie przesłanych zdjęć */}
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4'>
                {colorVariant.images.map((image, imageIndex) => (
                  <div key={imageIndex} className='relative group'>
                    <div className='relative h-24 w-full rounded overflow-hidden'>
                      <Image
                        src={image}
                        alt={`Zdjęcie ${imageIndex + 1}`}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <button
                      type='button'
                      onClick={() => removeImage(index, imageIndex)}
                      className='absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Ceny prześcieradeł */}
        <div className='bg-white shadow rounded-lg p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-medium text-gray-800'>
              Ceny prześcieradeł
            </h2>
            <button
              type='button'
              onClick={addSheetSize}
              className='px-4 py-2 bg-[var(--gold)] hover:bg-[var(--deep-gold)] text-white rounded-md'
            >
              Dodaj rozmiar
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {Object.entries(formData.sheetPrices).map(([size, price]) => (
              <div key={size} className='p-4 border border-gray-200 rounded-md'>
                <div className='flex justify-between items-start mb-2'>
                  <label className='block text-sm font-medium text-gray-700'>
                    {size}
                  </label>
                  <button
                    type='button'
                    onClick={() => removeSheetSize(size)}
                    className='text-red-600 hover:text-red-800 text-sm'
                  >
                    Usuń
                  </button>
                </div>
                <input
                  type='number'
                  value={price || ''}
                  onChange={(e) => handleSheetPriceChange(size, e.target.value)}
                  min='0'
                  step='0.01'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                  placeholder='Cena'
                />
              </div>
            ))}
          </div>
        </div>

        {/* Korzyści */}
        <div className='bg-white shadow rounded-lg p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-medium text-gray-800'>Korzyści</h2>
            <button
              type='button'
              onClick={addBenefit}
              className='px-4 py-2 bg-[var(--gold)] hover:bg-[var(--deep-gold)] text-white rounded-md'
            >
              Dodaj korzyść
            </button>
          </div>

          {formData.benefits.map((benefit, index) => (
            <div key={index} className='flex items-center gap-2 mb-3'>
              <input
                type='text'
                value={benefit}
                onChange={(e) => handleBenefitChange(index, e.target.value)}
                className='flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]'
                placeholder='np. Wykonane z wysokiej jakości materiałów'
              />
              {formData.benefits.length > 1 && (
                <button
                  type='button'
                  onClick={() => removeBenefit(index)}
                  className='text-red-600 hover:text-red-800'
                >
                  Usuń
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Przyciski formularza */}
        <div className='flex justify-end space-x-4'>
          <button
            type='button'
            onClick={() => router.push('/admin/produkty')}
            className='px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
          >
            Anuluj
          </button>
          <button
            type='submit'
            disabled={loading}
            className={`px-6 py-3 bg-[var(--gold)] text-white rounded-md ${
              loading
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-[var(--deep-gold)]'
            }`}
          >
            {loading ? 'Zapisywanie...' : 'Zapisz produkt'}
          </button>
        </div>
      </form>
    </div>
  );
}
