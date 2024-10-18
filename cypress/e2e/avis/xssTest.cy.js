describe("Requête pour tester la vulnérabilité XSS lors de l'envoi d'un avis", () => {
  before(() => {
    
    //Connexion sur le site
    cy.intercept("POST", "http://localhost:8081/login").as("loginRequest");

    cy.visit("http://localhost:8080/#/login");

    cy.get('[data-cy="login-input-username"]').type("test2@test.fr");

    cy.get('[data-cy="login-input-password"]').type("testtest");

    cy.get('[data-cy="login-submit"]').click();

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

    cy.intercept({
      method: "POST",
      url: "http://localhost:8081/reviews",
    }).as("postReview");

  });

  it("devrait bloquer l'exécution de scripts lors de l'envoi d'un avis contenant du code XSS", () => {
    cy.visit ("http://localhost:8080/#/");
    cy.get('[data-cy="nav-link-reviews"]').click();
    cy.url().should("include", "/reviews");

    cy.get('[data-cy="review-input-rating-images"]').should("exist");

    cy.get('[data-cy="review-input-rating-images"] img')
      .first()
      .click({ force: true });

    cy.get('[data-cy="review-input-rating"]').should("have.value", "1");

    const xssTitle = "<script>alert('XSS')</script>";
    const xssComment = "<img src=x onerror=alert('XSS')>";
    cy.get('[data-cy="review-input-title"]').clear().type(xssTitle);
    cy.get('[data-cy="review-input-comment"]').clear().type(xssComment);

    cy.get('[data-cy="review-submit"]').click();

    cy.wait("@postReview").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);

      cy.get(".review-section").should("not.contain", "<script>alert('XSS')</script>"); // Vérification que le code XSS ne s'exécute pas
      cy.get(".review-section").should("contain", "&lt;script&gt;alert('XSS')&lt;/script&gt;"); // Vérification que le code s'affiche en tant que texte
  
    });
  });
});
