describe("Smoke Test for Product Page", () => {
  before(() => {
     //Connexion sur le site
     cy.intercept("POST", "http://localhost:8081/login").as("loginRequest");

     cy.visit("http://localhost:8080/#/login");
 
     cy.get('[data-cy="login-input-username"]').type("test2@test.fr");
 
     cy.get('[data-cy="login-input-password"]').type("testtest");
 
     cy.get('[data-cy="login-submit"]').click();
 
     cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
  });

  it('vérifier la présence du bouton "Ajouter au panier"', () => {
    cy.visit("http://localhost:8080/products");

    cy.get('[data-cy="product-home-link"]') //boutons Consulter
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
