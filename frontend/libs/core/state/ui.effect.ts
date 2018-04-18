// angular
import { Injectable, forwardRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
// libs
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { map, startWith, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
// module
import { Tracking } from '@sketchpoints/utils';
import { LogService } from '../services/log.service';
import { ModalService } from '../services/modal.service';
import { LocaleService } from '../services/locale.service';
import { LocaleActions } from './locale.action';
import { ModalActions } from './modal.action';
import { RouterActions } from './router.action';
import { UIActions } from './ui.action';

@Injectable()
export class UIEffects {
  @Effect()
  localeSet$ = this._actions$.pipe(
    ofType(LocaleActions.Types.SET),
    map((action: LocaleActions.Set) => {
      this._localeService.locale = action.payload;
      this._translateService.use(action.payload);
      return new LocaleActions.SetSuccess(action.payload);
    })
  );

  @Effect()
  localeSetSuccess$ = this._actions$.pipe(
    ofType(LocaleActions.Types.SET_SUCCESS),
    map((action: LocaleActions.SetSuccess) => {
      return new UIActions.Changed({
        locale: action.payload
      });
    })
  );

  @Effect()
  modalOpen$: Observable<Action> = this._actions$.pipe(
    ofType(ModalActions.Types.OPEN),
    map((action: ModalActions.Open) => {
      this._log.debug('calling modal.open');
      const details = this._modal.open(action.payload);
      return new ModalActions.Opened({
        open: true,
        cmpType: details.cmpType,
        title: details.trackTitle,
        latestResult: null // reset when opening
      });
    })
  );

  @Effect()
  modalOpened$: Observable<Action> = this._actions$.pipe(
    ofType(ModalActions.Types.OPENED),
    map(
      (action: ModalActions.Opened) =>
        new UIActions.Changed({
          modal: action.payload
        })
    )
  );

  @Effect()
  modalClose$: Observable<Action> = this._actions$.pipe(
    ofType(ModalActions.Types.CLOSE),
    map((action: ModalActions.Close) => {
      const closeResult = this._modal.close(action.payload);
      return new ModalActions.Closed({
        open: false,
        cmpType: null,
        title: null,
        // keep null values to be consistent (instead of undefined)
        latestResult: typeof closeResult === 'undefined' ? null : closeResult
      });
    })
  );

  @Effect()
  modalClosed$: Observable<Action> = this._actions$.pipe(
    ofType(ModalActions.Types.CLOSED),
    map(
      (action: ModalActions.Closed) =>
        new UIActions.Changed({
          modal: action.payload
        })
    )
  );

  @Effect({ dispatch: false })
  navigate$ = this._actions$.pipe(
    ofType(RouterActions.Types.GO),
    map((action: RouterActions.Go) => action.payload),
    tap(({ path, query: queryParams, extras }) => this._router.navigate(path, { queryParams, ...extras }))
  );

  @Effect({ dispatch: false })
  navigateBack$ = this._actions$.pipe(ofType(RouterActions.Types.BACK), tap(() => this._location.back()));

  @Effect({ dispatch: false })
  navigateForward$ = this._actions$.pipe(ofType(RouterActions.Types.FORWARD), tap(() => this._location.forward()));

  // Any startWith observables - Should always BE LAST!
  @Effect()
  localeInit$ = this._actions$.pipe(
    ofType(LocaleActions.Types.INIT),
    startWith(new LocaleActions.Init()),
    map((action: LocaleActions.Init) => {
      this._translateService.setDefaultLang('en');
      return new LocaleActions.Set(this._localeService.locale);
    })
  );

  constructor(
    private _store: Store<any>,
    private _actions$: Actions,
    @Inject(forwardRef(() => ModalService))
    private _modal: ModalService,
    @Inject(forwardRef(() => LogService))
    private _log: LogService,
    @Inject(forwardRef(() => LocaleService))
    private _localeService: LocaleService,
    private _translateService: TranslateService,
    private _router: Router,
    private _location: Location
  ) {}
}
