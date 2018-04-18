import { Injectable } from '@angular/core';
import { Route, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanLoad } from '@angular/router';
// libs
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { take, takeUntil } from 'rxjs/operators';
import { from } from 'rxjs/observable/from';
import { User } from '@sketchpoints/api';
// app
import { UserService } from './user.service';
import { UserActions } from '../state/user.action';
import { UserState } from '../state/user.state';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  private _resolved$: Subject<boolean>;

  constructor(private _store: Store<any>, private _router: Router, private _userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const resolved$ = new Subject();
      this._userService.userInitialized$.pipe(takeUntil(resolved$)).subscribe(_ => {
        this._store.pipe(select(UserState.selectCurrent), take(1)).subscribe((user: User) => {
          if (user) {
            // user is authenticated
            resolved$.next(true);
            resolved$.complete();
            resolve(true);
          } else {
            if (routerState) {
              // pass along url that was being attempted
              this._store.dispatch(new UserActions.UnauthorizedUrl(routerState.url));
            }

            resolved$.next(true);
            resolved$.complete();
            // for now just redirect to home
            this._router.navigate(['/']);
            resolve(false);
          }
        });
      });
    });
  }

  canLoad(route: Route): Promise<boolean> {
    // reuse same logic to activate
    return this.canActivate(null, null);
  }
}
