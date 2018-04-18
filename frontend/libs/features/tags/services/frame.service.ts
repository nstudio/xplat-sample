import { Injectable } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { take, map } from 'rxjs/operators';
import { interval } from 'rxjs/observable/interval';
import { LogService, WindowService, FirebaseService, UserService } from '@sketchpoints/core/services';
import { timecodeDisplay } from '@sketchpoints/utils';
import { TagState } from '../state/tag.state';

@Injectable()
export class FrameService {
  private _activeTimecode$: BehaviorSubject<string>;
  private _streamCurrentTimer$: Observable<number>;
  private _streamCurrentTimerSub: Subscription;
  private _streamCurrentTime = 0;

  constructor(
    private _store: Store<any>,
    private _log: LogService,
    private _win: WindowService,
    private _firebase: FirebaseService,
    private _userService: UserService
  ) {
    // TODO: when active gathering comes from backend, update this with current time for the session
    // since artist may be able to switch back to other gatherings while an active one is going
    this._activeTimecode$ = new BehaviorSubject(timecodeDisplay(this._streamCurrentTime));
    this._streamCurrentTimer$ = interval(1000);
  }

  public get activeTimecode$() {
    return this._activeTimecode$;
  }

  public get activeTimecode() {
    return parseInt(this._activeTimecode$.getValue());
  }

  public set activeTimecode(value: number) {
    this._activeTimecode$.next(timecodeDisplay(value));
  }

  public get streamCurrentTime() {
    return this._streamCurrentTime;
  }

  public set streamCurrentTime(value: number) {
    this._streamCurrentTime = value;
  }

  public startSketchTime() {
    this._streamCurrentTimerSub = this._streamCurrentTimer$.subscribe(v => {
      this._streamCurrentTime++;
      this.activeTimecode = this._streamCurrentTime;
    });
  }

  public stopSketchTime() {
    if (this._streamCurrentTimerSub) {
      this._streamCurrentTimerSub.unsubscribe();
      this._streamCurrentTimerSub = null;
    }
  }

  public resetStreamStart() {
    this.streamCurrentTime = 0;
    this.activeTimecode = 0;
  }
}
