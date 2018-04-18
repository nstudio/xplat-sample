import { NgModule, Optional, SkipSelf } from '@angular/core';

// nativescript
import { device } from 'tns-core-modules/platform';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { TNSFontIconModule } from 'nativescript-ngx-fonticon';
import * as tnsApp from 'tns-core-modules/application';
import * as TNSFirebase from 'nativescript-plugin-firebase';

// libs
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { throwIfAlreadyLoaded } from '@sketchpoints/utils';
import {
  CoreModule,
  PlatformFirebaseToken,
  FirebaseService,
  ModalPlatformService,
  PlatformLanguageToken,
  WindowPlatformService
} from '@sketchpoints/core';
import { TAG_PROVIDERS } from '@sketchpoints/features';

// app
import { PROVIDERS } from './services';
import { AppService } from './services/app.service';
import { TNSFirebaseService } from './services/tns-firebase.service';
import { TNSModalService } from './services/tns-modal.service';
import { MobileWindowPlatformService } from './services/tns-window.service';
import { TNSTranslateLoader } from './utils';

// factories
export function platformLangFactory() {
  return device.language;
}

export function createTranslateLoader() {
  return new TNSTranslateLoader('/assets/i18n/');
}

export function firebaseFactory() {
  return TNSFirebase;
}

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptHttpClientModule,
    TNSFontIconModule.forRoot({
      ion: './assets/ionicons.min.css'
    }),
    CoreModule.forRoot([
      {
        provide: PlatformLanguageToken,
        useFactory: platformLangFactory
      },
      {
        provide: WindowPlatformService,
        useClass: MobileWindowPlatformService
      },
      {
        provide: ModalPlatformService,
        useClass: TNSModalService
      },
      {
        provide: PlatformFirebaseToken,
        useFactory : firebaseFactory
      },
      {
        provide: FirebaseService,
        useClass: TNSFirebaseService
      }
    ]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader
      }
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
