import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

// libs
import { Store } from '@ngrx/store';
import { LogService } from '@sketchpoints/core';
import { GatheringsBaseComponent, TagState } from '@sketchpoints/features';

@Component( {
  selector: 'sp-gathering-list-nav',
  templateUrl: './gathering-list-nav.component.html'
} )
export class GatheringListNavComponent extends GatheringsBaseComponent {
  constructor(
    protected store: Store<TagState.IState>,
    protected router: Router,
  ) {
    super( store, router );
  }
}
