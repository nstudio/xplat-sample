import { Component } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { isIOS } from 'tns-core-modules/platform';
import { WebView } from 'tns-core-modules/ui/web-view';
import { Page } from 'tns-core-modules/ui/page';
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';

// app
import { TNSModalBaseComponent } from '../../base/tns-modal.base-component';

@Component({
  selector: 'sp-modal-webview',
  moduleId: module.id,
  templateUrl: './modal-webview.component.html'
})
export class ModalWebViewComponent extends TNSModalBaseComponent {
  public url;
  public title;

  constructor(store: Store<any>, page: Page, params: ModalDialogParams) {
    super(store, page, params);
    if (this.params && this.params.context) {
      this.url = this.params.context.url;
      if (this.params.context.title) {
        this.title = this.params.context.title;
      }
    }
  }

  public loadFinished(e) {
    if (!this.title && e && e.url) {
      this.title = e.url;
    }
  }

  public webViewLoaded(view: WebView) {
    if (this.url) {
      view.src = this.url;
  
      if ( !isIOS && view.nativeView ) {
        (<android.webkit.WebView>view.nativeView).getSettings().setDomStorageEnabled(true);
      }
    }
  }
}
