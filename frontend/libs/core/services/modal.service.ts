// angular
import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

// libs
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { filter, throttleTime } from 'rxjs/operators';
import { ModalState, ModalActions } from '../state';
import { isObject } from '@sketchpoints/utils';

// app
import { LogService } from './log.service';

// open return value type
export interface IOpenReturn {
  cmpType: any;
  trackTitle?: string;
}

// used for special workaround for web ng-bootstrap in close method
declare var $;

@Injectable()
export class ModalPlatformService {
  public open(componentType: any, options?: any) {}
}

@Injectable()
export class ModalService {

  private _modalRef: any;

  constructor(
    private _store: Store<any>,
    private _platformModalService: ModalPlatformService,
    private _router: Router,
    private _log: LogService
  ) {
  }

  public open(options: ModalState.IOptions): IOpenReturn {
    const details: IOpenReturn = {
      cmpType: options.cmpType
    };

    if (!options.modalOptions) {
      options.modalOptions = {
        backdrop: 'static',
        keyboard: true
      };
    }

    // open modal using platform specific modal service
    this._modalRef =
      typeof options.cmpType !== 'string'
        ? this._platformModalService.open(options.cmpType, options.modalOptions)
        : null;
    this._log.debug('modalref:', this._modalRef);

    if (options.props) {
      // web can copy props onto passed in modal instances
      for (const key in options.props) {
        if (key === 'trackTitle') {
          details.trackTitle = options.props[key];
        } else if (this._modalRef && this._modalRef.componentInstance) {
          this._modalRef.componentInstance[key] = options.props[key];
        }
      }
    }
    if (this._modalRef) {
      if (this._modalRef.afterClosed) {
        // @angular/material (web)

        this._modalRef.afterClosed().subscribe(
          (result: any) => {
            this._log.debug('Modal closed with:', result);
          },
          (reason: any) => {
            this._log.debug('Modal closed reason:', reason);
          }
        );
      } else if (this._modalRef.then) {
        // like {N} (mobile)
        this._modalRef.then(result => {
          this._log.debug('Native modal closed with:', result);
        });
      }
    }
    return details;
  }

  public close(latestResult?: any | { params: any; value?: any }) {
    if (this._modalRef) {
      if (this._modalRef.close) {
        // web @angular/material
        this._modalRef.close(latestResult);

        return latestResult;
      } else if (this._modalRef.then) {
        // {N} ModalDialogService
        if (isObject(latestResult) && latestResult.params) {
          // {N} modal
          if (latestResult.params.closeCallback) {
            latestResult.params.closeCallback(latestResult.value);
          }
          return latestResult.value;
        }
      }
    }
    return null;
  }

  public get modalRef(): any {
    return this._modalRef;
  }
}
