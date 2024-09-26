describe("Smoke Test for Product Page", () => {
  before(() => {
    const testToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MjczNjY0NTIsImV4cCI6MTcyNzM3MDA1Miwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGVzdDJAdGVzdC5mciJ9.lPf9qz81FgSfggmXIhZd7K54fmjbBETREbQDfPUQfZim9mjHwy1uLHU6BQ3WGxH8eeG_MVv-a-BVhtygkr4vyg42Iv5-o1vA7eRIZe4HpC5U16t6Qcd5OekQ_l6gs7L__xmsuq4gBN7qHhS5m3XcLHnpYNdV_MTNDaxvvc0Gmitux6rdime-uevSYgSVacroEetsGGFc5iI_zM4sh_ribMGnfJlCrZF1IIOEh3CPGWvfT-8shd8EWXq0G4ON-Dpx0vJkjOPoNR5gDlQzVTuAO96TO7pO0jONnRagO4DrCOo9t6jqLtBMQV2aLZoF8hx-YKpUI5B62jIgEmp3wIsnKg";
    window.localStorage.setItem("user", testToken);
  });

  it('should display the "Add to Cart" button on the product page', () => {
    cy.visit("http://localhost:8080/products");

    cy.get('[data-cy="product-home-link"]')
      .its("length")
      .then((length) => {
        const randomIndex = Math.floor(Math.random() * length);
        cy.get('[data-cy="product-home-link"]').eq(randomIndex).click();
      });

    cy.get('[data-cy="detail-product-add"]')
      .should("be.visible")
      .and("contain", "Ajouter au panier");
  });
});
