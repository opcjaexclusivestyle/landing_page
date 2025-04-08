import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OrderForm from '../OrderForm';

describe('OrderForm', () => {
  const mockProps = {
    productName: 'Test Product',
    productDescription: 'Test Description',
    productImage: '/test-image.jpg',
  };

  it('renders form fields correctly', () => {
    render(<OrderForm {...mockProps} />);

    expect(screen.getByLabelText(/imię/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefon/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/szerokość/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/wysokość/i)).toBeInTheDocument();
    expect(screen.getByText(/dodaj do koszyka/i)).toBeInTheDocument();
  });

  it('calculates price correctly based on dimensions', () => {
    render(<OrderForm {...mockProps} />);

    const widthInput = screen.getByLabelText(/szerokość/i);
    const heightInput = screen.getByLabelText(/wysokość/i);

    fireEvent.change(widthInput, { target: { value: '100' } });
    fireEvent.change(heightInput, { target: { value: '200' } });

    // Cena bazowa: 100 * 200 = 20000
    expect(screen.getByText(/200 zł/i)).toBeInTheDocument();
  });

  it('adds embroidery cost when checkbox is checked', () => {
    render(<OrderForm {...mockProps} />);

    const widthInput = screen.getByLabelText(/szerokość/i);
    const heightInput = screen.getByLabelText(/wysokość/i);
    const embroideryCheckbox = screen.getByLabelText(/haft/i);

    fireEvent.change(widthInput, { target: { value: '100' } });
    fireEvent.change(heightInput, { target: { value: '200' } });
    fireEvent.click(embroideryCheckbox);

    // Cena bazowa: 200 zł + haft: 50 zł
    expect(screen.getByText(/250 zł/i)).toBeInTheDocument();
  });

  it('adds curtain rod cost when checkbox is checked', () => {
    render(<OrderForm {...mockProps} />);

    const widthInput = screen.getByLabelText(/szerokość/i);
    const heightInput = screen.getByLabelText(/wysokość/i);
    const rodCheckbox = screen.getByLabelText(/karnisz/i);

    fireEvent.change(widthInput, { target: { value: '100' } });
    fireEvent.change(heightInput, { target: { value: '200' } });
    fireEvent.click(rodCheckbox);

    // Cena bazowa: 200 zł + karnisz: 30 zł
    expect(screen.getByText(/230 zł/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<OrderForm {...mockProps} />);

    const submitButton = screen.getByText(/dodaj do koszyka/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/wypełnij wszystkie wymagane pola/i),
      ).toBeInTheDocument();
    });
  });
});
