import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// libs
import { Store, select } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { User } from '@sketchpoints/api';
import { FirebaseService, LoginBaseComponent, UserState } from '@sketchpoints/core';

@Component({
  selector: 'sp-login',
  templateUrl: './login.component.html'
})
export class LoginComponent extends LoginBaseComponent {

  constructor(
    protected store: Store<any>,
    protected firebase: FirebaseService,
    private _router: Router
  ) {
    super(store, firebase);
  }

  ngOnInit() {
    this.store.pipe(
      select( UserState.selectCurrent ),
      takeUntil(this.destroy$),
    ).subscribe((user: User) => {
      if (user) {
        // user logged in, go home
        this._router.navigate(['/']);
      }
    });
  }
}
