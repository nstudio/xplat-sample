import { Action } from '@ngrx/store';
import { LocaleState } from './locale.state';

export namespace LocaleActions {
  export enum Types {
    INIT = '[@sketchpoints/locale] Init',
    SET = '[@sketchpoints/locale] Set',
    SET_SUCCESS = '[@sketchpoints/locale] Set Success'
  }

  export class Init implements Action {
    type: string = Types.INIT;
    payload: string = null;
  }

  export class Set implements Action {
    type: string = Types.SET;

    constructor(public payload: LocaleState.Locale) {}
  }

  export class SetSuccess implements Action {
    type: string = Types.SET_SUCCESS;

    constructor(public payload: LocaleState.Locale) {}
  }

  export type Actions = Init | Set | SetSuccess;
}
