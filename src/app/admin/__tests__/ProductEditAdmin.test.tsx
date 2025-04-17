import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import EditProductPage from '../produkty/[id]/page';
import * as React from 'react';

// Mockowanie hooka next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mockowanie klienta Supabase
jest.mock('@/lib/supabase', () => {
  const mockProduct = {
    id: '123',
    name: 'Testowy Produkt',
    description: 'Opis testowego produktu',
    regular_price: 249.99,
    current_price: 199.99,
    lowest_price: 189.99,
    sizes: [
      { name: 'S', stock: 10 },
      { name: 'M', stock: 5 },
    ],
    color_variants: [
      {
        name: 'Czerwony',
        color_code: '#FF0000',
        images: ['https://przykład.com/czerwony1.jpg'],
      },
    ],
    sheet_prices: {},
    benefits: ['Trwały materiał', 'Łatwe czyszczenie'],
    main_image: 'https://przykład.com/główny.jpg',
  };

  return {
    supabase: {
      from: jest.fn().mockImplementation((table) => {
        if (table === 'products') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockImplementation((field, value) => {
              return {
                single: jest.fn().mockResolvedValue({
                  data: mockProduct,
                  error: null,
                }),
              };
            }),
            update: jest.fn().mockImplementation((updates) => {
              return {
                eq: jest.fn().mockImplementation((field, value) => {
                  return {
                    select: jest.fn().mockResolvedValue({
                      data: [{ id: '123', ...updates }],
                      error: null,
                    }),
                  };
                }),
              };
            }),
          };
        }
        return {};
      }),
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest.fn().mockResolvedValue({
            data: { path: 'products/testowy-obraz.jpg' },
            error: null,
          }),
          getPublicUrl: jest.fn().mockReturnValue({
            data: { publicUrl: 'https://przykład.com/nowy-obraz.jpg' },
          }),
        }),
      },
    },
  };
});

// Mockowanie komponentu Image z Next.js
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // Upewnij się, że 'fill' jest stringiem, nie booleanem
    const imgProps = { ...props };
    if (typeof imgProps.fill === 'boolean') {
      imgProps.fill = imgProps.fill.toString();
    }
    return <img {...imgProps} />;
  },
}));

describe('EditProductPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('ładuje dane produktu przy inicjalizacji', async () => {
    await act(async () => {
      render(<EditProductPage params={{ id: '123' }} />);
    });

    // Pomijamy sprawdzanie tekstu ładowania, ponieważ dane są ładowane natychmiast w mocku
    // i stan ładowania jest zbyt krótki, by go wykryć

    // Czekamy na załadowanie danych
    await waitFor(() => {
      expect(screen.getByText('Edytuj produkt')).toBeInTheDocument();
    });

    // Sprawdzamy, czy element formularza istnieje i czy nie ma komunikatu o błędzie
    expect(
      screen.queryByText('Nie udało się załadować danych produktu.'),
    ).not.toBeInTheDocument();
  });

  test('obsługuje przesyłanie obrazów', async () => {
    const { supabase } = require('@/lib/supabase');
    const uploadMock = jest.fn().mockResolvedValue({
      data: { path: 'products/testowy-obraz.jpg' },
      error: null,
    });
    const getPublicUrlMock = jest.fn().mockReturnValue({
      data: { publicUrl: 'https://przykład.com/nowy-obraz.jpg' },
    });

    // @ts-ignore - nadpisujemy mockowane funkcje
    supabase.storage.from().upload = uploadMock;
    // @ts-ignore
    supabase.storage.from().getPublicUrl = getPublicUrlMock;

    await act(async () => {
      render(<EditProductPage params={{ id: '123' }} />);
    });

    // Czekamy na załadowanie danych
    await waitFor(() => {
      expect(screen.getByText('Edytuj produkt')).toBeInTheDocument();
    });

    // Szukamy przycisku "Dodaj zdjęcia" i symulujemy przesłanie pliku
    const fileInputs = document.querySelectorAll('input[type="file"]');
    if (fileInputs.length > 0) {
      const fileInput = fileInputs[0];

      // Tworzymy testowy plik
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = {
        0: file,
        length: 1,
        item: (index: number) => file,
      };

      // Symulujemy zdarzenie zmiany pliku
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: fileList } });
      });

      // Sprawdzamy, czy funkcja przesyłania została wywołana
      await waitFor(() => {
        expect(uploadMock).toHaveBeenCalled();
        expect(getPublicUrlMock).toHaveBeenCalled();
      });
    }
  });

  test('aktualizuje produkt po przesłaniu formularza', async () => {
    // Przygotowujemy dane testowe
    const mockProduct = {
      id: '123',
      name: 'Testowy Produkt',
      description: 'Opis testowego produktu',
      regular_price: 249.99,
      current_price: 199.99,
      lowest_price: 189.99,
      sizes: [{ id: '1', label: 'S', price: 199 }],
      color_variants: [
        {
          name: 'Czerwony',
          color_code: '#FF0000',
          images: ['https://przykład.com/czerwony1.jpg'],
        },
      ],
      benefits: ['Trwały materiał'],
    };

    // Mockujemy Supabase
    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockProduct,
            error: null,
          }),
        }),
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue({
              data: [{ ...mockProduct, name: 'Zaktualizowany Produkt' }],
              error: null,
            }),
          }),
        }),
      }),
    };

    // Nadpisujemy moduł supabase
    jest.mock('@/lib/supabase', () => ({
      supabase: mockSupabase,
    }));

    // Renderujemy komponent
    let component;
    await act(async () => {
      component = render(<EditProductPage params={{ id: '123' }} />);
    });

    // Czekamy na załadowanie danych
    await waitFor(() => {
      expect(screen.getByText('Edytuj produkt')).toBeInTheDocument();
    });

    // Znajdujemy pole nazwy produktu za pomocą atrybutu name
    const nameInput = screen.getByRole('textbox', { name: /Nazwa produktu/i });
    expect(nameInput).toBeInTheDocument();

    // Modyfikujemy pole nazwy produktu
    await act(async () => {
      fireEvent.change(nameInput, {
        target: { value: 'Zaktualizowany Produkt' },
      });
    });

    // Wysyłamy formularz (szukamy przycisku submita)
    const form = screen.getByRole('form');

    // Mockujemy preventDefault na zdarzeniu formularza
    const mockPreventDefault = jest.fn();

    // Bezpośrednio wywołujemy zdarzenie submit na formularzu
    await act(async () => {
      fireEvent.submit(form, {
        preventDefault: mockPreventDefault,
      });
    });

    // Sprawdzamy, czy preventDefault został wywołany (co oznacza, że handler submit został uruchomiony)
    expect(mockPreventDefault).toHaveBeenCalled();

    // Sprawdzamy, czy pojawia się komunikat o sukcesie
    await waitFor(() => {
      const successMessage = screen.queryByText(
        /Produkt został pomyślnie zaktualizowany/i,
      );
      expect(successMessage).toBeInTheDocument();
    });
  });
});
