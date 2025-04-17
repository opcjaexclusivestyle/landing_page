'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string | null;
  category: string | null;
  image: string | null;
  publish_date: string;
  author_name: string;
  author_avatar: string | null;
  read_time: number | null;
  content?: string | null;
}

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    category: '',
    publish_date: new Date().toISOString().split('T')[0],
    author_name: '',
    read_time: 5,
    content: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('publish_date', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      console.error('Błąd podczas pobierania wpisów:', error.message);
      setError('Nie udało się pobrać wpisów na blogu');
    } finally {
      setLoading(false);
    }
  }

  const openModal = (post: BlogPost | null = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        excerpt: post.excerpt || '',
        category: post.category || '',
        image: post.image || '',
        publish_date: post.publish_date,
        author_name: post.author_name,
        author_avatar: post.author_avatar || '',
        read_time: post.read_time || 5,
        content: post.content || '',
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        excerpt: '',
        category: '',
        publish_date: new Date().toISOString().split('T')[0],
        author_name: '',
        read_time: 5,
        content: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setFormData({
      title: '',
      excerpt: '',
      category: '',
      publish_date: new Date().toISOString().split('T')[0],
      author_name: '',
      read_time: 5,
      content: '',
    });
    setFile(null);
    setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    try {
      // Sprawdzamy czy mamy wszystkie wymagane pola
      if (!formData.title) {
        throw new Error('Tytuł wpisu jest wymagany');
      }
      if (!formData.author_name) {
        throw new Error('Imię autora jest wymagane');
      }
      if (!formData.publish_date) {
        throw new Error('Data publikacji jest wymagana');
      }

      let imageUrl = formData.image || null;
      let avatarUrl = formData.author_avatar || null;

      // Jeśli mamy plik obrazu głównego do przesłania
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_post.${fileExt}`;
        const filePath = `blog/${fileName}`;

        // Przesyłamy plik do storage
        const { error: uploadError } = await supabase.storage
          .from('blog')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Uzyskujemy publiczny URL do obrazu
        const { data: urlData } = supabase.storage
          .from('blog')
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      // Jeśli mamy plik avatara do przesłania
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${Date.now()}_avatar.${fileExt}`;
        const filePath = `blog/${fileName}`;

        // Przesyłamy plik do storage
        const { error: uploadError } = await supabase.storage
          .from('blog')
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;

        // Uzyskujemy publiczny URL do obrazu
        const { data: urlData } = supabase.storage
          .from('blog')
          .getPublicUrl(filePath);

        avatarUrl = urlData.publicUrl;
      }

      // Przygotowanie danych do zapisania
      const postData = {
        ...formData,
        image: imageUrl,
        author_avatar: avatarUrl,
      };

      if (editingPost) {
        // Aktualizujemy istniejący wpis
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;
      } else {
        // Dodajemy nowy wpis
        const { error } = await supabase.from('blog_posts').insert([postData]);

        if (error) throw error;
      }

      // Odświeżamy listę wpisów
      await fetchPosts();
      closeModal();
    } catch (error: any) {
      console.error('Błąd podczas zapisywania wpisu:', error.message);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten wpis?')) {
      try {
        setLoading(true);
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await fetchPosts();
      } catch (error: any) {
        console.error('Błąd podczas usuwania wpisu:', error.message);
        setError('Nie udało się usunąć wpisu');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL');
  };

  return (
    <div className='container mx-auto pb-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Zarządzanie blogiem</h1>
        <button
          onClick={() => openModal()}
          className='bg-[var(--gold)] hover:bg-yellow-600 text-white px-4 py-2 rounded'
        >
          Dodaj nowy wpis
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
          <p className='mt-4 text-gray-600'>Ładowanie wpisów na blogu...</p>
        </div>
      ) : (
        <div className='bg-white shadow rounded-lg overflow-hidden'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Tytuł
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Kategoria
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Autor
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Data publikacji
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
              {posts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className='px-6 py-4 text-center text-gray-500'
                  >
                    Brak wpisów na blogu
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id}>
                    <td className='px-6 py-4'>
                      <div className='text-sm font-medium text-gray-900'>
                        {post.title}
                      </div>
                      {post.excerpt && (
                        <div className='text-xs text-gray-500 mt-1 line-clamp-2'>
                          {post.excerpt}
                        </div>
                      )}
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm text-gray-500'>
                        {post.category || '-'}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center'>
                        {post.author_avatar && (
                          <div className='w-8 h-8 mr-2 relative rounded-full overflow-hidden'>
                            <img
                              src={post.author_avatar}
                              alt={post.author_name}
                              className='object-cover w-full h-full'
                            />
                          </div>
                        )}
                        <div className='text-sm text-gray-500'>
                          {post.author_name}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-500'>
                        {formatDate(post.publish_date)}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      {post.image ? (
                        <div className='w-16 h-12 relative'>
                          <img
                            src={post.image}
                            alt={post.title}
                            className='object-cover w-full h-full rounded'
                          />
                        </div>
                      ) : (
                        <div className='text-sm text-gray-500'>-</div>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-center'>
                      <button
                        onClick={() => openModal(post)}
                        className='text-indigo-600 hover:text-indigo-900 mr-3'
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
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

      {/* Modal do dodawania/edycji wpisu */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold'>
                  {editingPost
                    ? 'Edytuj wpis na blogu'
                    : 'Dodaj nowy wpis na blogu'}
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
                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Tytuł wpisu*
                  </label>
                  <input
                    type='text'
                    name='title'
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    required
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Kategoria
                    </label>
                    <input
                      type='text'
                      name='category'
                      value={formData.category || ''}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Data publikacji*
                    </label>
                    <input
                      type='date'
                      name='publish_date'
                      value={formData.publish_date || ''}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                      required
                    />
                  </div>
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Krótki opis (wyciąg)
                  </label>
                  <textarea
                    name='excerpt'
                    value={formData.excerpt || ''}
                    onChange={handleInputChange}
                    rows={2}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                  ></textarea>
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Treść wpisu
                  </label>
                  <textarea
                    name='content'
                    value={formData.content || ''}
                    onChange={handleInputChange}
                    rows={8}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                  ></textarea>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Imię autora*
                    </label>
                    <input
                      type='text'
                      name='author_name'
                      value={formData.author_name || ''}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Czas czytania (minuty)
                    </label>
                    <input
                      type='number'
                      name='read_time'
                      value={formData.read_time || 5}
                      onChange={handleNumberInputChange}
                      min='1'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Avatar autora
                    </label>
                    <input
                      type='file'
                      ref={avatarInputRef}
                      onChange={handleAvatarFileChange}
                      accept='image/*'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    />
                  </div>
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Obraz główny wpisu
                  </label>
                  <input
                    type='file'
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept='image/*'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                  />
                </div>

                {/* Podgląd obecnych obrazów */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                  {formData.image && (
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Obecny obraz główny
                      </label>
                      <div className='w-full h-48 relative rounded overflow-hidden'>
                        <img
                          src={formData.image}
                          alt='Obraz główny'
                          className='object-cover w-full h-full'
                        />
                      </div>
                    </div>
                  )}

                  {formData.author_avatar && (
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Obecny avatar autora
                      </label>
                      <div className='w-24 h-24 relative rounded-full overflow-hidden'>
                        <img
                          src={formData.author_avatar}
                          alt='Avatar autora'
                          className='object-cover w-full h-full'
                        />
                      </div>
                    </div>
                  )}
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
