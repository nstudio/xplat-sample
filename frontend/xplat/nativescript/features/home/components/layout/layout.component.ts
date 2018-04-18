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
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { WindowService } from '@sketchpoints/core';
import { LayoutBaseComponent } from '@sketchpoints/features';

// nativescript
import { Page } from 'tns-core-modules/ui/page';
import { RadSideDrawerComponent } from 'nativescript-ui-sidedrawer/angular';
import {
  PushTransition,
  DrawerTransitionBase,
  SlideInOnTopTransition,
  ScaleDownPusherTransition,
  ReverseSlideOutTransition,
  SlideAlongTransition
} from 'nativescript-ui-sidedrawer';
import { RouterExtensions } from 'nativescript-angular/router';
import { isAndroid } from 'tns-core-modules/platform';

// app
// import { AppService, DrawerService } from '@sketchpoints/nativescript/core';
import { AppService } from '@sketchpoints/nativescript/core/services/app.service';
import { DrawerService } from '@sketchpoints/nativescript/core/services/drawer.service';

@Component( {
  moduleId: module.id,
  selector: 'sp-layout',
  templateUrl: './layout.component.html'
} )
export class LayoutComponent extends LayoutBaseComponent implements AfterViewInit {
  @ViewChild( RadSideDrawerComponent ) public drawerComponent: RadSideDrawerComponent;
  private _sideDrawerTransition: DrawerTransitionBase;

  constructor(
    protected cdRef: ChangeDetectorRef,
    @Inject( Page ) private page: Page,
    private vcRef: ViewContainerRef,
    private translate: TranslateService,
    private routerExt: RouterExtensions,
    private win: WindowService,
    public appService: AppService,
    public drawerService: DrawerService,
  ) {
    super( cdRef );
    // this.page.on('loaded', this.onLoaded, this);
    this._sideDrawerTransition = new SlideInOnTopTransition();
  }

  public get sideDrawerTransition(): DrawerTransitionBase {
    return this._sideDrawerTransition;
  }

  ngAfterViewInit() {
    this.drawerService.drawer = this.drawerComponent.sideDrawer;
    this.cdRef.detectChanges();
  }
}
