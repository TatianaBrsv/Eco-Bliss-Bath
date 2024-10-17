describe("API Testing with Dynamic Product Selection", () => {
  beforeEach(() => {
    cy.intercept("GET", /http:\/\/localhost:8081\/products\/\d+/, (req) => {
      const id = req.url.split("/").pop();
      
      
      const productsData = {
        3: {
          id: 3,
          name: "Sentiments printaniers",
          availableStock: -12,
          skin: "Propre, fraîche",
          aromas: "Frais et fruité",
          ingredients: "Framboise, zeste de citron et feuille de menthe",
          description: "Savon avec une formule douce à base d’huile de framboise, de citron et de menthe qui nettoie les mains efficacement sans les dessécher.",
          price: 60,
          picture: "https://cdn.pixabay.com/photo/2020/02/08/10/35/soap-4829708_960_720.jpg",
          varieties: 4
        },
        4: {
          id: 4,
          name: "Chuchotements d'été",
          availableStock: 1,
          skin: "Sèche",
          aromas: "Nature et végétal",
          ingredients: "Huile d'olive, glycérine végétale",
          description: "Savon surgras à l'huile d'olive, particulièrement utile contre la peau sèche.",
          price: 37,
          picture: "https://cdn.pixabay.com/photo/2017/09/07/19/43/soap-2726387_960_720.jpg",
          varieties: 6
        },
        5: {
          id: 5,
          name: "Poussière de lune",
          availableStock: 22,
          skin: "Peau grasse",
          aromas: "Musc",
          ingredients: "Huiles végétales",
          description: "Essayez notre savon aujourd'hui pour une expérience de bain rafraîchissante et revitalisante.",
          price: 9.99,
          picture: "https://cdn.pixabay.com/photo/2016/07/11/15/45/soap-1509963_960_720.jpg",
          varieties: 6
        },
        6: {
          id: 6,
          name: "Dans la forêt",
          availableStock: 12,
          skin: "Peau mixte",
          aromas: "Bois de santal",
          ingredients: "Soude caustique",
          description: "La mousse riche et onctueuse nettoie en profondeur en laissant votre peau douce et hydratée.",
          price: 24,
          picture: "https://cdn.pixabay.com/photo/2015/01/06/02/56/soap-589824_960_720.jpg",
          varieties: 9
        },
        7: {
          id: 7,
          name: "Extrait de nature",
          availableStock: 4,
          skin: "Peau sensible",
          aromas: "Eucalyptuse, Menthe poivrée",
          ingredients: "Herbes et pétales de fleurs",
          description: "Ce savon est doux pour votre peau et convient à tous les types de peau.",
          price: 5,
          picture: "https://cdn.pixabay.com/photo/2017/09/07/19/40/soap-2726378_960_720.jpg",
          varieties: 4
        },
        8: {
          id: 8,
          name: "Milkyway",
          availableStock: 6,
          skin: "Mature",
          aromas: "Lavande, rose",
          ingredients: "Huiles essentielles",
          description: "Savon fabriqué à partir d'ingrédients naturels tels que l'huile d'olive, la cire d'abeille et l'huile essentielle de lavande.",
          price: 15,
          picture: "https://cdn.pixabay.com/photo/2018/01/07/04/21/lavender-3066531_960_720.jpg",
          varieties: 7
        },
        9: {
          id: 9,
          name: "Mousse de rêve",
          availableStock: 8,
          skin: "Peau normale",
          aromas: "Fleur d'oranger",
          ingredients: "Cire d'abeilles",
          description: "Le parfum délicat de lavande vous transporte dans un jardin en fleurs.",
          price: 10,
          picture: "https://cdn.pixabay.com/photo/2018/01/30/16/54/herbs-3119132_960_720.jpg",
          varieties: 3
        },
        10: {
          id: 10,
          name: "Aurore boréale",
          availableStock: 18,
          skin: "Irritée",
          aromas: "Vanille",
          ingredients: "Agile verte",
          description: "Ses propriétés apaisantes aident à calmer les nerfs et à améliorer votre bien-être général.",
          price: 26,
          picture: "https://cdn.pixabay.com/photo/2017/05/22/07/34/soap-2333391_960_720.jpg",
          varieties: 3
        }
      };

      
      req.reply({
        statusCode: 200,
        body: productsData[id] || {}
      });
    }).as("getProduct");
  });
    it("Should send a GET request for the selected product when navigating to its page", () => {
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
      
      const product = interception.response.body; 
      expect(product).to.have.property('id');
      expect(product).to.have.property('name');
      expect(product).to.have.property('availableStock');
      expect(product).to.have.property('skin');
      expect(product).to.have.property('aromas');
      expect(product).to.have.property('ingredients');
      expect(product).to.have.property('description');
      expect(product).to.have.property('price');
      expect(product).to.have.property('picture');
      expect(product).to.have.property('varieties');
    });
  });
});
