// libs
import { Store } from '@ngrx/store';
// nativescript
import { Page } from 'tns-core-modules/ui/page';
import { Color } from 'tns-core-modules/color';
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';
// app
import { ModalActions } from '@sketchpoints/core';
import { ModalBaseComponent } from '@sketchpoints/features';

export abstract class TNSModalBaseComponent extends ModalBaseComponent {

  constructor(
    store: Store<any>,
    public page: Page,
    public params: ModalDialogParams,
  ) {
    super(store);
    page.backgroundSpanUnderStatusBar = true;
    page.backgroundColor = new Color('#000');
  }

  public close(value?: any) {
    this.store.dispatch(new ModalActions.Close({
      params : this.params,
      value
    }));
  }
}

