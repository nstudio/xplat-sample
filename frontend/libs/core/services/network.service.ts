import { Injectable } from '@angular/core';
// libs
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { LogService } from './log.service';

/**
 * This provides common network handling
 * Each platform web/mobile can inject this and use to help facilitate network handling
 */
@Injectable()
export class NetworkCommonService {
  public static API_URL: string = 'https://api-rc.sketchpoints.io/';
  public static BASE_URL: string = 'api/4.0/';
  private _isOffline = false;
  // helper for network calls that need an auth token
  private _authToken: string;

  constructor(private _log: LogService) {}

  public set offline(value: boolean) {
    this._isOffline = value;
  }

  public get isOffline() {
    return this._isOffline;
  }

  /**
   * helper for network requests which need a token
   */
  public set authToken(value: string) {
    this._authToken = value;
  }

  public get authToken() {
    return this._authToken;
  }
}
