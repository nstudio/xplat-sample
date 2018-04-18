// angular
import { Injectable, forwardRef, Inject } from '@angular/core';
// libs
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import {
  map,
  startWith,
  switchMap,
  concatMap,
  mergeMap,
  exhaustMap,
  withLatestFrom,
  catchError,
  tap
} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { User } from '@sketchpoints/api';
import { Tracking, isObject, isString, isNativeScript } from '@sketchpoints/utils';
// module
import { LogService } from '../services/log.service';
import { WindowService } from '../services/window.service';
import { UserService } from '../services/user.service';
import { UserActions } from './user.action';
import { UserState } from './user.state';

@Injectable()
export class UserEffects {
  @Effect()
  login$ = this._actions$.pipe(
    ofType(UserActions.Types.LOGIN),
    concatMap((action: UserActions.Login) =>
      this._user
        .checkLogin(action.payload)
        .pipe(map(user => new UserActions.LoginSuccess(user)), catchError(err => of(new UserActions.LoginFailure(err))))
    )
  );

  @Effect()
  loginSuccess$ = this._actions$.pipe(
    ofType(UserActions.Types.LOGIN_SUCCESS),
    map((action: UserActions.LoginSuccess) => {
      // for now, default to always using firebase auth
      this._user.isFirebaseAuth = true;
      return new UserActions.Changed({ current: action.payload });
    })
  );

  @Effect()
  logout$ = this._actions$.pipe(
    ofType(UserActions.Types.LOGOUT),
    map((action: UserActions.Logout) => {
      return new UserActions.Changed({ current: null });
    })
  );

  @Effect()
  loginFailure$ = this._actions$.pipe(
    ofType(UserActions.Types.LOGIN_FAILURE),
    map(user => {
      return new UserActions.Changed({ current: null });
    })
  );

  @Effect()
  update$ = this._actions$.pipe(
    ofType(UserActions.Types.UPDATE),
    withLatestFrom(this._store.pipe(select(UserState.selectCurrent))),
    concatMap(([action, user]: [UserActions.Update, User]) =>
      this._user.update(user.id, action.payload).pipe(
        map((user: User) => new UserActions.Changed({ current: user })),
        catchError(err => of(new UserActions.ApiError(err)))
      )
    )
  );

  @Effect()
  init$ = this._actions$.pipe(
    ofType(UserActions.Types.INIT),
    startWith(new UserActions.Init()),
    concatMap((action: UserActions.Init) =>
      this._user.getCurrentUser().pipe(
        map(user => new UserActions.Changed({ current: user })),
        catchError(err => of( new UserActions.ApiError( err ) ))
      )
    )
  );

  constructor(
    private _store: Store<UserState.IState>,
    private _actions$: Actions,
    @Inject(forwardRef(() => LogService))
    private _log: LogService,
    @Inject(forwardRef(() => WindowService))
    private _win: WindowService,
    private _user: UserService,
  ) {}
}
