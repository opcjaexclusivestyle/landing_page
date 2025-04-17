'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  message: string;
  rating: number | null;
  created_at: string | null;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    location: '',
    message: '',
    rating: 5,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error: any) {
      console.error('Błąd podczas pobierania opinii:', error.message);
      setError('Nie udało się pobrać opinii klientów');
    } finally {
      setLoading(false);
    }
  }

  const openModal = (testimonial: Testimonial | null = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        location: testimonial.location,
        message: testimonial.message,
        rating: testimonial.rating || 5,
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: '',
        location: '',
        message: '',
        rating: 5,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
    setFormData({
      name: '',
      location: '',
      message: '',
      rating: 5,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Sprawdzamy czy mamy wszystkie wymagane pola
      if (!formData.name) {
        throw new Error('Imię klienta jest wymagane');
      }
      if (!formData.location) {
        throw new Error('Lokalizacja jest wymagana');
      }
      if (!formData.message) {
        throw new Error('Treść opinii jest wymagana');
      }

      if (editingTestimonial) {
        // Aktualizujemy istniejącą opinię
        const { error } = await supabase
          .from('testimonials')
          .update(formData)
          .eq('id', editingTestimonial.id);

        if (error) throw error;
      } else {
        // Dodajemy nową opinię
        const { error } = await supabase
          .from('testimonials')
          .insert([formData]);

        if (error) throw error;
      }

      // Odświeżamy listę opinii
      await fetchTestimonials();
      closeModal();
    } catch (error: any) {
      console.error('Błąd podczas zapisywania opinii:', error.message);
      setError(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę opinię?')) {
      try {
        setLoading(true);
        const { error } = await supabase
          .from('testimonials')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await fetchTestimonials();
      } catch (error: any) {
        console.error('Błąd podczas usuwania opinii:', error.message);
        setError('Nie udało się usunąć opinii');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL');
  };

  const renderStars = (rating: number | null) => {
    if (rating === null)
      return <span className='text-gray-400'>brak oceny</span>;

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}
        >
          ★
        </span>,
      );
    }
    return <div className='flex'>{stars}</div>;
  };

  return (
    <div className='container mx-auto pb-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Zarządzanie opiniami klientów</h1>
        <button
          onClick={() => openModal()}
          className='bg-[var(--gold)] hover:bg-yellow-600 text-white px-4 py-2 rounded'
        >
          Dodaj nową opinię
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
          <p className='mt-4 text-gray-600'>Ładowanie opinii klientów...</p>
        </div>
      ) : (
        <div className='bg-white shadow rounded-lg overflow-hidden'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Klient
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Lokalizacja
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Opinia
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Ocena
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Data dodania
                </th>
                <th className='px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center'>
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {testimonials.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className='px-6 py-4 text-center text-gray-500'
                  >
                    Brak opinii do wyświetlenia
                  </td>
                </tr>
              ) : (
                testimonials.map((testimonial) => (
                  <tr key={testimonial.id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {testimonial.name}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-500'>
                        {testimonial.location}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm text-gray-500 line-clamp-2'>
                        {testimonial.message}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {renderStars(testimonial.rating)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-500'>
                        {formatDate(testimonial.created_at)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-center'>
                      <button
                        onClick={() => openModal(testimonial)}
                        className='text-indigo-600 hover:text-indigo-900 mr-3'
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial.id)}
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

      {/* Modal do dodawania/edycji opinii */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold'>
                  {editingTestimonial ? 'Edytuj opinię' : 'Dodaj nową opinię'}
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
                    Imię klienta*
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

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Lokalizacja*
                  </label>
                  <input
                    type='text'
                    name='location'
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    required
                  />
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Ocena
                  </label>
                  <div className='flex space-x-2 text-2xl'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type='button'
                        onClick={() => handleRatingChange(star)}
                        className={`focus:outline-none ${
                          (formData.rating || 0) >= star
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Treść opinii*
                  </label>
                  <textarea
                    name='message'
                    value={formData.message || ''}
                    onChange={handleInputChange}
                    rows={5}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--gold)]'
                    required
                  ></textarea>
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
                    className='bg-[var(--gold)] hover:bg-yellow-600 text-white px-4 py-2 rounded'
                  >
                    Zapisz
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
