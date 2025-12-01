import { UserActor, SeesAssertions, DoesNotSeeAssertions } from './types';
import { authenticates } from '../actions/authenticates';
import { navigatesTo } from '../actions/navigatesTo';
import { 
  seesDashboard, 
  seesErrorMessage, 
  seesNotification, 
  seesLoading,
  seesText 
} from '../assertions/sees';
import { 
  doesNotSeeErrorMessage, 
  doesNotSeeLoading,
  doesNotSeeText 
} from '../assertions/doesNotSee';

function createSeesAssertions(): SeesAssertions {
  return {
    dashboard: seesDashboard,
    errorMessage: seesErrorMessage,
    notification: seesNotification,
    loading: seesLoading,
    text: seesText,
  };
}

function createDoesNotSeeAssertions(): DoesNotSeeAssertions {
  return {
    errorMessage: doesNotSeeErrorMessage,
    loading: doesNotSeeLoading,
    text: doesNotSeeText,
  };
}

export function createUser(): UserActor {
  return {
    authenticates,
    navigatesTo,
    sees: createSeesAssertions(),
    doesNotSee: createDoesNotSeeAssertions(),
  };
}
