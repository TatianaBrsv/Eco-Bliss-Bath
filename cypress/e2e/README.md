# Nom du projet : Automatisation des tests pour la nouvelle appli de vente Eco Bliss Bath

## Description du projet
Ce projet contient une suite de tests automatisés pour une application web utilisant Cypress

## Prérequis
- Docker 
- Cypress
- Visual Studio Code

## Exécution du projet 

 Installer Docker

 Telecharger le projet https://github.com/OpenClassrooms-Student-Center/TesteurLogiciel_Automatisez_des_tests_pour_une_boutique_en_ligne.git
  
 Ouvrer un terminal dans le dossier du projet et ensuite lancer la commande **docker-compose up-build**

 Acceder à la page [http://localhost:8080]

## Configurer Cypress dans Visual Studio Code 

Dans le terminal de VS code il faut:

Installer Cypress : **npm install cypress --save-dev**

Ouvrir Cypress : **npx cypress open**

Vérifier que le dossier Cypress a été crée

## Exécuter des tests dans Visual Studio Code

Créer un fichier de test dans le dossier **cypress/e2e/** , par exemple mon-test.cy.js

Ovrir Cypress via terminal de VS code :  **npx cypress open**

Exécuter le test via Cypress : 

E2E Testing
Browser FireFox v130 
Choisir un test à exécuter 

## Générer un rapport de tests avec Cypress

Ajouter le script de génération de rapport à package.json : 
"scripts": {
    "test:report": "cypress run --reporter mochawesome --reporter-options reportDir=cypress/reports,reportFilename=report.html"}

Installer le package mochawesome : **npm install mochawesome --save-dev**

Tapez la commande suivante dans le terminal pour exécuter les tests et générer le rapport : **npm run test:report**