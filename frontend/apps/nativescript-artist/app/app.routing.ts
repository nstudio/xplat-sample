// angular
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router'; //PreloadAllModules

// nativescript
import { NativeScriptRouterModule } from 'nativescript-angular/router';

// libs
import { routeBase } from '@sketchpoints/features';

// app
import { SharedModule } from './features/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    NativeScriptRouterModule.forRoot(
      routeBase({
        base: '~/features/home/home.loader.module#HomeLoaderModule',
        login: '~/features/login/login.loader.module#LoginLoaderModule'
      })
    )
  ]
})
export class AppRoutingModule {}
