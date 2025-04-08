import Stripe from 'stripe';

// Eksport instancji Stripe do użycia w całej aplikacji
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
