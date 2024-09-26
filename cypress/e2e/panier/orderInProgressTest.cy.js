describe("Requête pour récupérer la liste des produits du panier", () => {
  // Étape 1:
  before(() => {
    const testToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MjczNjY0NTIsImV4cCI6MTcyNzM3MDA1Miwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGVzdDJAdGVzdC5mciJ9.lPf9qz81FgSfggmXIhZd7K54fmjbBETREbQDfPUQfZim9mjHwy1uLHU6BQ3WGxH8eeG_MVv-a-BVhtygkr4vyg42Iv5-o1vA7eRIZe4HpC5U16t6Qcd5OekQ_l6gs7L__xmsuq4gBN7qHhS5m3XcLHnpYNdV_MTNDaxvvc0Gmitux6rdime-uevSYgSVacroEetsGGFc5iI_zM4sh_ribMGnfJlCrZF1IIOEh3CPGWvfT-8shd8EWXq0G4ON-Dpx0vJkjOPoNR5gDlQzVTuAO96TO7pO0jONnRagO4DrCOo9t6jqLtBMQV2aLZoF8hx-YKpUI5B62jIgEmp3wIsnKg";
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
