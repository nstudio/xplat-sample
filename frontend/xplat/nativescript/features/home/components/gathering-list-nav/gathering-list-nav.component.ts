import {
  Component,
  ViewChild,
  ViewContainerRef,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  Inject,
  OnInit
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

// libs
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { WindowService, FirebaseService, ModalActions, UserService } from '@sketchpoints/core';
import { GatheringsBaseComponent, TagState } from '@sketchpoints/features';

// nativescript
import { Page } from 'tns-core-modules/ui/page';
import { RouterExtensions } from 'nativescript-angular/router';
import { isAndroid } from 'tns-core-modules/platform';

// app
import { AppService, DrawerService } from '@sketchpoints/nativescript/core';
import { ModalWebViewComponent } from '@sketchpoints/nativescript/features/ui';

@Component( {
  moduleId: module.id,
  selector: 'sp-gathering-list-nav',
  templateUrl: './gathering-list-nav.component.html'
} )
export class GatheringListNavComponent extends GatheringsBaseComponent implements OnInit {

  constructor(
    protected store: Store<TagState.IState>,
    protected router: Router,
    private routerExt: RouterExtensions,
    private win: WindowService,
    private firebaseService: FirebaseService,
    public appService: AppService,
    public drawerService: DrawerService,
    public userService: UserService,
  ) {
    super( store, router );
    // console.log('GatheringListNavComponent');
  }

  public login() {
    this.drawerService.toggle(false); // close drawer
    this.firebaseService.googleConnect();
  }

  public changeNav( route ) {
    let routePath = '/';
    if (route && route.length) {
      routePath = '/' + route.slice(1).join('/');
    }
    if ( this.activeUrl !== routePath ) {
      this.win.setTimeout( _ => {
        this.routerExt.navigate( route );
      }, 400 );
    } else {
      this.drawerService.toggle( false );
    }
  }

  public viewWeb() {
    this.drawerService.toggle(false);
    this.store.dispatch(new ModalActions.Open({
      cmpType: ModalWebViewComponent,
      modalOptions: {
        viewContainerRef: this.win.vcRef,
        context: {
          title: 'nStudio',
          url: 'https://nstudio.io'
        }
      }
    }))
  }
}
