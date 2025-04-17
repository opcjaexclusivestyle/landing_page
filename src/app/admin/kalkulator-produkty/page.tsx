'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface CalcProduct {
  id: string;
  name: string;
  base: string | null;
  fabric_price_per_mb: number | null;
  sewing_price_per_mb: number | null;
  image_path: string | null;
  images: string[] | null;
}

export default function CalculatorProductsPage() {
  const [products, setProducts] = useState<CalcProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CalcProduct | null>(
    null,
  );
  const [formData, setFormData] = useState<Partial<CalcProduct>>({
    name: '',
    base: '',
    fabric_price_per_mb: 0,
    sewing_price_per_mb: 0,
    images: [],
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('calculator_products')
        .select('*')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error(
        'Błąd podczas pobierania produktów kalkulatora:',
        error.message,
      );
      setError('Nie udało się pobrać produktów');
    } finally {
      setLoading(false);
    }
  }

  const openModal = (product: CalcProduct | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        base: product.base || '',
        fabric_price_per_mb: product.fabric_price_per_mb || 0,
        sewing_price_per_mb: product.sewing_price_per_mb || 0,
        images: product.images || [],
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        base: '',
        fabric_price_per_mb: 0,
        sewing_price_per_mb: 0,
        images: [],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      base: '',
      fabric_price_per_mb: 0,
      sewing_price_per_mb: 0,
      images: [],
    });
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Konwertujemy wartość na liczbę, obsługując też format z przecinkiem
    const numericValue = parseFloat(value.replace(',', '.')) || 0;
    setFormData((prev) => ({ ...prev, [name]: numericValue }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    try {
      // Sprawdzamy czy mamy wszystkie wymagane pola
      if (!formData.name) {
        throw new Error('Nazwa produktu jest wymagana');
      }

      let imageUrl = null;
      let updatedImages = [...(formData.images || [])];

      // Jeśli mamy plik do przesłania
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `calculator/${fileName}`;

        // Przesyłamy plik do storage
        const { error: uploadError } = await supabase.storage
          .from('calculator')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Uzyskujemy publiczny URL do obrazu
        const { data: urlData } = supabase.storage
          .from('calculator')
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
        updatedImages.push(imageUrl);
      }

      // Przygotowanie danych do zapisania
      const productData = {
        ...formData,
        images: updatedImages,
        ...(imageUrl && { image_path: imageUrl }),
      };

      if (editingProduct) {
        // Aktualizujemy istniejący produkt
        const { error } = await supabase
          .from('calculator_products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
      } else {
        // Dodajemy nowy produkt
        const { error } = await supabase
          .from('calculator_products')
          .insert([productData]);

        if (error) throw error;
      }

      // Odświeżamy listę produktów
      await fetchProducts();
      closeModal();
    } catch (error: any) {
      console.error(
        'Błąd podczas zapisywania produktu kalkulatora:',
        error.message,
      );
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten produkt?')) {
      try {
        setLoading(true);
        const { error } = await supabase
          .from('calculator_products')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await fetchProducts();
      } catch (error: any) {
        console.error(
          'Błąd podczas usuwania produktu kalkulatora:',
          error.message,
        );
        setError('Nie udało się usunąć produktu');
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteImage = async (productId: string, imageUrl: string) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten obraz?')) return;

    try {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      // Usuwamy obraz z listy obrazów
      const updatedImages = (product.images || []).filter(
        (img) => img !== imageUrl,
      );

      // Aktualizujemy produkt w bazie danych
      const { error } = await supabase
        .from('calculator_products')
        .update({
          images: updatedImages,
          // Jeśli usuwamy główny obraz, ustawiamy nowy lub null
          ...(product.image_path === imageUrl && {
            image_path: updatedImages.length > 0 ? updatedImages[0] : null,
          }),
        })
        .eq('id', productId);

      if (error) throw error;

      // Próbujemy także usunąć plik z storage, ale nie przerywamy jeśli się nie uda
      try {
        // Wydobywamy nazwę pliku z URL
        const fileName = imageUrl.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('calculator')
            .remove([`calculator/${fileName}`]);
        }
      } catch (storageError) {
        console.error('Nie udało się usunąć pliku z storage:', storageError);
      }

      // Odświeżamy listę produktów
      await fetchProducts();
    } catch (error: any) {
      console.error('Błąd podczas usuwania obrazu:', error.message);
      setError('Nie udało się usunąć obrazu');
    }
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return '-';
    return price.toFixed(2).replace('.', ',') + ' zł';
  };

  return (
    <div className='container mx-auto pb-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>
          Zarządzanie produktami kalkulatora
        </h1>
        <button
          onClick={() => openModal()}
          className='bg-[var(--gold)] hover:bg-yellow-600 text-white px-4 py-2 rounded'
        >
          Dodaj nowy produkt
        </button>
      </div>

      {error && (
        <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6'>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className='text-center py-10'>
          <div className='w-12 h-12 border-4 border-t-[var(--gold)] border-gray-200 rounded-full animate-spin mx-auto'></div>
          <p className='mt-4 text-gray-600'>
            Ładowanie produktów kalkulatora...
          </p>
        </div>
      ) : (
        <div className='bg-white shadow rounded-lg overflow-hidden'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Nazwa
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Typ
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Cena tkaniny/mb
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Cena szycia/mb
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Obraz
                </th>
                <th className='px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center'>
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className='px-6 py-4 text-center text-gray-500'
                  >
                    Brak produktów do wyświetlenia
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {product.name}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm text-gray-500'>
                        {product.base || '-'}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm text-gray-500'>
                        {formatPrice(product.fabric_price_per_mb)}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm text-gray-500'>
                        {formatPrice(product.sewing_price_per_mb)}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      {product.image_path ? (
                        <div className='w-16 h-16 relative'>
                          <img
                            src={product.image_path}
                            alt={product.name}
                            className='object-cover w-full h-full rounded'
                          />
                        </div>
                      ) : (
                        <div className='text-sm text-gray-500'>-</div>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-center'>
                      <button
                        onClick={() => openModal(product)}
                        className='text-indigo-600 hover:text-indigo-900 mr-3'
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className='text-red-600 hover:text-red-900'
                      >
                        Usuń
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal do dodawania/edycji produktu */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold'>
                  {editingProduct
                    ? 'Edytuj produkt kalkulatora'
                    : 'Dodaj nowy produkt kalkulatora'}
                </h2>
                <button
                  onClick={closeModal}
                  className='text-gray-500 hover:text-gray-700'
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
              </div>

              {error && (
                <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6'>
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Nazwa produktu*
                    </label>
                    <input
                      type='text'
                      name='name'
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Typ produktu
                    </label>
                    <input
                      type='text'
                      name='base'
                      value={formData.base || ''}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Cena tkaniny za mb (zł)
                    </label>
                    <input
                      type='text'
                      name='fabric_price_per_mb'
                      value={
                        formData.fabric_price_per_mb
                          ?.toString()
                          .replace('.', ',') || ''
                      }
                      onChange={handleNumberInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Cena szycia za mb (zł)
                    </label>
                    <input
                      type='text'
                      name='sewing_price_per_mb'
                      value={
                        formData.sewing_price_per_mb
                          ?.toString()
                          .replace('.', ',') || ''
                      }
                      onChange={handleNumberInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    />
                  </div>
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Dodaj obraz
                  </label>
                  <input
                    type='file'
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept='image/*'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                  />
                  <p className='text-xs text-gray-500 mt-1'>
                    Maksymalny rozmiar pliku: 2MB. Obsługiwane formaty: JPG,
                    PNG, GIF.
                  </p>
                </div>

                {/* Istniejące obrazy */}
                {editingProduct &&
                  editingProduct.images &&
                  editingProduct.images.length > 0 && (
                    <div className='mb-6'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Istniejące obrazy
                      </label>
                      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                        {editingProduct.images.map((imageUrl, index) => (
                          <div key={index} className='relative group'>
                            <div className='w-full h-24 relative'>
                              <img
                                src={imageUrl}
                                alt={`Obraz ${index + 1}`}
                                className='object-cover w-full h-full rounded'
                              />
                            </div>
                            <button
                              type='button'
                              onClick={() =>
                                deleteImage(editingProduct.id, imageUrl)
                              }
                              className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                            >
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-4 w-4'
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
                            {editingProduct.image_path === imageUrl && (
                              <div className='absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded'>
                                Główny
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className='flex justify-end mt-6'>
                  <button
                    type='button'
                    onClick={closeModal}
                    className='bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2'
                  >
                    Anuluj
                  </button>
                  <button
                    type='submit'
                    disabled={uploading}
                    className='bg-[var(--gold)] hover:bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50'
                  >
                    {uploading ? 'Zapisywanie...' : 'Zapisz'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
