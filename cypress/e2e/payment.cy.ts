/// <reference types="cypress" />

describe('Proces płatności', () => {
  const customerInfo = {
    name: 'Jan Kowalski',
    email: 'jan@example.com',
    city: 'Warszawa',
    postalCode: '00-001',
    street: 'ul. Testowa',
    houseNumber: '1',
  };

  const validCard = {
    number: '4242424242424242',
    expiry: '1225',
    cvc: '123',
  };

  const invalidCard = {
    number: '4000000000000002',
    expiry: '1225',
    cvc: '123',
  };

  beforeEach(() => {
    cy.visit('/cart');
  });

  it('powinien przejść przez cały proces płatności', () => {
    // Sprawdź czy koszyk jest pusty
    cy.checkEmptyCart();

    // Dodaj produkt do koszyka
    cy.visit('/rolety');
    cy.addToCart();
    cy.goToCart();

    // Wypełnij dane klienta
    cy.fillCustomerForm(customerInfo);

    // Przejdź do płatności
    cy.goToCheckout();

    // Sprawdź czy formularz płatności jest widoczny
    cy.get('[data-testid="payment-form"]').should('exist');

    // Wypełnij dane karty
    cy.fillCardDetails(validCard);

    // Kliknij przycisk płatności
    cy.get('[data-testid="pay-button"]').click();

    // Sprawdź czy przekierowano do strony sukcesu
    cy.checkPaymentSuccess();
  });

  it('powinien obsłużyć błąd płatności', () => {
    // Dodaj produkt do koszyka
    cy.visit('/rolety');
    cy.addToCart();
    cy.goToCart();

    // Wypełnij dane klienta
    cy.fillCustomerForm(customerInfo);

    // Przejdź do płatności
    cy.goToCheckout();

    // Wypełnij dane nieprawidłowej karty
    cy.fillCardDetails(invalidCard);

    // Kliknij przycisk płatności
    cy.get('[data-testid="pay-button"]').click();

    // Sprawdź czy wyświetlił się komunikat o błędzie
    cy.checkPaymentError();
  });

  it('powinien walidować dane klienta', () => {
    // Dodaj produkt do koszyka
    cy.visit('/rolety');
    cy.addToCart();
    cy.goToCart();

    // Próba przejścia do płatności bez wypełnionych danych
    cy.goToCheckout();

    // Sprawdź komunikaty walidacji
    cy.checkFormValidation();
  });

  it('powinien obsłużyć anulowanie płatności', () => {
    // Dodaj produkt do koszyka
    cy.visit('/rolety');
    cy.addToCart();
    cy.goToCart();

    // Wypełnij dane klienta
    cy.fillCustomerForm(customerInfo);

    // Przejdź do płatności
    cy.goToCheckout();

    // Anuluj płatność
    cy.cancelPayment();
  });
});
