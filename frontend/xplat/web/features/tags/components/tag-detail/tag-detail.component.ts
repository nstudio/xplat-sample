import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// libs
import { Store } from '@ngrx/store';
import { TagService, TagState, TagDetailBaseComponent } from '@sketchpoints/features';

@Component( {
  selector: 'sp-tag-detail',
  templateUrl: './tag-detail.component.html'
} )
export class TagDetailComponent extends TagDetailBaseComponent {
  constructor(
    protected store: Store<TagState.IState>,
    protected tagService: TagService,
    protected route: ActivatedRoute
  ) {
    super( store, tagService, route );
  }
}
