/**
 * Common base component
 * Provides destroy$ observable for subclasses to use .takeUntil(this.destroy$)
 * Avoids having to keep up with so many subscriptions
 */
import { OnInit, OnDestroy } from '@angular/core';
// libs
import { Subject } from 'rxjs/Subject';

import { environment } from '../environments/environment';

export abstract class BaseComponent implements OnDestroy {
  public destroy$: Subject<any> = new Subject();

  public get homePath() {
    return environment.homeRoutePath;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
