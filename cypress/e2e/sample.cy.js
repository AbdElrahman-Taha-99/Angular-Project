describe('Angular App', () => {
  it('should load the home page', () => {
    cy.visit('http://54.157.237.38/');
    cy.contains('My Store');
  });
});
