describe("Requête pour tester la vulnérabilité XSS lors de l'envoi d'un avis", () => {
  before(() => {
    const testToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3Mjc3ODUxNzgsImV4cCI6MTcyNzc4ODc3OCwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGVzdDJAdGVzdC5mciJ9.hDD8vlg2agyyZ70aTe4CUiIuUqEws49ImfC761VeXGchrviLVCVcbYMocaQOB4vkc7S5MGtss840F5uf-j8QdmI8BeqJq8nvLWAXyK2ItRgKwFhQh7DgVMM2Ltgf_blg8gnScElO__WjifOBaztkpTvuRZ9MR25ww5F3MdcV54l5eSqsZ5HQL8PMdaTPaPWxm1rBK4Bjcx49kkW1Ko-MGg-MeZsAE8XJh2zSlcmxJlkmCoGSy-opODoFkva6lVx7LTFmRxFbY0MDBnoWIHYaMhgYxqiVvwOgYgyPN_HC269GNIIIdc0vX-AIFc-3L_3YYCzD5KDFQc-zG4WfvqYDtg";
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

      cy.get(".review-section").should("not.contain", "<script>alert('XSS')</script>"); // Vérification que le code XSS ne s'exécute pas
      cy.get(".review-section").should("contain", "&lt;script&gt;alert('XSS')&lt;/script&gt;"); // Vérification que le code s'affiche en tant que texte
  
    });
  });
});
