export type AdapterType = 'cypress' | 'rtl';

export interface Credentials {
  email: string;
  password: string;
}

export interface TestContext {
  adapter: AdapterType;
  mocks: {
    api: MockApiConfig;
    auth: { user?: User; token?: string };
  };
  router: {
    location: { pathname: string };
    navigate: (path: string) => void;
  };
}

export interface MockApiConfig {
  handlers: Map<string, MockHandler>;
  addHandler: (pattern: string, handler: MockHandler) => void;
}

export interface MockHandler {
  status: number;
  body: unknown;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export interface ActionDefinition<TArgs extends unknown[] = unknown[]> {
  name: string;
  cypress: (ctx: TestContext, ...args: TArgs) => Promise<void> | void;
  rtl: (ctx: TestContext, ...args: TArgs) => Promise<void>;
}

export interface UserActor {
  authenticates(credentials: Credentials): Promise<void>;
  navigatesTo(path: string): Promise<void>;
  sees: SeesAssertions;
  doesNotSee: DoesNotSeeAssertions;
}

export interface SeesAssertions {
  dashboard(): Promise<void>;
  errorMessage(text: string): Promise<void>;
  notification(type: 'success' | 'error', message?: string): Promise<void>;
  loading(): Promise<void>;
  text(text: string): Promise<void>;
}

export interface DoesNotSeeAssertions {
  errorMessage(): Promise<void>;
  loading(): Promise<void>;
  text(text: string): Promise<void>;
}

export interface GivenContext {
  user: GivenUserContext;
  api: GivenApiContext;
}

export interface GivenUserContext {
  isOnLoginPage(): void;
  isAuthenticated(user?: User): void;
  isOnPage(path: string): void;
}

export interface GivenApiContext {
  willRejectAuthentication(): void;
  willSucceed(endpoint: string, response: unknown): void;
  willFail(endpoint: string, status: number, error?: unknown): void;
}
