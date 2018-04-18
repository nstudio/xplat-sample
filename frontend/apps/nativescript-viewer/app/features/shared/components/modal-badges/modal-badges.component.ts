import { Component, NgZone } from '@angular/core';

// libs
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { take, takeUntil, skip } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Color } from 'tns-core-modules/color';
import { isIOS } from 'tns-core-modules/platform';
import { WebView } from 'tns-core-modules/ui/web-view';
import { Page } from 'tns-core-modules/ui/page';
import { WindowService, LogService, ModalActions } from '@sketchpoints/core';
import { TagState, ModalBadgesBaseComponent } from '@sketchpoints/features';
import { AppService } from '@sketchpoints/nativescript';
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';
import { RadListView } from 'nativescript-ui-listview';

@Component({
  selector: 'sp-modal-badges',
  moduleId: module.id,
  templateUrl: './modal-badges.component.html'
})
export class ModalBadgesComponent extends ModalBadgesBaseComponent {
  private _badgeList: RadListView;

  constructor(
    store: Store<any>,
    ngZone: NgZone,
    translate: TranslateService,
    win: WindowService,
    log: LogService,
    public page: Page,
    public params: ModalDialogParams,
    public appService: AppService
  ) {
    super(store, ngZone, translate, win, log);
    page.backgroundSpanUnderStatusBar = true;
    page.backgroundColor = new Color('#000');
  }

  ngOnInit() {
    super.ngOnInit();

    if (this.params && this.params.context) {
      if (this.params.context.title) {
        this.title = this.params.context.title;
      }
    }

    this.buy$.pipe(takeUntil(this.destroy$)).subscribe(_ => {
      // purchase processing here...
    });
  }

  public unlockBadges(badgeIds: Array<string>) {
    super.unlockBadges(badgeIds);

    if (!this._badgeList) {
      this._badgeList = <RadListView>this.page.getViewById('badge-list');
    } else {
      this.win.setTimeout(_ => {
        this._badgeList.refresh();
      }, 10);
    }
  }

  public close(value?: any) {
    this.store.dispatch(
      new ModalActions.Close({
        params: this.params,
        value
      })
    );
  }

  public loaded() {
    this.log.debug('loaded');
  }
}
