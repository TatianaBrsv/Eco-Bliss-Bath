describe("Requête pour récupérer la liste des produits du panier", () => {
  // Étape 1:
  before(() => {
    const testToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MjcxMTk1NzYsImV4cCI6MTcyNzEyMzE3Niwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGVzdDJAdGVzdC5mciJ9.ljc_Z4HyVyajIZREz2cbcbqfcAMmloqCjI6ZG5Esq6KBoyb_20CvktN0dgjslq59vppgfIvABlkde00vu0i_f1vFKsnMQyRRFNwvVBk6g21F9BkDThFrCSlkh4e7bkr1OC3LMQeTfgnvaFr5db32nReLqLOCPgrP-1kcj5023AlfDro9XBW83e7cgm4bOINaO3NbNUcTNiKGuprasqtCxUdc4Gx7_rFBujE2OcKdGGQx8uWCz_vcbqARJAd5YTVddXo2H-sZcLZGZNpcVGUW6mVGhJYGO5fLk_r-vJOfwox3dtEIzfuOUbZBlRgTDFB7AdoLLbEntU6hsFdqKW2X5A";
    window.localStorage.setItem("user", testToken);
  });

  // Étape 2:
  it("Devrait accéder aux détails de la commande", () => {
    cy.visit("http://localhost:8080/#/");

    cy.get('[data-cy="nav-link-cart"]').should("be.visible").click();

    cy.intercept("GET", "http://localhost:8081/orders").as("getOrder");

    cy.wait("@getOrder").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);

      const responseBody = interception.response.body;

      //    Données via Swagger
      expect(responseBody).to.have.property("id");
      expect(responseBody).to.have.property("firstname");
      expect(responseBody).to.have.property("lastname");
      expect(responseBody).to.have.property("address");
      expect(responseBody).to.have.property("zipCode");
      expect(responseBody).to.have.property("city");
      expect(responseBody).to.have.property("date");
      expect(responseBody).to.have.property("validated");
      expect(responseBody).to.have.property("orderLines");
      expect(responseBody.orderLines).to.be.an("array");

     
      expect(responseBody.orderLines.length).to.be.greaterThan(0);

      
      const firstOrderLine = responseBody.orderLines[0];

      expect(firstOrderLine).to.have.property("id");
      expect(firstOrderLine).to.have.property("product");
      expect(firstOrderLine.product).to.have.property("id");
      expect(firstOrderLine.product).to.have.property("name");
      expect(firstOrderLine.product).to.have.property("description");
      expect(firstOrderLine.product).to.have.property("price");
      expect(firstOrderLine.product).to.have.property("picture");
      expect(firstOrderLine).to.have.property("quantity");
    });
  });
});
