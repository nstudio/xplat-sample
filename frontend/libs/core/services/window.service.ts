// angular
import { Injectable, ViewContainerRef } from '@angular/core';

// libs
import { Subject } from 'rxjs/Subject';

// app
import { isObject, isNativeScript } from '@sketchpoints/utils';

export interface IPromptOptions {
  placeholder: string;
  initialValue: string;
  action: Function;
  msg?: string;
  okButtonText?: string;
  cancelButtonText?: string;
}

@Injectable()
export class WindowPlatformService {
  public navigator: any = {};
  public location: any = {};
  public localStorage: any;
  public alert(msg: any) {}
  public confirm(msg: any) {}
  public prompt(options: any) {}
  public setTimeout(handler: (...args: any[]) => void, timeout?: number) {
    return 0;
  }
  public clearTimeout(timeoutId: number) {}
  public setInterval(handler: (...args: any[]) => void, ms?: number, ...args: any[]) {
    return 0;
  }
  public clearInterval(intervalId: number) {}
}

@Injectable()
export class WindowService {
  // google tag manager stub for web
  public dataLayer: Array<any> = [];
  // helps web trigger certain events when dialogs open
  public dialogOpening$: Subject<boolean> = new Subject();

  // base root vcRef for each routed component
  private _vcRef: ViewContainerRef;

  constructor(private _platformWindow: WindowPlatformService) {}

  public get vcRef() {
    return this._vcRef;
  }

  public set vcRef(value: ViewContainerRef) {
    this._vcRef = value;
  }

  public get navigator() {
    return this._platformWindow.navigator;
  }

  public get location() {
    return this._platformWindow.location;
  }

  public alert(msg: any): Promise<any> {
    this.dialogOpening$.next(true);
    return new Promise((resolve, reject) => {
      const result: any = this._platformWindow.alert(msg);
      if (isObject(result) && result.then) {
        result.then(resolve, reject);
      } else {
        resolve();
      }
    });
  }

  public confirm(msg: any, action?: Function /* used for fancyalerts on mobile*/, okText?: string): Promise<any> {
    this.dialogOpening$.next(true);
    return new Promise((resolve, reject) => {
      const result: any = (<any>this._platformWindow).confirm(
        msg,
        isNativeScript() ? action : undefined,
        isNativeScript() ? okText : undefined
      );
      if (isObject(result) && result.then) {
        result.then(resolve, reject);
      } else if (result) {
        if (action) {
          action();
        }
        resolve();
      } else {
        reject();
      }
    });
  }

  public prompt(options: IPromptOptions) {
    this.dialogOpening$.next(true);
    return new Promise((resolve, reject) => {
      const result: any = (<any>this._platformWindow).prompt(options);
      if (isObject(result) && result.then) {
        result.then(resolve, reject);
      } else if (result) {
        resolve();
      } else {
        reject();
      }
    });
  }

  public btoa(msg: string): string {
    return null;
  }

  public scrollTo(a: number, b: number) {
    return null;
  }

  public open(...args: Array<any>): any {
    return null;
  }

  public setTimeout(handler: (...args: any[]) => void, timeout?: number): number {
    return this._platformWindow.setTimeout(handler, timeout);
  }

  public clearTimeout(timeoutId: number): void {
    return this._platformWindow.clearTimeout(timeoutId);
  }

  public setInterval(handler: (...args: any[]) => void, ms?: number, ...args: any[]): number {
    return this._platformWindow.setInterval(handler, ms, args);
  }

  public clearInterval(intervalId: number): void {
    return this._platformWindow.clearInterval(intervalId);
  }
}
