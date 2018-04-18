import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// libs
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// import { environment } from '../environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { NxModule } from '@nrwl/nx';
import { ApiModule } from '@sketchpoints/api';
import { throwIfAlreadyLoaded } from '@sketchpoints/utils';

// app
import { environment } from './environments/environment';
import { CORE_PROVIDERS } from './services';
import { ApiInterceptor } from './services/http-interceptor.service';
import { LogService } from './services/log.service';
import { uiReducer } from './state/ui.reducer';
import { UIState } from './state/ui.state';
import { UIEffects } from './state/ui.effect';
import { userReducer } from './state/user.reducer';
import { UserState } from './state/user.state';
import { UserEffects } from './state/user.effect';

/**
 * DEBUGGING
 * Only enabled when not production api
 */
LogService.DEBUG.LEVEL_4 = environment.dev;
// optionally debug http
// LogService.DEBUG_HTTP.enable = true;
// LogService.DEBUG_HTTP.includeRequestBody = true;
// LogService.DEBUG_HTTP.includeResponse = true;
// optionally debug analytics (will log out all data before its sent)
// LogService.DEBUG_ANALYTICS = true;

export const BASE_PROVIDERS: any[] = [
  ...CORE_PROVIDERS,
  {
    provide: APP_BASE_HREF,
    useValue: '/'
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiInterceptor,
    multi: true
  },
  UIEffects
];

@NgModule({
  imports: [
    CommonModule,
    ApiModule,
    StoreModule.forRoot(
      {
        ui: uiReducer,
        user: userReducer
      },
      {
        initialState: {
          ui: UIState.initialState,
          user: UserState.initialState
        }
      }
    ),
    EffectsModule.forRoot([UIEffects, UserEffects]),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router'
    }),
    // !environment.production ? StoreDevtoolsModule.instrument() : [],
    // StoreRouterConnectingModule
    NxModule.forRoot()
  ]
})
export class CoreModule {
  // configuredProviders: *required to configure WindowService and others per platform
  static forRoot(configuredProviders: Array<any>): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [...BASE_PROVIDERS, ...configuredProviders]
    };
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
