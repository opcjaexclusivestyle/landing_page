import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicjalizacja klienta Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const { totalAmount, cancelRoute, productIds, currentRoute } =
      await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'p24', 'blik'],
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: 'Zamówienie rolety',
              images: ['https://i.imgur.com/EHyR2nP.png'],
            },
            unit_amount: Math.round(totalAmount * 100), // Konwersja na grosze
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get(
        'origin',
      )}?is_stripe=true&is_cart=${currentRoute.includes(
        'cart',
      )}&product_ids=${productIds}`,
      cancel_url: `${req.headers.get('origin')}${cancelRoute}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Błąd podczas tworzenia sesji płatności:', err);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas przetwarzania płatności' },
      { status: 500 },
    );
  }
}
