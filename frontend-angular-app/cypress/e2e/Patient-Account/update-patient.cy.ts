describe('UpdateAccountComponent', () => {
    beforeEach(() => {
      // Mock user data in localStorage
      const mockUser = {
        profileId: '12345',
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        birthDate: '1990-01-01',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'USA'
        },
        isEmailVerified: true,
        active: true
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
  
      cy.visit('http://localhost:4200/manage-patient-account/update'); // Ensure the correct route
    });
  
    it('should load account details from localStorage', () => {
      // Check if the form is pre-filled with the mock user data
      cy.get('input[name="fullName"]').should('have.value', 'John Doe');
      cy.get('input[name="email"]').should('have.value', 'john@example.com');
      cy.get('input[name="phone"]').should('have.value', '+1234567890');
      cy.get('input[name="birthDate"]').should('have.value', '1990-01-01');
      cy.get('input[name="street"]').should('have.value', '123 Main St');
      cy.get('input[name="city"]').should('have.value', 'New York');
      cy.get('input[name="state"]').should('have.value', 'NY');
      cy.get('input[name="postalCode"]').should('have.value', '10001');
      cy.get('input[name="country"]').should('have.value', 'USA');
    });
  
    it('should show an error if email is invalid', () => {
      // Change email to an invalid value
      cy.get('input[name="email"]').clear().type('invalidemail');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Check if error alert appears
      cy.on('window:alert', (alertMessage) => {
        expect(alertMessage).to.contains('Please enter a valid email address.');
      });
    });
  
    it('should show an error if phone number is invalid', () => {
      // Change phone number to an invalid value
      cy.get('input[name="phone"]').clear().type('invalidphone');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Check if error alert appears
      cy.on('window:alert', (alertMessage) => {
        expect(alertMessage).to.contains('Please enter a valid phone number.');
      });
    });
  
    it('should successfully update account details and redirect to /manage-account', () => {
      // Change some details
      cy.get('input[name="fullName"]').clear().type('Jane Doe');
      cy.get('input[name="email"]').clear().type('jane@example.com');
      cy.get('input[name="phone"]').clear().type('+1987654321');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Verify successful update message in console (or alert if needed)
      cy.window().then((win) => {
        cy.stub(win, 'alert').callsFake((msg) => {
          expect(msg).to.contains('Account updated successfully!');
        });
      });
  
      // Check if the user was redirected to the manage account page
      cy.url().should('include', '/manage-account');
    });
  
    it('should show an error if the backend returns an error', () => {
      // Mock HTTP error response
      cy.intercept('PUT', 'http://localhost:5005/api/v1/PatientAccount/*', {
        statusCode: 400,
        body: { message: 'Bad request' }
      }).as('updateAccount');
  
      // Change some details
      cy.get('input[name="fullName"]').clear().type('Jane Doe');
      cy.get('input[name="email"]').clear().type('jane@example.com');
      cy.get('input[name="phone"]').clear().type('+1987654321');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Check for the error alert
      cy.on('window:alert', (alertMessage) => {
        expect(alertMessage).to.contains('Bad request: Please ensure all fields are correctly filled.');
      });
    });
  });
  