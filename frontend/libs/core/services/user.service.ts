import { Injectable } from '@angular/core';

// libs
import { Store, select } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { skip, take, map } from 'rxjs/operators';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { ApiUser, User } from '@sketchpoints/api';
import { diffInMins } from '@sketchpoints/utils';

// app
import { environment } from '../environments/environment';
import { UserActions } from '../state/user.action';
import { UserState } from '../state/user.state';
import { LogService } from './log.service';
import { FirebaseService } from './firebase.service';

/**
 * This is organized in this module just for good housekeeping
 * However it is provided via the CoreModule to ensure it's
 * a singleton the entire app can use.
 * If your module service is *only* used in this module
 * you can have the service provided by this module.
 * In this case however, we want this service to be a true singleton
 * which can be injected into any component/service anywhere and
 * it will be the same instance therefore this is provided by the CoreModule.
 */
@Injectable()
export class UserService {
  // init helpers
  private _userInitialized: BehaviorSubject<boolean> = new BehaviorSubject(false);
  // for convenient binding
  private _current: User;
  private _init = false;
  private _isFirebaseAuth = false;

  constructor(
    private _store: Store<UserState.IState>,
    private _log: LogService,
    private _apiUser: ApiUser,
    private _firebase: FirebaseService,
  ) {

    this._store
      .pipe(
        select(UserState.selectCurrent),
        skip(1) // ignore the wiring, only listen to effect chain reaction
      )
      .subscribe((user: User) => {
        this.current = user;
      });
  }

  public get userInitialized$() {
    return this._userInitialized;
  }

  public get currentUserId() {
    return this._current ? this._current.id : null;
  }

  public get currentUsername() {
    return this._current ? this._current.username : null;
  }

  public get current() {
    return this._current;
  }

  public set current(value: User) {
    this._current = value;
    if (!value || (this._current && value && this._current.id !== value.id)) {
      // fire user initialized anytime this changes (helps with boot phase handling)
      this._userInitialized.next(true);
    }
  }

  public get isFirebaseAuth() {
    return this._isFirebaseAuth;
  }

  public set isFirebaseAuth(value: boolean) {
    this._isFirebaseAuth = value;
  }

  public update(id: string, updates: Partial<User>) {
    return this._apiUser.updateUser(id, updates);
  }

  public logout() {
    this._store.dispatch(new UserActions.Logout());
    if (this.isFirebaseAuth) {
      this._firebase.logout();
    }
    return null;
  }

  public login(cred: { email: string; password?: string }) {
    this._store.dispatch(new UserActions.Login(cred));
  }

  public checkLogin(cred: { email: string; password?: string }) {
    return this.getCurrentUser(cred.email, cred.password);
  }

  public getProfile(usernameArg: string) {
    // init api
    if (this.current && (this.current.username === usernameArg || this.current.email === usernameArg)) {
      return this.getCurrentUser();
    } else {
      // requesting another user account
      return this._apiUser
        .getUser({
          match: {
            username: usernameArg
          }
        })
        .pipe(
          map(user => {
            this._log.debug('fetched a user account:', user ? JSON.stringify(user) : user);
            return user;
          })
        );
    }
  }

  // can be used to fetch profile of another user
  public getCurrentUser(usernameArg?: string, tokenArg?: string) {
    if (
      (this.current && !usernameArg) ||
      (this.current && (this.current.username === usernameArg || this.current.email === usernameArg))
    ) {
      // already cached on the state model
      return this._store.pipe(
        select(UserState.selectCurrent),
        take(1),
        map(user => {
          if (user) {
            // for now, default to always assume it's firebase auth
            this.isFirebaseAuth = true;
          }
          return user;
        })
      );
    } else {
      let username = usernameArg;
      let token = tokenArg;
      
      return this._loadUser(username, token);
    }
  }

  private _loadUser(username?: string, token?: string) {
    this._setApiUserToken(token);
    if (username && token) {
      return this._apiUser.me().pipe(
        map(user => {
          if (user) {
            // for now, default to always assume it's firebase auth
            this.isFirebaseAuth = true;
          }
          return user;
        })
      );
    } else {
      return of(null);
    }
  }

  public persistToken(token: string) {
    this._setApiUserToken(token);
  }

  private _setApiUserToken(token?: string) {
    ApiUser.token = {
      date: Date.now(),
      value: token
    };
  }

  public clearToken() {
    ApiUser.token = null;
  }
}
