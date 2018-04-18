import { Component, EventEmitter, Input, Output } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { LogService, FirebaseService, UserService } from '@sketchpoints/core';
import { HeaderBaseComponent } from '@sketchpoints/features';

@Component( {
  selector: 'sp-header',
  templateUrl: './header.component.html'
} )
export class HeaderComponent extends HeaderBaseComponent {

  @Input() isMobile = false;
  @Output() onToggle = new EventEmitter<any>();

  constructor(
    protected store: Store<any>,
    protected log: LogService,
    protected firebaseService: FirebaseService,
    public userService: UserService,
  ) {
    super();
    this.title = 'SketchPoints';
  }

  public toggleSidenav() {
    this.onToggle.emit();
  }

  public login() {
    this.firebaseService.googleConnect();
  }
}
