import { Action } from '@ngrx/store';
import { User } from '@sketchpoints/api';
import { UserState } from './user.state';

export namespace UserActions {
  export enum Types {
    INIT = '[@sketchpoints/user] Init',
    LOGIN = '[@sketchpoints/user] Login',
    LOGIN_SUCCESS = '[@sketchpoints/user] Login success',
    LOGIN_FAILURE = '[@sketchpoints/user] Login failure',
    REAUTH = '[@sketchpoints/user] ReAuth',
    LOGOUT = '[@sketchpoints/user] Logout',
    UNAUTHORIZED_URL = '[@sketchpoints/user] Unauthorized url',
    UPDATE = '[@sketchpoints/user] Update',
    CREATE_DONATION = '[@sketchpoints/user] Create Donation',
    GET_DONATIONS = '[@sketchpoints/user] Get Donations',
    API_ERROR = '[@sketchpoints/user] Api error',
    CHANGED = '[@sketchpoints/user] Changed'
  }

  export class Init implements Action {
    readonly type = Types.INIT;
  }

  export class Login implements Action {
    readonly type = Types.LOGIN;
    constructor(public payload: { email: string; password?: string }) {}
  }

  export class LoginSuccess implements Action {
    readonly type = Types.LOGIN_SUCCESS;
    constructor(public payload: User) {}
  }

  export class LoginFailure implements Action {
    readonly type = Types.LOGIN_FAILURE;
    constructor(public payload: any) {}
  }

  export class ReAuth implements Action {
    readonly type = Types.REAUTH;
  }

  export class Logout implements Action {
    readonly type = Types.LOGOUT;
  }

  export class UnauthorizedUrl implements Action {
    readonly type = Types.UNAUTHORIZED_URL;
    constructor(public payload: string /* path */) {}
  }

  export class Update implements Action {
    readonly type = Types.UPDATE;
    constructor(public payload: User) {}
  }

  export class CreateDonation implements Action {
    readonly type = Types.CREATE_DONATION;
    constructor(public payload: string /* productId */) {}
  }

  export class GetDonations implements Action {
    readonly type = Types.GET_DONATIONS;
  }

  export class ApiError implements Action {
    readonly type = Types.API_ERROR;
    constructor(public payload: any) {}
  }

  export class Changed implements Action {
    readonly type = Types.CHANGED;
    constructor(public payload: UserState.IState) {}
  }

  export type Actions = Init | Login | LoginSuccess | LoginFailure | Logout | Update | ApiError | Changed;
}
