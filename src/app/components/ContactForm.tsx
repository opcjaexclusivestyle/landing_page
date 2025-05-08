'use client';
import { useState } from 'react';

interface ContactFormProps {
  onSubmit?: (formData: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }) => void;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Call the onSubmit prop if provided
    if (onSubmit) {
      onSubmit({ name, email, phone, message });
    } else {
      // Default behavior
      alert('Dziękujemy za Twoją wiadomość! Odpowiemy jak najszybciej.');
    }
    
    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl flex-1 min-w-[280px] md:min-w-[500px] backdrop-blur-sm bg-opacity-95">
      <h3 className="text-2xl mb-6 text-[#0d2b45] font-medium">
        Napisz do nas
      </h3>

      <p className="text-gray-700 mb-6">
        Masz pytania? Wypełnij poniższy formularz, a odpowiemy
        najszybciej jak to możliwe (zazwyczaj w ciągu jednego dnia
        roboczego).
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Imię i nazwisko
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Twoje imię i nazwisko*"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Twój e-mail*"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all duration-200"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Numer telefonu
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Twój numer telefonu"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Wiadomość
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Twoja wiadomość*"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 h-40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all duration-200"
            required
          ></textarea>
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            className="premium-button flex flex-row"
          >
            Wyślij wiadomość
          </button>
        </div>
      </form>
    </div>
  );
}
