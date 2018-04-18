import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { RouterExtensions } from 'nativescript-angular/router';

// app
import { HeaderBaseComponent } from '@sketchpoints/features';
import { AppService, DrawerService } from '@sketchpoints/nativescript/core';

@Component({
  moduleId: module.id,
  selector: 'sp-header-logo',
  templateUrl: 'header-logo.component.html'
})
export class HeaderLogoComponent extends HeaderBaseComponent {
  @Input() logo: string;

  constructor(
    // private store: Store<IAppState>,
    private router: RouterExtensions,
    private drawer: DrawerService,
    public appService: AppService
  ) {
    super();
  }

  public toggleDrawer() {
    this.drawer.toggle();
  }
}
