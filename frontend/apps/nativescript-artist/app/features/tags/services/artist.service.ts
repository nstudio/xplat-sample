import { Injectable, NgZone } from '@angular/core';

// libs
import { Store, select } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { take } from 'rxjs/operators';
import { Color } from 'tns-core-modules/color';
import { isIOS } from 'tns-core-modules/platform';
import { ImageSource, fromFile } from 'tns-core-modules/image-source';
import { GestureTypes, TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { knownFolders, path, Folder, File } from 'tns-core-modules/file-system';

// app
import {
  LogService,
  WindowService,
  FirebaseService,
  UserService,
} from '@sketchpoints/core';
import { TagState } from '@sketchpoints/features';
import { DrawerService } from '@sketchpoints/nativescript';
import { Tracking } from '@sketchpoints/utils';

@Injectable()
export class ArtistService {
  private _penColor$: BehaviorSubject<string>;
  private _penAlpha$: BehaviorSubject<number>;
  private _penWidth$: BehaviorSubject<number>;
  private _usedColors$: BehaviorSubject<Array<string>>;
  private _prevPenColor: string;
  private _eraser = false;
  private _enabled = false;
  private _background: ImageSource;

  constructor(
    private _store: Store<any>,
    private _log: LogService,
    private _ngZone: NgZone,
    private _drawer: DrawerService,
    private _win: WindowService,
    private _userService: UserService,
    private _firebase: FirebaseService,
  ) {
    // defaults
    this._penColor$ = new BehaviorSubject('#000');
    this._penAlpha$ = new BehaviorSubject(1);
    this._penWidth$ = new BehaviorSubject(2.0);
    this._usedColors$ = new BehaviorSubject([]);
  }

  // handle any global view adjustments and restore previously used sketch settings
  public toggleEnabled(value: boolean) {
    this._enabled = value;
    // disable/reenable swipe from left to open side drawer
    this._drawer.toggleGestures(value === false);
  }

  public get enabled() {
    return this._enabled;
  }

  public get penColor() {
    return this._penColor$.getValue();
  }

  public get penColor$() {
    return this._penColor$;
  }

  public set penColor(value: string) {
    this.penColor$.next(value);
  }

  public get penAlpha() {
    return this._penAlpha$.getValue();
  }

  public get penAlpha$() {
    return this._penAlpha$;
  }

  public set penAlpha(value: number) {
    this._ngZone.run(() => {
      this.penAlpha$.next(value);
    });
  }

  public get penWidth() {
    return this._penWidth$.getValue();
  }

  public get penWidth$() {
    return this._penWidth$;
  }

  public set penWidth(value: number) {
    this._ngZone.run(() => {
      this._penWidth$.next(value);
    });
  }

  public get background() {
    return this._background;
  }

  public set background(value: ImageSource) {
    this._background = value;
  }

  public get usedColors() {
    return this._usedColors$.getValue();
  }

  public get usedColors$() {
    return this._usedColors$;
  }

  public addUsedColor(value: string) {
    const colors = [...this.usedColors];
    if (!colors.find(c => c === value)) {
      colors.push(value);
      this._usedColors$.next(colors);
    }
  }

  public removeUsedColor(value: string) {
    this._ngZone.run(() => {
      const colors = [...this.usedColors];
      const index = colors.findIndex(c => c === value);
      if (index > -1) {
        colors.splice(index, 1);
        this._usedColors$.next(colors);
      }
    });
  }

  public get eraser() {
    return this._eraser;
  }

  public set eraser(value: boolean) {
    this._eraser = value;
  }
}
