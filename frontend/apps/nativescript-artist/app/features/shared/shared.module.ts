import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

// libs
import { UiModule } from '@sketchpoints/nativescript';

// app
import { COMPONENTS, ENTRY_COMPONENTS } from './components';

const MODULES = [UiModule];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  entryComponents: [...ENTRY_COMPONENTS],
  exports: [...MODULES, ...COMPONENTS],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule {}
