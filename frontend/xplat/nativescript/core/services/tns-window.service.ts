import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

// nativescript
import * as dialogs from 'tns-core-modules/ui/dialogs';
import { device, isIOS } from 'tns-core-modules/platform';
import * as timer from 'tns-core-modules/timer';

// app
import { isString } from '@sketchpoints/utils';
import { IPromptOptions } from '@sketchpoints/core';

declare var SCLAlertViewStyleKit;

var TNSFancyAlert, TNSFancyAlertButton;

if (isIOS) {
  var fAlerts = require('nativescript-fancyalert');
  TNSFancyAlert = fAlerts.TNSFancyAlert;
  TNSFancyAlertButton = fAlerts.TNSFancyAlertButton;
} else {
  // android
  TNSFancyAlertButton = (function() {
    function TNSFancyAlertButton(model) {
      if (model) {
        this.label = model.label;
        this.action = model.action;
      }
    }
    return TNSFancyAlertButton;
  })();
}

@Injectable()
export class MobileWindowPlatformService {
  private _dialogOpened = false;
  private _defaultTitle = '....................';

  constructor() {
    if (isIOS) {
      TNSFancyAlert.titleColor = '#fff';
      TNSFancyAlert.bodyTextColor = '#fff';
      TNSFancyAlert.shouldDismissOnTapOutside = false;
    } else {
      // android
    }
  }

  public get navigator(): any {
    return {
      language: device.language,
      userAgent: 'nativescript'
    };
  }
  public get location(): any {
    return {
      host: 'nativescript'
    };
  }
  public btoa() {
    return ''; // stub
  }
  public scrollTo(x?: number, y?: number) {}
  public alert(msg: string | dialogs.AlertOptions): Promise<any> {
    return new Promise(resolve => {
      if (!this._dialogOpened && msg) {
        this._dialogOpened = true;
        // console.log('typeof msg:', typeof msg);
        if (msg instanceof HttpResponse) {
          try {
            msg = (<any>msg).message;
          } catch (err) {
            msg = msg.toString();
          }
        }

        if (isIOS) {
          this._defaultColors();

          // TNSFancyAlert.showInfo(null, msg);
          TNSFancyAlert.showCustomButtons(
            [
              new TNSFancyAlertButton({
                label: 'Ok',
                action: () => {
                  this._dialogOpened = false;
                  resolve();
                }
              })
            ],
            SCLAlertViewStyleKit.imageOfWarning(),
            '#fff',
            this._defaultTitle,
            msg
          );
        } else {
          if (typeof msg === 'string') {
            const options: dialogs.AlertOptions = {
              message: <string>msg,
              okButtonText: 'Ok'
            };
            dialogs.alert(options).then(ok => {
              this._dialogOpened = false;
              resolve();
            });
          }
        }
      }
    });
  }
  public confirm(msg: any, action?: Function, okText?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this._dialogOpened) {
        this._dialogOpened = true;
        let options: dialogs.ConfirmOptions = {
          title: 'Confirm',
          okButtonText: okText || 'Ok',
          cancelButtonText: 'Cancel'
        };
        if (typeof msg === 'string') {
          options.message = msg;
        } else {
          options = msg;
        }

        if (isIOS) {
          this._defaultColors();
          TNSFancyAlert.showCustomButtons(
            [
              new TNSFancyAlertButton({
                label: options.cancelButtonText,
                action: () => {
                  this._dialogOpened = false;
                  reject();
                }
              }),
              new TNSFancyAlertButton({
                label: options.okButtonText,
                action: () => {
                  this._dialogOpened = false;
                  action();
                  resolve();
                }
              })
            ],
            SCLAlertViewStyleKit.imageOfQuestion(),
            '#fff',
            options.title || this._defaultTitle,
            options.message,
            options.cancelButtonText
          );
        } else {
          dialogs.confirm(options).then(ok => {
            this._dialogOpened = false;
            if (ok) {
              action();
              resolve();
            } else {
              reject();
            }
          });
        }
      }
    });
  }
  public prompt(options: IPromptOptions) {
    return new Promise((resolve, reject) => {
      if (!this._dialogOpened && msg) {
        this._dialogOpened = true;

        if (isIOS) {
          this._defaultColors();

          TNSFancyAlert.showTextField(
            options.placeholder,
            options.initialValue,
            new TNSFancyAlertButton({
              label: options.okButtonText,
              action: (value: any) => {
                this._dialogOpened = false;
                if (value) {
                  console.log(`User entered ${value}`);
                  options.action(value);
                  resolve(value);
                } else {
                  reject();
                }
              }
            }),
            SCLAlertViewStyleKit.imageOfWarning(),
            '#fff',
            this._defaultTitle,
            options.msg
          );
        } else {
          let opt: dialogs.PromptOptions = {
            title: options.okButtonText,
            message: options.msg,
            defaultText: options.initialValue || '',
            inputType: dialogs.inputType.text,
            okButtonText: options.okButtonText,
            cancelButtonText: options.cancelButtonText
          };
          dialogs.prompt(opt).then(
            (result: any) => {
              this._dialogOpened = false;
              if (result && result.text) {
                console.log(`User entered ${result.text}`);
                options.action(result.text);
                resolve(result.text);
              } else {
                reject();
              }
            },
            () => {
              // canceled
              this._dialogOpened = false;
              reject();
            }
          );
        }
      }
    });
  }
  public open(...args: Array<any>) {
    // might have this open a WebView modal
    return null;
  }
  public setTimeout(handler: (...args: any[]) => void, timeout?: number): number {
    return timer.setTimeout(handler, timeout);
  }
  public clearTimeout(timeoutId: number): void {
    timer.clearTimeout(timeoutId);
  }
  public setInterval(handler: (...args: any[]) => void, ms?: number, ...args: any[]): number {
    return timer.setInterval(handler, ms);
  }
  public clearInterval(intervalId: number): void {
    timer.clearInterval(intervalId);
  }
  private _defaultColors() {
    TNSFancyAlert.customViewColor = '#e335d5';
    TNSFancyAlert.backgroundViewColor = '#303030';
    TNSFancyAlert.showAnimationType = TNSFancyAlert.SHOW_ANIMATION_TYPES.SlideInFromCenter;
    TNSFancyAlert.hideAnimationType = TNSFancyAlert.HIDE_ANIMATION_TYPES.SlideOutFromCenter;
  }
}
