import { defineAction } from '../dsl/defineAction';

export const navigatesTo = defineAction<[string]>({
  name: 'navigatesTo',
  
  cypress: (ctx, path) => {
    const cy = (globalThis as any).cy;
    cy.visit(path);
    ctx.router.location.pathname = path;
  },
  
  rtl: async (ctx, path) => {
    ctx.router.navigate(path);
  },
});
