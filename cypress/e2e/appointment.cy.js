const { default: axios } = require("axios")

describe('Sign in', () => {
  let startTime

  before(() => {
    startTime = new Date()
    cy.visit('/login')
    cy.login()
  })
  it('create appointment config', () => {
    cy.getDataTest('open-nav-button').click()
    cy.getDataTest('nav-drawer').should('be.visible')
    cy.url().should('not.include', '/dashboard/appointments/config')
    cy.getDataTest('employee-nav-item-appointments').click()
    cy.getDataTest('employee-nav-item-appointments-config').click()
    cy.url().should('include', '/dashboard/appointments/config')
    cy.wait(1000)
    cy.url().should('not.include', 'config/new')
    cy.contains('العربية').click();
    cy.contains('English').click();
    cy.getDataTest('create-appointment-config-button').click()
    cy.url().should('include', 'config/new')
    cy.wait(1000)
    cy.contains('Skip').click();
    cy.getDataTest('select-ws').click()
    cy.contains('wg').click();
    cy.getDataTest('select-wg').click()
    cy.contains('22').click();
    cy.getDataTest('duration-time').find('input').type(60)
    cy.getDataTest('avalabitity-input').find('input').type(5)
    cy.getDataTest('select-appointment-type-0').click()
    cy.wait(500)
    cy.contains('new york').click();
    cy.getDataTest('work-inputs-0').find('input').first().type('10:00 AM');
    cy.getDataTest('work-inputs-0').find('input').eq(1).type('02:00 PM');
    Array.from({ length: 7 }).forEach(() => {
      cy.getDataTest('add-new-day-button').click()
    });
    cy.contains(/No valid date to create/i).should('exist')
    cy.contains('save').click();
    cy.url().should('include', '/dashboard/appointments/config')
    cy.url().should('not.include', 'config/new')
  })
  after(() => {
    const deleteData = async () => {
      axios.delete(`http://localhost:3000/delete?startTime=${startTime}`)
    }
    deleteData()
  })
})
