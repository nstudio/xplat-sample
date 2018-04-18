import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDrawer } from '@angular/material/sidenav';

// libs
import { Store } from '@ngrx/store';
import { LogService } from '@sketchpoints/core';
import { LayoutBaseComponent } from '@sketchpoints/features';
import { takeUntil, filter } from 'rxjs/operators';

@Component( {
  selector: 'sp-layout',
  templateUrl: './layout.component.html'
} )
export class LayoutComponent extends LayoutBaseComponent {

  public isMobile = false;
  @ViewChild('sidenav') private _sidenav: MatDrawer;

  constructor(
    protected cdRef: ChangeDetectorRef,
    protected log: LogService,
    private _router: Router,
    private _breakpointObserver: BreakpointObserver
  ) {
    super( cdRef );
    // this.page.on('loaded', this.onLoaded, this);
    this.appName = 'SketchPoints';

    this._breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe( result => {
      this.isMobile = result.matches;
    } );

    this._router.events.pipe(
      filter(e => this.isMobile && e instanceof NavigationEnd)
    ).subscribe(e => {
      if (this._sidenav && this._sidenav.opened) {
        this._sidenav.close();
      }
    })
  }
}
