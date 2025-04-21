describe('Medical Condition Update', () => {
    const existingMedicalCondition = {
        code: 'ANEM008',
        designation: 'Iron-Deficiency Anemia',
        description: 'A condition in which the blood lacks adequate healthy red blood cells due to insufficient iron, leading to reduced oxygen transport to tissues.',
        commonSymptoms: ['Fatigue and weakness', 'Pale or yellowish skin',
          'Shortness of breath', 'Dizziness or lightheadedness']
    };
  
    beforeEach(() => {
      cy.visit('http://localhost:4200/admin/medical-conditions-allergies/manage-medical-conditions/search');
    });
  
    it('should load the search medical condition component', () => {
      cy.contains('Search Medical Conditions').should('be.visible');
      cy.get('button').contains('▼').should('be.visible');
    });
  
    it('should expand the search section when button is clicked', () => {
      cy.get('button').contains('▼').click();
      cy.get('.form-content').should('be.visible');
      cy.get('button').contains('▲').should('be.visible');
    });
  
    it('should navigate to update medical condition component when Edit button is clicked', () => {
  
      cy.get('button').contains('▼').click();
  
      // Simulate API response
      cy.intercept('GET', '** /api/medical-condition', {
        statusCode: 200,
        body: [{
            code: 'ANEM008',
            designation: 'Iron-Deficiency Anemia',
        }]
      }).as('getMedicalConditions');
  
      // Execute search and wait for response
      cy.get('#code').type('ANEM008');
      cy.get('button').contains('Search').click();
  
      // Click Edit button
      cy.get('.list ul li').contains('Edit').click();
  
      cy.intercept('PATCH', '**/api/medical-condition/*', {
        body: {
          ...existingMedicalCondition,
            code: 'ANEM008',
            designation: 'Iron-Deficiency Anemia',
            description: 'A condition in which the blood lacks adequate healthy red blood cells due to insufficient iron, leading to reduced oxygen transport to tissues.',
            commonSymptoms: ['Fatigue and weakness', 'Pale or yellowish skin','Shortness of breath', 'Dizziness or lightheadedness']
        }
      }).as('updateMedicalCondition');
  
      updateMedicalConditionForm();
      cy.get('button[type="submit"]').click();
  
      // Check success message
      cy.get('.message.success')
        .should('be.visible')
        .and('contain', 'Medical Condition updated successfully!');
  
      // Verify updated medical condition details
      cy.get('.updated-details').within(() => {
        cy.contains('ANEM008');
        cy.contains('Iron-Deficiency Anemia');
        cy.contains('A condition in which the blood lacks adequate healthy red blood cells.');
        cy.contains('Fatigue and weakness, Pale or yellowish skin, Shortness of breath, Dizziness or lightheadedness');
      });
    });
  });
  
  // Helper function to update editable fields
  const updateMedicalConditionForm = (medicalConditionData = {}) => {
    const defaultUpdates = {
        //code: 'ANEM008',
        description: 'A condition in which the blood lacks adequate healthy red blood cells.',
    };
    const updates = { ...defaultUpdates, ...medicalConditionData };
  
    // Try several approaches to handle potential overlay issues
  
    // Wait for any loading states to resolve
    cy.wait(1000);
  
    // Update code with retry strategy
    /*cy.get('#code')
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
      .type(updates.designation, { force: true });*/

    // Update designation with retry strategy
    cy.get('#description')
    .should('exist')
    .should('be.visible')
    .should('not.be.disabled')
    .scrollIntoView()
    .clear({ force: true })
    .type(updates.description, { force: true });
  
  };
  