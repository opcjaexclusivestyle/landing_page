import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentForm from '../PaymentForm';

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() =>
    Promise.resolve({
      retrievePaymentIntent: jest.fn().mockResolvedValue({
        paymentIntent: { status: 'succeeded' },
      }),
      confirmPayment: jest.fn().mockResolvedValue({ error: null }),
    }),
  ),
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

describe('PaymentForm Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ clientSecret: 'test_secret' }),
    });
  });

  it('inicjalizuje płatność i wyświetla formularz', async () => {
    render(
      <PaymentForm
        amount={100}
        customerInfo={mockCustomerInfo}
        onSuccess={jest.fn()}
        onError={jest.fn()}
      />,
    );

    // Sprawdź czy wyświetla się loader
    expect(screen.getByText('Inicjalizacja płatności...')).toBeInTheDocument();

    // Poczekaj na załadowanie formularza
    await waitFor(() => {
      expect(screen.getByText('Szczegóły płatności')).toBeInTheDocument();
    });

    // Sprawdź czy został wykonany request do API
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/create-payment-intent',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.any(String),
      }),
    );
  });

  it('obsługuje błąd inicjalizacji płatności', async () => {
    const onError = jest.fn();
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Błąd serwera'));

    render(
      <PaymentForm
        amount={100}
        customerInfo={mockCustomerInfo}
        onSuccess={jest.fn()}
        onError={onError}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('Wystąpił problem')).toBeInTheDocument();
      expect(onError).toHaveBeenCalledWith('Błąd serwera');
    });
  });

  it('obsługuje nieprawidłowe dane klienta', async () => {
    const invalidCustomerInfo = {
      ...mockCustomerInfo,
      email: 'invalid-email',
    };

    render(
      <PaymentForm
        amount={100}
        customerInfo={invalidCustomerInfo}
        onSuccess={jest.fn()}
        onError={jest.fn()}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('Szczegóły płatności')).toBeInTheDocument();
    });

    // Sprawdź czy formularz zawiera walidację
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('obsługuje różne kwoty płatności', async () => {
    const amounts = [50, 100, 1000, 9999.99];

    for (const amount of amounts) {
      render(
        <PaymentForm
          amount={amount}
          customerInfo={mockCustomerInfo}
          onSuccess={jest.fn()}
          onError={jest.fn()}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText(`ZAPŁAĆ ${amount} ZŁ`)).toBeInTheDocument();
      });
    }
  });
});
