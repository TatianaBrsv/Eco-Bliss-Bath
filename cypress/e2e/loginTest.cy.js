describe("Registration Form Test", () => {
  beforeEach(() => {
    cy.intercept("POST", "http://localhost:8081/login").as("loginRequest");

    cy.visit("http://localhost:8080/#/login");

    cy.get('[data-cy="login-input-username"]').type("test2@test.fr");

    cy.get('[data-cy="login-input-password"]').type("testtest");

    cy.get('[data-cy="login-submit"]').click();

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
  });
    it("Doit rediriger vers la page d’accueil et afficher les options de navigation une fois la connexion réussie", () => {
    cy.url().should("eq", "http://localhost:8080/#/");

    cy.window().then((window) => {
      const token = window.localStorage.getItem('user'); 
      expect(token).to.exist; 
    });
      cy.get('[data-cy="nav-link-cart"]').should("be.visible");
  });
});
