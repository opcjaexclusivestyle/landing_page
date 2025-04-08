import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

// Inicjalizacja klienta Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    const errorMessage = err.message;
    console.error(`Błąd podpisu webhook: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    );
  }

  // Obsługa różnych typów zdarzeń
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`Płatność zatwierdzona: ${paymentIntent.id}`);
        // Tutaj możesz dodać aktualizację statusu zamówienia w bazie danych
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log(
          `Płatność nieudana: ${failedPayment.id}, powód: ${failedPayment.last_payment_error?.message}`,
        );
        break;
      default:
        console.log(`Nieobsługiwany typ zdarzenia: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas przetwarzania webhook:', error);
    return NextResponse.json(
      { message: 'Błąd podczas przetwarzania webhook' },
      { status: 500 },
    );
  }
}
