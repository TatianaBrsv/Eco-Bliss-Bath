describe("Requête pour récupérer la liste des produits du panier", () => {
    const apiUrl = "http://localhost:8081";
    
    beforeEach(() => {
      // Connexion sur le site
      cy.request({
        method: "POST",
        url: `${apiUrl}/login`,
        body: {
          username: "test2@test.fr",
          password: "testtest"
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        
        Cypress.env("authToken", response.body.token);
      });
    });
  
    it("API Test: Devrait retourner la réponse correcte pour les détails des produits présents dans le panier", () => {
    
      cy.request({
        method: "GET",
        url: `${apiUrl}/orders`,
        headers: {
          Authorization: `Bearer ${Cypress.env("authToken")}`  
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        
        const responseBody = response.body;
  
        
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

    it("API Test: Devrait envoyer une requête GET pour le produit sélectionné lors de la navigation vers sa page", () => {
        
        cy.request({
          method: "GET",
          url: `${apiUrl}/products`,
        }).then((response) => {
          expect(response.status).to.eq(200);
     
          const products = response.body;
          Cypress.env("products", products);
    
         // Choisir un produit aléatoire
          const randomProduct = products[Math.floor(Math.random() * products.length)];
    
          // une requête envoyé pour obtenir les données du produit sélectionné par son ID
          cy.request({
            method: "GET",
            url: `${apiUrl}/products/${randomProduct.id}`,
          }).then((response) => {
            expect(response.status).to.eq(200);
    
            // Vérification de la réponse réçu du serveur
            const product = response.body;
            expect(product).to.have.property("id", randomProduct.id);
            expect(product).to.have.property("name", randomProduct.name);
            expect(product).to.have.property("availableStock", randomProduct.availableStock);
            expect(product).to.have.property("skin", randomProduct.skin);
            expect(product).to.have.property("aromas", randomProduct.aromas);
            expect(product).to.have.property("ingredients", randomProduct.ingredients);
            expect(product).to.have.property("description", randomProduct.description);
            expect(product).to.have.property("price", randomProduct.price);
            expect(product).to.have.property("picture", randomProduct.picture);
            expect(product).to.have.property("varieties", randomProduct.varieties);
          });
        });
      });

      it("API Test: Devrait retourner une erreur 401 ou 403 lorsque non authentifié", () => {
        cy.request({
          method: "GET",
          url: `${apiUrl}/orders`,
          failOnStatusCode: false // Ne pas échouer le test si le statut est une erreur
        }).then((response) => {
          expect([401, 403]).to.include(response.status);
        });
      });

      it("API Test :Devrait envoyer un avis valide", () => {
        cy.request({
          method: "POST",
          url: `${apiUrl}/login`,
          body: {
            username: "test2@test.fr",
            password: "testtest",
          },
        }).then((loginResponse) => {
          expect(loginResponse.status).to.eq(200);
          
          cy.request({
            method: "POST",
            url: `${apiUrl}/reviews`,
            headers: {
              Authorization: `Bearer ${loginResponse.body.token}`,
            },
            body: {
              rating: 1,
              title: "Titre valide",
              comment: "Ceci est un commentaire valide.",
            },
          }).then((response) => {
            expect(response.status).to.eq(200);
    
            const review = response.body;
            expect(review).to.have.property("id");
            expect(review).to.have.property("rating", 1);
            expect(review).to.have.property("title", "Titre valide");
            expect(review).to.have.property("comment", "Ceci est un commentaire valide.");
          });
        });
      });

      it("API Test :Devrait bloquer l'exécution de scripts lors de l'envoi d'un avis contenant du code XSS", () => {
        const xssTitle = "<script>alert('XSS')</script>";
        const xssComment = "<img src=x onerror=alert('XSS')>";
    
        cy.request({
          method: "POST",
          url: `${apiUrl}/reviews`,
          headers: {
            Authorization: `Bearer ${Cypress.env("authToken")}` 
          },
          body: {
            rating: 1,
            title: xssTitle,
            comment: xssComment,
          },
          failOnStatusCode: false 
        }).then((response) => {
          expect(response.status).to.eq(200); 
    
          cy.request({
            method: "GET",
            url: `${apiUrl}/reviews`
          }).then((reviewResponse) => {
            expect(reviewResponse.status).to.eq(200);
            const reviewSection = reviewResponse.body;
    
        
            expect(reviewSection).to.not.contain("<script>alert('XSS')</script>");
            expect(reviewSection).to.contain("&lt;script&gt;alert('XSS')&lt;/script&gt;");
          });
        });
      });

      it("API Test :Impossible d'ajouter un produit  avec un stock négatif(produit avec l'ID 3 au panier", () => {
        // Мы пытаемся добавить продукт в корзину
        cy.request({
            method: "PUT",
            url: `${apiUrl}/orders/add`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cypress.env("authToken")}`
            },
            body: {
                quantity: 2,
                product: 3
            }
        }).then((response) => {
            expect(response.status).to.not.eq(200);
        });
          
         
        });
      });

    
