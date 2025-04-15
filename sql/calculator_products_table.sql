-- Tabela produktów do kalkulatora
CREATE TABLE calculator_products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  fabricPricePerMB NUMERIC(10, 2) NOT NULL,
  sewingPricePerMB NUMERIC(10, 2) NOT NULL,
  base VARCHAR(255),
  imagePath VARCHAR(255) NOT NULL,
  images JSON NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wprowadzenie przykładowych danych z pliku JSON
INSERT INTO calculator_products (name, fabricPricePerMB, sewingPricePerMB, base, imagePath, images)
VALUES
  (
    'Haftowana forycja',
    60.0,
    8.0,
    NULL,
    '/images/calculator/haftowanaforsycja',
    '["1.webp", "2.webp", "3.webp", "4.webp"]'
  ),
  (
    'Gipiura w krawacie',
    75.0,
    8.0,
    NULL,
    '/images/calculator/gipiurawkrawacie',
    '["1.webp", "2.webp", "3.webp", "4.webp"]'
  ),
  (
    'Kwiatowe Love',
    83.0,
    6.0,
    'Kwiaty żakardu',
    '/images/calculator/kwiatowelove',
    '["1.webp", "2.webp", "3.webp", "4.webp"]'
  ),
  (
    'Kwiaty żakardu',
    39.9,
    8.0,
    NULL,
    '/images/calculator/kwiatyakardu',
    '["1.webp", "2.webp", "3.webp", "4.webp"]'
  ),
  (
    'Listkowa elegancja',
    41.99,
    8.0,
    NULL,
    '/images/calculator/listkowaelegancja',
    '["1.webp", "2.webp", "3.webp", "4.webp"]'
  ); 