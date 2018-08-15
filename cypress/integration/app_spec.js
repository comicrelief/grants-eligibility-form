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

    it('should reject my application if I am not an organisation', () => {
      cy.get('.btn').click()
      cy.get('.question-1 .cr-body').should('contain', 'Individual')

      /* Submit a 'fail' value for Q1 */
      cy.get('.buttons .btn:nth-child(2)')
        .should('contain', 'Individual').then(($btn) => {
        ($btn).click()
      })

      /* Submit a 'success' value for Q2 */
      cy.get('.question-2 .cr-body').should('contain', 'income')
      cy.get('.question-2 .buttons .btn:nth-child(1)')
        .should('contain', 'Under £250,000').then(($btn) => {
          ($btn).click()
      })

      /* Submit a 'success' value for Q3 */
      cy.get('.question-3 .cr-body').should('contain', 'activities')
      cy.get('.question-3 .buttons .btn:nth-child(1)')
        .should('contain', 'Yes').then(($btn) => {
          ($btn).click()
      })

      /* Submit a 'success' value for Q4 */
      cy.get('.question-4 .cr-body').should('contain', 'sport')
      cy.get('.question-4 .buttons .btn:nth-child(1)')
        .should('contain', 'Yes').then(($btn) => {
          ($btn).click()
      })

      /* Submit a 'success' value for Q5 */
      cy.get('.question-5 .cr-body').should('contain', 'following activities?')
      cy.get('.question-5 .buttons .btn:nth-child(2)')
        .should('contain', 'No').then(($btn) => {
          ($btn).click()
      })

      /* Check failure outcome */
      cy.get('.outcome-wrapper .promo-header').should('contain', 'not eligible')
      cy.get('.outcome-wrapper .snippets .just-in-time--content')
        .should('contain', 'applying as an individual')
      
    })

    it('should accept my application if I am not funding Sport For Change but I am in the middle income tier ', () => {
      cy.get('.btn').click()

      /* Submit a 'success' value for Q1 */
      cy.get('.question-1 .cr-body').should('contain', 'organisation')
      cy.get('.buttons .btn:nth-child(1)')
        .should('contain', 'Organisation').then(($btn) => {
        ($btn).click()
      })

      /* Submit a 'success' value for Q2 */
      cy.get('.question-2 .cr-body').should('contain', 'income')
      cy.get('.question-2 .buttons .btn:nth-child(2)')
        .should('contain', 'Between £250,000 to £10 million').then(($btn) => {
        ($btn).click()
      })

      /* Submit a 'success' value for Q3 */
      cy.get('.question-3 .cr-body').should('contain', 'countries')
      cy.get('.question-3 .buttons .btn:nth-child(1)')
        .should('contain', 'Yes').then(($btn) => {
        ($btn).click()
      })

      /* Submit a 'success' value for Q4 */
      cy.get('.question-4 .cr-body').should('contain', 'sport')
      cy.get('.question-4 .buttons .btn:nth-child(2)')
        .should('contain', 'No').then(($btn) => {
        ($btn).click()
      })

      /* Submit a 'success' value for Q5 */
      cy.get('.question-5 .cr-body').should('contain', 'following activities?')
      cy.get('.question-5 .buttons .btn:nth-child(2)')
        .should('contain', 'No').then(($btn) => {
        ($btn).click()
      })

      /* Check failure outcome */
      cy.get('.outcome-wrapper .promo-header').should('contain', 'be eligible')
      cy.get('.outcome-wrapper .snippets .show-link').click()

      cy.get('.outcome-wrapper .snippets .just-in-time--content').should('contain', 'between £250,000 and £10 million')
        .should('contain', 'doesn’t use sport')

    })
  })
});
