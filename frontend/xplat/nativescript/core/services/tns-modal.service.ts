import { Injectable } from '@angular/core';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/directives/dialogs';

@Injectable()
export class TNSModalService {
  constructor(public modal: ModalDialogService) {}

  public open(cmpType: any, options?: ModalDialogOptions) {
    return this.modal.showModal(cmpType, options);
  }
}
