import { NgModule } from '@angular/core';

// app
import { DIRECTIVES } from './directives';
import { PIPES } from './pipes';

@NgModule({
  declarations: [...DIRECTIVES, ...PIPES],
  exports: [...DIRECTIVES, ...PIPES]
})
export class UiSharedModule {}
