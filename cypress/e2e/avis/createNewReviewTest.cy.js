describe("Requête pour envoyer un avis valide", () => {
  before(() => {
    const testToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MjcyMDQzMjMsImV4cCI6MTcyNzIwNzkyMywicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGVzdDJAdGVzdC5mciJ9.bbjrxFNN-ZprGnKLJMQ-TjG8hd52M0Dub0uocdKCMBJ6gkjaMVSuYhjUP7bCRdHB9sNEUNIudFxGBja6k1C9XHOexPmo5o3ssK799BOFyfovvt8cqz4fcoNzAWJTNLalzBuD4NCq5nxoJNSpZYVb1VgzRV072r8DM8D6qq1qNWisGgCl_7tXpE3TsEJUn2zpPeCe3Jbf6oDL4ILnbJIt1sOnRUyRkxkOVvs5xtPL_CLmhAaz1TdVyFQofn_GRX_AJltlGrijgscuTbxSw0vhYThPao9JaAwB2xBHHF5gIey3AHpcSCEucPvFOfwHYqUAw29IgTb6jDjAj70RiwU4dg";
    window.localStorage.setItem("user", testToken);
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

    cy.intercept({
      method: "POST",
      url: "http://localhost:8081/reviews",
    }).as("postReview");

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
