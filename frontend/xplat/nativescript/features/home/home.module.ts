import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';

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
        loadChildren: '~/features/user/user.loader.module#UserLoaderModule'
      },
      {
        path: '',
        loadChildren: '~/features/tags/tags.loader.module#TagsLoaderModule'
      },

      // paths like this work in web but not on mobile?
      // {
      //   path: 'profile',
      //   loadChildren: '../user/user.module#UserModule'
      // },
      // {
      //   path: '',
      //   loadChildren: '../tags/tags.module#TagsModule'
      // }
    ]
  }
];

@NgModule({
  imports: [UiModule, NativeScriptRouterModule.forChild(routes)],
  declarations: [...HOME_COMPONENTS],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule {}
