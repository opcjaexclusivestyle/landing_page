import { createClient } from '@supabase/supabase-js';

// Konfiguracja Supabase
// Dodajemy awaryjne wartości dla produkcji w przypadku, gdy zmienne środowiskowe nie są dostępne
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://siyavnvmbwjhwgjwunjr.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpeWF2bnZtYndqaHdnand1bmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyODMxOTMsImV4cCI6MjA1OTg1OTE5M30.ec0r2KT_A2ZKV6cfQUOC7OPUzWqjzic7KFpox3b5z6Q';

// Weryfikacja dostępności klucza i URL-a
if (!supabaseUrl) {
  console.error('Brak URL Supabase, sprawdź zmienne środowiskowe');
}

if (!supabaseKey) {
  console.error('Brak klucza Supabase, sprawdź zmienne środowiskowe');
} else {
  console.log('Klucz Supabase dostępny:', supabaseKey.substring(0, 5) + '...');
}

console.log('URL Supabase:', supabaseUrl);

// Tworzenie klienta Supabase z kluczem anonimowym
// Uwaga: ten klient ma ograniczone uprawnienia,
// więc będzie działał dla operacji dozwolonych dla ról publicznych
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Funkcja pomocnicza - testowanie połączenia
export async function testConnection() {
  console.log('Testowanie połączenia z Supabase...');

  try {
    // Test z użyciem klienta Supabase
    const supabaseTest = await supabase
      .from('testimonials')
      .select('count(*)', { count: 'exact', head: true });

    console.log('Test klienta Supabase:', supabaseTest);

    return {
      success: !supabaseTest.error,
      data: supabaseTest,
    };
  } catch (error) {
    console.error('Błąd podczas testowania połączenia:', error);
    return { success: false, error };
  }
}

// Funkcja pomocnicza do tworzenia publicznych URL-i dla Supabase Storage
export function getPublicStorageUrl(bucket: string, path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

// Interfejs ogólny dla odpowiedzi API
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

// Funkcja generująca obrazy-placeholdery
function getPlaceholderImage(
  width: number,
  height: number,
  text: string = 'Blog',
): string {
  return `https://placehold.co/${width}x${height}/E0E0E0/808080?text=${text.replace(
    /\s+/g,
    '+',
  )}`;
}

// Funkcja generująca placeholdery awatarów
function getAvatarPlaceholder(name: string): string {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return `https://placehold.co/100x100/4F46E5/FFFFFF?text=${initials}`;
}

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

// Interfejs dla produktów kalkulatora
export interface CalcProduct {
  id?: number | string;
  name: string;
  fabric_price_per_mb?: number;
  fabricPricePerMB?: number;
  sewing_price_per_mb?: number;
  sewingPricePerMB?: number;
  base?: string;
  image_path?: string;
  imagePath?: string;
  images: string[];
  created_at?: string;
  description?: string;
  style_tags?: string[];
  material?: string;
  composition?: string;
  pattern?: string;
  color?: string;
  height_cm?: number;
  width_type?: string;
  maintenance?: string;
  meta_title?: string;
  meta_description?: string;
  alt_texts?: string[];
  og_title?: string;
  og_description?: string;
  slug?: string;
}

// Interfejs dla posta blogowego
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  publishDate: string;
  author: {
    name: string;
    avatar: string;
  };
  readTime: number;
}

// Pobierz wszystkie zatwierdzone opinie
export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
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

// Funkcja do pobierania produktów do kalkulatora
export async function fetchCalculatorProducts(): Promise<CalcProduct[]> {
  console.log('Pobieranie produktów do kalkulatora...');

  try {
    const { data, error } = await supabase
      .from('calculator_products')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Błąd podczas pobierania produktów do kalkulatora:', error);
      throw new Error(`Błąd Supabase: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.warn('Brak produktów w bazie danych calculator_products');
    } else {
      console.log(`Pobrano ${data.length} produktów do kalkulatora`);

      // Wyświetlamy surowe dane bez modyfikacji
      data.forEach((product, index) => {
        console.log(`Produkt #${index + 1}:`, product);
      });
    }

    // Zwracamy dokładnie to, co przyszło z backendu
    return data || [];
  } catch (err) {
    console.error('Wyjątek podczas pobierania produktów kalkulatora:', err);
    throw err;
  }
}

// Funkcja do pobierania wszystkich postów blogowych
export async function fetchBlogPosts(limit: number = 10): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('publish_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Błąd podczas pobierania postów blogowych:', error);
      throw error;
    }

    // Mapowanie danych z Supabase na format interfejsu BlogPost
    const formattedPosts: BlogPost[] = data.map((post: any) => {
      // Formatowanie daty, używając pola publish_date
      const date = new Date(post.publish_date || new Date());
      const formattedDate = `${date.getDate()} ${getPolishMonth(
        date.getMonth(),
      )} ${date.getFullYear()}`;

      return {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || post.content?.substring(0, 150) + '...',
        category: post.category || 'Ogólne',
        image: post.image || getPlaceholderImage(800, 600, post.title),
        publishDate: formattedDate,
        author: {
          name: post.author_name || 'Admin',
          avatar:
            post.author_avatar ||
            getAvatarPlaceholder(post.author_name || 'Admin'),
        },
        readTime: post.read_time || calculateReadTime(post.content),
      };
    });

    return formattedPosts;
  } catch (error) {
    console.error('Błąd podczas pobierania postów blogowych:', error);
    // Zwracamy pustą tablicę w przypadku błędu, można też obsłużyć to inaczej
    return [];
  }
}

// Funkcja do pobierania pojedynczego posta blogowego po ID
export async function fetchBlogPostById(id: number): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(
        `Błąd podczas pobierania posta blogowego o ID ${id}:`,
        error,
      );
      throw error;
    }

    if (!data) {
      return null;
    }

    // Formatowanie daty z publish_date
    const date = new Date(data.publish_date || new Date());
    const formattedDate = `${date.getDate()} ${getPolishMonth(
      date.getMonth(),
    )} ${date.getFullYear()}`;

    return {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt || data.content?.substring(0, 150) + '...',
      category: data.category || 'Ogólne',
      image: data.image || getPlaceholderImage(800, 600, data.title),
      publishDate: formattedDate,
      author: {
        name: data.author_name || 'Admin',
        avatar:
          data.author_avatar ||
          getAvatarPlaceholder(data.author_name || 'Admin'),
      },
      readTime: data.read_time || calculateReadTime(data.content),
    };
  } catch (error) {
    console.error(`Błąd podczas pobierania posta blogowego o ID ${id}:`, error);
    return null;
  }
}

// Funkcja do pobierania postów blogowych według kategorii
export async function fetchBlogPostsByCategory(
  category: string,
  limit: number = 10,
): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', category)
      .order('publish_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error(
        `Błąd podczas pobierania postów z kategorii ${category}:`,
        error,
      );
      throw error;
    }

    // Mapowanie danych z Supabase na format interfejsu BlogPost
    const formattedPosts: BlogPost[] = data.map((post: any) => {
      // Formatowanie daty z publish_date
      const date = new Date(post.publish_date || new Date());
      const formattedDate = `${date.getDate()} ${getPolishMonth(
        date.getMonth(),
      )} ${date.getFullYear()}`;

      return {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || post.content?.substring(0, 150) + '...',
        category: post.category || 'Ogólne',
        image: post.image || getPlaceholderImage(800, 600, post.title),
        publishDate: formattedDate,
        author: {
          name: post.author_name || 'Admin',
          avatar:
            post.author_avatar ||
            getAvatarPlaceholder(post.author_name || 'Admin'),
        },
        readTime: post.read_time || calculateReadTime(post.content),
      };
    });

    return formattedPosts;
  } catch (error) {
    console.error(
      `Błąd podczas pobierania postów z kategorii ${category}:`,
      error,
    );
    return [];
  }
}

// Funkcja pomocnicza - zwraca nazwę miesiąca po polsku
function getPolishMonth(month: number): string {
  const months = [
    'stycznia',
    'lutego',
    'marca',
    'kwietnia',
    'maja',
    'czerwca',
    'lipca',
    'sierpnia',
    'września',
    'października',
    'listopada',
    'grudnia',
  ];
  return months[month];
}

// Funkcja pomocnicza - oblicza przybliżony czas czytania (1 minuta na 1000 znaków)
function calculateReadTime(content: string): number {
  if (!content) return 3; // Domyślny czas czytania
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// Interfejs dla produktów
export interface Product {
  id: number;
  name: string;
  description: string;
  currentPrice: number;
  regularPrice: number;
  lowestPrice: number;
  image: string;
  category: 'bedding' | 'curtains';
}

// Funkcja do pobierania produktów z danej kategorii
export async function fetchProducts(
  category: 'bedding' | 'curtains',
  limit: number = 3,
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .limit(limit)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(
      `Błąd podczas pobierania produktów z kategorii ${category}:`,
      error,
    );
    throw error;
  }

  return data || [];
}

// Funkcja do testowania połączenia z tabelą products
export async function testProductsConnection() {
  try {
    console.log('Testowanie połączenia z tabelą products...');
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Błąd podczas testowania tabeli products:', error);
      return { success: false, error };
    }

    console.log('Test połączenia z products zakończony sukcesem:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Wyjątek podczas testowania tabeli products:', error);
    return { success: false, error };
  }
}

// Funkcja do sprawdzenia dostępnych tabel w Supabase
export async function checkAvailableTables() {
  try {
    console.log('Sprawdzanie dostępnych tabel w Supabase...');
    const { data, error } = await supabase
      .from('products_linen')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Błąd podczas sprawdzania tabeli products_linen:', error);
    } else {
      console.log('Tabela products_linen istnieje i zawiera dane:', data);
    }

    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (productsError) {
      console.error('Błąd podczas sprawdzania tabeli products:', productsError);
    } else {
      console.log('Tabela products istnieje i zawiera dane:', productsData);
    }

    return {
      products_linen: { exists: !error, data },
      products: { exists: !productsError, data: productsData },
    };
  } catch (error) {
    console.error('Wyjątek podczas sprawdzania tabel:', error);
    return { error };
  }
}
