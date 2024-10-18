describe("Ajouter un produit au panier", () => {
    beforeEach(() => {
      
      //Connexion sur le site
      cy.intercept("POST", "http://localhost:8081/login").as("loginRequest");

      cy.visit("http://localhost:8080/#/login");
  
      cy.get('[data-cy="login-input-username"]').type("test2@test.fr");
  
      cy.get('[data-cy="login-input-password"]').type("testtest");
  
      cy.get('[data-cy="login-submit"]').click();
  
      cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
  
      cy.intercept("PUT", "http://localhost:8081/orders/add").as("addToPanier");
    });

    it("Ajouter un produit avec le stock supériuer à 1", () => {
        cy.visit("http://localhost:8080/#/products/5"); //stock du produit est 22
        
        let initialStock;

// Vérifier le stock et transformer le texte en nombre
cy.get('[data-cy="detail-product-stock"]').should(($stock) => {
    const stockText = $stock.text().trim();
    const stockMatch = stockText.match(/\d+/);

    expect(stockMatch).to.not.be.null;

    initialStock = Number(stockMatch[0]);
    expect(initialStock).to.not.be.NaN;
    expect(initialStock).to.be.gte(1); // Vérifions si c'est egale ou supérieur à 1 
  });
// Simuler un clic sur le bouton "Ajouter"
const quantityToAdd = 2;
cy.get('[data-cy="detail-product-quantity"]').clear().type(quantityToAdd);
cy.get('[data-cy="detail-product-add"]').click();

// Vérifier que le produit a été ajouter au panier
cy.wait("@addToPanier").then((interception) => {
    expect(interception.response.statusCode).to.eq(200); 
  });
  cy.get('[data-cy="cart-line"]').should('exist'); 

  cy.visit("http://localhost:8080/#/products/5");

//Vérifier que le stock a enlevé le nombre de produits qui sont dans le panier
  cy.get('[data-cy="detail-product-stock"]').should(($stock) => {
    const newStockText = $stock.text().trim();
    const newStockMatch = newStockText.match(/\d+/); 
    expect(newStockMatch).to.not.be.null; 
    const newStock = Number(newStockMatch[0]); 
    expect(newStock).to.equal( initialStock - quantityToAdd); 
});
    });


    it("Ajouter un produit avec une quantité supérieure à 20", () => {
        cy.visit("http://localhost:8080/#/products/5"); 
        
        let initialStock;

// Vérifier le stock et transformer le texte en nombre
cy.get('[data-cy="detail-product-stock"]').should(($stock) => {
    const stockText = $stock.text().trim();
    const stockMatch = stockText.match(/\d+/);

    expect(stockMatch).to.not.be.null;

    initialStock = Number(stockMatch[0]);
    expect(initialStock).to.not.be.NaN;
    expect(initialStock).to.be.gte(1); // Vérifions si c'est egale ou supérieur à 1 
  });
// Simuler un clic sur le bouton "Ajouter"
const quantityToAdd = 25;
cy.get('[data-cy="detail-product-quantity"]').clear().type(quantityToAdd);
cy.get('[data-cy="detail-product-add"]').click();

// Vérifier que le produit a été ajouter au panier
cy.wait("@addToPanier").then((interception) => {
    expect(interception.response.statusCode).to.eq(200); 
  });
  cy.get('[data-cy="cart-line"]').should('exist'); 

  cy.visit("http://localhost:8080/#/products/5");

//Vérifier que le stock a enlevé le nombre de produits qui sont dans le panier
  cy.get('[data-cy="detail-product-stock"]').should(($stock) => {
    const newStockText = $stock.text().trim();
    const newStockMatch = newStockText.match(/-?\d+/); 
    expect(newStockMatch).to.not.be.null; 
    const newStock = Number(newStockMatch[0]); 
    expect(newStock).to.equal( initialStock - quantityToAdd); 
});

    });
    it("Impossible d'ajouter un produit avec une quantité négative", () => {
        cy.visit("http://localhost:8080/#/products/5");

// Simuler un clic sur le bouton "Ajouter"
const quantityToAdd = -5;
cy.get('[data-cy="detail-product-quantity"]').clear().type(quantityToAdd);
cy.get('[data-cy="detail-product-add"]').click();

// Vérifier que le requête n'a pas été envoyée
cy.get('@addToPanier').should('not.exist');

    });

    it("Ajouter un produit au panier et vérifier le contenu via l'API", () => {
        cy.visit("http://localhost:8080/#/products/9");

        const quantityToAdd = 1; 
        cy.get('[data-cy="detail-product-quantity"]').clear().type(quantityToAdd);

        cy.get('[data-cy="detail-product-add"]').click();

        cy.wait("@addToPanier").then((interception) => {
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

    it("Impossible d'ajouter un produit avec une quantité égale à 0", () => {
      cy.visit("http://localhost:8080/#/products/10");

// Simuler un clic sur le bouton "Ajouter"
const quantityToAdd = 0;
cy.get('[data-cy="detail-product-quantity"]').clear().type(quantityToAdd);
cy.get('[data-cy="detail-product-add"]').click();

// Vérifier que le requête n'a pas été envoyée
cy.get('@addToPanier').should('not.exist');

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
