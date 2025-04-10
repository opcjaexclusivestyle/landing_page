import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TestimonialForm from '../TestimonialForm';
import { addTestimonial } from '@/lib/supabase';
import '@testing-library/jest-dom';

// Mockowanie modułu supabase
jest.mock('@/lib/supabase', () => ({
  addTestimonial: jest.fn(),
}));

describe('TestimonialForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderuje formularz poprawnie', () => {
    render(
      <TestimonialForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
    );

    expect(screen.getByText('Podziel się swoją opinią')).toBeInTheDocument();
    expect(screen.getByLabelText(/Imię i nazwisko/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Miejscowość/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Twoja opinia/)).toBeInTheDocument();
    expect(screen.getByText('Wyślij opinię')).toBeInTheDocument();
    expect(screen.getByText('Anuluj')).toBeInTheDocument();
  });

  test('reaguje na przycisk anuluj', () => {
    render(
      <TestimonialForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
    );

    fireEvent.click(screen.getByText('Anuluj'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('wyświetla błąd, gdy formularz jest niepełny', async () => {
    render(
      <TestimonialForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
    );

    // Kliknij przycisk wyślij bez wypełnienia pól
    fireEvent.click(screen.getByText('Wyślij opinię'));

    expect(
      screen.getByText('Proszę wypełnić wszystkie wymagane pola'),
    ).toBeInTheDocument();
    expect(addTestimonial).not.toHaveBeenCalled();
  });

  test('wysyła formularz poprawnie, gdy wszystkie pola są wypełnione', async () => {
    // Mock udanego dodania świadectwa
    (addTestimonial as jest.Mock).mockResolvedValue({});

    render(
      <TestimonialForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
    );

    // Wypełnij formularz
    fireEvent.change(screen.getByLabelText(/Imię i nazwisko/), {
      target: { value: 'Jan Kowalski' },
    });

    fireEvent.change(screen.getByLabelText(/Miejscowość/), {
      target: { value: 'Warszawa' },
    });

    fireEvent.change(screen.getByLabelText(/Twoja opinia/), {
      target: { value: 'Świetna obsługa, polecam!' },
    });

    // Wyślij formularz
    fireEvent.click(screen.getByText('Wyślij opinię'));

    // Sprawdź, czy addTestimonial został wywołany z odpowiednimi parametrami
    expect(addTestimonial).toHaveBeenCalledWith({
      name: 'Jan Kowalski',
      location: 'Warszawa',
      rating: 5, // Domyślna wartość
      content: 'Świetna obsługa, polecam!',
      created_at: expect.any(String),
    });

    // Poczekaj na sukces i sprawdź komunikat
    await waitFor(() => {
      expect(
        screen.getByText(/Dziękujemy za dodanie opinii/),
      ).toBeInTheDocument();
    });

    // Sprawdź, czy callback onSuccess został wywołany (po timeoucie)
    jest.advanceTimersByTime(3000);
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
  });

  test('obsługuje błąd podczas dodawania opinii', async () => {
    // Mock nieudanego dodania świadectwa
    (addTestimonial as jest.Mock).mockRejectedValue(new Error('Błąd API'));

    render(
      <TestimonialForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
    );

    // Wypełnij formularz
    fireEvent.change(screen.getByLabelText(/Imię i nazwisko/), {
      target: { value: 'Jan Kowalski' },
    });

    fireEvent.change(screen.getByLabelText(/Twoja opinia/), {
      target: { value: 'Świetna obsługa, polecam!' },
    });

    // Wyślij formularz
    fireEvent.click(screen.getByText('Wyślij opinię'));

    // Sprawdź, czy pojawił się komunikat o błędzie
    await waitFor(() => {
      expect(
        screen.getByText(/Wystąpił błąd podczas dodawania opinii/),
      ).toBeInTheDocument();
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  test('sprawdza mapowanie pól do struktury bazy danych', async () => {
    // Ten test sprawdza, czy dane są prawidłowo mapowane
    (addTestimonial as jest.Mock).mockResolvedValue({});

    render(
      <TestimonialForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
    );

    // Wypełnij formularz
    fireEvent.change(screen.getByLabelText(/Imię i nazwisko/), {
      target: { value: 'Jan Kowalski' },
    });

    fireEvent.change(screen.getByLabelText(/Twoja opinia/), {
      target: { value: 'Test opinii' },
    });

    // Wyślij formularz
    fireEvent.click(screen.getByText('Wyślij opinię'));

    // Sprawdź, czy addTestimonial został wywołany
    expect(addTestimonial).toHaveBeenCalled();

    // Rozpakuj argumenty z wywołania mocka
    const calledWith = (addTestimonial as jest.Mock).mock.calls[0][0];

    // Sprawdź, czy pola są poprawne
    expect(calledWith.name).toBe('Jan Kowalski');
    expect(calledWith.content).toBe('Test opinii');
    expect(calledWith.rating).toBe(5);
  });
});
