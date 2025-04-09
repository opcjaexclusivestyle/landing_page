// Import potrzebnych funkcji z firebase
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';

// Konfiguracja Firebase - w produkcji te dane powinny być w zmiennych środowiskowych
const firebaseConfig = {
  apiKey: 'AIzaSyABC123_placeholder_replace_with_real_key',
  authDomain: 'curtains-testimonials.firebaseapp.com',
  projectId: 'curtains-testimonials',
  storageBucket: 'curtains-testimonials.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdef1234567890',
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Typy dla opinii
export interface Testimonial {
  id?: string;
  name: string;
  location: string;
  rating: number;
  content: string;
  createdAt: Timestamp;
  approved?: boolean;
  avatar?: string;
}

// Funkcja do pobrania opinii
export async function getTestimonials(limitCount = 10) {
  try {
    const testimonialsRef = collection(db, 'testimonials');
    const q = query(
      testimonialsRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount),
    );

    const querySnapshot = await getDocs(q);
    const testimonials: Testimonial[] = [];

    querySnapshot.forEach((doc) => {
      testimonials.push({ id: doc.id, ...doc.data() } as Testimonial);
    });

    return testimonials;
  } catch (error) {
    console.error('Błąd podczas pobierania opinii:', error);
    return [];
  }
}

// Funkcja do dodawania nowej opinii
export async function addTestimonial(testimonial: Omit<Testimonial, 'id'>) {
  try {
    const testimonialWithDefaults = {
      ...testimonial,
      approved: false, // Domyślnie opinie wymagają zatwierdzenia
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(
      collection(db, 'testimonials'),
      testimonialWithDefaults,
    );
    return { id: docRef.id, ...testimonialWithDefaults };
  } catch (error) {
    console.error('Błąd podczas dodawania opinii:', error);
    throw error;
  }
}

export { db };
