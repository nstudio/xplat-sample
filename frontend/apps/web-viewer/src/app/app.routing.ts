// angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

// libs
import { routeBase } from '@sketchpoints/features';

// app
import { SharedModule } from './features/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forRoot(
      routeBase({
        base: './features/home/home.loader.module#HomeLoaderModule',
        login: './features/login/login.loader.module#LoginLoaderModule'
      }),
      { preloadingStrategy: PreloadAllModules }
    )
  ]
})
export class AppRoutingModule {}
