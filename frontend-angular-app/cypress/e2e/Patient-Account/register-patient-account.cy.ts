describe('Tests E2E - Patient Registration', () => {
    beforeEach(() => {
      // Visit the page where the registration form is located
      cy.visit('http://localhost:4200/manage-patient-account/register');
      
    });
  
    // Helper function to fill the patient form
    const fillPatientForm = (patientData = {}) => {
      const defaultData = {
        fullName: 'as',
        email: 'as@example.com',
        phone: '+123 4567890',
        birthDate: '1990-05-15',
        address: {
          street: 'as',
          city: 'Metropolis',
          state: 'NY',
          postalCode: 'as',
          country: 'USA',
        },
      };
  
      const data = { ...defaultData, ...patientData };
  
      cy.get('#fullName').type(data.fullName);
      cy.get('#email').type(data.email);
      cy.get('#phone').type(data.phone);
      cy.get('#birthDate').type(data.birthDate);
      cy.get('#street').type(data.address.street);
      cy.get('#city').type(data.address.city);
      cy.get('#state').type(data.address.state);
      cy.get('#postalCode').type(data.address.postalCode);
      cy.get('#country').type(data.address.country);
    };
  
    it('should successfully register a patient with valid data', () => {
      fillPatientForm();
      cy.get('button[type="submit"]').click();
  
      // Check success message
      cy.get('.message.success')
        .should('be.visible')
        .and('contain', 'Patient registered successfully!');
  
      // Verify form is reset
      cy.get('#fullName').should('have.value', '');
      cy.get('#email').should('have.value', '');
      cy.get('#phone').should('have.value', '');
      cy.get('#birthDate').should('have.value', '');
      cy.get('#street').should('have.value', '');
      cy.get('#city').should('have.value', '');
      cy.get('#state').should('have.value', '');
      cy.get('#postalCode').should('have.value', '');
      cy.get('#country').should('have.value', '');
    });
  
    it('should show validation errors for empty required fields', () => {
      cy.get('button[type="submit"]').click();
  
      cy.get('.message.error')
        .should('be.visible')
        .and('contain', 'Please fill out the form correctly.');
    });
  
    it('should handle server errors gracefully', () => {
      // Intercept the API call and force a 500 error
      cy.intercept('POST', '**/api/v1/PatientAccount/register', {
        statusCode: 500,
        body: { Errors: ['Server error: Registration failed.'] },
      }).as('registerPatientError');
  
      fillPatientForm();
      cy.get('button[type="submit"]').click();
  
      // Check error message
      cy.get('.message.error')
        .should('be.visible')
        .and('contain', 'Server error: Registration failed.');
    });
  
    it('should reset form fields when manually triggered', () => {
      fillPatientForm();
      cy.get('button[type="reset"]').click(); // Assuming there's a reset button in your form
  
      // Verify form is reset
      cy.get('#fullName').should('have.value', '');
      cy.get('#email').should('have.value', '');
      cy.get('#phone').should('have.value', '');
      cy.get('#birthDate').should('have.value', '');
      cy.get('#street').should('have.value', '');
      cy.get('#city').should('have.value', '');
      cy.get('#state').should('have.value', '');
      cy.get('#postalCode').should('have.value', '');
      cy.get('#country').should('have.value', '');
    });
  });
  