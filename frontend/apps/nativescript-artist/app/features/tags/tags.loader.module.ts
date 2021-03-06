// from workaround:
// https://github.com/angular/angular-cli/issues/6373#issuecomment-319116889

import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

// nativescript
import { NativeScriptRouterModule } from 'nativescript-angular/router';

// libs
import { routeTags } from '@sketchpoints/features';
import { TagsModule, TagsComponent, TagDetailComponent } from '@sketchpoints/nativescript';

import { ArtistComponent } from './components/artist/artist.component';

@NgModule({
  imports: [
    TagsModule,
    NativeScriptRouterModule.forChild(
      routeTags(TagsComponent, TagDetailComponent, ArtistComponent)
    )
  ],
  declarations: [ArtistComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class TagsLoaderModule {}
