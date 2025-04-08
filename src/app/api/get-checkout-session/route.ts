import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicjalizacja klienta Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Brak identyfikatora sesji' },
        { status: 400 },
      );
    }

    // Pobieranie szczegółów sesji ze Stripe wraz z danymi linii zamówienia
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    });

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Błąd podczas pobierania sesji checkout:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania danych zamówienia' },
      { status: 500 },
    );
  }
}
