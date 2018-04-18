import { NgModule } from '@angular/core';

// libs
import { UiModule } from '@sketchpoints/web';

const MODULES = [UiModule];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES]
})
export class SharedModule {}
