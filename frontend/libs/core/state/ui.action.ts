import { Action } from '@ngrx/store';
import { UIState } from './ui.state';

export namespace UIActions {
  export enum Types {
    CHANGED = '[@sketchpoints/ui] Changed'
  }

  export class Changed implements Action {
    type = Types.CHANGED;

    constructor(public payload: UIState.IState) {}
  }

  export type Actions = Changed;
}
