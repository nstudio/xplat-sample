import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// libs
import { routeTags, TagStateModule } from '@sketchpoints/features';
import { UiModule } from '../ui/ui.module';

// app
import { TAG_COMPONENTS, TagsComponent, TagDetailComponent, GatheringDetailComponent } from './components';

@NgModule({
  imports: [
    UiModule, 
    TagStateModule,
    RouterModule.forChild(routeTags(
      TagsComponent, 
      TagDetailComponent, 
      GatheringDetailComponent
    ))
  ],
  declarations: [...TAG_COMPONENTS],
  schemas: [NO_ERRORS_SCHEMA]
})
export class TagsModule {}
