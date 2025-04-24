import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicjalizacja klienta Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address?: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  };
}

interface CartItemPrice {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      description?: string;
      images?: string[];
    };
    unit_amount: number;
  };
  quantity: number;
}

export async function POST(req: Request) {
  try {
    const { items, total, customer } = await req.json();

    // Sprawdzanie, czy mamy prawidłowe dane
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Nieprawidłowa lista produktów' },
        { status: 400 },
      );
    }

    // Pobierz dane klienta, jeśli zostały przesłane
    let customerName = 'Gość';
    let customerEmail = undefined;
    let customerPhone = undefined;
    let shippingDetails = undefined;

    if (customer) {
      customerName = customer.name || 'Gość';
      customerEmail = customer.email;
      customerPhone = customer.phone;
    }

    // Przygotowanie opcji sesji
    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card', 'p24', 'blik'],
      line_items: items as CartItemPrice[],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/zamowienie-zlozone`,
      cancel_url: `${req.headers.get('origin')}/cart`,
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: total > 399 ? 0 : 1500, // 15 zł lub darmowa dla zamówień powyżej 399 zł
              currency: 'pln',
            },
            display_name: total > 399 ? 'Darmowa dostawa' : 'Dostawa kurierem',
          },
        },
      ],
      metadata: {
        totalAmount: total.toString(),
      },
      locale: 'pl',
    };

    // Dodanie opcjonalnych pól jeśli dane klienta są dostępne
    if (customerEmail) {
      sessionOptions.customer_email = customerEmail;
    } else {
      sessionOptions.shipping_address_collection = {
        allowed_countries: ['PL'],
      };
    }

    if (!customerPhone) {
      sessionOptions.phone_number_collection = {
        enabled: true,
      };
    }

    // Utworzenie sesji checkout
    const session = await stripe.checkout.sessions.create(sessionOptions);

    return NextResponse.json({ clientSecret: session.id });
  } catch (err) {
    console.error('Błąd podczas tworzenia sesji płatności:', err);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas przetwarzania płatności' },
      { status: 500 },
    );
  }
}
