import { Action } from '@ngrx/store';
import { ModalState } from './modal.state';

export namespace ModalActions {
  export enum Types {
    OPEN = '[@sketchpoints/modal] Open',
    OPENED = '[@sketchpoints/modal] Opened',
    CLOSE = '[@sketchpoints/modal] Close',
    CLOSED = '[@sketchpoints/modal] Closed'
  }

  export class Open implements Action {
    type = Types.OPEN;

    constructor(public payload: ModalState.IOptions) {}
  }

  export class Opened implements Action {
    type = Types.OPENED;

    constructor(public payload: ModalState.IState) {}
  }

  export class Close implements Action {
    type = Types.CLOSE;

    /**
     * @param payload any object or for mobile, the ModalDialogParams as params and optional value to pass back
     */
    constructor(public payload?: any | { params: any; value?: any }) {}
  }

  export class Closed implements Action {
    type = Types.CLOSED;

    constructor(public payload?: ModalState.IState) {}
  }

  export type Actions = Open | Opened | Close | Closed;
}
