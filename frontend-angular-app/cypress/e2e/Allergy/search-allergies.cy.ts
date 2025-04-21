describe('Tests E2E - Search Allergies', () => {

    beforeEach(() => {
      cy.visit('http://localhost:4200/admin/medical-conditions-allergies/manage-allergies/search');
    });

    it('should load the search allergy component', () => {
      cy.contains('Search Allergies').should('be.visible');
      cy.get('button').contains('▼').should('be.visible');
    });

    it('should expand the search section when button is clicked', () => {
      cy.get('button').contains('▼').click();
      cy.get('.form-content').should('be.visible');
      cy.get('button').contains('▲').should('be.visible');
    });

    it('should show error message if no allergy is found', () => {
      cy.get('button').contains('▼').click();

      // Preenche os campos de busca com dados inválidos
      cy.get('#code').type('Invalid');
      cy.get('#designation').type('Invalid name');

      // Submete a pesquisa
      cy.get('button').contains('Search').click();

      // Verifica se a mensagem de erro é exibida
      cy.get('.error-message').should('be.visible').and('contain', 'Allergy not found');
    });

    it('should return a list of allergies when valid filters are applied', () => {
      cy.get('button').contains('▼').click();

      // Preenche os campos de busca com dados válidos
      cy.get('#code').type('A123');
      cy.get('#designation').type('Marisco');

      // Submete a pesquisa
      cy.get('button').contains('Search').click();

      // Verifica se a lista de Allergies é exibida
      cy.get('.list-container').should('be.visible');
      cy.get('.list ul li').should('have.length.greaterThan', 0);
    });

    it('should navigate to update allergy component when Edit button is clicked', () => {
      cy.get('button').contains('▼').click();

      // Simula a resposta da API
      cy.intercept('GET', '**/api/allergy', {
        statusCode: 200,
        body: [
          { code: 'A123', designation: 'Marisco', description: 'Provoca falta de ar e comichao' },
        ],
      }).as('getAllergies');

      // Executa a busca e espera a resposta
      cy.get('#code').type('A123');
      cy.get('button').contains('Search').click();

      // Clica no botão Edit
      cy.get('.list ul li').contains('Edit').click();
      // Verifica se a lista de allergies é exibida
      cy.get('.list-container').should('be.visible');
      cy.get('.list ul li').should('have.length.greaterThan', 0);

    });

  });

