import { Component } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { LogService } from '@sketchpoints/core';

@Component( {
  selector: 'sp-footer',
  templateUrl: './footer.component.html'
} )
export class FooterComponent {

  constructor(
    protected store: Store<any>,
    protected log: LogService,
  ) {
  }
}
