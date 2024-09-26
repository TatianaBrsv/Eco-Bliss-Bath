describe("Requête pour tester la vulnérabilité XSS lors de l'envoi d'un avis", () => {
  before(() => {
    const testToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MjczNjA1MTksImV4cCI6MTcyNzM2NDExOSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGVzdDJAdGVzdC5mciJ9.O-37foW8C0Ho9nPcfqhoKTu_V13yvN3XryyoGxJ5AKviV3YkDfloosUqNj5-f9jfncXpnSQroGIDss4tzvaUB7RlSOXpZeZ_n5YlwhI2-6hl_Y_-swS10HnNY_uVgyzX096F-duk6V0jr7HUi8n2guPhsk4oI_nJJOiooOcNxP84IJuFJL8CiRMGrxSr2_0HCAk7mG7cb3jUra-cI2JHwjjLUPjiXta-Oe4H-hbm-o7fozIBmdofn-FueLmkfxBzRq5044MLBW6IUvoMwTk43xcHNP7QiL2stVD2OsaV-SPOtg4LgNF9RGNDjS_o1f6gHWHLzJ5Hbbe7elW14CWn0A";
    window.localStorage.setItem("user", testToken);
  });

  it("devrait bloquer l'exécution de scripts lors de l'envoi d'un avis contenant du code XSS", () => {
    cy.visit("http://localhost:8080/#/");
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

    cy.intercept({
      method: "POST",
      url: "http://localhost:8081/reviews",
    }).as("postReview");

    cy.get('[data-cy="review-submit"]').click();

    cy.wait("@postReview").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);

      cy.get(".review-section").should(
        "contain",
        "&lt;script&gt;alert('XSS')&lt;/script&gt;"
      );
      cy.get(".review-section").should(
        "contain",
        "&lt;img src=x onerror=alert('XSS')&gt;"
      );
    });
  });
});
