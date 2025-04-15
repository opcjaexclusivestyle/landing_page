import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// To jest ważne dla typów!
import '@testing-library/jest-dom';
// Dodajemy rozszerzenie expect dla właściwego typowania
import { expect } from '@jest/globals';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { v4 as uuidv4 } from 'uuid';
import BeddingForm, {
  BeddingProductData,
  ColorOption,
  CartItemOptions,
} from './BeddingForm';

// Rozszerz testy dla @testing-library/jest-dom
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(content: string | RegExp): R;
      toBeChecked(): R;
    }
  }
}

// Mock dla uuid
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

// Przykładowe dane testowe
const mockProductData: BeddingProductData = {
  name: 'Pościel adamaszkowa SAN ANTONIO',
  description:
    'Luksusowa pościel adamaszkowa wykonana z wysokiej jakości bawełny.',
  beddingSets: [
    {
      id: 1,
      label: '135x200 + 50x60',
      beddingSize: '135x200',
      pillowSize: '50x60',
      price: 195.99,
    },
    {
      id: 2,
      label: '140x200 + 70x80',
      beddingSize: '140x200',
      pillowSize: '70x80',
      price: 199.99,
    },
  ],
  sheetPrices: {
    '135x200': 91.0,
    '140x200': 94.25,
  },
  colors: {
    white: {
      images: ['/images/linen/white_1.jpg'],
      displayName: 'biała',
      displayColor: '#ffffff',
    },
    beige: {
      images: ['/images/linen/beige_11.jpg'],
      displayName: 'beżowa',
      displayColor: '#f5f5dc',
    },
    silver: {
      images: ['/images/linen/silver_22.jpg'],
      displayName: 'srebrna',
      displayColor: '#c0c0c0',
    },
    black: {
      images: ['/images/linen/black_30.jpg'],
      displayName: 'czarna',
      displayColor: '#000000',
    },
  },
  defaultColor: 'white' as ColorOption,
  features: [
    'Materiał: 100% bawełna - adamaszek',
    'Gramatura: 160g/m²',
    'Prać w temperaturze 40°C',
  ],
};

// Konfiguracja mockowego store Redux
const mockStore = configureStore([]);

describe('BeddingForm Component', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      cart: {
        items: [],
      },
    });

    // Mock dla uuid
    (uuidv4 as jest.Mock).mockReturnValue('mock-uuid-123');
  });

  test('renderuje formularz z domyślnymi opcjami', () => {
    render(
      <Provider store={store}>
        <BeddingForm productData={mockProductData} />
      </Provider>,
    );

    // Sprawdź czy formularz się wyświetla z domyślnymi opcjami
    expect(screen.getByTestId('product-title')).toHaveTextContent(
      'Pościel adamaszkowa SAN ANTONIO – biała',
    );

    // Sprawdź opcje zakupu
    expect(screen.getByTestId('bedding-with-sheet-radio')).toBeChecked();

    // Zmień na opcję "Tylko pościel"
    fireEvent.click(screen.getByLabelText('Tylko pościel'));

    // Teraz cena powinna być za samą pościel (bez prześcieradła)
    expect(screen.getByTestId('product-price')).toHaveTextContent('195.99 zł');
  });

  test('aktualizuje cenę przy zmianie zestawu pościeli', () => {
    render(
      <Provider store={store}>
        <BeddingForm productData={mockProductData} />
      </Provider>,
    );

    // Przełącz na opcję "Tylko pościel"
    fireEvent.click(screen.getByLabelText('Tylko pościel'));

    // Zmień zestaw pościeli
    fireEvent.change(screen.getByTestId('bedding-set-select'), {
      target: { value: '2' },
    });

    // Sprawdź czy cena się zaktualizowała
    expect(screen.getByTestId('product-price')).toHaveTextContent('199.99 zł');
  });

  test('aktualizuje cenę po wybraniu opcji z prześcieradłem', () => {
    render(
      <Provider store={store}>
        <BeddingForm productData={mockProductData} />
      </Provider>,
    );

    // Najpierw przełącz na opcję "Tylko pościel"
    fireEvent.click(screen.getByLabelText('Tylko pościel'));

    // Sprawdź początkową cenę (tylko pościel)
    expect(screen.getByTestId('product-price')).toHaveTextContent('195.99 zł');

    // Zmień na opcję "Pościel z prześcieradłem"
    fireEvent.click(screen.getByLabelText('Pościel z prześcieradłem'));

    // Sprawdź czy cena zawiera teraz również prześcieradło (195.99 + 91.0)
    expect(screen.getByTestId('product-price')).toHaveTextContent('286.99 zł');
  });

  test('dodaje produkt do koszyka z poprawnymi danymi', async () => {
    render(
      <Provider store={store}>
        <BeddingForm productData={mockProductData} />
      </Provider>,
    );

    // Wybierz kolor
    fireEvent.click(screen.getByTestId('color-beige'));

    // Ustaw ilość
    const quantityInput = screen.getByTestId('quantity-input');
    fireEvent.change(quantityInput, { target: { value: '2' } });

    // Kliknij przycisk dodania do koszyka
    fireEvent.click(screen.getByTestId('add-to-cart-button'));

    // Sprawdź czy akcja została wysłana do store'a
    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe('cart/addToCart');

    const expectedOptions: CartItemOptions = {
      width: '135',
      height: '200',
      embroidery: false,
      curtainRod: false,
      purchaseType: 'bedding-with-sheet',
      color: 'beige',
      customSize: null,
      comment: null,
    };

    expect(actions[0].payload).toEqual({
      id: 'mock-uuid-123',
      name: expect.stringContaining('Pościel adamaszkowa SAN ANTONIO – beżowa'),
      price: 286.99 * 2, // całkowita cena za 2 sztuki
      quantity: 2,
      options: expectedOptions,
    });

    // Sprawdź czy pojawia się komunikat o dodaniu do koszyka
    await waitFor(() => {
      expect(screen.getByTestId('added-to-cart-message')).toBeInTheDocument();
    });
  });

  test('zmienia główny obraz po kliknięciu w miniaturę', () => {
    // Rozszerzmy mock kolorów o więcej obrazów dla beżowego
    const extendedProductData = {
      ...mockProductData,
      colors: {
        ...mockProductData.colors,
        beige: {
          ...mockProductData.colors.beige,
          images: ['/images/linen/beige_11.jpg', '/images/linen/beige_14.jpg'],
        },
      },
    };

    render(
      <Provider store={store}>
        <BeddingForm productData={extendedProductData} />
      </Provider>,
    );

    // Znajdź i kliknij w beżowy kolor
    fireEvent.click(screen.getByTestId('color-beige'));

    // Znajdź miniaturę i kliknij w nią
    const thumbnail = screen.getByTestId('thumbnail-0');
    fireEvent.click(thumbnail);

    // Sprawdź czy główny obraz jest widoczny
    expect(screen.getByTestId('main-product-image')).toBeInTheDocument();
  });
});
