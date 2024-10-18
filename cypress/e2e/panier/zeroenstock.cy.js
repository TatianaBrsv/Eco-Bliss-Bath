describe("Vérification de l'impossibilité d'ajouter un produit avec un stock nul ou négatif au panier pour un utilisateur enregistré", () => {
  beforeEach(() => {
    //Connexion sur le site
    cy.intercept("POST", "http://localhost:8081/login").as("loginRequest");

    cy.visit("http://localhost:8080/#/login");

    cy.get('[data-cy="login-input-username"]').type("test2@test.fr");

    cy.get('[data-cy="login-input-password"]').type("testtest");

    cy.get('[data-cy="login-submit"]').click();

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

    cy.intercept("PUT", "http://localhost:8081/orders/add").as("addToPanier");
  });

  it("Impossible d'ajouter un produit au panier avec un stock nul ou négatif (produit avec l'ID 3)", () => {
   
    cy.visit("http://localhost:8080/#/products/3");

    // Vérifier le stock et transformer le texte en nombre
    cy.get('[data-cy="detail-product-stock"]').should(($stock) => {
      const stockText = $stock.text().trim();
      const stockMatch = stockText.match(/(-?\d+)/);

      expect(stockMatch).to.not.be.null;

      const stockValue = Number(stockMatch[0]);

      expect(stockValue).to.not.be.NaN;
      expect(stockValue).to.be.lessThan(1); // Vérifions si c'est moins que 1 (0 ou négatif)
    });

    // Nous essayons d'ajouter un produit en rupture de stock
    cy.get('[data-cy="detail-product-quantity"]').clear().type("1");
    cy.get('[data-cy="detail-product-add"]').click();

    //Vérification que la requête n'a pas été effectuée
    cy.wait("@addToPanier").then((interception) => {
      //Vérifier que le statut n'est pas 200
      expect(interception.response.statusCode).to.not.eq(200);
    });

    cy.get(".cart-line-quantity").should("contain", "0");
  });
});
