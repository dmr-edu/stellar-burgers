describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.mockIngredients();
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('должен добавлять ингредиент в конструктор при клике на кнопку "Добавить"', () => {
    cy.contains('Соус Spicy-X')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
    cy.contains('Соус Spicy-X').should('exist');
  });

  it('должен добавлять булку в конструктор', () => {
    cy.contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
    cy.contains('Краторная булка N-200i (верх)').should('be.visible');
    cy.contains('Краторная булка N-200i (низ)').should('be.visible');
  });

  it('должен открывать страницу логина при оформлении заказа без авторизации', () => {
    cy.contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
    cy.contains('Соус Spicy-X')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
    cy.contains('Оформить заказ').click();
    cy.url().should('include', '/login');
  });

  it('должен оформлять заказ при авторизации', () => {
    cy.mockLogin();
    cy.mockGetUser();
    cy.mockRefreshToken();
    cy.mockCreateOrder(12345);

    cy.setCookie('accessToken', 'Bearer test-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser', { timeout: 10000 });
    cy.contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
    cy.contains('Соус Spicy-X')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');
    cy.contains('12345').should('be.visible');

    cy.get('#modals').find('button[type="button"]').click();
    cy.contains('12345').should('not.exist');

    cy.contains('Выберите булки').should('be.visible');
    cy.contains('Выберите начинку').should('be.visible');

    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
  });
});
