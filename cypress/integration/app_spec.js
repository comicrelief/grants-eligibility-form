//
// **** App Tests ****

// Please read our "Introduction to Cypress"
// https://on.cypress.io/introduction-to-cypress

describe('Grants form tests', () => {

  beforeEach(() =>  {
    cy.visit('/')
  })

  context('first page is loading', () => {
    it('should have a proper title', () => {
      cy.title().should('include', 'Grants Eligiblity Form')
    })
  })
});
