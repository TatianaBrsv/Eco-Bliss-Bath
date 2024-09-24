describe("Étoiles d'évaluation", () => {
  before(() => {
    const testToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MjcxODkwMzksImV4cCI6MTcyNzE5MjYzOSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGVzdDJAdGVzdC5mciJ9.G3iV4S2xk4Xfx54xTaJNwaIjb0YxPMOJiPG6gFlkOvI4s6D6VUlQoJLvL4BIlje_H942RgPCha2hXsD2yqRLe55qAG1xmeZ2cgArU0r2pNbATfSk3ooPYRWA6L2h3Yv30fTJavt_ZRsOSqB3szBfSq76v8wprW8x_TGcBpUAeYb5s0IcN9eXZAHfby9zaQQFvozgQsWRZGVNcw0pj7rvVU_dznxgN5V8dqxWGCxw7dyQnWA0O-gozFDfTrQ9hCKZStMK7S7eqatCCNwMEttOHwzpEZkbeS_waqcHdEhqqJGyHbrsmvx4o7WNZda97ixbtg18whydGHhTS3itSeNCUw";
    window.localStorage.setItem("user", testToken);
  });

  it("devrait afficher les étoiles", () => {
    cy.visit("http://localhost:8080/#/");
    cy.get('[data-cy="nav-link-reviews"]').click();
    cy.url().should("include", "/reviews");

    cy.get('[data-cy="review-input-rating-images"]').should("exist");

    cy.get('[data-cy="review-input-rating-images"] img')
      .should("have.length", 5)
      .each(($el) => {
        cy.wrap($el).should("have.attr", "src", "assets/images/star-empty.png");
      });
  });
});
