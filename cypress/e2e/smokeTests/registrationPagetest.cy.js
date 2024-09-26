describe("Smoke Test for Registration Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/#/login");
  });

  it("should display registration fields and button", () => {
    cy.get('[data-cy="login-input-username"]').should("be.visible");

    cy.get('[data-cy="login-input-password"]').should("be.visible");

    cy.get('[data-cy="login-submit"]')
      .should("be.visible")
      .and("contain", "Se connecter");

    cy.get('a[href="#/register')
      .should("be.visible")
      .and("contain", "S'inscrire");
  });
});
