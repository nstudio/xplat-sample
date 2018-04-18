import { Component } from '@angular/core';

// libs
import { Store, select } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';

import { FirebaseService } from '../services/firebase.service';
import { BaseComponent } from './base-component';

export abstract class LoginBaseComponent extends BaseComponent {
  constructor(protected store: Store<any>, protected firebase: FirebaseService) {
    super();
  }

  public login() {
    this.firebase.googleConnect();
  }
}
