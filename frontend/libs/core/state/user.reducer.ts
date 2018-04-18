import { UserState } from './user.state';
import { UserActions } from './user.action';

export function userReducer(
  state: UserState.IState = UserState.initialState,
  action: UserActions.Actions
): UserState.IState {
  switch (action.type) {
    case UserActions.Types.CHANGED:
      return { ...state, ...action.payload };

    default:
      return state;
  }
}
