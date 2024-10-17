describe("Smoke Test for Product Card", () => {
  before(() => {
    const testToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MjkxNTQ1OTAsImV4cCI6MTcyOTE1ODE5MCwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGVzdDJAdGVzdC5mciJ9.ZVLtlTwYmXHUM66Qk7Hf0KkCFFAMboXzjgH8h69XoWHbRrK7YbZo9zrtyWPcNXSZY6etY2KtbqnDlHL2cDPKqQRovQkbrYCtwVDgTwJZ8UHl1MK7ftJrjt86qe9ND18cwRng0Rai8Cu5Y-Fzd4FmsTOqEQknT0WsVPdgvqZ64W4_gJsllxAdF92xvP4RMB_E4RYhVz4W6hzpRcI_2FjCR40bx5fqTTGt44kvIFt56YQGlDZntszMD2I0NGy4TuUpwBtgddR0nSV91FBz0HIMaI9pIZJkZd6hI51U6SX2uZjscPzvBcDq69Q6aOIyZidBgHwrOIp8SsK27DrUVIp0qA";
    window.localStorage.setItem("user", testToken);
  });

  it('Vérifiez la présence du champ de disponibilité du produit', () => {
    cy.visit("http://localhost:8080/products");

    cy.get('[data-cy="product-home-link"]')
      .its("length")
      .then((length) => {
        const randomIndex = Math.floor(Math.random() * length);
        cy.get('[data-cy="product-home-link"]').eq(randomIndex).click();
      });
    cy.get('[data-cy="detail-product-quantity"]');
  });
});
