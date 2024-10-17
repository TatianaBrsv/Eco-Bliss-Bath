describe("Requête pour tester la vulnérabilité XSS lors de l'envoi d'un avis", () => {
  before(() => {
    const testToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MjkxNjIwODEsImV4cCI6MTcyOTE2NTY4MSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGVzdDJAdGVzdC5mciJ9.WeTf3yA8aU_lwA16ggufGZIAVA33VORHa9IRmMsFF6ynF3Tka-CGC1j_eaae7y_Btzt5JsYbvKtX9msM5KUduY9IWDMTU17aAGulumw_dQKo1toB58dlGcBer3Ej5BWmwZt0dlVlAZy9fbEQeY34cciQ7fXclMdUZzpGqTTHH_UT866gklP5MvRGAaPixbknNR94SyGjt_N6D_-PH40R_yOwa_9LD0kJAcLwAUCpxIPowKYEPne6F1a3qgASMT1HFIFh-7uTVv7pVUZdPZspCM7o2VIMA_JCRGs8ABFvUkPjtaPM8AAOrIArI_D-x1rabPWDuC1s9uLRsZ-8AkOS4g";
    window.localStorage.setItem("user", testToken);

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
