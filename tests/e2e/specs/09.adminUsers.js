import faker from 'faker'

describe('Admin Users', () => {
  it('Visits the admin users url and list users', () => {
    cy.login('admin@admin.com')
    cy.visit('/admin/users')
    // url should be /admin/users
    cy.url().should('include', '/admin/users')
  })
  it('Checks input types for create/edit new user', () => {
    cy.login('admin@admin.com')
    cy.setLocaleToEN()
    cy.visit('/admin/users')

    // Click create new user
    cy.get('button.btnNewItem')
      .contains('New Item')
      .click()
    cy.get('div.dlgNewEditItem.v-dialog--active').should('be.visible')

    // Checks input type is text
    cy.get('input[name=name]')
      .invoke('attr', 'type')
      .should('contain', 'text')
    cy.get('input[name=role]')
      .invoke('attr', 'type')
      .should('contain', 'text')
    cy.get('input[name=city]')
      .invoke('attr', 'type')
      .should('contain', 'text')
    cy.get('input[name=country]')
      .invoke('attr', 'type')
      .should('contain', 'text')
    // Checks input type is email
    cy.get('input[name=email]')
      .invoke('attr', 'type')
      .should('contain', 'email')
    // Checks input type is password
    cy.get('input[name=password]')
      .invoke('attr', 'type')
      .should('contain', 'password')
    cy.get('input[name=confirmPassword]')
      .invoke('attr', 'type')
      .should('contain', 'password')
  })
  it('Create new user', () => {
    cy.login('admin@admin.com')
    cy.setLocaleToEN()
    cy.visit('/admin/users')

    // Click create new user
    cy.get('button.btnNewItem')
      .contains('New Item')
      .click()
    cy.get('div.dlgNewEditItem.v-dialog--active').should('be.visible')

    // Type new user data and save
    // name
    cy.get('input[name=name]')
      .clear()
      .type('A New User')
    // email
    cy.get('input[name=email]')
      .clear()
      .type(faker.internet.email())
    // password
    cy.get('input[name=password]')
      .clear()
      .type('12345')
    cy.get('input[name=confirmPassword]')
      .clear()
      .type('12345')
    // role
    cy.get('div.inputRole > div > div > div > div > div > i')
      .contains('arrow_drop_down')
      .click()
    cy.get('div.v-list__tile__title')
      .contains('Administrator')
      .click()
    cy.get('div.inputRole > div > div > div > div > div > i')
      .contains('clear')
      .click()
    cy.get('div.inputRole > div > div > div > div > div > i')
      .contains('arrow_drop_down')
      .click()
    cy.get('div.v-list__tile__title')
      .contains('User')
      .click()
    // city
    cy.get('div.inputCity > div > div > div > div > div > i')
      .contains('arrow_drop_down')
      .click()
    cy.get('div.v-list__tile__title')
      .contains('Cali')
      .click()
    cy.get('div.inputCity > div > div > div > div > div > i')
      .contains('clear')
      .click()
    cy.get('div.inputCity > div > div > div > div > div > i')
      .contains('arrow_drop_down')
      .click()
    cy.get('div.v-list__tile__title')
      .contains('Bucaramanga')
      .click()
    // country
    cy.get('input[name=country]')
      .clear()
      .type(faker.random.word())
    // phone
    cy.get('input[name=phone]')
      .clear()
      .type(faker.phone.phoneNumber())
    // save
    cy.get('button.btnSave').click()
    cy.get('div.success')
      .should('be.visible')
      .contains('Saved successfully')
  })
  it('Edit user', () => {
    cy.login('admin@admin.com')
    cy.setLocaleToEN()
    cy.visit('/admin/users')

    // Search user
    cy.get('input[aria-label=Search]')
      .clear()
      .type('A New User')
    cy.wait(1000)
    // Click and edit first element
    cy.get('td > div > span.v-tooltip.v-tooltip--top')
      .eq(0)
      .click()
    // name
    cy.get('input[name=name]')
      .clear()
      .type('A New User Edited')
    // email
    cy.get('input[name=email]')
      .clear()
      .type(faker.internet.email())
    // role
    cy.get('div.inputRole > div > div > div > div > div > i')
      .contains('clear')
      .click()
    cy.get('div.inputRole > div > div > div > div > div > i')
      .contains('arrow_drop_down')
      .click()
    cy.get('div.v-list__tile__title')
      .contains('Administrator')
      .click()
    // city
    cy.get('div.inputCity > div > div > div > div > div > i')
      .contains('clear')
      .click()
    cy.get('div.inputCity > div > div > div > div > div > i')
      .contains('arrow_drop_down')
      .click()
    cy.get('div.v-list__tile__title')
      .contains('Cali')
      .click()
    // country
    cy.get('input[name=country]')
      .clear()
      .type(faker.random.word())
    // phone
    cy.get('input[name=phone]')
      .clear()
      .type(faker.phone.phoneNumber())
    // save
    cy.get('button.btnSave').click()
    cy.get('div.success')
      .should('be.visible')
      .contains('Saved successfully')
  })
  it('Search user', () => {
    cy.login('admin@admin.com')
    cy.setLocaleToEN()
    cy.visit('/admin/users')

    // Search edited user
    cy.get('input[aria-label=Search]')
      .clear()
      .type('A New User Edited')
    // Wait for api to reply
    cy.wait(1000)
    // Ensure there´s only one result
    cy.get('table.v-datatable.v-table > tbody > tr').should('have.length', 1)
    // Check if result is the same as entered in edit
    cy.get('table.v-datatable.v-table > tbody > tr > td')
      .eq(1)
      .contains('A New User Edited')
  })
  it('Delete user', () => {
    cy.login('admin@admin.com')
    cy.setLocaleToEN()
    cy.visit('/admin/users')

    // Search user
    cy.get('input[aria-label=Search]')
      .clear()
      .type('A New User Edited')
    // Wait for api to reply
    cy.wait(1000)
    // Ensure there´s only one result
    cy.get('table.v-datatable.v-table > tbody > tr').should('have.length', 1)
    // Check if result is the same as entered in edit
    cy.get('table.v-datatable.v-table > tbody > tr > td')
      .eq(1)
      .contains('A New User Edited')

    // Click and delete first element
    cy.get('td > div > span.v-tooltip.v-tooltip--top')
      .eq(1)
      .click()
    cy.get('div.v-dialog.v-dialog--active').should('be.visible')
    cy.get('button > div.v-btn__content')
      .contains('Delete')
      .click()
    cy.get('div.success')
      .should('be.visible')
      .contains('Deleted successfully')
  })
})
