/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      mockIngredients(): Chainable<void>;
      mockCreateOrder(orderNumber?: number): Chainable<void>;
      mockLogin(): Chainable<void>;
      mockGetUser(): Chainable<void>;
      mockRefreshToken(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('mockIngredients', () => {
  cy.fixture('ingredients').then((ingredients) => {
    cy.intercept('GET', '**/api/ingredients', {
      statusCode: 200,
      body: {
        success: true,
        data: ingredients
      }
    }).as('getIngredients');
  });
});

Cypress.Commands.add('mockCreateOrder', (orderNumber = 12345) => {
  cy.fixture('order').then((orderData) => {
    orderData.order.number = orderNumber;
    cy.intercept('POST', '**/api/orders', {
      statusCode: 200,
      body: orderData
    }).as('createOrder');
  });
});

Cypress.Commands.add('mockLogin', () => {
  cy.fixture('user').then((user) => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        accessToken: 'Bearer test-token',
        refreshToken: 'test-refresh-token',
        user
      }
    }).as('login');
  });
});

Cypress.Commands.add('mockGetUser', () => {
  cy.fixture('user').then((user) => {
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user
      }
    }).as('getUser');
  });
});

Cypress.Commands.add('mockRefreshToken', () => {
  cy.intercept('POST', '**/api/auth/token', {
    statusCode: 200,
    body: {
      success: true,
      accessToken: 'Bearer refreshed-token',
      refreshToken: 'refreshed-refresh-token'
    }
  }).as('refreshToken');
});

export {};
