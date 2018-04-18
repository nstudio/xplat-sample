import { TagState } from './tag.state';
import { TagActions } from './tag.action';

export function reducer(state: TagState.IState = TagState.initialState, action: TagActions.Actions): TagState.IState {
  switch (action.type) {
    case TagActions.Types.CHANGED:
      return { ...state, ...action.payload };

    default:
      return state;
  }
}
