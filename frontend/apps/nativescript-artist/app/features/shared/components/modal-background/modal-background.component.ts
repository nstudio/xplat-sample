import { Component } from '@angular/core';

// libs
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { isIOS } from 'tns-core-modules/platform';
import { WebView } from 'tns-core-modules/ui/web-view';
import { Page } from 'tns-core-modules/ui/page';
import { WindowService, LogService, UserActions } from '@sketchpoints/core';
import { TagState } from '@sketchpoints/features';
import { TNSModalBaseComponent, AppService } from '@sketchpoints/nativescript';
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';

@Component({
  selector: 'sp-modal-background',
  moduleId: module.id,
  templateUrl: './modal-background.component.html'
})
export class ModalBackgroundComponent extends TNSModalBaseComponent {
  public title;
  public backgrounds = [
    { img: '~/assets/images/backgrounds/linedpaper.png', name: 'Notebook Paper' },
    { img: '~/assets/images/backgrounds/graphpaper.png', name: 'Graph Paper' }
  ];

  constructor(
    store: Store<any>,
    page: Page,
    params: ModalDialogParams,
    private _translate: TranslateService,
    private _win: WindowService,
    private _log: LogService,
    private _appService: AppService
  ) {
    super(store, page, params);
  }

  ngOnInit() {
    if (this.params && this.params.context) {
      if (this.params.context.title) {
        this.title = this.params.context.title;
      }
    }
  }

  public select(bg) {
    this.close(bg.img);
  }

  public loaded() {
    this._log.debug('loaded');
  }
}
