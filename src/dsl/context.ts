import { AdapterType, TestContext, MockApiConfig } from './types';

let currentContext: TestContext | null = null;

function detectAdapter(): AdapterType {
  if (typeof window !== 'undefined' && 'Cypress' in window) {
    return 'cypress';
  }
  if (process.env.TEST_ADAPTER === 'cypress') {
    return 'cypress';
  }
  return 'rtl';
}

function createMockApi(): MockApiConfig {
  const handlers = new Map();
  return {
    handlers,
    addHandler: (pattern, handler) => handlers.set(pattern, handler),
  };
}

export function createContext(): TestContext {
  const adapter = detectAdapter();
  
  currentContext = {
    adapter,
    mocks: {
      api: createMockApi(),
      auth: {},
    },
    router: {
      location: { pathname: '/' },
      navigate: (path: string) => {
        if (currentContext) {
          currentContext.router.location.pathname = path;
        }
      },
    },
  };
  
  return currentContext;
}

export function getContext(): TestContext {
  if (!currentContext) {
    return createContext();
  }
  return currentContext;
}

export function resetContext(): void {
  currentContext = null;
}
