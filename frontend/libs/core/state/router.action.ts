import { Action } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';

export namespace RouterActions {
  export enum Types {
    GO = '[@sketchpoints/router] Go',
    BACK = '[@sketchpoints/router] Back',
    FORWARD = '[@sketchpoints/router] Forward'
  }

  export class Go implements Action {
    readonly type = Types.GO;

    constructor(
      public payload: {
        path: any[];
        query?: object;
        extras?: NavigationExtras;
      }
    ) {}
  }

  export class Back implements Action {
    readonly type = Types.BACK;
  }

  export class Forward implements Action {
    readonly type = Types.FORWARD;
  }

  export type Actions = Go | Back | Forward;
}
