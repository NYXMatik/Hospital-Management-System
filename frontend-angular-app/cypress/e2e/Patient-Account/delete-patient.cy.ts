describe('DeleteAccountComponent', () => {
    const userId = 'd3b9d797-ee5a-4f1c-b76f-9d5132c8ab31';  // Replace with the dynamic user ID
    const apiUrl = 'http://localhost:5005/api/v1/PatientAccount/';
    
    beforeEach(() => {
      // Visit the delete account page with the dynamic ID
      cy.visit(`/manage-patient-account/delete/${userId}`);
    
      // Simulate user being logged in by setting the user data in localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('user', JSON.stringify({ profileId: userId }));
      });
    });
  
    it('should delete the account successfully and navigate to login page', () => {
      // Mock confirmation dialog (simulate user confirming the deletion)
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(true);
      });
  
      // Stub the backend API to simulate a successful deletion
      cy.intercept('DELETE', `${apiUrl}${userId}`, {
        statusCode: 200,
        body: {},
      }).as('deleteAccountRequest');
  
      // Click the delete button
      cy.get('button.btn-delete').click();
  
      // Wait for the delete API request to complete
      cy.wait('@deleteAccountRequest');
  
      // Verify success message is shown
      cy.get('.success-message').should('contain', 'Your account and all associated data have been deleted successfully.');
  
      // Verify that localStorage is cleared
      cy.window().then((win) => {
        expect(win.localStorage.getItem('user')).to.be.null;
      });
  
      // Verify the router navigates to the login page in the manage-patient-account section
      cy.url().should('include', '/manage-patient-account/login');
    });
  
    it('should show an error message when the deletion fails', () => {
      // Mock confirmation dialog (simulate user confirming the deletion)
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(true);
      });
  
      // Stub the backend API to simulate an error response
      cy.intercept('DELETE', `${apiUrl}${userId}`, {
        statusCode: 500,
        body: { message: 'Error deleting account' },
      }).as('deleteAccountRequest');
  
      // Click the delete button
      cy.get('button.btn-delete').click();
  
      // Wait for the delete API request to complete
      cy.wait('@deleteAccountRequest');
  
      // Verify error message is shown
      cy.get('.error-message').should('contain', 'An error occurred while trying to delete your account. Please try again later.');
    });
  
    it('should show an alert if the user ID is missing', () => {
      // Simulate user being logged out by removing user data from localStorage
      cy.window().then((win) => {
        win.localStorage.removeItem('user');
      });
  
      // Mock confirmation dialog (simulate user confirming the deletion)
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(true);
      });
  
      // Spy on the alert method to check if it gets called
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertSpy');
      });
  
      // Click the delete button
      cy.get('button.btn-delete').click();
  
      // Verify alert was called
      cy.get('@alertSpy').should('have.been.calledWith', 'User ID is missing. Please log in again or contact support.');
    });
  
    it('should not delete the account if the user cancels the confirmation', () => {
      // Simulate user canceling the deletion
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(false);
      });
  
      // Click the delete button
      cy.get('button.btn-delete').click();
  
      // Verify that no DELETE request was made
      cy.intercept('DELETE', `${apiUrl}${userId}`).as('deleteAccountRequest');
      cy.wait('@deleteAccountRequest').should('not.exist');
    });
  });
  