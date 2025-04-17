import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { supabase } from '@/lib/supabase';
import '@testing-library/jest-dom';
import ProductsPage from '../produkty/page';

// Mockowanie hooka next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mockowanie hooka autoryzacji admina
jest.mock('@/hooks/useAdminAuth', () => ({
  useAdminAuth: () => ({
    isVerifying: false,
  }),
}));

// Mockowane dane produktów
const mockProducts = [
  {
    id: 1,
    name: 'Testowy Produkt 1',
    current_price: 199.99,
    regular_price: 249.99,
    colors: ['#FF0000', '#00FF00'],
    created_at: '2023-01-01T12:00:00Z',
    main_image: 'https://przykład.com/obraz1.jpg',
  },
  {
    id: 2,
    name: 'Testowy Produkt 2',
    current_price: 99.99,
    regular_price: 99.99,
    colors: ['#0000FF'],
    created_at: '2023-01-02T12:00:00Z',
    main_image: 'https://przykład.com/obraz2.jpg',
  },
];

// Mockowanie klienta Supabase
jest.mock('@/lib/supabase', () => {
  return {
    supabase: {
      from: jest.fn().mockImplementation((table) => {
        if (table === 'products') {
          return {
            select: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnValue({
              data: mockProducts,
              error: null,
            }),
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnValue({
              data: null,
              error: null,
            }),
          };
        }
        return {};
      }),
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

// Helper do renderowania z opóźnionym stanie ładowania
const renderWithLoadingState = async () => {
  let component;
  await act(async () => {
    component = render(<ProductsPage />);
    // Poczekaj na asynchroniczne ładowanie danych
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
  return component;
};

describe('ProductsPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderuje listę produktów', async () => {
    // Renderujemy komponent
    await renderWithLoadingState();

    // Sprawdzamy, czy tytuł strony jest wyświetlany
    expect(screen.getByText('Produkty')).toBeInTheDocument();

    // Sprawdzamy, czy przycisk "Dodaj nowy produkt" jest wyświetlany
    expect(screen.getByText('Dodaj nowy produkt')).toBeInTheDocument();

    // Sprawdzamy, czy nazwa produktu 1 jest widoczna
    expect(screen.getByText('Testowy Produkt 1')).toBeInTheDocument();

    // Sprawdzamy, czy nazwa produktu 2 jest widoczna
    expect(screen.getByText('Testowy Produkt 2')).toBeInTheDocument();

    // Sprawdzamy elementy cenowe za pomocą selektorów tekstowych
    const priceElements = screen.getAllByText(/\d+\.\d+ zł/);
    expect(priceElements.length).toBeGreaterThan(0);
  });

  test('filtruje produkty na podstawie wyszukiwania', async () => {
    await renderWithLoadingState();

    // Sprawdzamy, czy dane zostały załadowane
    await waitFor(() => {
      expect(screen.getByText('Testowy Produkt 1')).toBeInTheDocument();
    });

    // Wprowadzamy tekst do pola wyszukiwania
    const searchInput = screen.getByPlaceholderText('Wyszukaj produkt...');
    fireEvent.change(searchInput, { target: { value: 'Produkt 1' } });

    // Sprawdzamy, czy tylko pasujące produkty są wyświetlane
    expect(screen.getByText('Testowy Produkt 1')).toBeInTheDocument();
    expect(screen.queryByText('Testowy Produkt 2')).not.toBeInTheDocument();
  });

  test('zmienia sortowanie po kliknięciu w nagłówek kolumny', async () => {
    // Mockujemy funkcje sortowania
    const mockOrderFn = jest.fn().mockReturnValue({
      data: mockProducts,
      error: null,
    });

    const fromFn = jest.fn().mockImplementation((table) => {
      if (table === 'products') {
        return {
          select: jest.fn().mockReturnThis(),
          order: mockOrderFn,
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnValue({
            data: null,
            error: null,
          }),
        };
      }
      return {};
    });

    // Nadpisujemy mocka z bardziej szczegółowym śledzeniem
    (supabase.from as jest.Mock) = fromFn;

    // Renderujemy komponent i czekamy na dane
    await renderWithLoadingState();

    // Znajdujemy nagłówek kolumny "Nazwa"
    const nameHeader = screen.getByText('Nazwa');

    // Klikamy nagłówek
    fireEvent.click(nameHeader);

    // Sprawdzamy, czy funkcja sortowania została wywołana
    expect(mockOrderFn).toHaveBeenCalled();
  });

  test('wywołuje potwierdzenie przed usunięciem produktu', async () => {
    // Mockujemy window.confirm
    const confirmSpy = jest.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(() => true);

    // Mockujemy funkcję usuwania
    const mockDeleteFn = jest.fn().mockReturnThis();
    const mockEqFn = jest.fn().mockReturnValue({
      data: { id: 1 },
      error: null,
    });

    const fromFn = jest.fn().mockImplementation((table) => {
      if (table === 'products') {
        return {
          select: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnValue({
            data: mockProducts,
            error: null,
          }),
          delete: mockDeleteFn,
          eq: mockEqFn,
        };
      }
      return {};
    });

    // Nadpisujemy mocka
    (supabase.from as jest.Mock) = fromFn;

    // Renderujemy komponent i czekamy na dane
    await renderWithLoadingState();

    // Znajdujemy przycisk "Usuń"
    await waitFor(() => {
      const deleteButtons = screen.getAllByText('Usuń');
      expect(deleteButtons.length).toBeGreaterThan(0);

      // Klikamy pierwszy przycisk "Usuń"
      fireEvent.click(deleteButtons[0]);
    });

    // Sprawdzamy, czy potwierdzenie zostało wywołane
    expect(confirmSpy).toHaveBeenCalledWith(
      'Czy na pewno chcesz usunąć ten produkt?',
    );

    // Sprawdzamy, czy funkcja usuwania została wywołana
    expect(mockDeleteFn).toHaveBeenCalled();
  });
});
