import { UIState } from './ui.state';
import { UIActions } from './ui.action';

export function uiReducer(state: UIState.IState = UIState.initialState, action: UIActions.Actions): UIState.IState {
  switch (action.type) {
    case UIActions.Types.CHANGED:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
