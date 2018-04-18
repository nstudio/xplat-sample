import {
  Component,
  ViewChild,
  ViewContainerRef,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';

// libs
import { RouterExtensions } from 'nativescript-angular/router';
import { isAndroid } from 'tns-core-modules/platform';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { environment, WindowService, FirebaseService, BaseComponent, UserService } from '@sketchpoints/core';
import { TagService } from '@sketchpoints/features';
// import { AppService, DrawerService } from '@sketchpoints/nativescript/core';
import { AppService } from '@sketchpoints/nativescript/core/services/app.service';
import { DrawerService } from '@sketchpoints/nativescript/core/services/drawer.service';

@Component( {
  moduleId: module.id,
  selector: 'sp-sidebar-header',
  templateUrl: './sidebar-header.component.html'
} )
export class SidebarHeaderComponent extends BaseComponent {
  public logo: string;

  constructor(
    private translate: TranslateService,
    private routerExt: RouterExtensions,
    private win: WindowService,
    private tagService: TagService,
    private firebaseService: FirebaseService,
    public appService: AppService,
    public userService: UserService,
    public drawerService: DrawerService,
  ) {
    super();
    // console.log('SidebarHeaderComponent!');
    if (environment.isArtist) {
      this.logo = '~/assets/images/logo.png';
    } else {
      this.logo = '~/assets/images/logo-drawer.png';
    }
  }

  public login() {
    this.drawerService.toggle(false); // close drawer
    this.firebaseService.googleConnect();
  }
}
