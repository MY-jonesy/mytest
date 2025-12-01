# Unified Testing DSL - Behavior-Driven Test Abstraction

## Overview

A TypeScript testing DSL that expresses user behaviors in natural language, routing to either Cypress (E2E) or React Testing Library (RTL) based on execution context.

---

## Core Philosophy

**Tests describe WHAT the user does, not HOW they do it.**

```typescript
// Instead of imperative:
cy.get('[data-testid="email"]').type('user@example.com');
cy.get('[data-testid="submit"]').click();

// Behavioral:
await user.authenticates({ email: 'user@example.com', password: 'secret' });
await user.sees.dashboard();
```

---

## Architecture

### 1. Action Registry Pattern

Each user story maps to a registered "action" with implementations per adapter:

```typescript
// actions/authenticates.ts
export const authenticates = defineAction({
  name: 'authenticates',
  
  cypress: async (ctx, credentials: Credentials) => {
    cy.visit('/login');
    cy.findByLabelText('Email').type(credentials.email);
    cy.findByLabelText('Password').type(credentials.password);
    cy.findByRole('button', { name: /sign in/i }).click();
    cy.url().should('include', '/dashboard');
  },
  
  rtl: async (ctx, credentials: Credentials) => {
    renderWithProviders(<LoginPage />);
    await userEvent.type(screen.getByLabelText('Email'), credentials.email);
    await userEvent.type(screen.getByLabelText('Password'), credentials.password);
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(ctx.router.location.pathname).toBe('/dashboard');
    });
  },
});
```

### 2. User Actor Interface

```typescript
interface UserActor {
  // Actions (verbs)
  authenticates(credentials: Credentials): Promise<void>;
  navigatesTo(destination: Destination): Promise<void>;
  submits(form: FormName, data: FormData): Promise<void>;
  selects(option: string, from: SelectName): Promise<void>;
  
  // Assertions (sees.*)
  sees: {
    dashboard(): Promise<void>;
    errorMessage(text: string): Promise<void>;
    notification(type: 'success' | 'error', message?: string): Promise<void>;
    loading(): Promise<void>;
  };
  
  // Negative assertions (doesNotSee.*)
  doesNotSee: {
    errorMessage(): Promise<void>;
    loading(): Promise<void>;
  };
}
```

### 3. Context Provider

Handles environment differences (mocking, providers, navigation):

```typescript
interface TestContext {
  // For RTL: mock handlers
  mocks: {
    api: MockAdapter;
    auth: { user?: User; token?: string };
  };
  
  // For navigation assertions
  router: { location: Location; navigate: (path: string) => void };
  
  // Adapter detection
  adapter: 'cypress' | 'rtl';
}
```

### 4. Test File Structure

```typescript
// __tests__/authentication.test.ts
import { scenario, given, when, then } from '@company/test-dsl';

scenario('User signs into the application successfully', () => {
  given.user.isOnLoginPage();
  
  when.user.authenticates({
    email: 'valid@example.com',
    password: 'correctPassword',
  });
  
  then.user.sees.dashboard();
  then.user.sees.notification('success', 'Welcome back!');
});

scenario('User sees error with invalid credentials', () => {
  given.user.isOnLoginPage();
  given.api.willRejectAuthentication();
  
  when.user.authenticates({
    email: 'valid@example.com', 
    password: 'wrongPassword',
  });
  
  then.user.sees.errorMessage('Invalid credentials');
  then.user.doesNotSee.dashboard();
});
```

---

## Key Design Decisions

### Same File, Dual Execution
- Environment detected via `process.env.TEST_ADAPTER` or test runner detection
- Run with: `npm run test:e2e` (Cypress) or `npm run test:unit` (Jest/RTL)

### Assertion Style: Fluent Namespacing
- `user.sees.dashboard()` over `user.seesDashboard()` - better discoverability and grouping

### Mocking Strategy
- RTL: MSW (Mock Service Worker) handlers configured in `given.api.*`
- Cypress: Can intercept or hit real staging API (configurable)

### Element Selection
- Prefer ARIA roles and labels (`getByRole`, `getByLabelText`)
- Fallback to `data-testid` for complex components
- **Never expose CSS selectors in test files** - selectors live in action implementations

---

## File Structure

```
src/
  testing/
    dsl/
      index.ts              # Exports scenario, given, when, then
      createUser.ts         # UserActor factory
      context.ts            # TestContext management
    adapters/
      cypress.adapter.ts
      rtl.adapter.ts
    actions/
      authenticates.ts
      navigatesTo.ts
      submitsForm.ts
    assertions/
      sees/
        dashboard.ts
        errorMessage.ts
        notification.ts
    fixtures/
      users.ts
      apiResponses.ts
```

---

## Open Questions for Team Discussion

1. **Granularity**: Should `authenticates` be a single atomic action, or composed of smaller actions (`fillsEmail`, `fillsPassword`, `submitsLoginForm`)?

2. **Async handling**: Use explicit `await` everywhere, or hide it behind the DSL?

3. **Parameterized fixtures**: `given.user.isAuthenticated()` vs `given.user.isAuthenticated(adminUser)`?

4. **Error recovery**: Should actions auto-retry on flaky elements, or fail fast?

---

## Next Steps

1. Scaffold the DSL core (`defineAction`, adapters, context)
2. Implement 2-3 proof-of-concept actions (auth, navigation, form submission)
3. Write one scenario that runs in both Cypress and Jest/RTL
4. Document patterns for team adoption
