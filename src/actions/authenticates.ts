import { defineAction } from '../dsl/defineAction';
import { Credentials } from '../dsl/types';

export const authenticates = defineAction<[Credentials]>({
  name: 'authenticates',
  
  cypress: (ctx, credentials) => {
    const cy = (globalThis as any).cy;
    
    if (ctx.router.location.pathname !== '/login') {
      cy.visit('/login');
    }
    
    cy.findByLabelText(/email/i).type(credentials.email);
    cy.findByLabelText(/password/i).type(credentials.password);
    cy.findByRole('button', { name: /sign in|log in|submit/i }).click();
    
    cy.url().should('not.include', '/login');
  },
  
  rtl: async (ctx, credentials) => {
    const { screen, waitFor } = await import('@testing-library/react');
    const { default: userEvent } = await import('@testing-library/user-event');
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in|log in|submit/i });
    
    await userEvent.type(emailInput, credentials.email);
    await userEvent.type(passwordInput, credentials.password);
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(ctx.router.location.pathname).not.toBe('/login');
    });
  },
});
