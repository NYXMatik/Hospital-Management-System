describe('Patient Login - Email Login', () => {
    beforeEach(() => {
        // Visit the login page before each test
        cy.visit('http://localhost:4200/manage-patient-account/login');  // Adjust this to the correct URL of your login page
    });

    it('should display the login form with Google login button and email input', () => {
        // Check if the Google login button and email input are visible
        cy.get('#google-login-btn').should('be.visible');
        cy.get('input[id="simulate-id"]').should('be.visible');
        cy.get('button').contains('Simulate Login').should('be.visible');
    });

    it('should show an error for invalid login credentials when simulating login', () => {
        // Set up a listener for alerts
        cy.on('window:alert', (str) => {
            // Assert the alert message is as expected
            expect(str).to.equal('Failed to simulate login. Please check the email and try again.');
        });

        // Enter an invalid email and simulate login
        cy.get('input[id="simulate-id"]').type('invalid@example.com');
        cy.get('button').contains('Simulate Login').click();
    });

    it('should login successfully with valid simulated email', () => {
        // Enter a valid email to simulate login
        cy.get('input[id="simulate-id"]').type('as@gmail.com');
        cy.get('button').contains('Simulate Login').click();

        // Stub the backend request (adjust URL and data as needed)
        cy.intercept('GET', 'http://localhost:5005/api/v1/PatientAccount/email/as@gmail.com', {
            statusCode: 200,
            body: {
                data: {
                    name: { fullName: 'John Doe' },
                    contactInfo: { email: 'as@gmail.com', phoneNumber: '1234567890' },
                    birthDate: '1990-01-01',
                    address: { street: '123 Main St', city: 'City', state: 'State', postalCode: '12345', country: 'Country' },
                    profileId: '12345',
                    isEmailVerified: true,
                    appointments: [],
                }
            }
        }).as('simulatedLoginRequest');

        // Wait for the API response
        cy.wait('@simulatedLoginRequest');

        // Check if user data is stored in localStorage
        cy.window().then((window) => {
            const user = window.localStorage.getItem('user');
            if (user) {
                const parsedUser = JSON.parse(user);
                expect(parsedUser).to.have.property('fullName', 'John Doe');
                expect(parsedUser).to.have.property('email', 'as@gmail.com');
            } else {
                // Handle the case where 'user' is not found in localStorage
                throw new Error('User data not found in localStorage');
            }
        });

        // Check if user is redirected to the account management page
        cy.url().should('include', '/manage-account');
    });

    it('should show an error message when email is empty and simulate login is clicked', () => {
        // Set up a listener for alerts
        cy.on('window:alert', (str) => {
            // Assert the alert message is as expected
            expect(str).to.equal('Failed to simulate login. Please check the email and try again.');
        });

        // Click the simulate login button without entering email
        cy.get('button').contains('Simulate Login').click();
    });
});
