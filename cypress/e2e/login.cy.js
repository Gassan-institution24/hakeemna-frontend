const { default: axios } = require("axios")

describe('log in', () => {
  let startTime
  before(() => {
    startTime = new Date()
  })
  beforeEach(() => {
    cy.visit('/login')
  })
  it('test login with wrong password', () => {
    cy.getDataTest('email-input').find('input').as('email-input')
    cy.getDataTest('password-input').find('input').as('password-input')
    cy.getDataTest('login-button').as('login-button')
    cy.contains(/تسجيل الدخول/i)
    cy.get('@email-input').type('alaa@employee.com')
    cy.get('@password-input').type(123456789)
    cy.contains(/خطأ في البريد الالكتروني أو كلمة المرور/i).should('not.exist')
    cy.get('@login-button').click()
    cy.contains(/خطأ في البريد الالكتروني أو كلمة المرور/i).should('exist')
    cy.url().should('not.include', '/dashboard')
    cy.get('@email-input').clear()
    cy.get('@password-input').clear()
    cy.wait(2000)
  })

  it('test login with wrong email', () => {
    cy.getDataTest('email-input').find('input').as('email-input')
    cy.getDataTest('password-input').find('input').as('password-input')
    cy.getDataTest('login-button').as('login-button')
    cy.contains(/تسجيل الدخول/i)
    cy.get('@email-input').type('alaa@employee')
    cy.get('@password-input').type(12345678)
    cy.contains(/خطأ في البريد الالكتروني أو كلمة المرور/i).should('not.exist')
    cy.get('@login-button').click()
    cy.contains(/خطأ في البريد الالكتروني أو كلمة المرور/i).should('exist')
    cy.url().should('not.include', '/dashboard')
    cy.get('@email-input').clear()
    cy.get('@password-input').clear()
    cy.wait(2000)
  })

  it('test login with correct credential', () => {
    cy.getDataTest('email-input').find('input').type('alaa@employee.com')
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
