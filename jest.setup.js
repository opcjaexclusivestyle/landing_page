import '@testing-library/jest-dom';

// Mock dla Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() =>
    Promise.resolve({
      elements: jest.fn(() => ({
        create: jest.fn(() => ({
          mount: jest.fn(),
          unmount: jest.fn(),
          on: jest.fn(),
          update: jest.fn(),
        })),
      })),
      createPaymentMethod: jest.fn(() =>
        Promise.resolve({
          paymentMethod: {
            id: 'pm_test_123',
          },
        }),
      ),
      confirmCardPayment: jest.fn(() =>
        Promise.resolve({
          paymentIntent: {
            status: 'succeeded',
          },
        }),
      ),
    }),
  ),
}));

// Mock dla Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock dla Redux
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: jest.fn((selector) =>
    selector({
      cart: {
        items: [],
        total: 0,
      },
      customer: {
        name: '',
        email: '',
        phone: '',
      },
    }),
  ),
}));
