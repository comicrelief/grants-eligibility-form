//
// **** App Tests ****

// Please read our "Introduction to Cypress"
// https://on.cypress.io/introduction-to-cypress

describe('Grants form tests', () => {

  beforeEach(() =>  {
    cy.visit('/')
  })

  context('Stepping through the form', () => {
    it('should have a proper title', () => {
      cy.title().should('include', 'Grants Eligiblity Form')
      cy.get('.promo-header__content').should('contain', 'Find out if you\'re eligible')
    })

    it('should reject my application if I am an individual', () => {
      cy.get('.btn').click()
      cy.get('.question-1 .cr-body h4').should('contain', 'individual')
      cy.get('.buttons .btn:nth-child(1)').should('contain', 'Individual')
      cy.get('.buttons .btn:nth-child(1)').click()
      cy.get('h1').should('contain', 'We don’t think you’re eligible')
    })

    it('should accept my application if I answer correctly', () => {
      cy.get('.btn').click()
      cy.get('.question-1 .cr-body h4').should('contain', 'individual')
      cy.get('.buttons .btn:nth-child(2)').should('contain', 'Charity')
      cy.get('.buttons .btn:nth-child(2)').click()
      cy.get('[type="text"]').type('Test charity name')
      cy.get('[type="submit"]').click()
      cy.get('.buttons .btn:nth-child(2)').should('contain', 'No')
      cy.get('.buttons .btn:nth-child(2)').click()
      cy.get('.buttons .btn:nth-child(2)').should('contain', 'No')
      cy.get('.buttons .btn:nth-child(2)').click()
      cy.get('.buttons .btn:nth-child(2)').should('contain', 'No')
      cy.get('.buttons .btn:nth-child(2)').click()
      cy.get('.buttons .btn:nth-child(1)').should('contain', 'Yes')
      cy.get('.buttons .btn:nth-child(1)').click()
      cy.get('.buttons .btn:nth-child(1)').should('contain', 'Yes')
      cy.get('.buttons .btn:nth-child(1)').click()
      cy.get('.buttons .btn:nth-child(1)').should('contain', 'UK')
      cy.get('.buttons .btn:nth-child(1)').click()
      cy.get('.buttons .btn:nth-child(2)').should('contain', 'No')
      cy.get('.buttons .btn:nth-child(2)').click()
      cy.get('h1').should('contain', 'We think you might be eligible')
    })
  })
});
