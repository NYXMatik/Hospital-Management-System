describe('Tests E2E - Patient Profile Creation', () => {
  beforeEach(() => {
    // Visit the page where patient creation form is located
    cy.visit('http://localhost:4200/admin/manage-patients-profile/create');

    // Expand the form if it's collapsed
    cy.get('button').contains('▼').click();
  });

  // Helper function to fill the patient form
  const fillPatientForm = (patientData = {}) => {
    const defaultData = {
      fullName: 'Ana Sousa',
      email: 'ana@example.com',
      phoneNumber: '+351 987654321',
      gender: 'Female',
      birth: '1990-01-01',
      emergencyContact: '+351 966222111'
    };

    const data = { ...defaultData, ...patientData };
    cy.get('#fullName').type(data.fullName);
    cy.get('#email').type(data.email);
    cy.get('#phoneNumber').type(data.phoneNumber);
    cy.get('#gender').select(data.gender);
    cy.get('#birth').type(data.birth);
    cy.get('#emergencyContact').type(data.emergencyContact);
  };

  const fillPatientForm2 = (patientData = {}) => {

    const defaultData2 = {
      fullName: 'João Sousa',
      email: 'joao@example.com',
      phoneNumber: '+351 912345678',
      gender: 'Male',
      birth: '1990-01-01',
      emergencyContact: '+351 966222111'
    };

    const data2 = { ...defaultData2, ...patientData };
      cy.get('#fullName').type(data2.fullName);
      cy.get('#email').type(data2.email);
      cy.get('#phoneNumber').type(data2.phoneNumber);
      cy.get('#gender').select(data2.gender);
      cy.get('#birth').type(data2.birth);
      cy.get('#emergencyContact').type(data2.emergencyContact);
  };

  it('should successfully create a patient profile with valid data', () => {
    fillPatientForm();
    cy.get('button[type="submit"]').click();

    // Check success message
    cy.get('.message.success').should('be.visible')
      .and('contain', 'Patient created successfully!');

    // Verify created patient details are displayed
    cy.get('.created-details').within(() => {
      cy.contains('Ana Sousa');
      cy.contains('ana@example.com');
      cy.contains('+351 987654321');
      cy.contains('Female');
      cy.contains('1990-01-01');
      cy.contains('+351 966222111');
    });
  });

  it('should show validation errors for empty required fields', () => {
    cy.get('button[type="submit"]').click();

    cy.get('.message.error').should('have.length.at.least', 1);
  });

  it('should show error for duplicate data', () => {
    // First create a patient member
    fillPatientForm();
    cy.get('button[type="submit"]').click();

    // Check error message
    cy.get('.message.error').should('be.visible').and('contain', 'Email and phone number must be unique');
    cy.get('.message.error').should('have.length.at.least', 1);
  });

  it('should handle server errors gracefully', () => {
    // Intercept the API call and force a 500 error
    cy.intercept('POST', '**/api/patient', {
      statusCode: 500,
      body: 'Server error'
    }).as('createPatientError');

    fillPatientForm();
    cy.get('button[type="submit"]').click();

    // Check error message
    cy.get('.message.error').should('have.length.at.least', 1);
  });

  it('should reset form when clicking Create New Patient', () => {
    fillPatientForm2();
    cy.get('button[type="submit"]').click();

    // Check success message
    cy.get('.message.success').should('be.visible')
      .and('contain', 'Patient created successfully!');

    // Verify created patient details are displayed
    cy.get('.created-details').within(() => {
      cy.contains('João Sousa');
      cy.contains('joao@example.com');
      cy.contains('+351 987654321');
      cy.contains('Male');
      cy.contains('1990-01-01');
      cy.contains('+351 966222111');
    });

    // Click Create New Patient
    cy.get('button').contains('Create New Patient').click();

    // Verify form is reset
    cy.get('#fullName').should('have.value', '');
    cy.get('#email').should('have.value', '');
    cy.get('#phoneNumber').should('have.value', '');
    cy.get('#gender').should('have.value', null);
    cy.get('#birth').should('have.value', '');
    cy.get('#emergencyContact').should('have.value', '');
  });

});
