describe('Tests E2E - Staff Profile Creation', () => {
  beforeEach(() => {
    // Visit the page where staff creation form is located
    cy.visit('http://localhost:4200/admin/manage-staffs/create');

    // Expand the form if it's collapsed
    cy.get('button').contains('▼').click();
  });

  // Helper function to fill the staff form
  const fillStaffForm = (staffData = {}) => {
    const defaultData = {
      fullName: 'Celeste Santos',
      licenseNumber: 'CSC999918',
      email: 'celeste@example.com',
      phoneNumber: '+123 45678918',
      recruitmentYear: '2024',
      category: 'Doctor',
      specialization: 'Psychiatry'
    };

    const data = { ...defaultData, ...staffData };
    cy.get('#fullName').type(data.fullName);
    cy.get('#licenseNumber').type(data.licenseNumber);
    cy.get('#email').type(data.email);
    cy.get('#phoneNumber').type(data.phoneNumber);
    cy.get('#recruitmentYear').clear().type(data.recruitmentYear);
    cy.get('#category').select(data.category);
    cy.get('#specialization').select(data.specialization);
  };

  const fillStaffForm2 = (staffData = {}) => {

    const defaultData2 = {
      fullName: 'Joana Neves',
      licenseNumber: 'JN12345',
      email: 'joana@example.com',
      phoneNumber: '+123 9872395',
      recruitmentYear: '2024',
      category: 'Doctor',
      specialization: 'Cardiology'
    };

    const data2 = { ...defaultData2, ...staffData };
    cy.get('#fullName').type(data2.fullName);
    cy.get('#licenseNumber').type(data2.licenseNumber);
    cy.get('#email').type(data2.email);
    cy.get('#phoneNumber').type(data2.phoneNumber);
    cy.get('#recruitmentYear').clear().type(data2.recruitmentYear);
    cy.get('#category').select(data2.category);
    cy.get('#specialization').select(data2.specialization);
  };

  it('should successfully create a staff profile with valid data', () => {
    fillStaffForm();
    cy.get('button[type="submit"]').click();

    // Check success message
    cy.get('.message.success').should('be.visible')
      .and('contain', 'Staff created successfully!');

    // Verify created staff details are displayed
    cy.get('.created-details').within(() => {
      cy.contains('Celeste Santos');
      cy.contains('CSC999918');
      cy.contains('celeste@example.com');
      cy.contains('+123 45678918');
      cy.contains('Psychiatry');
    });
  });

  it('should show validation errors for empty required fields', () => {
    cy.get('button[type="submit"]').click();

    cy.get('.message.error').should('have.length.at.least', 1);
  });

  it('should show error for duplicate license number', () => {
    // First create a staff member
    fillStaffForm();
    cy.get('button[type="submit"]').click();

    // Check error message
    cy.get('.message.error').should('be.visible').and('contain', 'License number, email and phone number must be unique');
    cy.get('.message.error').should('have.length.at.least', 1);
  });

  it('should handle server errors gracefully', () => {
    // Intercept the API call and force a 500 error
    cy.intercept('POST', '**/api/staff', {
      statusCode: 500,
      body: 'Server error'
    }).as('createStaffError');

    fillStaffForm();
    cy.get('button[type="submit"]').click();

    // Check error message
    cy.get('.message.error').should('have.length.at.least', 1);
  });

  it('should reset form when clicking Create New Staff', () => {
    fillStaffForm2();
    cy.get('button[type="submit"]').click();

    // Check success message
    cy.get('.message.success').should('be.visible')
      .and('contain', 'Staff created successfully!');

    // Verify created staff details are displayed
    cy.get('.created-details').within(() => {
      cy.contains('Joana Neves');
      cy.contains('JN12345');
      cy.contains('joana@example.com');
      cy.contains('+123 9872395');
      cy.contains('Cardiology');
    });

    // Click Create New Staff
    cy.get('button').contains('Create New Staff').click();

    // Verify form is reset
    cy.get('#fullName').should('have.value', '');
    cy.get('#licenseNumber').should('have.value', '');
    cy.get('#email').should('have.value', '');
    cy.get('#phoneNumber').should('have.value', '');
    cy.get('#recruitmentYear').should('have.value', '2024');
    cy.get('#category').should('have.value', null);
    cy.get('#specialization').should('have.value', null);
  });

});
