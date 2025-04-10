import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoda niedozwolona' });
  }

  try {
    const { name, location, rating, content } = req.body;

    // Walidacja
    if (!name || !content || !rating) {
      return res.status(400).json({ error: 'Brakujące wymagane pola' });
    }

    // Konfiguracja Supabase po stronie serwera
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      'https://siyavnvmbwjhwgjwunjr.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Klucz serwisowy, nie anonimowy!

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Dodanie rekordu
    const { data, error } = await supabase.from('testimonials').insert([
      {
        name,
        message: content,
        rating,
        location: location || null,
      },
    ]);

    if (error) {
      console.error('Błąd Supabase:', error);
      return res
        .status(500)
        .json({ error: 'Błąd podczas zapisywania opinii', details: error });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Wyjątek:', err);
    return res.status(500).json({ error: 'Błąd serwera', details: err });
  }
}
