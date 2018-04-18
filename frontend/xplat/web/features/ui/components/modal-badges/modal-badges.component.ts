import { Component, NgZone } from '@angular/core';

// libs
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { take, takeUntil, skip } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { WindowService, LogService, ModalActions, environment } from '@sketchpoints/core';
import { TagState, ModalBadgesBaseComponent } from '@sketchpoints/features';

@Component({
  selector: 'sp-modal-badges',
  templateUrl: './modal-badges.component.html'
})
export class ModalBadgesComponent extends ModalBadgesBaseComponent {

  constructor(
    store: Store<any>,
    ngZone: NgZone,
    translate: TranslateService,
    win: WindowService,
    log: LogService,
  ) {
    super(store, ngZone, translate, win, log);
  }

  ngOnInit() {
    super.ngOnInit();

    this.buy$.pipe(takeUntil(this.destroy$)).subscribe(_ => {
      this.log.debug('buy:', this.activeProductId);
      this.openCheckout();
    });
  }

  openCheckout() {
    // checkout processing...
  }

  public close(value?: any) {
    this.store.dispatch(
      new ModalActions.Close(value)
    );
  }
}
