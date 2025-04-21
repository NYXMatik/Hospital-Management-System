describe('Tests E2E - Search and deactivate Staff', () => {

    beforeEach(() => {
      cy.visit('http://localhost:4200/admin/manage-staffs/search');
    });

    it('should load the search staff component', () => {
      cy.contains('Search Staff Profile').should('be.visible');
      cy.get('button').contains('▼').should('be.visible');
    });

    it('should expand the search section when button is clicked', () => {
      cy.get('button').contains('▼').click();
      cy.get('.form-content').should('be.visible');
      cy.get('button').contains('▲').should('be.visible');
    });

    it('should show error message if no staff is found', () => {
      cy.get('button').contains('▼').click();

      // Preenche os campos de busca com dados inválidos
      cy.get('#name').type('Invalid Name');
      cy.get('#email').type('invalid@example.com');
      cy.get('#specialization').select('--');

      // Submete a pesquisa
      cy.get('button').contains('Search').click();

      // Verifica se a mensagem de erro é exibida
      cy.get('.error-message').should('be.visible').and('contain', 'No staff found!');
    });

    it('should return a list of staff when valid filters are applied', () => {
      cy.get('button').contains('▼').click();

      // Preenche os campos de busca com dados válidos
      cy.get('#name').type('Celeste');
      cy.get('#email').type('celeste@example.com');
      cy.get('#specialization').select('Psychiatry');

      // Submete a pesquisa
      cy.get('button').contains('Search').click();

      // Verifica se a lista de staff é exibida
      cy.get('.list-container').should('be.visible');
      cy.get('.list ul li').should('have.length.greaterThan', 0);
    });

    it('should navigate to update staff component when Edit button is clicked', () => {
      cy.get('button').contains('▼').click();

      // Simula a resposta da API
      cy.intercept('GET', '**/api/staffs', {
        statusCode: 200,
        body: [
          { fullName: 'Celeste Santos', email: 'celeste@example.com', specialization: 'Psychiatry' },
        ],
      }).as('getStaffs');

      // Executa a busca e espera a resposta
      cy.get('#name').type('Celeste');
      cy.get('button').contains('Search').click();

      // Clica no botão Edit
      cy.get('.list ul li').contains('Edit').click();
      // Verifica se a lista de staff é exibida
      cy.get('.list-container').should('be.visible');
      cy.get('.list ul li').should('have.length.greaterThan', 0);

    });


    it('should deactivate a staff member after confirmation', () => {
      cy.get('button').contains('▼').click();

      // Simula a resposta da API
      cy.intercept('GET', '**/api/staffs', {
        statusCode: 200,
        body: [
          { fullName: 'Celeste Santos', email: 'celeste@example.com', specialization: 'Psychiatry' },
        ],
      }).as('getStaffs');

      // Intercepta a desativação
      cy.intercept('DELETE', '**/api/staffs/delete', {
        statusCode: 200,
        body: { message: 'Staff successfully deactivated' },
      }).as('deactivateStaff');

      // Executa a busca e espera os resultados
      cy.get('#name').type('Celeste');
      cy.get('button').contains('Search').click();
      // Verifica se a lista de staff é exibida
      cy.get('.list-container').should('be.visible');
      cy.get('.list ul li').should('have.length.greaterThan', 0);

      // Clica no botão Deactivate e confirma
      cy.get('.list ul li').contains('Deactivate').click();
      cy.on('window:confirm', () => true);

      // Verifica a mensagem de sucesso
      cy.get('.success-message').should('contain', 'Staff profile deactivated successfully.');
    });

  });

