describe("Requête pour envoyer un avis valide", () => {
  before(() => {
    const testToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MjkxNjIwODEsImV4cCI6MTcyOTE2NTY4MSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGVzdDJAdGVzdC5mciJ9.WeTf3yA8aU_lwA16ggufGZIAVA33VORHa9IRmMsFF6ynF3Tka-CGC1j_eaae7y_Btzt5JsYbvKtX9msM5KUduY9IWDMTU17aAGulumw_dQKo1toB58dlGcBer3Ej5BWmwZt0dlVlAZy9fbEQeY34cciQ7fXclMdUZzpGqTTHH_UT866gklP5MvRGAaPixbknNR94SyGjt_N6D_-PH40R_yOwa_9LD0kJAcLwAUCpxIPowKYEPne6F1a3qgASMT1HFIFh-7uTVv7pVUZdPZspCM7o2VIMA_JCRGs8ABFvUkPjtaPM8AAOrIArI_D-x1rabPWDuC1s9uLRsZ-8AkOS4g";
    window.localStorage.setItem("user", testToken);

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
