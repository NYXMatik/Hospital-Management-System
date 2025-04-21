describe('Staff Profile Update', () => {
  const existingStaff = {
    id: 'D2024000001',
    fullName: 'Joana Neves',
    licenseNumber: 'JN12345',
    email: 'joana@example.com',
    phoneNumber: '+123 9872395',
    recruitmentYear: '2024',
    category: 'Nurse',
    specialization: 'Psychiatry'
  };

  beforeEach(() => {
    cy.visit('http://localhost:4200/admin/manage-staffs/dual-view/');
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

  it('should navigate to update staff component when Edit button is clicked', () => {
    cy.get('button').contains('▼').click();
    
    // Simulate API response
    cy.intercept('GET', '**/api/staffs', {
      statusCode: 200,
      body: [{
        fullName: 'Joana Neves',
        email: 'joana@example.com',
        specialization: 'Psychiatry'
      }]
    }).as('getStaffs');

    // Execute search and wait for response
    cy.get('#name').type('Joana');
    cy.get('button').contains('Search').click();
    
    // Click Edit button
    cy.get('.list ul li').contains('Edit').click();

    cy.intercept('PUT', '**/api/staff/*', {
      body: {
        ...existingStaff,
        email: 'joana@example.com',
        phoneNumber: '+123 9872395',
        specialization: 'Psychiatry'
      }
    }).as('updateStaff');

    updateStaffForm();
    cy.get('button[type="submit"]').click();

    // Check success message
    cy.get('.message.success')
      .should('be.visible')
      .and('contain', 'Staff updated successfully!');

    // Verify updated staff details
    cy.get('.updated-details').within(() => {
      cy.contains('+999 45678918');
      cy.contains('Cardiology');
    });
  });
});

// Helper function to update editable fields
const updateStaffForm = (staffData = {}) => {
  const defaultUpdates = {
    email: 'joana1@example.com',
    phoneNumber: '+999 45678918',
    specialization: 'Cardiology'
  };
  const updates = { ...defaultUpdates, ...staffData };

  // Try several approaches to handle potential overlay issues
  
  // Wait for any loading states to resolve
  cy.wait(1000);

  // Update email with retry strategy
  cy.get('#email')
    .should('exist')
    .should('be.visible')
    .should('not.be.disabled')
    .scrollIntoView()
    .clear({ force: true })
    .type(updates.email, { force: true });

  // Update phone with retry strategy
  cy.get('#phoneNumber')
    .should('exist')
    .should('be.visible')
    .should('not.be.disabled')
    .scrollIntoView()
    .clear({ force: true })
    .type(updates.phoneNumber, { force: true });

  // Update specialization
  cy.get('#specialization')
    .should('exist')
    .should('be.visible')
    .should('not.be.disabled')
    .scrollIntoView()
    .select(updates.specialization, { force: true });

};