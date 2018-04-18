import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// libs
import { Store } from '@ngrx/store';
import { ProfileBaseComponent, UserState, UserService } from '@sketchpoints/core';

@Component({
  selector: 'sp-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent extends ProfileBaseComponent {

  constructor(
    protected store: Store<UserState.IState>,
    protected route: ActivatedRoute,
    public userService: UserService,
  ) {
    super(store, route, userService);
  }
}
