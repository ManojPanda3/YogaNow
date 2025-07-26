describe('Authentication Flow', () => {
  describe('Signup Page', () => {
    beforeEach(() => {
      cy.visit('/auth/signup');
    });

    it('should show required error when email is missing', () => {
      cy.get('input[name="password"]').type('a-strong-password');
      cy.get('button[type="submit"]').click();

      cy.get('input[name="email"]').siblings('p.text-red-500').should('contain.text', 'Email is required');

      cy.url().should('include', '/auth/signup');
    });

    it('should show required error when password is missing', () => {
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('button[type="submit"]').click();

      cy.get('input[name="password"]').siblings('p.text-red-500').should('contain.text', 'Password is required');

      cy.url().should('include', '/auth/signup');
    });

    it('should show a toast error for an existing email', () => {
      // Mock the API response for this specific test case
      cy.intercept('POST', '/api/auth/signup', {
        statusCode: 409, // 409 Conflict is a good choice for existing resources
        body: { message: 'This email is already registered.' },
      }).as('signupRequest');

      // Use the specific email you mentioned
      cy.get('input[name="email"]').type('manojpandaplus1pro+test@gmail.com');
      cy.get('input[name="password"]').type('any-password');
      cy.get('button[type="submit"]').click();

      // Wait for the API call to complete
      cy.wait('@signupRequest');

      cy.get('[data-sonner-toast]').should('be.visible').and('contain.text', 'This email is already registered.');

      // Ensure we are still on the signup page
      cy.url().should('include', '/auth/signup');
    });

    it('should navigate to login page on successful signup', () => {
      cy.intercept('POST', '/api/auth/signup', {
        statusCode: 201, // 201 Created
        body: { message: 'Signup successful! Please login.' },
      }).as('signupRequest');

      cy.get('input[name="email"]').type('new-user@example.com');
      cy.get('input[name="password"]').type('a-strong-password');
      cy.get('button[type="submit"]').click();

      cy.wait('@signupRequest');

      // Check for success toast
      cy.get('[data-sonner-toast]').should('be.visible').and('contain.text', 'Signup successful!');

      // Check for redirection
      cy.url().should('include', '/auth/login');
    });
  });

  // --- LOGIN PAGE TESTS ---
  describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/auth/login');
    });

    it('should show a toast error for incorrect credentials', () => {
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 401, // 401 Unauthorized
        body: { message: 'Invalid email or password.' },
      }).as('loginRequest');

      cy.get('input[name="email"]').type('wrong@example.com');
      cy.get('input[name="password"]').type('wrong-password');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest');

      // Check for error toast
      cy.get('[data-sonner-toast]').should('be.visible').and('contain.text', 'Invalid email or password.');
      cy.url().should('include', '/auth/login');
    });

    it('should navigate to the product page on successful login', () => {
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: { message: 'Login successful!' },
      }).as('loginRequest');

      cy.get('input[name="email"]').type('correct-user@example.com');
      cy.get('input[name="password"]').type('correct-password');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest');

      // Check for successful redirection
      cy.url().should('include', '/products');
    });
  });
});
