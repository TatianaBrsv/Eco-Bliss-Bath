describe("Vérification de l'impossibilité d'ajouter un produit avec un stock nul ou négatif au panier pour un utilisateur enregistré", () => {
  before(() => {
    const testToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3Mjc2MTE5MDAsImV4cCI6MTcyNzYxNTUwMCwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGVzdDJAdGVzdC5mciJ9.Sd_0N37eG5VPn7VFpRAlpZ6SROX9jveSYtduk67YAbVnaVTEgWxEbN2C1nb1-uvqMQB03GLN3wKujKTccI2mc09gAn_j2kCvHODHq-3ogE0pmLHFJN_7ksehNoDrB63WFqjQfhMP-Mq42aV27ApXnlC4heyfh7YILPIMRs2vLnw6Tun-u_e0pBCaiPVre7csgYLk-ZV5upOxQJ7iXS14PYPt1IvvROLdP9E7ly7xnMeN3oQiHz_Do4sFn3IZLjCpXIElwLBLEClyGqCPg9M5CdZJjqJpzyGCGE-VPqfOm9CBfOh0vTjGg2dtY6HgYvlLmKyRiufabsPo9mFhpsuCNQ";
    window.localStorage.setItem("user", testToken);
  });

  it("Impossible d'ajouter un produit au panier avec un stock nul ou négatif (produit avec l'ID 3)", () => {
    cy.intercept("POST", "/cart").as("addToCart");
    cy.visit("http://localhost:8080/#/products/3");

    cy.get('[data-cy="detail-product-stock"]').should(($stock) => {
      const stock = parseInt($stock.text());
      expect(stock).to.be.lessThan(1); // Vérifier que le nombre est inférieur à 1(0 ou un nombre négatif)
    });

    // Essayer d'ajouter un produit en rupture de stock
    cy.get('[data-cy="detail-product-quantity"]').clear().type("1");

    cy.get('[data-cy="detail-product-add"]').click();

    //Vérifie que la requête n'a pas été effectuée
    cy.wait("@addToCart").its("response.statusCode").should("not.eq", 200);

    // Vérifier que notre panier est toujours vide
    cy.get(".cart-line-quantity").should("contain", "0");
  });
});
