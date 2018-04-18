import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// libs
import { environment } from '@sketchpoints/core';

import { UiModule } from '../ui/ui.module';
import { HOME_COMPONENTS, LayoutComponent } from './components';

const routes: Routes = [
  {
    path: environment.baseRoutePath,
    component: LayoutComponent,
    children: [
      {
        path: 'profile',
        loadChildren: '../user/user.module#UserModule'
      },
      {
        path: '',
        loadChildren: '../tags/tags.module#TagsModule'
      }
    ]
  }
];

@NgModule({
  imports: [UiModule, RouterModule.forChild(routes)],
  declarations: [...HOME_COMPONENTS],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule {}
