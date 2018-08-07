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
      cy.get('.question-1 .cr-body').should('contain', 'organisation')

      /* Submit a 'fail' value for Q1 */
      cy.get('.buttons .btn:nth-child(2)')
        .should('contain', 'No').then(($btn) => {
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
      cy.get('.question-5 .cr-body').should('contain', 'We don’t usually fund')
      cy.get('.question-5 .buttons .btn:nth-child(2)')
        .should('contain', 'No').then(($btn) => {
          ($btn).click()
      })

      /* Submit a 'success' value for Q6 */
      cy.get('.question-6 .cr-body').should('contain', 'About your funding amount')
      cy.get('.question-6 .buttons .btn:nth-child(1)')
        .should('contain', 'OK').then(($btn) => {
          ($btn).click()
      })

      /* Submit a 'success' value for Q7 */
      cy.get('.question-7 .cr-body').should('contain', 'Our hallmarks')
      cy.get('.question-7 .buttons .btn:nth-child(1)')
        .should('contain', 'OK').then(($btn) => {
        ($btn).click()
      })
      /* Check failure outcome */
      cy.get('.outcome-message .outcome-heading').should('contain', 'Looks like you don’t meet with our core criteria.')
      cy.get('.outcome-message .cr-body')
        .should('contain', 'You are an individual')
      
    })

    it('should accept my application if I am not funding Sport For Change but I am in the middle income tier ', () => {
      cy.get('.btn').click()

      /* Submit a 'success' value for Q1 */
      cy.get('.question-1 .cr-body').should('contain', 'organisation')
      cy.get('.buttons .btn:nth-child(1)')
        .should('contain', 'Yes').then(($btn) => {
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
      cy.get('.question-5 .cr-body').should('contain', 'We don’t usually fund')
      cy.get('.question-5 .buttons .btn:nth-child(2)')
        .should('contain', 'No').then(($btn) => {
        ($btn).click()
      })

      /* Submit a 'success' value for Q6 */
      cy.get('.question-6 .cr-body').should('contain', 'About your funding amount')
      cy.get('.question-6 .buttons .btn:nth-child(1)')
        .should('contain', 'OK').then(($btn) => {
        ($btn).click()
      })

      /* Submit a 'success' value for Q7 */
      cy.get('.question-7 .cr-body').should('contain', 'Our hallmarks')
      cy.get('.question-7 .buttons .btn:nth-child(1)')
        .should('contain', 'OK').then(($btn) => {
        ($btn).click()
      })
      /* Check failure outcome */
      cy.get('.outcome-message .outcome-heading').should('contain', 'Looks like you meet with our core criteria!')
      cy.get('.outcome-message .cr-body').should('contain', 'Your organisation\'s income is between £250,000 and £10 million')
        .should('contain', 'Your project won\'t use sport as a tool for social change')

    })
  })
});
