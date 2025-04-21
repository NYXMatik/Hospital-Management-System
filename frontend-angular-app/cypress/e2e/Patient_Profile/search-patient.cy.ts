describe('Tests E2E - Search and deactivate Patient', () => {

    beforeEach(() => {
      cy.visit('http://localhost:4200/admin/manage-patients-profile/search');
    });

    it('should load the search patient component', () => {
      cy.contains('Search Patient Profile').should('be.visible');
      cy.get('button').contains('▼').should('be.visible');
    });

    it('should expand the search section when button is clicked', () => {
      cy.get('button').contains('▼').click();
      cy.get('.form-content').should('be.visible');
      cy.get('button').contains('▲').should('be.visible');
    });

    it('should show error message if no patient is found', () => {
      cy.get('button').contains('▼').click();

      // Preenche os campos de busca com dados inválidos
      cy.get('#name').type('Invalid Name');
      cy.get('#email').type('invalid@example.com');
      cy.get('#gender').select('--');

      // Submete a pesquisa
      cy.get('button').contains('Search').click();

      // Verifica se a mensagem de erro é exibida
      cy.get('.error-message').should('be.visible').and('contain', 'No patient found!');
    });

    it('should return a list of patient when valid filters are applied', () => {
      cy.get('button').contains('▼').click();

      // Preenche os campos de busca com dados válidos
      cy.get('#name').type('Ana');
      cy.get('#email').type('ana@example.com');
      cy.get('#phoneNumber').type('+351 987654321');
      cy.get('#gender').select('Female');
      cy.get('#birth').type('1990-01-01');

      // Submete a pesquisa
      cy.get('button').contains('Search').click();

      // Verifica se a lista de patients é exibida
      cy.get('.list-container').should('be.visible');
      cy.get('.list ul li').should('have.length.greaterThan', 0);
    });

    it('should navigate to update patient component when Edit button is clicked', () => {
      cy.get('button').contains('▼').click();

      // Simula a resposta da API
      cy.intercept('GET', '**/api/patients', {
        statusCode: 200,
      }).as('getPatients');

      // Executa a busca e espera a resposta
      cy.get('#name').type('Ana');
      cy.get('button').contains('Search').click();

      // Clica no botão Edit
      cy.get('.list ul li').contains('Edit').click();
      // Verifica se a lista de patients é exibida
      cy.get('.list-container').should('be.visible');
      cy.get('.list ul li').should('have.length.greaterThan', 0);

    });


    it('should deactivate a patient member after confirmation', () => {
      cy.get('button').contains('▼').click();

      // Simula a resposta da API
      cy.intercept('GET', '**/api/patients', {
        statusCode: 200,
      }).as('getPatients');

      // Intercepta a desativação
      cy.intercept('DELETE', '**/api/patients/deactivate', {
        statusCode: 200,
        body: { message: 'Patient successfully deactivated' },
      }).as('deactivatePatient');

      // Executa a busca e espera os resultados
      cy.get('#name').type('Ana');
      cy.get('button').contains('Search').click();
      // Verifica se a lista de patients é exibida
      cy.get('.list-container').should('be.visible');
      cy.get('.list ul li').should('have.length.greaterThan', 0);

      // Clica no botão Deactivate e confirma
      cy.get('.list ul li').contains('Deactivate').click();
      cy.on('window:confirm', () => true);

      // Verifica a mensagem de sucesso
      cy.get('.success-message').should('contain', 'Patient profile deactivated successfully.');
    });

  });

