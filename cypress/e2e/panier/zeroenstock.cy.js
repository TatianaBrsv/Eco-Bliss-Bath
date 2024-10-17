describe("Vérification de l'impossibilité d'ajouter un produit avec un stock nul ou négatif au panier pour un utilisateur enregistré", () => {
  beforeEach(() => {
    const testToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MjkxNjE1MjUsImV4cCI6MTcyOTE2NTEyNSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGVzdDJAdGVzdC5mciJ9.iM-kuqy-jqV9-cmudiATtnSG1-IzYQkfQv1EsFKhEav0sUwKOpctQ9nHn0SzKBgqkadj5Pu0sPGB6Xpf3sfLv3lO2D8oPkUBRPYKgrnWOFa4iOFwgZVVVO_lcdPzOUKlVec1RlcZGQU40oCbukJ_PaOJwMKYBO0sruJ4o4dSsJJ7RAy9h9fk0lQ94ZygpvrfQNvduJBDDzJy69MoH_oB_JFmEZpaqwCp9XQmcrjrUVUpqgnUelklOHOfV2MRGWgooOiwifLHy9A_uEYjoCUt4V1HFZ6m5qRbo_L9_BXaVfK6DZ8hZdVHZWJGHV9voz-jwRV9_GM2imcSuk-uQCKuTQ";
    window.localStorage.setItem("user", testToken);

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
