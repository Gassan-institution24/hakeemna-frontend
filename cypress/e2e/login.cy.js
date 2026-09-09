const { default: axios } = require("axios")

// Logging in takes two steps: the address is submitted on its own first, and only then does the
// form show the password field. Accounts a clinic created have no password yet and are sent to a
// "create your password" dialog instead — see src/sections/auth/jwt-login-view.jsx.
const submitEmail = (email) => {
  cy.getDataTest('email-input').find('input').clear().type(email)
  cy.getDataTest('login-button').click()
}

describe('log in', () => {
  let startTime
  before(() => {
    startTime = new Date()
  })
  beforeEach(() => {
    cy.visit('/login')
  })
  it('test login with wrong password', () => {
    cy.contains(/تسجيل الدخول/i)
    submitEmail('alaa@employee.com')
    cy.getDataTest('password-input').find('input').as('password-input')
    cy.get('@password-input').type(123456789)
    cy.contains(/خطأ في البريد الالكتروني أو كلمة المرور/i).should('not.exist')
    cy.getDataTest('login-button').click()
    cy.contains(/خطأ في البريد الالكتروني أو كلمة المرور/i).should('exist')
    cy.url().should('not.include', '/dashboard')
    cy.wait(2000)
  })

  it('test login with wrong email', () => {
    cy.contains(/تسجيل الدخول/i)
    submitEmail('alaa@employee')
    cy.getDataTest('password-input').find('input').as('password-input')
    cy.get('@password-input').type(12345678)
    cy.contains(/خطأ في البريد الالكتروني أو كلمة المرور/i).should('not.exist')
    cy.getDataTest('login-button').click()
    cy.contains(/خطأ في البريد الالكتروني أو كلمة المرور/i).should('exist')
    cy.url().should('not.include', '/dashboard')
    cy.wait(2000)
  })

  it('test login with correct credential', () => {
    submitEmail('alaa@employee.com')
    cy.getDataTest('password-input').find('input').type(12345678)
    cy.url().should('not.include', '/dashboard')
    cy.getDataTest('login-button').click()
    cy.url().should('include', '/dashboard')
    cy.wait(2000)
  })

  after(() => {
    const deleteData = async () => {
      axios.delete(`http://localhost:3000/delete?startTime=${startTime}`)
    }
    deleteData()
  })
})
