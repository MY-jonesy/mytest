import { defineAssertion } from '../../dsl/defineAction';

export const doesNotSeeErrorMessage = defineAssertion({
  name: 'doesNotSee.errorMessage',
  
  cypress: () => {
    const cy = (globalThis as any).cy;
    cy.findByRole('alert').should('not.exist');
  },
  
  rtl: async () => {
    const { screen } = await import('@testing-library/react');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  },
});

export const doesNotSeeLoading = defineAssertion({
  name: 'doesNotSee.loading',
  
  cypress: () => {
    const cy = (globalThis as any).cy;
    cy.findByRole('progressbar').should('not.exist');
  },
  
  rtl: async () => {
    const { screen, waitFor } = await import('@testing-library/react');
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  },
});

export const doesNotSeeText = defineAssertion<[string]>({
  name: 'doesNotSee.text',
  
  cypress: (ctx, text) => {
    const cy = (globalThis as any).cy;
    cy.contains(text).should('not.exist');
  },
  
  rtl: async (ctx, text) => {
    const { screen, waitFor } = await import('@testing-library/react');
    
    await waitFor(() => {
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    });
  },
});
