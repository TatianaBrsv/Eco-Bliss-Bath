describe("Requête pour récupérer la liste des produits du panier", () => {
  // Étape 1:
  beforeEach(() => {
    const testToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MjkxNjExNzIsImV4cCI6MTcyOTE2NDc3Miwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGVzdDJAdGVzdC5mciJ9.A5V0FBesy7KppLzAccLkA3MOhaBzm5YfwEaflczmuGRKzxPQtazpXLdgvXIZw-cOuiQc5JvF15M-GQFp6Yvi0_JnXIqq0Bl4dilheMMmuHU76V6cQyWqPLBvqdfeAAZJz3Qjz8IuH-d453rJ6Op0RMtQ-AFfbVv6oWNtFPAS4EwsDxjVfvQM5p23tUKv5DmOCxsnjBPA8e8cxJ5e_FoK7CPHeLVk5w-QQg8V7DtU6JNJZadURU81SorePr4K8HSUgWtEcSX_PIXUk2xt6b7Kirgp3FHJim3wpmd-MLYLOlbfXOsTneGoViXSkuxdZsWNkIvI5MzKHjDlrq01hZ1bHA";
    window.localStorage.setItem("user", testToken);

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
