import { Component } from '@angular/core';

// libs
import { AppBaseComponent, AppService } from '@sketchpoints/nativescript';

@Component({
  selector: 'ns-app',
  templateUrl: 'app.component.html'
})
export class AppComponent extends AppBaseComponent {
  constructor(
    // here to construct singleton on boot
    protected _appService: AppService
  ) {
    super(_appService);
    _appService.appName = 'SPArtist';
  }
}
