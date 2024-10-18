describe("Requête pour récupérer la liste des produits du panier", () => {
  // Étape 1:
  beforeEach(() => {
   //Connexion sur le site
   cy.intercept("POST", "http://localhost:8081/login").as("loginRequest");

   cy.visit("http://localhost:8080/#/login");

   cy.get('[data-cy="login-input-username"]').type("test2@test.fr");

   cy.get('[data-cy="login-input-password"]').type("testtest");

   cy.get('[data-cy="login-submit"]').click();

   cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

    cy.intercept("GET", "http://localhost:8081/orders").as("getOrder");
  });

  // Étape 2:
  it("API Test: Devrait retourner la réponse correcte pour les détails des produits présents dans le panier", () => {
    cy.visit("http://localhost:8080/#/");

    cy.get('[data-cy="nav-link-cart"]').should("be.visible").click();

    

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
