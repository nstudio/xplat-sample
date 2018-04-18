import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// libs
import { routeLogin } from '@sketchpoints/features';
import { UiModule } from '../ui/ui.module';

// app
import { LOGIN_COMPONENTS, LoginComponent } from './components';

@NgModule({
  imports: [
    UiModule, 
    RouterModule.forChild(routeLogin(
      LoginComponent,
    ))
  ],
  declarations: [
    ...LOGIN_COMPONENTS
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class LoginModule {}

