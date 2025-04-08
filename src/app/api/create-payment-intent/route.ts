import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicjalizacja klienta Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: Request) {
  try {
    const { amount, name, title } = await request.json();

    // Upewniamy się, że kwota jest poprawna (minimum 1 zł)
    const adjustedAmount = Math.max(Math.round(amount * 100), 100);

    // Tworzenie intencji płatności
    const paymentIntent = await stripe.paymentIntents.create({
      amount: adjustedAmount, // Stripe wymaga kwoty w groszach/centach
      currency: 'pln',
      payment_method_types: ['card', 'p24', 'blik'],
      metadata: {
        name: name,
        orderTitle: title,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Błąd przy tworzeniu intencji płatności:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd przy przetwarzaniu płatności' },
      { status: 500 },
    );
  }
}
