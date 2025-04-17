import { supabase } from '../supabase';

// Typy dla produktów
interface Product {
  id: number;
  name: string;
  description?: string;
  regular_price: number;
  current_price: number;
  lowest_price?: number;
  color_variants?: any[];
  sizes?: any[];
  main_image?: string;
  created_at: string;
  updated_at?: string;
}

// Mockowanie klienta Supabase
jest.mock('../supabase', () => {
  // Mockowane dane
  const mockData = [
    {
      id: 1,
      name: 'Testowy Produkt 1',
      description: 'Opis produktu 1',
      regular_price: 249.99,
      current_price: 199.99,
      lowest_price: 189.99,
      color_variants: [
        {
          name: 'Czerwony',
          color_code: '#FF0000',
          images: ['https://przykład.com/czerwony1.jpg'],
        },
      ],
      sizes: [
        { name: 'S', stock: 10 },
        { name: 'M', stock: 5 },
      ],
      main_image: 'https://przykład.com/główny1.jpg',
      created_at: '2023-01-01T12:00:00Z',
    },
    {
      id: 2,
      name: 'Testowy Produkt 2',
      description: 'Opis produktu 2',
      regular_price: 149.99,
      current_price: 149.99,
      color_variants: [
        {
          name: 'Niebieski',
          color_code: '#0000FF',
          images: ['https://przykład.com/niebieski1.jpg'],
        },
      ],
      main_image: 'https://przykład.com/główny2.jpg',
      created_at: '2023-01-02T12:00:00Z',
    },
  ];

  let products = [...mockData];

  return {
    supabase: {
      from: jest.fn().mockImplementation((table) => {
        if (table === 'products') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockImplementation((field, value) => {
              if (field === 'id') {
                return {
                  single: jest.fn().mockImplementation(() => {
                    const product = products.find((p) => p.id === value);
                    if (product) {
                      return { data: product, error: null };
                    }
                    return {
                      data: null,
                      error: { message: 'Nie znaleziono produktu' },
                    };
                  }),
                };
              }
              return {
                data: products.filter(
                  (p) => p[field as keyof Product] === value,
                ),
                error: null,
              };
            }),
            order: jest.fn().mockImplementation((field, { ascending }) => {
              const sorted = [...products].sort((a, b) => {
                const aVal = a[field as keyof Product];
                const bVal = b[field as keyof Product];
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                  return ascending
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
                }
                if (typeof aVal === 'number' && typeof bVal === 'number') {
                  return ascending ? aVal - bVal : bVal - aVal;
                }
                return 0;
              });
              return { data: sorted, error: null };
            }),
            insert: jest.fn().mockImplementation((newProducts) => {
              const insertedProducts = newProducts.map(
                (product: Partial<Product>, index: number) => {
                  const newProduct = {
                    ...product,
                    id: products.length + index + 1,
                  } as Product;
                  products.push(newProduct);
                  return newProduct;
                },
              );
              return {
                select: jest.fn().mockReturnValue({
                  data: insertedProducts,
                  error: null,
                }),
              };
            }),
            update: jest.fn().mockImplementation((updates) => {
              return {
                eq: jest.fn().mockImplementation((field, value) => {
                  if (field === 'id') {
                    const index = products.findIndex((p) => p.id === value);
                    if (index !== -1) {
                      products[index] = { ...products[index], ...updates };
                      return {
                        select: jest.fn().mockReturnValue({
                          data: [products[index]],
                          error: null,
                        }),
                      };
                    }
                  }
                  return {
                    select: jest.fn().mockReturnValue({
                      data: null,
                      error: { message: 'Nie znaleziono produktu' },
                    }),
                  };
                }),
              };
            }),
            delete: jest.fn().mockReturnThis(),
          };
        }
        return {};
      }),
    },
  };
});

// Dostęp do mockowanych danych dla testów
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Testowy Produkt 1',
    description: 'Opis produktu 1',
    regular_price: 249.99,
    current_price: 199.99,
    lowest_price: 189.99,
    color_variants: [
      {
        name: 'Czerwony',
        color_code: '#FF0000',
        images: ['https://przykład.com/czerwony1.jpg'],
      },
    ],
    sizes: [
      { name: 'S', stock: 10 },
      { name: 'M', stock: 5 },
    ],
    main_image: 'https://przykład.com/główny1.jpg',
    created_at: '2023-01-01T12:00:00Z',
  },
  {
    id: 2,
    name: 'Testowy Produkt 2',
    description: 'Opis produktu 2',
    regular_price: 149.99,
    current_price: 149.99,
    color_variants: [
      {
        name: 'Niebieski',
        color_code: '#0000FF',
        images: ['https://przykład.com/niebieski1.jpg'],
      },
    ],
    main_image: 'https://przykład.com/główny2.jpg',
    created_at: '2023-01-02T12:00:00Z',
  },
];

describe('Products CRUD Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('pobiera listę produktów', async () => {
    // Wywołanie funkcji select i order
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    // Sprawdzenie wyniku
    expect(error).toBeNull();
    expect(data).toHaveLength(mockProducts.length);
    expect(data && data[0].name).toBe('Testowy Produkt 2'); // Sortowanie od najnowszych
  });

  test('pobiera pojedynczy produkt po ID', async () => {
    // Wywołanie funkcji select z filtrowaniem po ID
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', 1)
      .single();

    // Sprawdzenie wyniku
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data && data.name).toBe('Testowy Produkt 1');
    expect(data && data.current_price).toBe(199.99);
  });

  test('dodaje nowy produkt', async () => {
    // Dane nowego produktu
    const newProduct = {
      name: 'Nowy Produkt',
      description: 'Opis nowego produktu',
      regular_price: 179.99,
      current_price: 159.99,
      main_image: 'https://przykład.com/nowy.jpg',
      created_at: new Date().toISOString(),
    };

    // Wywołanie funkcji insert
    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select();

    // Sprawdzenie wyniku
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data && data[0].name).toBe('Nowy Produkt');
    expect(data && data[0].id).toBe(3); // Powinno mieć ID = 3 (po dwóch mockowanych produktach)
  });

  test('aktualizuje istniejący produkt', async () => {
    // Dane do aktualizacji
    const productUpdates = {
      name: 'Zaktualizowany Produkt',
      current_price: 179.99,
      updated_at: new Date().toISOString(),
    };

    // Wywołanie funkcji update
    const { data, error } = await supabase
      .from('products')
      .update(productUpdates)
      .eq('id', 1)
      .select();

    // Sprawdzenie wyniku
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data && data[0].name).toBe('Zaktualizowany Produkt');
    expect(data && data[0].current_price).toBe(179.99);
  });

  test('zwraca błąd przy aktualizacji nieistniejącego produktu', async () => {
    // Dane do aktualizacji
    const productUpdates = {
      name: 'Zaktualizowany Produkt',
    };

    // Wywołanie funkcji update dla nieistniejącego ID
    const { data, error } = await supabase
      .from('products')
      .update(productUpdates)
      .eq('id', 999) // nieistniejące ID
      .select();

    // Sprawdzenie wyniku
    expect(data).toBeNull();
    expect(error).not.toBeNull();
    expect(error && error.message).toBe('Nie znaleziono produktu');
  });
});
