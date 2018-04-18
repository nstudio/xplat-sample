import { Component, OnInit } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { TagsBaseComponent, TagState } from '@sketchpoints/features';

@Component({
  selector: 'sp-tags',
  templateUrl: './tags.component.html'
})
export class TagsComponent extends TagsBaseComponent {

  constructor(
    protected store: Store<TagState.IState>,
  ) {
    super(store);
    this.appName = 'SketchPoints';
  }
}

