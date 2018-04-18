import { Component, ViewChild, ElementRef, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// libs
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime, takeUntil, skip, take, filter } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Sketch, SketchPage, SketchFrame, User, latestSketchFrame } from '@sketchpoints/api';
import {
  LogService,
  WindowService,
  ModalActions,
  RouterActions,
  UIState,
  ModalState,
  FirebaseService,
  UserState
} from '@sketchpoints/core';
import {
  GatheringDetailBaseComponent,
  IPageBrowser,
  TagService,
  TagState,
  TagActions,
  FrameService,
  ISelectGroup,
  ISelectItem,
  IHelpTip
} from '@sketchpoints/features';
import { isString, Tracking } from '@sketchpoints/utils';
import {
  DrawerService,
  AppService,
  resizeImage,
} from '@sketchpoints/nativescript';
import { ColorPicker } from 'nativescript-color-picker';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { Page } from 'tns-core-modules/ui/page';
import { Slider } from 'tns-core-modules/ui/slider';
import { Color } from 'tns-core-modules/color';
import { getImage } from 'tns-core-modules/http';
import { isIOS } from 'tns-core-modules/platform';
import { fromFile, fromNativeSource } from 'tns-core-modules/image-source';
import { knownFolders, path } from 'tns-core-modules/file-system';
import { shareImage, shareUrl } from 'nativescript-social-share';

// app
import { ArtistService } from '../../services/artist.service';
import { ModalBackgroundComponent } from '../../../shared/components/modal-background/modal-background.component';

@Component({
  selector: 'sp-artist',
  moduleId: module.id,
  templateUrl: './artist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistComponent extends GatheringDetailBaseComponent {
  @ViewChild('slider') private _sliderEl: ElementRef;

  private _slider: Slider;
  private _sliderChange: Observable<any>;
  private _colorPicker: ColorPicker;

  constructor(
    protected store: Store<any>,
    protected ngZone: NgZone,
    protected route: ActivatedRoute,
    protected log: LogService,
    protected win: WindowService,
    protected tagService: TagService,
    public frameService: FrameService,
    private _page: Page,
    private _router: Router,
    private _translate: TranslateService,
    private _drawer: DrawerService,
    private _appService: AppService,
    private _firebase: FirebaseService,
    public artist: ArtistService
  ) {
    super(store, ngZone, route, log, win, tagService, frameService);
    this._colorPicker = new ColorPicker();
  }

  ngAfterViewInit() {
    // helps with various global view handling adjustments
    // implementation [omitted] - this would usually handle ref to the drawing plugin
    this.artist.toggleEnabled(true);
    this.log.debug('artist ngAfterViewInit');

    this._slider = <Slider>this._sliderEl.nativeElement;
    if (this._slider) {
      // trigger penWidth to set it since the nativeview inits it under hood to it's own default
      this._slider.value = this.artist.penWidth;
      this._widthChange(true);

      this._sliderChange = fromEvent(this._slider, 'valueChange');
      this._sliderChange.pipe(takeUntil(this.destroy$), debounceTime(200)).subscribe(e => this._widthChange(e));
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    // reset various global view handling adjustments
    this.artist.toggleEnabled(false);
  }

  public markDone() {
    // marking sketch done logic here...
  }

  public addPage(advanceNext: boolean = true) {
    // add page logic here...
  }

  public completePage() {
    return new Promise((resolve, reject) => {
      // complete page logic here...
      resolve();
    });
  }

  public viewCurrentPage() {
    // implementation [omitted] here...
  }

  public viewPage(index: number) {
    // implementation [omitted] here...
  }

  public save(): Promise<string> {
    return new Promise(resolve => {
      this.saveFrame().then((url: string) => {
        this.frameCnt++;
        resolve(url);
      });
    });
  }

  public share() {
    // implementation [omitted]...
  }

  public selectBackground() {
    this.resetModal();
    this.modalSub = this.store
      .pipe(
        select(UIState.selectModal),
        takeUntil(this.destroy$),
        skip(1) // only react
      )
      .subscribe((modal: ModalState.IState) => {
        if (!modal.open) {
          const isClear = modal.latestResult === 'clear';
          // implementation [omitted]...

          this.resetModal(true);
        }
      });
    this.store.dispatch(
      new ModalActions.Open({
        cmpType: ModalBackgroundComponent,
        modalOptions: {
          viewContainerRef: this.win.vcRef,
          context: {
            title: 'Select Background'
          }
        }
      })
    );
  }

  public resetAll() {
    // implementation [omitted] here...
  }

  public unlock() {
    this.win.alert('This prompts to unlock and start stream in production app.');
  }

  private _hasPurchased() {
    return new Promise((resolve, reject) => {
      // implementation [omitted] here...
      resolve();
    });
  }

  public confirmColorRemove(color?: string) {
    // fix issue since (tap) and (longPress) on same element, just select last used color after this triggers
    const colors = this.artist.usedColors;
    this.artist.penColor = colors[colors.length - 1];
    this.win
      .confirm('Do you want to clear this saved color?', () => {
        this.artist.removeUsedColor(color);
      })
      .then(_ => {}, _ => {});
  }

  public reuseColor(color?: string) {
    this.ngZone.run(() => {
      // save current color
      this.artist.addUsedColor(this.artist.penColor);
      // change color
      this.artist.penColor = color;
    });
  }

  public selectColor(color?: string) {
    const currentColor = this.artist.penColor;
    this._colorPicker
      .show(color || currentColor, 'HEX')
      .then((result: any) => {
        if (result) {
          this.ngZone.run(() => {
            this.artist.addUsedColor(currentColor);
            this.log.debug(result);
            this.artist.penColor = result;
          });
        } else {
          this.win.alert('Sorry about that but the color did not come through. Please pick that color again.');
        }
      })
      .catch((err: any) => {
        this.log.debug(err);
      });
  }

  public clear() {
    // implementation [omitted] here...
  }

  public toggleEraseTool() {
    this.artist.eraser = !this.artist.eraser;
  }

  public saveFrame() {
    return new Promise((resolve, reject) => {
      // implementation [omitted] here...
      resolve();
    });
  }

  private _widthChange(e: any) {
    if (e && this._slider) {
      const value = +this._slider.value;
      if (value) {
        const width = +value.toFixed(2);
        this.artist.penWidth = width;
      }
    }
  }
}
