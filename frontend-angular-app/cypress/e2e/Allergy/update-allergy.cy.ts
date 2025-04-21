describe('Allergy Update', () => {
  const existingAllergy = {
    code: 'A123',
    designation: 'Marisco',
    description: 'Provoca falta de ar e comichao'
  };

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

  it('should navigate to update allergy component when Edit button is clicked', () => {

    cy.get('button').contains('▼').click();

    // Simulate API response
    cy.intercept('GET', '** /api/allergy', {
      statusCode: 200,
      body: [{
        code: 'A123',
        designation: 'Marisco'
      }]
    }).as('getAllergies');

    // Execute search and wait for response
    cy.get('#code').type('A123');
    cy.get('button').contains('Search').click();

    // Click Edit button
    cy.get('.list ul li').contains('Edit').click();

    cy.intercept('PATCH', '**/api/allergy/*', {
      body: {
        ...existingAllergy,
        code: 'A123',
        designation: 'Marisco',
        description: 'Provoca falta de ar e comichao'
      }
    }).as('updateAllergy');

    updateAllergyForm();
    cy.get('button[type="submit"]').click();

    // Check success message
    cy.get('.message.success')
      .should('be.visible')
      .and('contain', 'Allergy updated successfully!');

    // Verify updated allergy details
    cy.get('.updated-details').within(() => {
      cy.contains('A123');
      cy.contains('Marisco');
      cy.contains('Provoca falta de ar e comichao');
    });
  });
});

// Helper function to update editable fields
const updateAllergyForm = (allergyData = {}) => {
  const defaultUpdates = {
    code: 'A123',
    designation: 'Marisco'
  };
  const updates = { ...defaultUpdates, ...allergyData };

  // Try several approaches to handle potential overlay issues

  // Wait for any loading states to resolve
  cy.wait(1000);

  // Update code with retry strategy
  cy.get('#code')
    .should('exist')
    .should('be.visible')
    .should('not.be.disabled')
    .scrollIntoView()
    .clear({ force: true })
    .type(updates.code, { force: true });

  // Update designation with retry strategy
  cy.get('#designation')
    .should('exist')
    .should('be.visible')
    .should('not.be.disabled')
    .scrollIntoView()
    .clear({ force: true })
    .type(updates.designation, { force: true });

};
