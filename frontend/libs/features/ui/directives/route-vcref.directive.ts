import { Directive, Inject, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// libs
import { WindowService } from '@sketchpoints/core/services';

@Directive({
  selector: '[sp-route-vcref]'
})
export class RouteViewContainerRefDirective {
  constructor(private _vcRef: ViewContainerRef, private _win: WindowService) {
    // console.log('sp-route-vcref', this._vcRef);
    this._win.vcRef = this._vcRef;
  }
}
