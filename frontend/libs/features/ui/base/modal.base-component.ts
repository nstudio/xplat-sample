// libs
import { Store } from '@ngrx/store';

// app
import { BaseComponent, ModalActions } from '@sketchpoints/core';

export abstract class ModalBaseComponent extends BaseComponent {
  constructor(protected store: Store<any>) {
    super();
  }

  public close(value?: any) {
    this.store.dispatch(new ModalActions.Close(value));
  }
}
