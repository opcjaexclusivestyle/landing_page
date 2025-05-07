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
  promoted: boolean | null;
  promotion_index: number | null;
}

export default function CurtainCalculatorProductsPage() {
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
    promoted: false,
    promotion_index: 0,
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
        .from('calculator_zaslony')
        .select('*')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Błąd podczas pobierania produktów zasłon:', error.message);
      setError('Nie udało się pobrać produktów');
    } finally {
      setLoading(false);
    }
  }

  const handleExpandRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const openModal = (product: CalcProduct | null = null) => {
    setEditingProduct(product);
    if (product) {
      setFormData({
        name: product.name,
        base: product.base,
        fabric_price_per_mb: product.fabric_price_per_mb,
        sewing_price_per_mb: product.sewing_price_per_mb,
        image_path: product.image_path,
        images: product.images || [],
        description: product.description,
        style_tags: product.style_tags || [],
        material: product.material,
        composition: product.composition,
        pattern: product.pattern,
        color: product.color,
        height_cm: product.height_cm,
        width_type: product.width_type,
        maintenance: product.maintenance,
        meta_title: product.meta_title,
        meta_description: product.meta_description,
        alt_texts: product.alt_texts || [],
        og_title: product.og_title,
        og_description: product.og_description,
        slug: product.slug,
        promoted: product.promoted || false,
        promotion_index: product.promotion_index || 0,
      });
    } else {
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
        promoted: false,
        promotion_index: 0,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFile(null);
    setError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? null : parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleArrayInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: 'images' | 'style_tags' | 'alt_texts',
  ) => {
    const { value } = e.target;
    const updatedArray = [...(formData[field] || [])];
    updatedArray[index] = value;

    setFormData({
      ...formData,
      [field]: updatedArray,
    });
  };

  const addArrayItem = (field: 'images' | 'style_tags' | 'alt_texts') => {
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), ''],
    });
  };

  const removeArrayItem = (
    index: number,
    field: 'images' | 'style_tags' | 'alt_texts',
  ) => {
    const updatedArray = [...(formData[field] || [])];
    updatedArray.splice(index, 1);

    setFormData({
      ...formData,
      [field]: updatedArray,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleHeightInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      height_cm: value === '' ? null : parseFloat(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      setError(null);

      let imagePath = formData.image_path;

      // Jeśli dodajemy nowy plik
      if (file) {
        const fileExt = file.name.split('.').pop();
        const folderName = formData.name
          ? formData.name.replace(/\s+/g, '-').toLowerCase()
          : 'unknown';
        const fileName = `${folderName}-${Math.random()
          .toString(36)
          .substring(2, 15)}.${fileExt}`;
        const filePath = `calculator_zaslony/${fileName}`;

        // Uploadujemy plik do Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('calculator')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Tworzymy publiczny URL do pliku
        const { data } = supabase.storage
          .from('calculator')
          .getPublicUrl(filePath);

        imagePath = data.publicUrl;

        // Dodajemy nowy obraz do listy obrazów
        if (!formData.images) {
          formData.images = [imagePath];
        } else if (!formData.images.includes(imagePath)) {
          formData.images = [...formData.images, imagePath];
        }
      }

      // Przygotowujemy dane produktu do zapisu
      const productData = {
        ...formData,
        image_path: imagePath,
      };

      if (editingProduct) {
        // Aktualizujemy istniejący produkt
        const { error } = await supabase
          .from('calculator_zaslony')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
      } else {
        // Dodajemy nowy produkt
        const { error } = await supabase
          .from('calculator_zaslony')
          .insert([productData]);

        if (error) throw error;
      }

      // Odświeżamy listę produktów
      await fetchProducts();
      closeModal();
    } catch (error: any) {
      console.error('Błąd podczas zapisywania produktu zasłon:', error.message);
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
          .from('calculator_zaslony')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await fetchProducts();
      } catch (error: any) {
        console.error('Błąd podczas usuwania produktu zasłon:', error.message);
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
        .from('calculator_zaslony')
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
            .remove([`calculator_zaslony/${fileName}`]);
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
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Zarządzanie produktami zasłon</h1>
        <button
          onClick={() => openModal()}
          className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
        >
          Dodaj nowy produkt
        </button>
      </div>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          {error}
        </div>
      )}

      {loading ? (
        <div className='flex justify-center py-10'>
          <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900'></div>
        </div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full table-auto border-collapse'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Akcje
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Nazwa
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Baza
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Cena materiału
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Cena szycia
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Materiał
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Kolor
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Zdjęcie
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {products.map((product) => (
                <React.Fragment key={product.id}>
                  <tr
                    className={
                      expandedRows.has(product.id)
                        ? 'bg-blue-50 cursor-pointer'
                        : 'hover:bg-gray-50 cursor-pointer'
                    }
                    onClick={() => handleExpandRow(product.id)}
                  >
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex space-x-2'>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(product);
                          }}
                          className='text-blue-600 hover:text-blue-800'
                        >
                          Edytuj
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(product.id);
                          }}
                          className='text-red-600 hover:text-red-800'
                        >
                          Usuń
                        </button>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
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
                  </tr>
                  {expandedRows.has(product.id) && (
                    <tr>
                      <td colSpan={8} className='px-6 py-4 bg-blue-50'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div>
                            <h3 className='font-semibold mb-2'>
                              Dodatkowe informacje
                            </h3>
                            {product.description && (
                              <div>
                                <h4 className='font-medium text-sm'>Opis:</h4>
                                <p className='text-sm text-gray-600 mt-1'>
                                  {product.description}
                                </p>
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
                            {product.slug && (
                              <div>
                                <h4 className='font-medium text-sm'>Slug:</h4>
                                <p className='text-sm text-gray-600 mt-1'>
                                  {product.slug}
                                </p>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className='font-semibold mb-2'>Galeria</h3>
                            {product.images && product.images.length > 0 ? (
                              <div className='grid grid-cols-3 gap-2'>
                                {product.images.map((img, index) => (
                                  <div
                                    key={index}
                                    className='relative w-full h-24'
                                  >
                                    <img
                                      src={img}
                                      alt={`${product.name} - ${index + 1}`}
                                      className='object-cover w-full h-full rounded'
                                    />
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteImage(product.id, img);
                                      }}
                                      className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs'
                                      title='Usuń obraz'
                                    >
                                      X
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className='text-sm text-gray-500'>
                                Brak zdjęć w galerii
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal do dodawania/edycji produktu */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto'>
            <h2 className='text-xl font-bold mb-4'>
              {editingProduct ? 'Edytuj produkt' : 'Dodaj nowy produkt'}
            </h2>
            {error && (
              <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Nazwa produktu*
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Baza
                  </label>
                  <input
                    type='text'
                    name='base'
                    value={formData.base || ''}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Cena materiału za mb*
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    name='fabric_price_per_mb'
                    value={formData.fabric_price_per_mb || ''}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Cena szycia za mb*
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    name='sewing_price_per_mb'
                    value={formData.sewing_price_per_mb || ''}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Materiał
                  </label>
                  <input
                    type='text'
                    name='material'
                    value={formData.material || ''}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
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
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Wzór
                  </label>
                  <input
                    type='text'
                    name='pattern'
                    value={formData.pattern || ''}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Wysokość (cm)
                  </label>
                  <input
                    type='number'
                    name='height_cm'
                    value={formData.height_cm || ''}
                    onChange={handleHeightInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
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
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  />
                </div>
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Opis
                </label>
                <textarea
                  name='description'
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  rows={3}
                />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Skład
                </label>
                <textarea
                  name='composition'
                  value={formData.composition || ''}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  rows={2}
                />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Pielęgnacja
                </label>
                <textarea
                  name='maintenance'
                  value={formData.maintenance || ''}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  rows={2}
                />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Slug (URL)
                </label>
                <input
                  type='text'
                  name='slug'
                  value={formData.slug || ''}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  placeholder='np. haftowana-forsycja'
                />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Dodaj nowe zdjęcie
                </label>
                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  accept='image/*'
                />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Obrazy (URLe)
                </label>
                {(formData.images || []).map((image, index) => (
                  <div key={index} className='flex mb-2'>
                    <input
                      type='text'
                      value={image}
                      onChange={(e) =>
                        handleArrayInputChange(e, index, 'images')
                      }
                      className='flex-grow px-3 py-2 border border-gray-300 rounded-md mr-2'
                      placeholder='URL obrazu'
                    />
                    <button
                      type='button'
                      onClick={() => removeArrayItem(index, 'images')}
                      className='bg-red-500 text-white px-3 py-2 rounded'
                    >
                      Usuń
                    </button>
                  </div>
                ))}
                <button
                  type='button'
                  onClick={() => addArrayItem('images')}
                  className='bg-green-500 text-white px-3 py-2 rounded mt-2'
                >
                  Dodaj URL obrazu
                </button>
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Tagi stylów
                </label>
                {(formData.style_tags || []).map((tag, index) => (
                  <div key={index} className='flex mb-2'>
                    <input
                      type='text'
                      value={tag}
                      onChange={(e) =>
                        handleArrayInputChange(e, index, 'style_tags')
                      }
                      className='flex-grow px-3 py-2 border border-gray-300 rounded-md mr-2'
                      placeholder='Tag stylu'
                    />
                    <button
                      type='button'
                      onClick={() => removeArrayItem(index, 'style_tags')}
                      className='bg-red-500 text-white px-3 py-2 rounded'
                    >
                      Usuń
                    </button>
                  </div>
                ))}
                <button
                  type='button'
                  onClick={() => addArrayItem('style_tags')}
                  className='bg-green-500 text-white px-3 py-2 rounded mt-2'
                >
                  Dodaj tag stylu
                </button>
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Teksty alternatywne dla zdjęć
                </label>
                {(formData.alt_texts || []).map((text, index) => (
                  <div key={index} className='flex mb-2'>
                    <input
                      type='text'
                      value={text}
                      onChange={(e) =>
                        handleArrayInputChange(e, index, 'alt_texts')
                      }
                      className='flex-grow px-3 py-2 border border-gray-300 rounded-md mr-2'
                      placeholder='Tekst alternatywny'
                    />
                    <button
                      type='button'
                      onClick={() => removeArrayItem(index, 'alt_texts')}
                      className='bg-red-500 text-white px-3 py-2 rounded'
                    >
                      Usuń
                    </button>
                  </div>
                ))}
                <button
                  type='button'
                  onClick={() => addArrayItem('alt_texts')}
                  className='bg-green-500 text-white px-3 py-2 rounded mt-2'
                >
                  Dodaj tekst alternatywny
                </button>
              </div>
              
              <div className='mb-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Promowany
                  </label>
                  <div className='mt-2'>
                    <input
                      type='checkbox'
                      checked={formData.promoted || false}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          promoted: e.target.checked,
                        });
                      }}
                      className='h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500'
                    />
                    <span className='ml-2'>Zaznacz, aby promować produkt</span>
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Indeks promocji
                  </label>
                  <input
                    type='number'
                    value={formData.promotion_index || 0}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        promotion_index: parseInt(e.target.value) || 0,
                      });
                    }}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
                    placeholder='0'
                    min='0'
                  />
                  <p className='text-sm text-gray-500 mt-1'>Wyższy indeks = wyższa pozycja</p>
                </div>
              </div>

              <div className='flex justify-end space-x-3'>
                <button
                  type='button'
                  onClick={closeModal}
                  className='bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded'
                >
                  Anuluj
                </button>
                <button
                  type='submit'
                  className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
                  disabled={uploading}
                >
                  {uploading ? 'Zapisywanie...' : 'Zapisz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
