import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
  HttpParams,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { tap, map, filter, catchError, switchMap, take, finalize } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

// app
import { ApiUser } from '@sketchpoints/api';
import { isNativeScript, isObject, isIOS, isAndroid } from '@sketchpoints/utils';
import { LogService } from './log.service';
import { NetworkCommonService } from './network.service';
import { UserService } from './user.service';
import { WindowService } from './window.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private _platform: string;
  private _isRefreshingToken: boolean = false;
  private _token$: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(
    private _log: LogService,
    private _win: WindowService,
    private _network: NetworkCommonService,
    private _userService: UserService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this._platform) {
      if (isNativeScript()) {
        if (isIOS()) {
          this._platform = 'ios_app';
        } else if (isAndroid()) {
          this._platform = 'android_app';
        }
      } else if (typeof window !== 'undefined') {
        const agent = window.navigator.userAgent;
        const isMobile = agent.match(/mobile/i);
        if (isMobile) {
          this._platform = 'web_app_mobile';
        } else {
          this._platform = 'web_app_desktop';
        }
      }
    }

    const options: any = {};
    const headers: any = {};
    headers['X-Client-Platform'] = this._platform;

    if (LogService.DEBUG_HTTP.enable) {
      this._log.debug(`http request --- ${request.url}`);
      if (LogService.DEBUG_HTTP.includeRequestHeaders) {
        this._log.debug('headers:', request.headers.keys);
      }
      if (request.body && LogService.DEBUG_HTTP.includeRequestBody) {
        this._log.debug('body:', request.body);
        if (isObject(request.body)) {
          for (const key in request.body) {
            this._log.debug(`   ${key}:`, request.body[key]);
          }
        }
      }
    }
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // configurable debug output
          if (LogService.DEBUG_HTTP.enable) {
            if (LogService.DEBUG_HTTP.includeResponse) {
              this._log.debug(`http response --- ${event.url}`);
              this._log.debug('status:', event.status);
              const result = event.body;
              this._log.debug('result:', JSON.stringify(result));
              this._log.debug(`http response end ---`);
            }
          }
        }
      }),
      catchError((err: any) => _throw(err))
    );
  }
}
