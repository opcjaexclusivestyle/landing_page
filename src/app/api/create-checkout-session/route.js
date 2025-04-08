import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicjalizacja klienta Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, productName, name, metadata } = body;

    // Tworzenie sesji checkout Stripe
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: productName || 'Zamówienie',
              description: `Wymiary: ${metadata?.width || ''}cm × ${
                metadata?.height || ''
              }cm`,
            },
            unit_amount: Math.round(parseFloat(amount) * 100), // Stripe wymaga kwoty w groszach/centach
          },
          quantity: 1,
        },
      ],
      customer_email: metadata?.email,
      mode: 'payment',
      return_url: `${req.headers.get(
        'origin',
      )}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      payment_method_types: ['card', 'p24', 'blik'],
      shipping_address_collection: {
        allowed_countries: ['PL'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'pln',
            },
            display_name: 'Darmowa dostawa',
          },
        },
      ],
      custom_text: {
        shipping_address: {
          message: 'Proszę podać adres dostawy',
        },
        submit: {
          message:
            'Twoja płatność jest przetwarzana przez Stripe, lidera bezpiecznych płatności online.',
        },
      },
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        customer_name: name,
        product_name: productName,
        ...metadata,
      },
    });

    return NextResponse.json({
      clientSecret: session.client_secret,
    });
  } catch (error) {
    console.error('Błąd podczas tworzenia sesji checkout:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
