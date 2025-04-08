import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicjalizacja klienta Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, productName, name, metadata } = body;

    // Tworzenie obiektu płatności
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(amount) * 100), // Stripe wymaga kwoty w groszach/centach
      currency: 'pln',
      payment_method_types: ['card', 'p24', 'blik'],
      description: `Zamówienie: ${productName}`,
      metadata: {
        customer_name: name,
        product_name: productName,
        ...metadata,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Błąd podczas tworzenia payment intent:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
