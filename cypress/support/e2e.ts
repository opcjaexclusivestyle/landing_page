// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
const app = window.top as any;
if (app) {
  app.console.log = () => {};
}

// Prevent uncaught exception from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

// Prevent unhandled promise rejection from failing tests
Cypress.on('unhandled:rejection', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});
