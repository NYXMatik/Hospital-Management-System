describe('Tests E2E - Allergy Creation', () => {
  beforeEach(() => {
    // Visit the page where allergy creation form is located
    cy.visit('http://localhost:4200/admin/medical-conditions-allergies/manage-allergies/create');


    // Expand the form if it's collapsed
    cy.get('button').contains('▼').click();
  });

  // Helper function to fill the allergy form
  const fillAllergyForm = (allergyData = {}) => {
    const defaultData = {
      code: 'A123',
      designation: 'Marisco',
      description: 'Provoca falta de ar e comichao'
    };

    const data = { ...defaultData, ...allergyData };
    cy.get('#code').type(data.code);
    cy.get('#designation').type(data.designation);
    cy.get('#description').type(data.description);
  };

  const fillAllergyForm2 = (allergyData = {}) => {

    const defaultData2 = {
      code: 'A456',
      designation: 'Flores',
      description: 'Provoca espirros'
    };

    const data2 = { ...defaultData2, ...allergyData };
    cy.get('#code').type(data2.code);
    cy.get('#designation').type(data2.designation);
    cy.get('#description').type(data2.description);
  };

  it('should successfully create an allergy with valid data', () => {
    fillAllergyForm();
    cy.get('button[type="submit"]').click();

    // Check success message
    cy.get('.message.success').should('be.visible')
      .and('contain', 'Allergy created successfully!');

    // Verify created allergy details are displayed
    cy.get('.created-details').within(() => {
      cy.contains('A123');
      cy.contains('Marisco');
      cy.contains('Provoca falta de ar e comichao');
    });
  });

  it('should show validation errors for empty required fields', () => {
    cy.get('button[type="submit"]').click();

    cy.get('.message.error').should('have.length.at.least', 1);
  });

  it('should show error for duplicate code', () => {
    // First create an allergy
    fillAllergyForm();
    cy.get('button[type="submit"]').click();

    // Check error message
    cy.get('.message.error').should('be.visible').and('contain', 'Allergy already exists.');
    cy.get('.message.error').should('have.length.at.least', 1);
  });

  it('should handle server errors gracefully', () => {
    // Intercept the API call and force a 500 error
    cy.intercept('POST', '**/api/allergy', {
      statusCode: 500,
      body: 'Server error'
    }).as('createAllergyError');

    fillAllergyForm();
    cy.get('button[type="submit"]').click();

    // Check error message
    cy.get('.message.error').should('have.length.at.least', 1);
  });

  it('should reset form when clicking Create New Allergy', () => {
    fillAllergyForm2();
    cy.get('button[type="submit"]').click();

    // Check success message
    cy.get('.message.success').should('be.visible')
      /*.and('contain', 'Staff created successfully!')*/;

    // Verify created allergy details are displayed
    cy.get('.created-details').within(() => {
      cy.contains('A456');
      cy.contains('Flores');
      cy.contains('Provoca espirros');
    });

    // Click Create New Allergy
    cy.get('button').contains('Create New Allergy').click();

    // Verify form is reset
    cy.get('#code').should('have.value', '');
    cy.get('#designation').should('have.value', '');
    cy.get('#description').should('have.value', '');
  });

});
