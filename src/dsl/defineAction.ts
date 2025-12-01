import { ActionDefinition, TestContext } from './types';
import { getContext } from './context';

export function defineAction<TArgs extends unknown[]>(
  definition: ActionDefinition<TArgs>
): (...args: TArgs) => Promise<void> {
  return async (...args: TArgs): Promise<void> => {
    const ctx = getContext();
    
    if (ctx.adapter === 'cypress') {
      await definition.cypress(ctx, ...args);
    } else {
      await definition.rtl(ctx, ...args);
    }
  };
}

export function defineAssertion<TArgs extends unknown[]>(
  definition: ActionDefinition<TArgs>
): (...args: TArgs) => Promise<void> {
  return defineAction(definition);
}
