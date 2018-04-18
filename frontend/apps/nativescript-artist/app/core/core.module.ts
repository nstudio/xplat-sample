import { NgModule } from '@angular/core';

// libs
import { environment } from '@sketchpoints/core';
import { SPCoreModule } from '@sketchpoints/nativescript';

import { PROVIDERS } from '../features/tags/services';

// configure app level settings
environment.isArtist = true;

@NgModule({
  imports: [SPCoreModule],
  providers: [...PROVIDERS]
})
export class CoreModule {}
