describe("Test d’accès non authentifié au panier", () => {
  it("Devrait retourner une erreur 401 ou 403 lorsque non authentifié", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8081/orders",
      failOnStatusCode: false, // Ne pas échouer le test si le statut est une erreur
    }).then((response) => {
      expect([401, 403]).to.include(response.status);
    });
  });
});
