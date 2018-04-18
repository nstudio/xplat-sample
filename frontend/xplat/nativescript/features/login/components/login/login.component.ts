import { Component, OnInit } from '@angular/core';

// libs
import { RouterExtensions } from 'nativescript-angular/router';
import { Store, select } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { User } from '@sketchpoints/api';
import { FirebaseService, LoginBaseComponent, UserState } from '@sketchpoints/core';

@Component({
  selector: 'sp-login',
  moduleId: module.id,
  templateUrl: './login.component.html'
})
export class LoginComponent extends LoginBaseComponent {

  constructor(
    protected store: Store<any>,
    protected firebase: FirebaseService,
    private _router: RouterExtensions,
  ) {
    super(store, firebase);
  }

  ngOnInit() {
    this.store.pipe(
      select( UserState.selectCurrent ),
      takeUntil(this.destroy$),
    ).subscribe((user: User) => {
      if (user) {
        // user logged out when on profile page, take them back to home
        this._router.back();
      }
    });
  }
}
