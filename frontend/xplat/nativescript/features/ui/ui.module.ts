import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

// nativescript
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

// libs
import { TranslateModule } from '@ngx-translate/core';
import { TNSFontIconModule } from 'nativescript-ngx-fonticon';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { UiSharedModule } from '@sketchpoints/features';

// app
import { UI_COMPONENTS, UI_ENTRY_COMPONENTS } from './components';

const MODULES = [
  NativeScriptCommonModule, 
  NativeScriptFormsModule, 
  NativeScriptRouterModule, 
  NativeScriptUIListViewModule,
  NativeScriptUISideDrawerModule,
  TranslateModule,
  TNSFontIconModule,
  UiSharedModule,
];

@NgModule({
  imports: [...MODULES],
  declarations: [
    ...UI_COMPONENTS,
  ],
  entryComponents: [
    ...UI_ENTRY_COMPONENTS
  ],
  exports: [
    ...MODULES, 
    ...UI_COMPONENTS,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class UiModule {}
