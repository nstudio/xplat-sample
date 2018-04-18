import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { RouterExtensions } from 'nativescript-angular/router';

// app
import { HeaderBaseComponent } from '@sketchpoints/features';
import { AppService, DrawerService } from '@sketchpoints/nativescript/core';

@Component({
  moduleId: module.id,
  selector: 'sp-header',
  templateUrl: 'header.component.html'
})
export class HeaderComponent extends HeaderBaseComponent {

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
