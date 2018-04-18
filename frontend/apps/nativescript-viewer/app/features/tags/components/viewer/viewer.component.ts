import { Component, ViewChild, ElementRef, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// libs
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime, takeUntil, skip, take } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Page } from 'tns-core-modules/ui/page';
import { AnimationCurve } from 'tns-core-modules/ui/enums';
import { fromFile, ImageSource } from 'tns-core-modules/image-source';
import { getImage } from 'tns-core-modules/http';
import { openUrl } from 'tns-core-modules/utils/utils';
import { User } from '@sketchpoints/api';
import {
  LogService,
  WindowService,
  ModalActions,
  RouterActions,
  FirebaseService,
  UIState,
  ModalState,
  UserState,
  UserActions,
  UserService
} from '@sketchpoints/core';
import {
  SketchViewerBaseComponent,
  TagService,
  FrameService,
  IHelpTip,
  TagState,
  getAppProducts,
  IViewerProducts
} from '@sketchpoints/features';
import { DrawerService, AppService } from '@sketchpoints/nativescript';
import { shareImage, shareUrl } from 'nativescript-social-share';

// app
import { ModalBadgesComponent } from '../../../shared/components/modal-badges/modal-badges.component';

@Component({
  selector: 'sp-viewer-demo',
  moduleId: module.id,
  templateUrl: './viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewerComponent extends SketchViewerBaseComponent {
  public image$: BehaviorSubject<any> = new BehaviorSubject(this.awaitImg);

  constructor(
    protected store: Store<any>,
    protected ngZone: NgZone,
    protected route: ActivatedRoute,
    protected log: LogService,
    protected win: WindowService,
    protected tagService: TagService,
    public frameService: FrameService,
    public userService: UserService,
    public firebase: FirebaseService,
    private _router: Router,
    private _translate: TranslateService,
    private _drawer: DrawerService,
    private _page: Page,
    private _appService: AppService
  ) {
    super(
      store,
      ngZone,
      route,
      log,
      win,
      tagService,
      frameService,
      userService,
      firebase
    );
  }

  ngOnInit() {
    super.ngOnInit();

    if (this.selectedTag && this.selectedTag.loveIcon) {
      this.loveIcon = this.selectedTag.loveIcon;
      this.log.debug('love icon url:', this.loveIcon);
      getImage(this.loveIcon).then(
        img => {
          this.log.debug('love icon preloaded.');
        },
        err => {
          this.log.debug('love icon preload error:', err);
        }
      );
    } else {
      this.loveIcon = 'assets/images/ng.png';
    }

    this.imageSource$.pipe(takeUntil(this.destroy$)).subscribe(url => {
      if (url) {
        this.log.debug('imageSource url:', url);
        getImage(url).then(
          img => {
            this.log.debug('img from getImage:', img);
            this.ngZone.run(() => {
              this.image$.next(img);
            });
          },
          err => {}
        );
      }
    });

    this.promptBadge$.pipe(takeUntil(this.destroy$)).subscribe(_ => {
      this.store.dispatch(
        new ModalActions.Open({
          cmpType: ModalBadgesComponent,
          modalOptions: {
            viewContainerRef: this.win.vcRef,
            context: {
              title: 'Badges'
            }
          }
        })
      );
    });
  }

  ngAfterViewInit() {

    if (!this.helpOn && this.isAwaiting && this.promptIfWaitingCnt === 0) {
      // TODO: may shown at different cnt times with this.promptIfWaitingCnt
      // if user sits looking at screen, prompt them to go to artist app
      this.promptIfWaiting = this.win.setTimeout(_ => {
        const src = this.imageSource;
        if (src !== this.awaitImg && src !== this.awaitArtistImg) {
          this.promptIfWaitingCnt = this.promptIfWaitingCnt++;
          this.win
            .confirm(
              `Would you like to create a sketch? Tap 'Ok' to jump over to the 'SPArtist' app to sketch on this.`,
              () => {
                openUrl('https://itunes.apple.com/us/app/spartist/id1349560119?mt=8');
              }
            )
            .then(
              _ => {
                // ignore
              },
              _ => {
                // ignore
              }
            );
        }
      }, 10000);
    }
  }

  public tip(type: number) {
    // payment processing...
  }

  private _showError() {
    this.win.alert('Sorry, there might be a connection issue to the store.');
  }

  public cancelTip() {
    this.showTip = false;
  }

  public share() {
    if (this._appService.user) {
      if (this.isAwaiting) {
        this.win.alert('You probably want to wait until there is some artwork here ;)');
      } else {
        // TODO: have this grab the latest frame
        getImage(this.imageSource$.getValue()).then(
          img => {
            shareImage(img, 'How would you like to share this sketch?');
          },
          err => {
            this.win.alert(`We're sorry, an error occurred while trying to download this image.`);
          }
        );
      }
    } else {
      this.resetModal();
      this.modalSub = this.store
        .pipe(
          select(UserState.selectCurrent),
          takeUntil(this.destroy$),
          skip(1) // only react
        )
        .subscribe((user: User) => {
          if (user) {
            this.resetModal();
            this.win.setTimeout(_ => {
              // just initiate share after they logged in
              this.share();
            }, 300);
          }
        });
      this.win.confirm(`Login with Google to share, it'll take just a second.`, () => {
        this.ngZone.run(() => {
          this.firebase.googleConnect();
        });
      });
    }
  }
}
