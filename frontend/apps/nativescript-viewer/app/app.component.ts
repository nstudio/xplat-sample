import { Component } from '@angular/core';

// libs
import { AppBaseComponent, AppService } from '@sketchpoints/nativescript';

// register 3rd party view plugins
import { registerElement } from 'nativescript-angular/element-registry';
registerElement('ImageZoom', () => require('nativescript-image-zoom').ImageZoom);

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
    _appService.appName = 'SketchPoints';
  }
}
