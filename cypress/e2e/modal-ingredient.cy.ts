describe('Модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.mockIngredients();
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('должно открываться при клике на ингредиент', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента').should('be.visible');
    cy.contains('Краторная булка N-200i').should('be.visible');
  });

  it('должно закрываться при клике на крестик', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента').should('be.visible');
    cy.get('#modals').find('button[type="button"]').click();
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('должно закрываться при клике на оверлей', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента').should('be.visible');
    cy.get('[class*="overlay"]').click({ force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('должно отображать данные именно того ингредиента, по которому произошел клик', () => {
    cy.contains('Соус Spicy-X').click();
    cy.contains('Детали ингредиента').should('be.visible');
    cy.contains('Соус Spicy-X').should('be.visible');
    cy.contains('Калории').should('be.visible');
    cy.contains('Белки').should('be.visible');
    cy.contains('Жиры').should('be.visible');
    cy.contains('Углеводы').should('be.visible');
  });
});
