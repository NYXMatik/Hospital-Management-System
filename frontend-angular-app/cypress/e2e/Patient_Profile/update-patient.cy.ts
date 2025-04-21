describe('Patient Profile Update', () => {
  const existingPatient = {
    medicalRecordNumber: '202411000002',
    fullName: 'João Sousa',
    email: 'joao@example.com',
    phoneNumber: '+351 912345678',
    gender: 'Male',
    birth: '1990-01-01',
    emergencyContact: '+351 966222111'
  };

  beforeEach(() => {
    cy.visit('http://localhost:4200/admin/manage-patient-profile/dual-view/');
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

  it('should navigate to update patient component when Edit button is clicked', () => {
    cy.get('button').contains('▼').click();
    
    // Simulate API response
    cy.intercept('GET', '**/api/patients', {
      statusCode: 200,
    }).as('getPatients');

    // Execute search and wait for response
    cy.get('#name').type('João');
    cy.get('button').contains('Search').click();
    
    // Click Edit button
    cy.get('.list ul li').contains('Edit').click();

    cy.intercept('PUT', '**/api/patient/*', { }).as('updatePatient');

    updatePatientForm();
    cy.get('button[type="submit"]').click();

    // Check success message
    cy.get('.message.success')
      .should('be.visible')
      .and('contain', 'Patient updated successfully!');

    // Verify updated patient details
    cy.get('.updated-details').within(() => {
      //cy.contains('Paulo');
      //cy.contains('paulo@example.com');
      cy.contains('+999 45678918');
    });
  });
});

// Helper function to update editable fields
const updatePatientForm = (patientData = {}) => {
  const defaultUpdates = {
    fullName: 'Paulo',
    emergencyContact: '+999 45678918',
  };
  const updates = { ...defaultUpdates, ...patientData };

  // Try several approaches to handle potential overlay issues
  
  // Wait for any loading states to resolve
  cy.wait(1000);

  // Update specialization
  cy.get('#fullName')
  .should('exist')
  .should('be.visible')
  .should('not.be.disabled')
  .scrollIntoView()
  .clear({ force: true })
  .type(updates.fullName, { force: true });

  // Update email with retry strategy
  cy.get('#emergencyContact')
    .should('exist')
    .should('be.visible')
    .should('not.be.disabled')
    .scrollIntoView()
    .clear({ force: true })
    .type(updates.emergencyContact, { force: true });

};