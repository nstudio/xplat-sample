import { Component } from '@angular/core';

// nativescript
import { topmost } from 'tns-core-modules/ui/frame';

// libs
import { BaseComponent } from '@sketchpoints/core';
import { AppService } from '@sketchpoints/nativescript/core';

export abstract class AppBaseComponent extends BaseComponent {
  constructor(
    // here to construct singleton on boot
    protected _appService: AppService
  ) {
    super();
    this._appService.initFirebase();

    if (topmost().ios) {
      let navigationBar = topmost().ios.controller.navigationBar;
      // 0: default
      // 1: light
      navigationBar.barStyle = 1;
    }
  }
}
