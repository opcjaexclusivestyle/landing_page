/// <reference types="cypress" />

interface CustomerInfo {
  name: string;
  email: string;
  city: string;
  postalCode: string;
  street: string;
  houseNumber: string;
}

interface CardInfo {
  number: string;
  expiry: string;
  cvc: string;
}

declare namespace Cypress {
  interface Chainable {
    fillCustomerForm(customerInfo: CustomerInfo): Chainable<void>;
    fillCardDetails(cardInfo: CardInfo): Chainable<void>;
    addToCart(productSelector?: string): Chainable<void>;
    checkEmptyCart(): Chainable<void>;
    goToCart(): Chainable<void>;
    goToCheckout(): Chainable<void>;
    checkPaymentSuccess(): Chainable<void>;
    checkPaymentError(): Chainable<void>;
    checkFormValidation(): Chainable<void>;
    cancelPayment(): Chainable<void>;
  }
}
