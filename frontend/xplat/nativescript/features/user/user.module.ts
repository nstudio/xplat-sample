import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// libs
import { routesUser } from '@sketchpoints/core';
import { UiModule } from '../ui/ui.module';

// app
import { USER_COMPONENTS, ProfileComponent } from './components';

@NgModule({
  imports: [
    UiModule,
    RouterModule.forChild(routesUser(ProfileComponent))
  ],
  declarations: [...USER_COMPONENTS],
  schemas: [NO_ERRORS_SCHEMA]
})
export class UserModule {}

