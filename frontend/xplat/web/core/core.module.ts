import { NgModule, Optional, SkipSelf, Injector } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// libs
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import * as firebase from 'firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { MatDialog } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import {
  environment,
  CoreModule,
  PlatformFirebaseToken,
  ModalPlatformService,
  PlatformLanguageToken,
  WindowPlatformService,
  FirebaseService
} from '@sketchpoints/core';
import { TAG_PROVIDERS } from '@sketchpoints/features';
import { throwIfAlreadyLoaded } from '@sketchpoints/utils';

// app
import { PROVIDERS, FirebaseWebService } from './services';

// factories
export function winFactory() {
  return window;
}

export function platformLangFactory() {
  return window.navigator.language;
}

export class CustomTranslateLoader {
  constructor(private injector: Injector) { }

  public getTranslation(lang: string) {
    const http = this.injector.get(HttpClient);
    return http.get(`/assets/i18n/${lang}.json`);
  }
}

export function createTranslateLoader(injector: Injector) {
  return new CustomTranslateLoader(injector);
}

export function firebaseFactory() {
  // TODO: use firebase web sdk
  return firebase;
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    LayoutModule,
    CoreModule.forRoot([
      {
        provide: PlatformLanguageToken,
        useFactory: platformLangFactory
      },
      {
        provide: WindowPlatformService,
        useFactory: winFactory
      },
      {
        provide: ModalPlatformService,
        useClass: MatDialog
      },
      {
        provide: PlatformFirebaseToken,
        useFactory : firebaseFactory
      },
      {
        provide: FirebaseService,
        useClass: FirebaseWebService
      }
    ]),
    TranslateModule.forRoot({
      loader : {
        provide : TranslateLoader,
        useFactory : createTranslateLoader,
        deps : [Injector],
      },
    }),
  ],
  providers: [
    ...PROVIDERS,
    ...TAG_PROVIDERS
  ]
})
export class SPCoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: SPCoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'SPCoreModule');
  }
}
