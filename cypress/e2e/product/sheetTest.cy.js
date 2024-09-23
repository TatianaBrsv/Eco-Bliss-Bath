describe("API Testing with Dynamic Product Selection", () => {
  it("Should send a GET request for the selected product when navigating to its page", () => {
    cy.intercept("GET", /http:\/\/localhost:8081\/products\/\d+/, {
      statusCode: 200,
      body: (req) => {
        const id = req.url.split("/").pop();
        return {
          id: parseInt(id),
          
        };
      },
    }).as("getProduct");

    cy.visit("http://localhost:8080/products");

    cy.get('[data-cy="product-home-link"]')
      .its("length")
      .then((length) => {
        const randomIndex = Math.floor(Math.random() * length);
        cy.get('[data-cy="product-home-link"]').eq(randomIndex).click();
      });

    cy.wait("@getProduct").then((interception) => {
      expect(interception).to.exist;
      expect(interception.response.statusCode).to.eq(200);
    });
  });
});
