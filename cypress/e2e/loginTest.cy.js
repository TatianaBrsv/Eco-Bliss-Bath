describe("Registration Form Test", () => {
  it("Should fill the registration form and be redirected on success", () => {
    cy.intercept("POST", "http://localhost:8081/login").as("loginRequest");

    cy.visit("http://localhost:8080/#/login");

    cy.get('[data-cy="login-input-username"]').type("test2@test.fr");

    cy.get('[data-cy="login-input-password"]').type("testtest");

    cy.get('[data-cy="login-submit"]').click();

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

    cy.url().should("eq", "http://localhost:8080/#/");

    cy.window().then((window) => {
      const token = window.localStorage.getItem('user'); 
      expect(token).to.exist; 
  });
});
});