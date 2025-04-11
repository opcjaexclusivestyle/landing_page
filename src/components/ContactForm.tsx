'use client';
import React, { useState } from 'react';
import Button from './Button';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          formType: 'Formularz kontaktowy',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Wystąpił błąd podczas wysyłania wiadomości',
        );
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Błąd:', error);
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Wystąpił nieznany błąd',
      );
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-semibold mb-6 text-center'>
        Skontaktuj się z nami
      </h2>

      {status === 'success' ? (
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
          <p>Dziękujemy za wiadomość! Skontaktujemy się z Tobą wkrótce.</p>
        </div>
      ) : null}

      {status === 'error' ? (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          <p>Wystąpił błąd: {errorMessage}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label
            htmlFor='name'
            className='block text-black-rich font-medium mb-1'
          >
            Imię i nazwisko
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
            className='w-full px-4 py-2 border border-gray-light rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-primary/50 transition-all'
            placeholder='Twoje imię i nazwisko'
          />
        </div>

        <div>
          <label
            htmlFor='email'
            className='block text-black-rich font-medium mb-1'
          >
            Adres email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
            className='w-full px-4 py-2 border border-gray-light rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-primary/50 transition-all'
            placeholder='Twój adres email'
          />
        </div>

        <div>
          <label
            htmlFor='message'
            className='block text-black-rich font-medium mb-1'
          >
            Wiadomość
          </label>
          <textarea
            id='message'
            name='message'
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className='w-full px-4 py-2 border border-gray-light rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-primary/50 transition-all resize-none'
            placeholder='Twoja wiadomość...'
          />
        </div>

        <Button type='submit' size='lg' width='full'>
          Wyślij wiadomość
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
