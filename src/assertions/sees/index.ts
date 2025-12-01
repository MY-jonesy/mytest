import { defineAssertion } from '../../dsl/defineAction';

export const seesDashboard = defineAssertion({
  name: 'sees.dashboard',
  
  cypress: () => {
    const cy = (globalThis as any).cy;
    cy.url().should('include', '/dashboard');
    cy.findByRole('heading', { name: /dashboard/i }).should('exist');
  },
  
  rtl: async (ctx) => {
    const { screen, waitFor } = await import('@testing-library/react');
    
    await waitFor(() => {
      expect(ctx.router.location.pathname).toContain('/dashboard');
    });
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  },
});

export const seesErrorMessage = defineAssertion<[string]>({
  name: 'sees.errorMessage',
  
  cypress: (ctx, text) => {
    const cy = (globalThis as any).cy;
    cy.findByRole('alert').should('contain.text', text);
  },
  
  rtl: async (ctx, text) => {
    const { screen, waitFor } = await import('@testing-library/react');
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(text);
    });
  },
});

export const seesNotification = defineAssertion<['success' | 'error', string?]>({
  name: 'sees.notification',
  
  cypress: (ctx, type, message) => {
    const cy = (globalThis as any).cy;
    const selector = `[data-testid="notification-${type}"]`;
    
    if (message) {
      cy.get(selector).should('contain.text', message);
    } else {
      cy.get(selector).should('exist');
    }
  },
  
  rtl: async (ctx, type, message) => {
    const { screen, waitFor } = await import('@testing-library/react');
    
    await waitFor(() => {
      const notification = screen.getByTestId(`notification-${type}`);
      expect(notification).toBeInTheDocument();
      if (message) {
        expect(notification).toHaveTextContent(message);
      }
    });
  },
});

export const seesLoading = defineAssertion({
  name: 'sees.loading',
  
  cypress: () => {
    const cy = (globalThis as any).cy;
    cy.findByRole('progressbar').should('exist');
  },
  
  rtl: async () => {
    const { screen } = await import('@testing-library/react');
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  },
});

export const seesText = defineAssertion<[string]>({
  name: 'sees.text',
  
  cypress: (ctx, text) => {
    const cy = (globalThis as any).cy;
    cy.contains(text).should('exist');
  },
  
  rtl: async (ctx, text) => {
    const { screen, waitFor } = await import('@testing-library/react');
    
    await waitFor(() => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  },
});
