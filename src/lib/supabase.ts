import { createClient } from '@supabase/supabase-js';

// Konfiguracja klienta Supabase
const supabaseUrl = 'https://siyavnvmbwjhwgjwunjr.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpeWF2bnZtYndqaHdnand1bmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyODMxOTMsImV4cCI6MjA1OTg1OTE5M30.ec0r2KT_A2ZKV6cfQUOC7OPUzWqjzic7KFpox3b5z6Q';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key dostępny:', supabaseKey ? 'Tak' : 'Nie');
console.log(
  'Początek klucza:',
  supabaseKey ? supabaseKey.substring(0, 5) + '...' : 'brak',
);

// Utworzenie klienta Supabase z dodatkowymi nagłówkami
export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  },
});

// Interfejs dla testimoniali
export interface Testimonial {
  id?: number;
  name: string;
  location?: string;
  role?: string;
  rating: number;
  content: string;
  quote?: string; // pole alternatywne dla content
  image?: string;
  created_at?: string;
  approved?: boolean;
}

// Interfejs dla danych z formularza
export interface TestimonialFormData {
  name: string;
  location?: string;
  rating: number;
  content: string;
  created_at?: string;
}

// Interfejs dla danych z bazy
export interface TestimonialData {
  id: string;
  name: string;
  message: string; // W bazie używamy 'message', nie 'content'
  rating: number;
  location?: string;
  created_at: string;
}

// Pobierz wszystkie zatwierdzone opinie
export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('approved', true) // pobieramy tylko zatwierdzone opinie
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Błąd podczas pobierania opinii:', error);
    throw error;
  }

  return data || [];
}

// Funkcja testowa do sprawdzenia połączenia
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('count()', { count: 'exact', head: true });

    console.log('Test połączenia:', { data, error });
    return { success: !error, data, error };
  } catch (error) {
    console.error('Błąd połączenia:', error);
    return { success: false, error };
  }
}

// Funkcja do dodawania opinii
export async function addTestimonial(formData: TestimonialFormData) {
  console.log('Dodawanie opinii:', formData);

  // Mapowanie pól formularza na pola w bazie danych
  const testimonialData = {
    name: formData.name,
    message: formData.content, // Konwersja z content na message
    rating: formData.rating,
    location: formData.location || null,
    // created_at jest automatycznie ustawiane przez bazę
  };

  // Eksplicytnie ustawiamy nagłówki dla tego żądania
  const { data, error } = await supabase
    .from('testimonials')
    .insert([testimonialData])
    .select();

  if (error) {
    console.error('Błąd dodawania opinii:', error);
    throw error;
  }

  console.log('Opinia dodana pomyślnie:', data);
  return data;
}

// Alternatywna implementacja używająca bezpośrednio fetch API dla większej kontroli
export async function addTestimonialWithFetch(formData: TestimonialFormData) {
  const testimonialData = {
    name: formData.name,
    message: formData.content,
    rating: formData.rating,
    location: formData.location || null,
  };

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(testimonialData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Błąd API: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Błąd fetch:', error);
    throw error;
  }
}

// Funkcja do pobierania opinii
export async function getTestimonials(options = { limit: 10 }) {
  console.log('Pobieranie opinii z opcjami:', options);

  // Eksplicytnie ustawiamy nagłówki dla tego żądania
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(options.limit);

  if (error) {
    console.error('Błąd pobierania opinii:', error);
    throw error;
  }

  console.log('Pobrano opinie:', data);
  return data as TestimonialData[];
}

// Alternatywna implementacja pobierania opinii z fetch
export async function getTestimonialsWithFetch(options = { limit: 10 }) {
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/testimonials?select=*&order=created_at.desc&limit=${options.limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Błąd API: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return data as TestimonialData[];
  } catch (error) {
    console.error('Błąd fetch:', error);
    throw error;
  }
}

// Funkcja testowa sprawdzająca połączenie
export async function testConnection() {
  console.log('Testowanie połączenia z Supabase...');

  try {
    // Test z użyciem klienta Supabase
    const supabaseTest = await supabase
      .from('testimonials')
      .select('count(*)', { count: 'exact', head: true });

    console.log('Test klienta Supabase:', supabaseTest);

    // Test z użyciem bezpośrednio fetch API
    const fetchResponse = await fetch(
      `${supabaseUrl}/rest/v1/testimonials?select=count`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      },
    );

    const fetchData = await fetchResponse.json();
    console.log('Test fetch API:', {
      status: fetchResponse.status,
      data: fetchData,
    });

    return {
      supabaseTest,
      fetchTest: { status: fetchResponse.status, data: fetchData },
    };
  } catch (error) {
    console.error('Błąd podczas testowania połączenia:', error);
    return { error };
  }
}
