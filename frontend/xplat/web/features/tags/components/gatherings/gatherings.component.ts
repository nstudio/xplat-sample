import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// libs
import { Store } from '@ngrx/store';
import { TagService, GatheringsBaseComponent, TagState } from '@sketchpoints/features';

@Component({
  selector: 'sp-gatherings',
  templateUrl: './gatherings.component.html'
})
export class GatheringsComponent extends GatheringsBaseComponent {

  constructor(
    protected store: Store<TagState.IState>,
    protected router: Router
  ) {
    super(store, router);
  }
}
