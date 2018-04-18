import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { RouterExtensions } from 'nativescript-angular/router';
import { HeaderBaseComponent } from '@sketchpoints/features';
import { AppService, DrawerService } from '@sketchpoints/nativescript/core';
import { backIcon, moreIcon } from '@sketchpoints/nativescript/utils';

@Component({
  moduleId: module.id,
  selector: 'sp-header-back',
  templateUrl: 'header-back.component.html'
})
export class HeaderBackComponent extends HeaderBaseComponent {
  @Input() backIcon: string;
  @Input() showMoreIcon: boolean;
  @Input() backGuard: Function;

  public moreIcon: string;

  constructor(private _router: RouterExtensions) {
    super();
  }

  ngOnInit() {
    if (!this.backIcon) {
      this.backIcon = backIcon();
    }
    this.moreIcon = moreIcon();
  }

  public back() {
    if ( this.backGuard ) {
      if ( this.backGuard() ) {
        // only nav back if guard allows
        this._router.back();
      }
    } else {
      this._router.back();
    }
  }
}
