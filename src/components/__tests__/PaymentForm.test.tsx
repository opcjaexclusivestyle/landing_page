import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../PaymentForm';

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({})),
}));

// Mock fetch
global.fetch = jest.fn();

const mockCustomerInfo = {
  name: 'Jan Kowalski',
  email: 'jan@example.com',
  city: 'Warszawa',
  postalCode: '00-001',
  street: 'ul. Testowa',
  houseNumber: '1',
};

const mockProps = {
  amount: 100,
  customerInfo: mockCustomerInfo,
  onSuccess: jest.fn(),
  onError: jest.fn(),
};

describe('PaymentForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ clientSecret: 'test_secret' }),
    });
  });

  it('renderuje formularz płatności', async () => {
    render(<PaymentForm {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Szczegóły płatności')).toBeInTheDocument();
    });
  });

  it('wyświetla błąd gdy nie można zainicjalizować płatności', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(
      new Error('Błąd inicjalizacji'),
    );

    render(<PaymentForm {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Wystąpił problem')).toBeInTheDocument();
      expect(mockProps.onError).toHaveBeenCalled();
    });
  });

  it('wyświetla loader podczas inicjalizacji', () => {
    render(<PaymentForm {...mockProps} />);

    expect(screen.getByText('Inicjalizacja płatności...')).toBeInTheDocument();
  });

  it('wyświetla komunikat o sukcesie po udanej płatności', async () => {
    const mockStripe = {
      retrievePaymentIntent: jest.fn().mockResolvedValue({
        paymentIntent: { status: 'succeeded' },
      }),
      confirmPayment: jest.fn().mockResolvedValue({ error: null }),
    };

    (loadStripe as jest.Mock).mockResolvedValue(mockStripe);

    render(<PaymentForm {...mockProps} />);

    await waitFor(() => {
      expect(
        screen.getByText('Płatność zakończona sukcesem!'),
      ).toBeInTheDocument();
      expect(mockProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('wyświetla komunikat o błędzie po nieudanej płatności', async () => {
    const mockStripe = {
      retrievePaymentIntent: jest.fn().mockResolvedValue({
        paymentIntent: { status: 'requires_payment_method' },
      }),
      confirmPayment: jest.fn().mockResolvedValue({
        error: { type: 'card_error', message: 'Błąd karty' },
      }),
    };

    (loadStripe as jest.Mock).mockResolvedValue(mockStripe);

    render(<PaymentForm {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Błąd karty')).toBeInTheDocument();
      expect(mockProps.onError).toHaveBeenCalled();
    });
  });
});
