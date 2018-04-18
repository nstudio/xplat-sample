import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './tag.reducer';
import { TagEffects } from './tag.effect';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature('tag', reducer), EffectsModule.forFeature([TagEffects])],
  providers: [TagEffects]
})
export class TagStateModule {}
