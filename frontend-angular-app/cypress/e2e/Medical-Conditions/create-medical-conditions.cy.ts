describe('Tests E2E - Create Medical Condition', () => {
    beforeEach(() => {
      // Visit the page where staff creation form is located
      cy.visit('http://localhost:4200/admin/medical-conditions-allergies/manage-medical-conditions/create');

      // Expand the form if it's collapsed
      cy.get('button').contains('▼').click();
    });

    // Helper function to fill the staff form
    const fillStaffForm = (medicalCondition = {}) => {
      const defaultData = {
        code: 'MIG007',
        designation: 'Migraine',
        description: 'A neurological condition characterized by recurrent headaches that are often accompanied by other symptoms such as nausea, sensitivity to light, and visual disturbances.',
        commonSymptoms: ['Moderate to severe headache, often on one side of the head',
          'Sensitivity to light and sound', 'Nausea and vomiting']
      };

      const data = { ...defaultData, ...medicalCondition }; 
      cy.get('#code').type(data.code);
      cy.get('#designation').type(data.designation);
      cy.get('#description').type(data.description);
      cy.get('#commonSymptoms').type(data.commonSymptoms.join(', '));
    };

    const fillStaffForm2 = (medicalCondition = {}) => {

      const defaultData2 = {
        code: 'ANEM008',
        designation: 'Iron-Deficiency Anemia',
        description: 'A condition in which the blood lacks adequate healthy red blood cells due to insufficient iron, leading to reduced oxygen transport to tissues.',
        commonSymptoms: ['Fatigue and weakness', 'Pale or yellowish skin',
          'Shortness of breath', 'Dizziness or lightheadedness']
      };

      const data2 = { ...defaultData2, ...medicalCondition };
      cy.get('#code').type(data2.code);
      cy.get('#designation').type(data2.designation);
      cy.get('#description').type(data2.description);
      cy.get('#commonSymptoms').type(data2.commonSymptoms.join(', '));
    };

    it('should successfully create a medical condition with valid data', () => {
      fillStaffForm();
      cy.get('button[type="submit"]').click();

      // Check success message
      cy.get('.message.success').should('be.visible')
        .and('contain', 'Medical Condition created successfully!');

      // Verify created medical condition details are displayed
      cy.get('.created-details').within(() => {
        cy.contains('MIG007');
        cy.contains('Migraine');
        cy.contains('A neurological condition characterized by recurrent headaches that are often accompanied by other symptoms such as nausea, sensitivity to light, and visual disturbances.');
        cy.contains('Moderate to severe headache, often on one side of the head, Sensitivity to light and sound, Nausea and vomiting');
      });
    });

    it('should show validation errors for empty required fields', () => {
      cy.get('button[type="submit"]').click();

      cy.get('.message.error').should('have.length.at.least', 1);
    });

    it('should show error for duplicate code', () => {
      // First create a medical condition
      fillStaffForm();
      cy.get('button[type="submit"]').click();

      // Check error message
      cy.get('.message.error').should('be.visible').and('contain', 'Medical condition already exists.');
      cy.get('.message.error').should('have.length.at.least', 1);
    });

    it('should handle server errors gracefully', () => {
      // Intercept the API call and force a 500 error
      cy.intercept('POST', '**/api/medical-conditions', {
        statusCode: 500,
        body: 'Server error'
      }).as('createMedicalConditionError');

      fillStaffForm();
      cy.get('button[type="submit"]').click();

      // Check error message
      cy.get('.message.error').should('have.length.at.least', 1);
    });

    it('should reset form when clicking Create New Medical condition', () => {
      fillStaffForm2();
      cy.get('button[type="submit"]').click();

      // Check success message
      cy.get('.message.success').should('be.visible')
        .and('contain', 'Medical Condition created successfully!');

      // Verify created staff details are displayed
      cy.get('.created-details').within(() => {
        cy.contains('ANEM008');
        cy.contains('Iron-Deficiency Anemia');
        cy.contains('A condition in which the blood lacks adequate healthy red blood cells due to insufficient iron, leading to reduced oxygen transport to tissues.');
        cy.contains('Fatigue and weakness, Pale or yellowish skin, Shortness of breath, Dizziness or lightheadedness');
      });

      // Click Create New Medical condition
      cy.get('button').contains('Create New Medical Condition').click();

      // Verify form is reset
      cy.get('#code').should('have.value', '');
      cy.get('#designation').should('have.value', '');
      cy.get('#description').should('have.value', '');
      cy.get('#commonSymptoms').should('have.value', '');
    });

  });
