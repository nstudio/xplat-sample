import { Injectable, Inject, NgZone } from '@angular/core';

import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { LogService, WindowService, PlatformFirebaseToken, FirebaseService } from '@sketchpoints/core';
import { Tracking, capitalize } from '@sketchpoints/utils';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { FacebookAuthProvider, GoogleAuthProvider } from '@firebase/auth-types';

@Injectable()
export class FirebaseWebService extends FirebaseService {

  private _doubleFireTimeout: number;

  constructor(
    protected _store: Store<any>,
    protected _ngZone: NgZone,
    protected _translate: TranslateService,
    protected _log: LogService,
    protected _win: WindowService,
    @Inject(PlatformFirebaseToken) protected _firebase: any,
    protected _afAuth: AngularFireAuth,
    protected _afStore: AngularFirestore,
  ) {
    super(
      _store,
      _ngZone,
      _translate,
      _log, 
      _win,
    );
    this.loginTypes = {
      google: this._firebase.auth.GoogleAuthProvider,
      facebook: this._firebase.auth.FacebookAuthProvider
    };
  }

  // all thats supported right now
  public googleConnect() {
    this._socialLogin({
      type: 'google'
    });
  }

  public facebookConnect() {
    this._socialLogin({
      type : 'facebook',
      facebookOptions : {
        scope : [
          'public_profile',
          'email',
          'user_photos',
        ],
      },
    });
  }

  private _socialLogin(options?: any) {
    super.socialLogin(options);
    const provider = options.type;

    let firebaseProvider: FacebookAuthProvider | GoogleAuthProvider = null;
    switch ( provider ) {
      case 'facebook':
        firebaseProvider = new this.loginTypes.facebook();
        for (const scope of options.facebookOptions.scope) {
          firebaseProvider.addScope(scope);
        }
        break;
      case 'google':
        firebaseProvider = new this.loginTypes.google();
        break;
    }
    this._afAuth.auth.signInWithPopup(firebaseProvider).then(res => {
      // this._log.debug('afAuth.auth.signInWithPopup result:', res);
      this.getUserToken().then(token => {
      // this._afAuth.idToken.subscribe(token => {
        if (typeof this._doubleFireTimeout === 'undefined') {
          this._doubleFireTimeout = this._win.setTimeout(_ => {
            this.connectToken(token, res.user);
            this._doubleFireTimeout = undefined;
          }, 300);
        }
      }, (err: any) => {
        this._handleSocialError(err, provider);
      });
    }, (err: any) => {
      this._handleSocialError(err, provider);
    });
  }

  public getUserToken(): Promise<string> {
    // must implement in platform specific service
    return new Promise(resolve => {
      if (this._afAuth.auth && this._afAuth.auth.currentUser) {
        this._afAuth.auth.currentUser.getIdToken(true)
          .then(token => {
            resolve(token);
          }, (err: any) => {
            resolve(null);
          });
      } else {
        resolve(null);
      }
    });
  }

  public logout() {
    this._afAuth.auth.signOut();
  }

  public upload(localPath: string, remotePath: string) {
    return new Promise((resolve, reject) => {
      // TODO: for web
    });
  }

  public listenForChanges(name: string, queryParams?: Array<{name: string; comparator: string; value: any}>): Observable<any> {
    return this._afStore.collection(name, ref => {
      let query: any = ref;
      if (queryParams) {
        for (const param of queryParams) {
          query = query.where(param.name, param.comparator, param.value);
        }
      }
      return query;
    }).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      }) 
    );
  }

  private _handleSocialError(
    err: any,
    provider: string,
  ) {
    if ( err && err.message && err.code ) {
      let message = err.message;
      if ( err.code.indexOf('account-exists') > -1 ) {
        message = `${this._translate.instant('alert.attempt-txt')} ${capitalize(provider)} ${this._translate.instant(
          'alert.using-txt',
        )}
                '${err.email}' ${this._translate.instant('login.email-lbl-2')}.
                 ${message}`;
      }
      if ( message.indexOf('USER_CANCELLED') > -1 ) {
        message = `${this._translate.instant('login.FBcancel-txt')}`;
      }
      if (
        message &&
        message.indexOf('popup has been closed') === -1 &&
        message.indexOf('operation has been cancelled') === -1
      ) {
        // ensure various messages are suppressed and ignored
        this._win.alert(message);
      }
    }
  }
}