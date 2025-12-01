# MyTest DSL

Behavior-driven testing DSL that routes to Cypress or React Testing Library.

## This is a proposal

The MY frontend is poised for a massive overhaul, which gives us a nice opportunity to rethink our testing strategy.

With this approach, we can start with a user story, implement it in tests, and have those tests run in both E2E and unit/integration contexts without duplicating effort.

## Overview

**Core idea**: Write tests that describe *what* the user does, not *how* they do it. The same test runs in both Cypress (E2E) and React Testing Library (unit/integration).

```typescript
import { constants, scenario, given, when, then } from '@mytest/dsl';

scenario('User signs in successfully', async () => {
  given.user.isOnLoginPage();
  
  await when.user.authenticates({
    email: constants.TEST_USER_EMAIL,
    password: constants.TEST_USER_PASSWORD,
  });
  
  await then.user.sees.dashboard();
});
```

**Key components**:
- `scenario` / `given` / `when` / `then` - BDD-style test structure
- `defineAction()` - Register actions with separate Cypress & RTL implementations
- Auto-detection of test environment (Cypress vs Jest/Vitest)

**Benefits**:
- Tests read like user stories
- Implementation details hidden from test files
- One test file, two execution contexts
- Consistent patterns across the team

## Future: Cucumber/Gherkin Integration

We could take this one step further by adopting **Cucumber/Gherkin** syntax via `@badeball/cypress-cucumber-preprocessor`. This would allow non-developers (QA, product) to write or read test scenarios in plain English `.feature` files:

```gherkin
Feature: Authentication

  Scenario: User signs in successfully
    Given the user is on the login page
    When the user authenticates with valid credentials
    Then the user sees the dashboard
```

Our DSL would then serve as the step definition layer, still routing to Cypress or RTL under the hood. Worth discussing if we want that level of abstraction.

---

For the full architecture and design decisions, see [the spec document](./SPEC.md).
