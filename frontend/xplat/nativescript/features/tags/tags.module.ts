import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

// nativescript
import { NativeScriptRouterModule } from 'nativescript-angular/router';

// libs
import { TagStateModule } from '@sketchpoints/features';
import { UiModule } from '../ui/ui.module';

// app
import { TAG_COMPONENTS } from './components';

@NgModule({
  imports: [
    UiModule, 
    TagStateModule
  ],
  declarations: [
    ...TAG_COMPONENTS
  ],
  exports: [
    UiModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class TagsModule {}
