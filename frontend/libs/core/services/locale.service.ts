import { Inject, Injectable, forwardRef } from '@angular/core';

// libs
import { safeSplit } from '@sketchpoints/utils';
import { LocaleState } from '../state';

import { PlatformLanguageToken } from './tokens';

@Injectable()
export class LocaleService {

  constructor(
    @Inject(forwardRef(() => PlatformLanguageToken))
    private _languageToken: LocaleState.Locale,
  ) {

    if (this._languageToken) {
      this._languageToken = <LocaleState.Locale>safeSplit(this._languageToken, '-')[0];
    }
    if (!Object.keys(LocaleState.Locale).includes(this._languageToken)) {
      this._languageToken = 'en';
    }
  }

  public get locale(): LocaleState.Locale {
    return this._languageToken;
  }

  public set locale(locale: LocaleState.Locale) {
    // always update in-memory locale for rapid access elsewhere
    this._languageToken = locale;
  }
}
