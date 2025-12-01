import { createUser } from './createUser';
import { createContext, resetContext, getContext } from './context';
import { GivenContext, GivenUserContext, GivenApiContext } from './types';

const user = createUser();

function createGivenUserContext(): GivenUserContext {
  return {
    isOnLoginPage: () => {
      const ctx = getContext();
      ctx.router.location.pathname = '/login';
    },
    isAuthenticated: (authUser) => {
      const ctx = getContext();
      ctx.mocks.auth = {
        user: authUser ?? { id: '1', email: 'test@example.com', name: 'Test User' },
        token: 'mock-token',
      };
    },
    isOnPage: (path) => {
      const ctx = getContext();
      ctx.router.location.pathname = path;
    },
  };
}

function createGivenApiContext(): GivenApiContext {
  return {
    willRejectAuthentication: () => {
      const ctx = getContext();
      ctx.mocks.api.addHandler('/auth/login', { status: 401, body: { error: 'Invalid credentials' } });
    },
    willSucceed: (endpoint, response) => {
      const ctx = getContext();
      ctx.mocks.api.addHandler(endpoint, { status: 200, body: response });
    },
    willFail: (endpoint, status, error) => {
      const ctx = getContext();
      ctx.mocks.api.addHandler(endpoint, { status, body: error ?? { error: 'Request failed' } });
    },
  };
}

export const given: GivenContext = {
  user: createGivenUserContext(),
  api: createGivenApiContext(),
};

export const when = { user };
export const then = { user };

export function scenario(name: string, fn: () => void | Promise<void>): void {
  const testFn = typeof describe !== 'undefined' ? describe : (global as any).describe;
  const itFn = typeof it !== 'undefined' ? it : (global as any).it;
  
  if (testFn && itFn) {
    testFn(name, () => {
      beforeEach(() => {
        createContext();
      });
      
      afterEach(() => {
        resetContext();
      });
      
      itFn('executes scenario', async () => {
        await fn();
      });
    });
  } else {
    console.warn('No test runner detected. Running scenario directly.');
    createContext();
    Promise.resolve(fn()).finally(resetContext);
  }
}

export { createUser } from './createUser';
export { defineAction, defineAssertion } from './defineAction';
export { createContext, getContext, resetContext } from './context';
export * from './types';
