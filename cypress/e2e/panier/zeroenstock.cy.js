describe("Vérification de l'impossibilité d'ajouter un produit avec un stock nul ou négatif au panier pour un utilisateur enregistré", () => {
  before(() => {
    const testToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3Mjc2MTU3OTgsImV4cCI6MTcyNzYxOTM5OCwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGVzdDJAdGVzdC5mciJ9.VVQ-IibCtNLtsfzBb8zZb9AjY2q1bN6fx7p8QtukdYUwbxCk5fczMTB7cl876rpy23K6A5UjAAPfQPV7Dibsehq_i8R0-1ntfmSg1IOzdeW4IDfTW6-7seXcu4mWNEAToYd6dXdRup7gjH1VE5W8v-PEaIzM08DQ1-6XJTENjYJlOsY7Ee3jC2wbVmE1i9lxZkWLXuBKIZAiM0P8cMajd3-JBJuM9hwDHaNyUJ21tlO_fWUz3faYhmvEPW0ymrkCaYfChHXaPH0jh6L1D1gf2Z1WteLSFldXi2YVYF-k86Z-dHmnF4Kp0A3gAsqXpnku5alG8ZvUmYmCwfJT7wt8gw";
    window.localStorage.setItem("user", testToken);
  });

  it("Impossible d'ajouter un produit au panier avec un stock nul ou négatif (produit avec l'ID 3)", () => {
    cy.intercept("PUT", "http://localhost:8081/orders/add").as("addToPanier");
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
