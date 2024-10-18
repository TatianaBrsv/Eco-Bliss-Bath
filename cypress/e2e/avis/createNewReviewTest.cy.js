describe("Requête pour envoyer un avis valide", () => {
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

  it("devrait afficher les étoiles et envoyer un avis valide", () => {
    cy.visit("http://localhost:8080/#/");
    cy.get('[data-cy="nav-link-reviews"]').click();
    cy.url().should("include", "/reviews");

    cy.get('[data-cy="review-input-rating-images"]').should("exist");

    cy.get('[data-cy="review-input-rating-images"] img')
      .should("have.length", 5)
      .each(($el) => {
        cy.wrap($el).should("have.attr", "src", "assets/images/star-empty.png");
      });

    cy.get('[data-cy="review-input-rating-images"] img')
      .first()
      .click({ force: true });

    cy.get('[data-cy="review-input-rating"]').should("have.value", "1");

    const validTitle = "Titre valide";
    const validComment = "Ceci est un commentaire valide.";
    cy.get('[data-cy="review-input-title"]').clear().type(validTitle);
    cy.get('[data-cy="review-input-comment"]').clear().type(validComment);

    cy.get('[data-cy="review-submit"]').click();

    cy.wait("@postReview").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);

      expect(interception.request.headers).to.have.property("authorization");
      expect(interception.request.headers.authorization).to.contain("Bearer");

      cy.get(".review-section").should("contain", validTitle);
      cy.get(".review-section").should("contain", validComment);
    });
  });
});
