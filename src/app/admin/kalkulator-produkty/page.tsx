'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  description: string | null;
  style_tags: string[] | null;
  material: string | null;
  composition: string | null;
  pattern: string | null;
  color: string | null;
  height_cm: number | null;
  width_type: string | null;
  maintenance: string | null;
  meta_title: string | null;
  meta_description: string | null;
  alt_texts: string[] | null;
  og_title: string | null;
  og_description: string | null;
  slug: string | null;
}

export default function CalculatorProductsPage() {
  const [products, setProducts] = useState<CalcProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CalcProduct | null>(
    null,
  );
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<Partial<CalcProduct>>({
    name: '',
    base: '',
    fabric_price_per_mb: 0,
    sewing_price_per_mb: 0,
    images: [],
    description: '',
    style_tags: [],
    material: '',
    composition: '',
    pattern: '',
    color: '',
    height_cm: null,
    width_type: '',
    maintenance: '',
    meta_title: '',
    meta_description: '',
    alt_texts: [],
    og_title: '',
    og_description: '',
    slug: '',
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
        description: product.description || '',
        style_tags: product.style_tags || [],
        material: product.material || '',
        composition: product.composition || '',
        pattern: product.pattern || '',
        color: product.color || '',
        height_cm: product.height_cm || null,
        width_type: product.width_type || '',
        maintenance: product.maintenance || '',
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
        alt_texts: product.alt_texts || [],
        og_title: product.og_title || '',
        og_description: product.og_description || '',
        slug: product.slug || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        base: '',
        fabric_price_per_mb: 0,
        sewing_price_per_mb: 0,
        images: [],
        description: '',
        style_tags: [],
        material: '',
        composition: '',
        pattern: '',
        color: '',
        height_cm: null,
        width_type: '',
        maintenance: '',
        meta_title: '',
        meta_description: '',
        alt_texts: [],
        og_title: '',
        og_description: '',
        slug: '',
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
      description: '',
      style_tags: [],
      material: '',
      composition: '',
      pattern: '',
      color: '',
      height_cm: null,
      width_type: '',
      maintenance: '',
      meta_title: '',
      meta_description: '',
      alt_texts: [],
      og_title: '',
      og_description: '',
      slug: '',
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

  const handleArrayInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'style_tags' | 'alt_texts',
  ) => {
    const { value } = e.target;
    // Konwertuje wartość wejściową oddzieloną przecinkami na tablicę
    const arrayValue = value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '');
    setFormData((prev) => ({ ...prev, [field]: arrayValue }));
  };

  const handleHeightInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Konwertujemy wartość na liczbę, obsługując też format z przecinkiem
    const numericValue = value ? parseFloat(value.replace(',', '.')) : null;
    setFormData((prev) => ({ ...prev, [e.target.name]: numericValue }));
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

  const toggleRowExpansion = (productId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
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
                  Materiał
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Kolor
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
                    colSpan={8}
                    className='px-6 py-4 text-center text-gray-500'
                  >
                    Brak produktów do wyświetlenia
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <React.Fragment key={product.id}>
                    <tr
                      className='cursor-pointer hover:bg-gray-50'
                      onClick={() => toggleRowExpansion(product.id)}
                    >
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900 flex items-center'>
                          <span className='mr-2'>
                            {expandedRows.has(product.id) ? (
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
                                  d='M19 9l-7 7-7-7'
                                />
                              </svg>
                            ) : (
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
                                  d='M9 5l7 7-7 7'
                                />
                              </svg>
                            )}
                          </span>
                          {product.name}
                        </div>
                        {product.slug && (
                          <div className='text-xs text-gray-500'>
                            /{product.slug}
                          </div>
                        )}
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
                        <div className='text-sm text-gray-500'>
                          {product.material || '-'}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm text-gray-500'>
                          {product.color || '-'}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(product);
                          }}
                          className='text-indigo-600 hover:text-indigo-900 mr-3'
                        >
                          Edytuj
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(product.id);
                          }}
                          className='text-red-600 hover:text-red-900'
                        >
                          Usuń
                        </button>
                      </td>
                    </tr>
                    {expandedRows.has(product.id) && (
                      <tr className='bg-gray-50'>
                        <td colSpan={8} className='px-6 py-4'>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {product.description && (
                              <div>
                                <h4 className='font-medium text-sm'>Opis:</h4>
                                <p className='text-sm text-gray-600 mt-1'>
                                  {product.description}
                                </p>
                              </div>
                            )}
                            {product.style_tags &&
                              product.style_tags.length > 0 && (
                                <div>
                                  <h4 className='font-medium text-sm'>
                                    Tagi stylu:
                                  </h4>
                                  <div className='flex flex-wrap gap-1 mt-1'>
                                    {product.style_tags.map((tag, index) => (
                                      <span
                                        key={index}
                                        className='text-xs bg-gray-200 px-2 py-1 rounded'
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            {product.composition && (
                              <div>
                                <h4 className='font-medium text-sm'>Skład:</h4>
                                <p className='text-sm text-gray-600 mt-1'>
                                  {product.composition}
                                </p>
                              </div>
                            )}
                            {product.pattern && (
                              <div>
                                <h4 className='font-medium text-sm'>Wzór:</h4>
                                <p className='text-sm text-gray-600 mt-1'>
                                  {product.pattern}
                                </p>
                              </div>
                            )}
                            {product.height_cm && (
                              <div>
                                <h4 className='font-medium text-sm'>
                                  Wysokość:
                                </h4>
                                <p className='text-sm text-gray-600 mt-1'>
                                  {product.height_cm} cm
                                </p>
                              </div>
                            )}
                            {product.width_type && (
                              <div>
                                <h4 className='font-medium text-sm'>
                                  Typ szerokości:
                                </h4>
                                <p className='text-sm text-gray-600 mt-1'>
                                  {product.width_type}
                                </p>
                              </div>
                            )}
                            {product.maintenance && (
                              <div>
                                <h4 className='font-medium text-sm'>
                                  Pielęgnacja:
                                </h4>
                                <p className='text-sm text-gray-600 mt-1'>
                                  {product.maintenance}
                                </p>
                              </div>
                            )}
                            <div className='md:col-span-2 mt-2'>
                              <h4 className='font-medium text-sm border-b pb-1 mb-2'>
                                SEO:
                              </h4>
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {product.meta_title && (
                                  <div>
                                    <h5 className='font-medium text-xs'>
                                      Meta tytuł:
                                    </h5>
                                    <p className='text-sm text-gray-600'>
                                      {product.meta_title}
                                    </p>
                                  </div>
                                )}
                                {product.meta_description && (
                                  <div>
                                    <h5 className='font-medium text-xs'>
                                      Meta opis:
                                    </h5>
                                    <p className='text-sm text-gray-600'>
                                      {product.meta_description}
                                    </p>
                                  </div>
                                )}
                                {product.og_title && (
                                  <div>
                                    <h5 className='font-medium text-xs'>
                                      OG tytuł:
                                    </h5>
                                    <p className='text-sm text-gray-600'>
                                      {product.og_title}
                                    </p>
                                  </div>
                                )}
                                {product.og_description && (
                                  <div>
                                    <h5 className='font-medium text-xs'>
                                      OG opis:
                                    </h5>
                                    <p className='text-sm text-gray-600'>
                                      {product.og_description}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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

                {/* Opis produktu */}
                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Opis produktu
                  </label>
                  <textarea
                    name='description'
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                  />
                </div>

                {/* Materiał, Kompozycja, Wzór, Kolor */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Materiał
                    </label>
                    <input
                      type='text'
                      name='material'
                      value={formData.material || ''}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Skład
                    </label>
                    <input
                      type='text'
                      name='composition'
                      value={formData.composition || ''}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Wzór
                    </label>
                    <input
                      type='text'
                      name='pattern'
                      value={formData.pattern || ''}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Kolor
                    </label>
                    <input
                      type='text'
                      name='color'
                      value={formData.color || ''}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    />
                  </div>
                </div>

                {/* Wysokość, Szerokość, Pielęgnacja */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Wysokość (cm)
                    </label>
                    <input
                      type='text'
                      name='height_cm'
                      value={formData.height_cm?.toString() || ''}
                      onChange={handleHeightInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Typ szerokości
                    </label>
                    <input
                      type='text'
                      name='width_type'
                      value={formData.width_type || ''}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Pielęgnacja
                    </label>
                    <input
                      type='text'
                      name='maintenance'
                      value={formData.maintenance || ''}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    />
                  </div>
                </div>

                {/* Tagi stylu */}
                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Tagi stylu (oddzielone przecinkami)
                  </label>
                  <input
                    type='text'
                    value={(formData.style_tags || []).join(', ')}
                    onChange={(e) => handleArrayInputChange(e, 'style_tags')}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    placeholder='np. nowoczesny, skandynawski, minimalistyczny'
                  />
                </div>

                {/* SEO Metadata */}
                <div className='border-t border-gray-200 pt-6 mb-6'>
                  <h3 className='text-lg font-medium mb-4'>Metadane SEO</h3>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Meta Tytuł
                      </label>
                      <input
                        type='text'
                        name='meta_title'
                        value={formData.meta_title || ''}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Slug URL
                      </label>
                      <input
                        type='text'
                        name='slug'
                        value={formData.slug || ''}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                      />
                    </div>
                  </div>

                  <div className='mb-6'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Meta Opis
                    </label>
                    <textarea
                      name='meta_description'
                      value={formData.meta_description || ''}
                      onChange={handleInputChange}
                      rows={2}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        OG Tytuł
                      </label>
                      <input
                        type='text'
                        name='og_title'
                        value={formData.og_title || ''}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        OG Opis
                      </label>
                      <input
                        type='text'
                        name='og_description'
                        value={formData.og_description || ''}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                      />
                    </div>
                  </div>

                  <div className='mb-6'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Teksty alternatywne dla obrazów (oddzielone przecinkami)
                    </label>
                    <input
                      type='text'
                      value={(formData.alt_texts || []).join(', ')}
                      onChange={(e) => handleArrayInputChange(e, 'alt_texts')}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                      placeholder='np. Firanka w salonie, Biała firanka'
                    />
                  </div>
                </div>

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
