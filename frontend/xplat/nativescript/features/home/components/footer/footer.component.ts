import { Component } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { LogService, WindowService, ModalActions } from '@sketchpoints/core';

// app
import { DrawerService } from '@sketchpoints/nativescript/core';
import { ModalWebViewComponent } from '../../../ui/components/modal-webview/modal-webview.component';

@Component( {
  selector: 'sp-footer',
  moduleId: module.id,
  templateUrl: './footer.component.html'
} )
export class FooterComponent {

  constructor(
    protected store: Store<any>,
    protected log: LogService,
    private _win: WindowService,
    private _drawer: DrawerService,
  ) {
  }

  

  public viewWeb() {
    this._drawer.toggle(false);
    this.store.dispatch(new ModalActions.Open({
      cmpType: ModalWebViewComponent,
      modalOptions: {
        viewContainerRef: this._win.vcRef,
        context: {
          title: 'nStudio',
          url: 'https://nstudio.io'
        }
      }
    }))
  }
}
