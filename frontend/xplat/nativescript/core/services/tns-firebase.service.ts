import { Injectable, Inject, NgZone } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map } from 'rxjs/operators';
import { FirebaseService, PlatformFirebaseToken, LogService, WindowService } from '@sketchpoints/core';
import { fileNameFromPath, isObject } from '@sketchpoints/utils';
import { File } from 'tns-core-modules/file-system';

@Injectable()
export class TNSFirebaseService extends FirebaseService {
  
  constructor(
    protected _store: Store<any>,
    protected _ngZone: NgZone,
    protected _translate: TranslateService,
    protected _log: LogService,
    protected _win: WindowService,
    @Inject(PlatformFirebaseToken) protected _firebase: any,
  ) {
    super(
      _store,
      _ngZone,
      _translate,
      _log, 
      _win,
    );
    this.loginTypes = {
      google: this._firebase.LoginType.GOOGLE,
      facebook: this._firebase.LoginType.FACEBOOK
    };
  }

  // all thats supported right now
  public googleConnect() {
    this._socialLogin({
      type : this.loginTypes.google
    });
  }

  public facebookConnect() {
    this._socialLogin({
      type : this.loginTypes.facebook,
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

    this._firebase.logout().then(() => {
      // ensure any prior Firebase sessions are cleared
      // most often case if user logging out of one social account
      // and into another.
      this._firebase.login(options).then((result: any) => {
        if ( result ) {
          this.getUserToken().then((token: string) => {
            if ( token ) {
              // social connect flow
              this.connectToken(token, result);
            } else {
              this._showAlert('{N} Firebase plugin did not return a token.');
            }
          }, (errorMessage: any) => {
            this._showAlert(`{N} Firebase plugin Auth token retrieval error: ${errorMessage}`);
            this._log.debug(errorMessage);
          });
        } else {
          this._showAlert('{N} Firebase login did not return a result.');
        }
      }, (errorMessage: any) => {
        // this._showAlert(`{N} Firebase login failed: ${errorMessage}`);
        this._log.debug(errorMessage);
      });
    });
  }

  public getUserToken(force: boolean = false): Promise<string> {
    return new Promise((resolve, reject) => {
      this._firebase.getAuthToken({
        forceRefresh : force, 
      }).then((token: string) => {
        resolve(token);
      }, err => {
        reject(err);
      });
    });
  }

  public logout() {
    this._firebase.logout();
  }

  private _showAlert(
    message: string,
    title?: string,
  ): Promise<any> {
    return new Promise((resolve) => {
      const alertOptions: any = {
        message,
        okButtonText : this._translate.instant('dialogs.ok'),
      };
      if ( title ) {
        alertOptions.title = title;
      }
      this._win.alert(<any>alertOptions).then(_ => resolve());
    });
  }

  private _listenSub: any;
  public listenForChanges(name: string, queryParams?: Array<{name: string; comparator: string; value: any}>): Observable<any> {
    if (this._listenSub) {
      this._listenSub();
      this._listenSub = null;
    }
    let query = this._firebase.firestore.collection(name);
    if (queryParams) {
      for (const param of queryParams) {
        query = query.where(param.name, param.comparator, param.value);
      }
    }
    return Observable.create(observer => {
      this._listenSub = query.onSnapshot((snapshot: any) => {
        const results = [];
        if (snapshot && snapshot.forEach) {
          snapshot.forEach(doc => results.push({
            id: doc.id,
            ...doc.data()
          }));
        } 
        observer.next(results);
      });
    });
  }

  public upload(localPath: string, remotePath: string) {
    return new Promise((resolve, reject) => {
      this._firebase.uploadFile({
        localFullPath: localPath,
        remoteFullPath: remotePath,
        onProgress: (status) => {
          this._log.debug('Uploaded fraction: ' + status.fractionCompleted);
          this._log.debug('Percentage complete: ' + status.percentageCompleted);
        }
      }).then((file) => {
        // this._log.debug(JSON.stringify(file));
        resolve(file.url);
      }, err => {
        this._log.debug('fileupload error:', err);
        reject(err);
      });
    });
  }

  public download(remotePath: string, localPath: any) {
    return new Promise((resolve, reject) => {
      this._firebase.downloadFile({
        remoteFullPath: remotePath,
        localFullPath: localPath,
        onProgress: (status) => {
          this._log.debug('Downloaded fraction: ' + status.fractionCompleted);
          this._log.debug('Download complete: ' + status.percentageCompleted);
        }
      }).then(file => {
        // this._log.debug(JSON.stringify(file));
        resolve(file);
      }, err => {
        this._log.debug('file download error:', err);
        reject(err);
      });
    });
  }
}