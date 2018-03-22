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
      cy.get('h2').should('contain', 'We don’t think you’re eligible')
    })

    it('should accept my application if I answer correctly', () => {
      cy.get('.btn').click()
      cy.get('.question-1 > h4').should('contain', 'type')
      cy.get(':nth-child(2) > .btn').should('contain', 'Charity')
      cy.get(':nth-child(2) > .btn').click()
      cy.get('[type="text"]').type('Test charity name')
      cy.get('[type="submit"]').click()
      cy.get(':nth-child(2) > .btn').should('contain', 'Other')
      cy.get(':nth-child(2) > .btn').click()
      cy.get(':nth-child(2) > .btn').should('contain', 'No')
      cy.get(':nth-child(2) > .btn').click()
      cy.get(':nth-child(2) > .btn').should('contain', 'No')
      cy.get(':nth-child(2) > .btn').click()
      cy.get(':nth-child(1) > .btn').should('contain', 'Yes')
      cy.get(':nth-child(1) > .btn').click()
      cy.get(':nth-child(1) > .btn').should('contain', 'Yes')
      cy.get(':nth-child(1) > .btn').click()
      cy.get(':nth-child(1) > .btn').should('contain', 'UK')
      cy.get(':nth-child(1) > .btn').click()
      cy.get(':nth-child(2) > .btn').should('contain', 'No')
      cy.get(':nth-child(2) > .btn').click()
      cy.get('h2').should('contain', 'We think you might be eligible')
    })
  })
});
