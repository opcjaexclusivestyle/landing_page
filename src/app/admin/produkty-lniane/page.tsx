'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProductLinen {
  id: string;
  name: string;
  description: string | null;
  base_product: string | null;
  default_color: string | null;
  default_variant: number | null;
  colors: any | null;
  variants: any | null;
  additional_options: any | null;
  features: string[] | null;
}

export default function ProductsLinenPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductLinen[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductLinen | null>(
    null,
  );
  const [formData, setFormData] = useState<Partial<ProductLinen>>({
    name: '',
    description: '',
    base_product: '',
    default_color: '',
    default_variant: 0,
    colors: {},
    variants: {},
    additional_options: {},
    features: [],
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
        .from('products_linen')
        .select('*')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Błąd podczas pobierania produktów:', error.message);
      setError('Nie udało się pobrać produktów');
    } finally {
      setLoading(false);
    }
  }

  const openModal = (product: ProductLinen | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        base_product: product.base_product || '',
        default_color: product.default_color || '',
        default_variant: product.default_variant || 0,
        colors: product.colors || {},
        variants: product.variants || {},
        additional_options: product.additional_options || {},
        features: product.features || [],
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        base_product: '',
        default_color: '',
        default_variant: 0,
        colors: {},
        variants: {},
        additional_options: {},
        features: [],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      base_product: '',
      default_color: '',
      default_variant: 0,
      colors: {},
      variants: {},
      additional_options: {},
      features: [],
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
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleJsonInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    try {
      const jsonValue = value.trim() ? JSON.parse(value) : {};
      setFormData((prev) => ({ ...prev, [name]: jsonValue }));
    } catch (error) {
      // Ignorujemy błędy parsowania podczas wpisywania
    }
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    const features = value
      .split('\n')
      .filter((feature) => feature.trim() !== '');
    setFormData((prev) => ({ ...prev, features }));
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

      // Jeśli mamy plik do przesłania
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `linen/${fileName}`;

        // Przesyłamy plik do storage
        const { error: uploadError } = await supabase.storage
          .from('linen')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Uzyskujemy publiczny URL do obrazu
        const { data: urlData } = supabase.storage
          .from('linen')
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      // Przygotowanie danych do zapisania
      const productData = {
        ...formData,
        ...(imageUrl && { image_url: imageUrl }),
      };

      if (editingProduct) {
        // Aktualizujemy istniejący produkt
        const { error } = await supabase
          .from('products_linen')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
      } else {
        // Dodajemy nowy produkt
        const { error } = await supabase
          .from('products_linen')
          .insert([productData]);

        if (error) throw error;
      }

      // Odświeżamy listę produktów
      await fetchProducts();
      closeModal();
    } catch (error: any) {
      console.error('Błąd podczas zapisywania produktu:', error.message);
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
          .from('products_linen')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await fetchProducts();
      } catch (error: any) {
        console.error('Błąd podczas usuwania produktu:', error.message);
        setError('Nie udało się usunąć produktu');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className='container mx-auto pb-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Zarządzanie produktami lnianymi</h1>
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
          <p className='mt-4 text-gray-600'>Ładowanie produktów...</p>
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
                  Opis
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Produkt bazowy
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
                    colSpan={4}
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
                      <div className='text-sm text-gray-500 line-clamp-2'>
                        {product.description || '-'}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm text-gray-500'>
                        {product.base_product || '-'}
                      </div>
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
                  {editingProduct ? 'Edytuj produkt' : 'Dodaj nowy produkt'}
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
                      Produkt bazowy
                    </label>
                    <input
                      type='text'
                      name='base_product'
                      value={formData.base_product || ''}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    />
                  </div>
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Opis
                  </label>
                  <textarea
                    name='description'
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                  ></textarea>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Domyślny kolor
                    </label>
                    <input
                      type='text'
                      name='default_color'
                      value={formData.default_color || ''}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Domyślny wariant
                    </label>
                    <input
                      type='number'
                      name='default_variant'
                      value={formData.default_variant || 0}
                      onChange={handleNumberInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    />
                  </div>
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Kolory (format JSON)
                  </label>
                  <textarea
                    name='colors'
                    value={
                      formData.colors
                        ? JSON.stringify(formData.colors, null, 2)
                        : ''
                    }
                    onChange={handleJsonInputChange}
                    rows={3}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)] font-mono text-sm'
                  ></textarea>
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Warianty (format JSON)
                  </label>
                  <textarea
                    name='variants'
                    value={
                      formData.variants
                        ? JSON.stringify(formData.variants, null, 2)
                        : ''
                    }
                    onChange={handleJsonInputChange}
                    rows={3}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)] font-mono text-sm'
                  ></textarea>
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Dodatkowe opcje (format JSON)
                  </label>
                  <textarea
                    name='additional_options'
                    value={
                      formData.additional_options
                        ? JSON.stringify(formData.additional_options, null, 2)
                        : ''
                    }
                    onChange={handleJsonInputChange}
                    rows={3}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)] font-mono text-sm'
                  ></textarea>
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Cechy produktu (każda cecha w nowej linii)
                  </label>
                  <textarea
                    name='features'
                    value={
                      formData.features ? formData.features.join('\n') : ''
                    }
                    onChange={handleFeaturesChange}
                    rows={3}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                  ></textarea>
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Obraz produktu
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

                <div className='flex justify-end'>
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
