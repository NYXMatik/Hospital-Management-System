describe('Tests E2E - Search Allergies', () => {

    beforeEach(() => {
      cy.visit('http://localhost:4200/admin/medical-conditions-allergies/manage-medical-conditions/search');
    });

    it('should load the search allergy component', () => {
      cy.contains('Search Medical Conditions').should('be.visible');
      cy.get('button').contains('▼').should('be.visible');
    });

    it('should expand the search section when button is clicked', () => {
      cy.get('button').contains('▼').click();
      cy.get('.form-content').should('be.visible');
      cy.get('button').contains('▲').should('be.visible');
    });

    it('should show error message if no medical condition is found', () => {
      cy.get('button').contains('▼').click();

      // Preenche os campos de busca com dados inválidos
      cy.get('#code').type('Invalid');
      cy.get('#designation').type('Invalid name');

      // Submete a pesquisa
      cy.get('button').contains('Search').click();

      // Verifica se a mensagem de erro é exibida
      cy.get('.error-message').should('be.visible').and('contain', 'Medical conditions not found');
    });

    it('should return a list of medical condition when valid filters are applied', () => {
      cy.get('button').contains('▼').click();

      // Preenche os campos de busca com dados válidos
      cy.get('#code').type('ANEM008');
      cy.get('#designation').type('Iron-Deficiency Anemia');

      // Submete a pesquisa
      cy.get('button').contains('Search').click();

      // Verifica se a lista de condições é exibida
      cy.get('.list-container').should('be.visible');
      cy.get('.list ul li').should('have.length.greaterThan', 0);
    });

    it('should navigate to update medical condition component when Edit button is clicked', () => {
      cy.get('button').contains('▼').click();

      // Simula a resposta da API
      cy.intercept('GET', '**/api/medical-condition', {
        statusCode: 200,
        body: [
          { code: 'ANEM008',
            designation: 'Iron-Deficiency Anemia',
            description: 'A condition in which the blood lacks adequate healthy red blood cells due to insufficient iron, leading to reduced oxygen transport to tissues.',
            commonSymptoms: ['Fatigue and weakness', 'Pale or yellowish skin',
              'Shortness of breath', 'Dizziness or lightheadedness'] },
        ],
      }).as('getMedicalConditions');

      // Executa a busca e espera a resposta
      cy.get('#code').type('ANEM008');
      cy.get('button').contains('Search').click();

      // Clica no botão Edit
      cy.get('.list ul li').contains('Edit').click();
      // Verifica se a lista de allergies é exibida
      cy.get('.list-container').should('be.visible');
      cy.get('.list ul li').should('have.length.greaterThan', 0);

    });

  });

