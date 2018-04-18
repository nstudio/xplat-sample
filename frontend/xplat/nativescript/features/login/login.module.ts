import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

// nativescript
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { routeLogin } from '@sketchpoints/features';
import { UiModule } from '../ui/ui.module';

// app
import { LOGIN_COMPONENTS, LoginComponent } from './components';

@NgModule({
  imports: [
    UiModule, 
    NativeScriptRouterModule.forChild(routeLogin(
      LoginComponent
    ))
  ],
  declarations: [
    ...LOGIN_COMPONENTS
  ],
  exports: [
    UiModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class LoginModule {}
