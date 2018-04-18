// angular
import { Injectable, Inject, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

// nativescript
import * as tnsApp from 'tns-core-modules/application';
import * as tnsUtils from 'tns-core-modules/utils/utils';
import { device, isIOS, isAndroid } from 'tns-core-modules/platform';
import { Color } from 'tns-core-modules/color';
import { DeviceOrientation } from 'tns-core-modules/ui/enums';
import { Page } from 'tns-core-modules/ui/page';
import { RouterExtensions } from 'nativescript-angular/router';
import * as TNSFirebase from 'nativescript-plugin-firebase';

// libs
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { User } from '@sketchpoints/api';
import { LogService, WindowService, PlatformFirebaseToken, UserState, environment } from '@sketchpoints/core';
import { IHelpTip } from '@sketchpoints/features';

/**
 * This service can be used for low level app wiring
 * for best practice purposes, this service sets up:
 * - app version
 * - orientation handling including a Subject the app can observe
 * - deviceType to help component bindings
 * - example of global app event wiring for resume/suspend
 */
@Injectable()
export class AppService {

  // fundamentals
  private _appVersion: string;
  private _appName: string;
  
  // app launch handling
  public static routeToUrlOnLaunch$: BehaviorSubject<string> = new BehaviorSubject(null);
  private _launchInit = false;

  // orientation helper
  private _orientation: string;
  private _orientation$: Subject<any> = new Subject();
  private _deviceType: 'Phone' | 'Tablet';

  // auth helpers
  private _initUser: boolean;
  private _user: User; // convenient accessor
  // Firebase
  private _isFirebaseLoggedIn: boolean;
  private _pushTokenPosted: boolean;

  // device helpers
  private _iPhoneX: boolean;

  constructor(
    private _store: Store<any>,
    private _router: RouterExtensions,
    private _ngRouter: Router,
    private _ngZone: NgZone,
    private _log: LogService,
    private _win: WindowService,
    @Inject(PlatformFirebaseToken) private _firebase: any,
  ) {
    // initialize core services
    this._initAppVersion();
    this._initOrientation();
    this._initAppEvents();
    this._initUserSubscription();
  }

  public get orientation() {
    return this._orientation;
  }

  public set orientation(value) {
    this._log.debug('setting orientation:', value);
    this._orientation = value;
    this._orientation$.next(value);
  }

  public get orientation$() {
    return this._orientation$;
  }

  public get deviceType() {
    return this._deviceType;
  }

  public get user() {
    return this._user;
  }

  public get appVersion() {
    return this._appVersion;
  }

  public set appName(value: string) {
    this._appName = value;
  }

  public get appName() {
    return this._appName;
  }

  public initFirebase() {
    // TODO: base setting on config
    const app = environment.firebase.storageBucket;
    const initOptions: TNSFirebase.InitOptions = {
      storageBucket: `gs://${app}`,
      // Optionally pass in properties for database, authentication and cloud messaging,
      // see their respective docs and 'iOSEmulatorFlush' to flush token before init.
      // TODO
      // iOSEmulatorFlush: true,
      onAuthStateChanged: (data: any) => {
        this._log.debug('Firebase onAuthStateChanged:', data.loggedIn);
      },
    };

    this._firebase.init(initOptions)
        .then(
          instance => {
            this._log.debug('Firebase plugin initialized.');
          },
          error => {
            this._log.debug('Firebase plugin initialization failed.');
          },
        );
  }

  public disableRowColor(e) {
    if ( isIOS && e ) {
      let cell = e.ios;
      if ( cell ) {
        cell.selectionStyle = UITableViewCellSelectionStyle.None;
        if ( cell.backgroundView ) {
          cell.backgroundView.backgroundColor = new Color(0, 255, 0, 0).ios;
        }
      }
    }
  }

  private _initAppVersion() {
    let versionName: string;
    let buildNumber: string;

    if (tnsApp.android) {
      const pi = tnsApp.android.context.getPackageManager().getPackageInfo(tnsApp.android.context.getPackageName(), 0);
      versionName = pi.versionName;
      buildNumber = pi.versionCode.toString();
    } else if (tnsApp.ios) {
      versionName = NSBundle.mainBundle.objectForInfoDictionaryKey('CFBundleShortVersionString');
      buildNumber = NSBundle.mainBundle.objectForInfoDictionaryKey('CFBundleVersion');
    }
    this._appVersion = `v${versionName} (${buildNumber})`;
    this._log.debug('App version:', this._appVersion);
  }

  private _initAppEvents() {
    // For the future - may want to use these
    tnsApp.on(tnsApp.resumeEvent, () => {
      this._log.debug('tnsApp.resumeEvent');
    });
    tnsApp.on(tnsApp.suspendEvent, () => {
      this._log.debug('tnsApp.suspendEvent');
    });
  }

  private _initOrientation() {
    this._deviceType = device.deviceType;
    this._log.debug('deviceType:', this._deviceType);
    this._log.debug('initializing orientation handling.');

    // set initial orientation
    this.orientation = getOrientation();
    this._log.debug('current orientation:', this.orientation);

    // handle orientation changes
    tnsApp.on(tnsApp.orientationChangedEvent, e => {
      // sometimes e.newValue will be undefined, ignore those
      if (e.newValue && this.orientation !== e.newValue) {
        this._log.debug(`Old: ${this.orientation}; New: ${e.newValue}`);
        this._ngZone.run(() => {
          this.orientation = getOrientation();
        });
      }
    });
  }

  private _initUserSubscription() {
    this._store.select(UserState.selectCurrent).subscribe((user: User) => {
      this._user = user;

      if (!this._user) {
        // just for long live app sessions that user never closes the app
        this._initUser = false;
        this._checkLaunchUrl();

      } else if ( !this._initUser ) {
        this._initUser = true;
        this._checkLaunchUrl();
        // wire up things once for global app behavior when user is authenticated
        this._ngZone.run(() => {
          TNSFirebase.addOnMessageReceivedCallback((data: any) => {
            try {
              this._log.debug('push notification', data);
              if (data) {
                this._log.debug('push notification', JSON.stringify(data));
                this._ngZone.run(() => {
                  // TODO
                });
              }
            } catch (err) {

            }
          });

          TNSFirebase.addOnPushTokenReceivedCallback((token: any) => {
            // platforms return proprietary objects here
            // use following method to retrieve string value to post
            this._registerPushDeviceToken();
          });

          // also register here since the callback above may not fire
          this._registerPushDeviceToken();
        });
      }
    });
  }

  private _checkLaunchUrl() {
    if (!this._launchInit) {
      this._launchInit = true;
      AppService.routeToUrlOnLaunch$.subscribe(url => {
        this._log.debug('routeToUrlOnLaunch$:', url);
        if (url) {
          // this._win.alert(url);
          const parts = url.split('://');
          if (parts.length) {
            this._ngZone.run(() => {
              this._router.navigate([parts[1]]);
            });
          }
          AppService.routeToUrlOnLaunch$.next(null);
        }
      });
    }
  }

  private _registerPushDeviceToken() {
    if (!this._pushTokenPosted) {
      TNSFirebase.getCurrentPushToken().then((token: string) => {
        this._log.debug('Register FCM Token', token);
        if (token) {
          this._pushTokenPosted = true;
          // TODO: Jeff - register token with GraphQL
          // This will repost the push token EVERY time the user re-launches the app if they were logged in (even if the token had already been registered on the backend)
          // this._store.dispatch(new DeviceActions.CreateAction({
          //   os :  'fcm',
          //   uid : token
          // }));
        }
      });
    }
  }
}

const getOrientation = function() {
  if (isIOS) {
    const deviceOrientation = tnsUtils.ios.getter(UIDevice, UIDevice.currentDevice).orientation;

    return deviceOrientation === UIDeviceOrientation.LandscapeLeft ||
      deviceOrientation === UIDeviceOrientation.LandscapeRight
      ? DeviceOrientation.landscape
      : DeviceOrientation.portrait;
  } else {
    const orientation = getContext()
      .getResources()
      .getConfiguration().orientation;
    switch (orientation) {
      case 1 /* ORIENTATION_PORTRAIT (0x00000001) */:
        return DeviceOrientation.portrait;
      case 2 /* ORIENTATION_LANDSCAPE (0x00000002) */:
        return DeviceOrientation.landscape;
      default:
        /* ORIENTATION_UNDEFINED (0x00000000) */
        return DeviceOrientation.portrait;
    }
  }
};

const getContext = function() {
  const ctx = java.lang.Class.forName('android.app.AppGlobals')
    .getMethod('getInitialApplication', null)
    .invoke(null, null);
  if (ctx) {
    return ctx;
  }

  return java.lang.Class.forName('android.app.ActivityThread')
    .getMethod('currentApplication', null)
    .invoke(null, null);
};
