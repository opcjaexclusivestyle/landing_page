/// <reference types="cypress" />

// Komenda do wypełniania formularza klienta
Cypress.Commands.add('fillCustomerForm', (customerInfo) => {
  cy.get('[data-testid="customer-name"]').type(customerInfo.name);
  cy.get('[data-testid="customer-email"]').type(customerInfo.email);
  cy.get('[data-testid="customer-city"]').type(customerInfo.city);
  cy.get('[data-testid="customer-postal-code"]').type(customerInfo.postalCode);
  cy.get('[data-testid="customer-street"]').type(customerInfo.street);
  cy.get('[data-testid="customer-house-number"]').type(
    customerInfo.houseNumber,
  );
});

// Komenda do wypełniania danych karty
Cypress.Commands.add('fillCardDetails', (cardInfo) => {
  cy.get('[data-testid="card-number"]').type(cardInfo.number);
  cy.get('[data-testid="card-expiry"]').type(cardInfo.expiry);
  cy.get('[data-testid="card-cvc"]').type(cardInfo.cvc);
});

// Komenda do dodawania produktu do koszyka
Cypress.Commands.add(
  'addToCart',
  (productSelector = '[data-testid="add-to-cart"]') => {
    cy.get(productSelector).first().click();
    cy.get('[data-testid="cart-count"]').should('have.text', '1');
  },
);

// Komenda do sprawdzania czy koszyk jest pusty
Cypress.Commands.add('checkEmptyCart', () => {
  cy.get('[data-testid="empty-cart"]').should('exist');
});

// Komenda do przechodzenia do koszyka
Cypress.Commands.add('goToCart', () => {
  cy.visit('/cart');
});

// Komenda do przechodzenia do płatności
Cypress.Commands.add('goToCheckout', () => {
  cy.get('[data-testid="checkout-button"]').click();
});

// Komenda do sprawdzania czy przekierowano do strony sukcesu
Cypress.Commands.add('checkPaymentSuccess', () => {
  cy.url().should('include', '/payment-success');
  cy.get('[data-testid="success-message"]').should('exist');
});

// Komenda do sprawdzania czy wyświetlił się błąd
Cypress.Commands.add('checkPaymentError', () => {
  cy.get('[data-testid="error-message"]').should('exist');
});

// Komenda do sprawdzania walidacji formularza
Cypress.Commands.add('checkFormValidation', () => {
  cy.get('[data-testid="customer-name-error"]').should('exist');
  cy.get('[data-testid="customer-email-error"]').should('exist');
  cy.get('[data-testid="customer-city-error"]').should('exist');
  cy.get('[data-testid="customer-postal-code-error"]').should('exist');
  cy.get('[data-testid="customer-street-error"]').should('exist');
  cy.get('[data-testid="customer-house-number-error"]').should('exist');
});

// Komenda do anulowania płatności
Cypress.Commands.add('cancelPayment', () => {
  cy.get('[data-testid="cancel-payment"]').click();
  cy.url().should('include', '/cart');
});
