import { ActivatedRoute } from '@angular/router';
import { OnInit, OnDestroy, NgZone } from '@angular/core';

// libs
import { Store, select } from '@ngrx/store';
import { Tag, Gathering, Sketch, SketchPage, SketchFrame, latestFrame, Sponsored, Love, User } from '@sketchpoints/api';
import {
  WindowService,
  LogService,
  FirebaseService,
  ModalActions,
  ModalState,
  UIState,
  UserState,
  UserActions,
  UserService
} from '@sketchpoints/core';
import { Tracking, isNativeScript } from '@sketchpoints/utils';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { takeUntil, take, skip, switchMap, withLatestFrom } from 'rxjs/operators';

import { TagService } from '../services/tag.service';
import { FrameService } from '../services/frame.service';
import { TagActions, TagState } from '../state';

// app
import { GatheringDetailBaseComponent } from './gathering-detail.base-component';

export interface IArtist {
  id: string;
  gatheringId: string;
  name: string;
  selected?: boolean;
}
export abstract class SketchViewerBaseComponent extends GatheringDetailBaseComponent implements OnInit, OnDestroy {
  public sketches: Sketch[];
  public isAwaiting = true;
  public loginPromptCnt = 0;
  public promptBadge$: Subject<boolean> = new Subject();
  private _imageSource$: BehaviorSubject<string>;
  private _artists: BehaviorSubject<Array<IArtist>> = new BehaviorSubject([]);
  private _activeSketchSub: Subscription;
  private _listening = false;
  private _promptIfWaiting: number;
  private _promptIfWaitingCnt: number = 0;
  private _loveIcon: string;
  private _activeProductId: string;

  constructor(
    store: Store<TagState.IState>,
    ngZone: NgZone,
    route: ActivatedRoute,
    log: LogService,
    win: WindowService,
    tagService: TagService,
    frameService: FrameService,
    protected userService: UserService,
    public firebase: FirebaseService
  ) {
    super(store, ngZone, route, log, win, tagService, frameService);
    this._imageSource$ = new BehaviorSubject(this.awaitImg);
  }

  public get imageSource$() {
    return this._imageSource$;
  }

  public get imageSource() {
    return this._imageSource$.getValue();
  }

  public set imageSource(value: string) {
    this._imageSource$.next(value);
  }

  public get artists$() {
    return this._artists;
  }

  public get artists() {
    return this._artists.getValue();
  }

  public set artists(value: Array<IArtist>) {
    this._artists.next(value);
  }

  public get promptIfWaiting() {
    return this._promptIfWaiting;
  }

  public set promptIfWaiting(value: number) {
    this._promptIfWaiting = value;
  }

  public get promptIfWaitingCnt() {
    return this._promptIfWaitingCnt;
  }

  public set promptIfWaitingCnt(value: number) {
    this._promptIfWaitingCnt = value;
  }

  public get loveIcon() {
    return this._loveIcon;
  }

  public set loveIcon(value: string) {
    this._loveIcon = value;
  }

  public get activeProductId() {
    return this._activeProductId;
  }

  public set activeProductId(value: string) {
    this._activeProductId = value;
  }

  public considerLogin() {
    let msg = this.isAwaiting
      ? `Awesome you got it! That's how you show love. Even though there is no artist streaming a sketch yet, you can tap 'Ok' to login so you can show them love when they arrive.`
      : null;
    this.promptLogin(msg);
  }

  public promptLogin(msg?: string) {
    this.loginPromptCnt++;
    msg = msg || `Thanks for showing love! Please consider giving this sketch a badge. Tap 'Ok' to login.`;
    if (this.loginPromptCnt) {
      // === 1 || this.loginPromptCnt > 4) {
      this.win
        .confirm(msg, () => {
          this.firebase.googleConnect();
        })
        .then(_ => {}, _ => {});
    }
  }

  public hitMax(e) {
    if (this.userService.current) {
      if (e && !this.isAwaiting) {
        // console.log('hitmax:', e.data);
        if (this.activeBadgeId) {
          this.addLoveBadge().then(_ => {
            this.persistLove();
          });
        } else {
          this.promptBadge();
        }
      }
    } else {
      this.considerLogin();
    }
  }

  public hitBonus(e) {
    if (this.userService.current) {
      if (e && !this.isAwaiting) {
        // console.log('hitmax:', e.data);
        if (this.activeBadgeId) {
          this.addLoveBadge(true).then(_ => {
            this.persistLove();
          });
        }
      }
    }
  }

  public promptBadge() {
    this.resetModal();
    this.modalSub = this.store
      .pipe(
        select(UIState.selectModal),
        takeUntil(this.destroy$),
        skip(1) // only react
      )
      .subscribe((modal: ModalState.IState) => {
        if (!modal.open) {
          const btn = modal.latestResult;
          if (btn) {
            this.activeBadgeId = btn.id;
            this.addLoveBadge(false, btn.color).then(_ => {
              this.persistLove(btn.color);
            });
          }
          this.resetModal(true);
        }
      });
    this.win.dialogOpening$.next(true);
    this.win.setTimeout(_ => {
      this.promptBadge$.next(true);
    });
  }

  public persistLove(color?: string) {
    this.win.setTimeout(_ => {
      this.store
        .pipe(select(TagState.selectActiveLoves), withLatestFrom(this.store), take(1))
        .subscribe(([loves, state]: [Love[], any]) => {
          const badgeId = this.activeBadgeId || 'badge-heart';
          const activeSketch = this.activeSketch || state.tag.activeSketch;
          const love = loves.find(l => l.badgeId === badgeId && l.sketchId === activeSketch.id);
          if (love && love.id) {
            this.log.debug('persistLove() current love with badge:', JSON.stringify(love));
            const heart = this.hearts.find(l => l.badgeId === badgeId);
            const total = heart.total;
            const bonus = heart.bonus;
            // due to graphql returning frozen objects :(
            const { __typename, ...updateLove } = <any>love;
            updateLove.total = total;
            updateLove.bonus = bonus;
            updateLove.badgeId = badgeId;
            if (heart.color) {
              updateLove.color = heart.color;
            }
            this.log.debug('updating love:', JSON.stringify(updateLove));
            this.store.dispatch(new TagActions.UpdateLove(updateLove));
          } else {
            const newLove: Love = {
              userId: state.user.current.id,
              sketchId: activeSketch ? activeSketch.id : null,
              total: 1,
              bonus: 0,
              badgeId
            };
            if (color) {
              newLove.color = color;
            }
            this.log.debug('creating new love:', JSON.stringify(newLove));
            this.store.dispatch(new TagActions.CreateLove(newLove));
          }
        });
    });
  }

  ngOnInit() {
    // Setup first to react to state changes before calling super
    combineLatest([
      this.store.pipe(select(TagState.selectSelectedGathering)),
      this.store.pipe(select(TagState.selectSponsoredArtist)),
      this.artistFilter$
    ])
      .pipe(
        skip(1), // just react after gathering has been set
        takeUntil(this.destroy$),
        switchMap((data: [Gathering, Sponsored, string]) => {
          // TODO: if we bring back in above, we will need to change the destructing here - we could also combine the sponsor match with above possibly
          const [gathering, sponsoredArtist, userId] = data;
          this.sponsoredArtist = sponsoredArtist;
          if (gathering) {
            this._listening = true;
            // listen for all sketches that show up for this gathering
            // doing this by itself is what makes sketches show up when they are none to begin with at all
            const queryParams = [{ name: 'gatheringId', comparator: '==', value: gathering.id }];
            if (userId) {
              // when sketches are present they are filtered by the artist
              queryParams.push({ name: 'userId', comparator: '==', value: userId });
            }
            this.log.debug('listening for sketches with params:', JSON.stringify(queryParams));
            return this.firebase.listenForChanges('sketch', queryParams);
          } else {
            this._listening = false;
            return of(null);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((sketches: any) => {
        if (sketches) {
          this.ngZone.run(() => {
            if (!this.sketches) {
              // artists just arrived to create first sketch for this gathering
              this.store.dispatch(new TagActions.Changed({ sketches }));
            }
            // this.log.debug('sketch listener:', JSON.stringify(sketches));
            const newSketch = sketches[0];
            if (newSketch) {
              const isDifferent =
                this.activeSketch &&
                (this.activeSketch.userId !== newSketch.userId ||
                  this.activeSketch.gatheringId !== newSketch.gatheringId);
              if (!this.activeSketch || isDifferent) {
                this.log.debug(
                  `dispathing "new TagActions.Changed( { activeSketch } )". total sketches:`,
                  sketches.length
                );
                // user switching artist
                this._updateLove(newSketch);
              }

              // check to see if different set of artists for gathering
              const artists = this.artists || [];
              const anyArtists = artists.find(a => a.gatheringId === this.selected.id);
              if (!anyArtists) {
                // reset artist selection states
                this._initArtists(sketches);
              } else if (artists.length) {
                // just selecting artists from the current gathering
                this._selectArtist(artists);
              }

              // this._initArtists(sketches);
              this.log.debug('viewer active sketches:', sketches);
              const url = latestFrame(newSketch);
              if (url) {
                this.log.debug('showing url:', url);
                this.imageSource = url;
                this.isAwaiting = false;
                this.cancelPromptIfWaiting();
              } else {
                // this artist likely reset their sketch and is working on it again
                this.isAwaiting = true;
                this.imageSource = this.awaitArtistImg;
              }
            } else {
              this._resetViewer();
            }
          });
        }
      });

    // this will setup the params to select the gathering which will in turn fire on above
    // TODO: if we use router actions/effects to select the gathering instead of component
    // the order may not matter so much
    super.ngOnInit();
  }

  private _resetViewer() {
    this.log.debug('no sketches yet, resetting.');
    // no sketches yet, reset
    this.isAwaiting = true;
    this.imageSource = this.awaitImg;
    this.artists = [];
    this.activeSketch = null;
    this.sponsoredArtist = null;
    this.store.dispatch(new TagActions.Changed({ activeSketch: null }));
  }

  public cancelPromptIfWaiting() {
    if (typeof this._promptIfWaiting !== 'undefined') {
      this.win.clearTimeout(this._promptIfWaiting);
      this._promptIfWaiting = undefined;
    }
  }

  private _initArtists(sketches: Sketch[]) {
    this.log.debug('_initArtists with sketches:', sketches ? sketches.length : 0);
    if (sketches) {
      const sponsored = this.sponsoredArtist;
      if (sponsored) {
        this.log.debug('sponsored artist:', sponsored.name);
      }
      let artistFilter = this.artistFilter;
      if (!artistFilter) {
        // will always be the sponsoredArtist or first artist in collection
        artistFilter = sponsored ? sponsored.userId : sketches.length ? sketches[0].userId : null;
        this.artistFilter = artistFilter;
      }
      this.artists = sketches.filter(s => (sponsored ? sponsored.userId !== s.userId : s)).map(s => {
        return {
          name: s.artistName,
          id: s.userId,
          gatheringId: s.gatheringId,
          selected: artistFilter ? artistFilter === s.userId : false
        };
      });

      this.log.debug('artists:', this.artists.length ? this.artists.map(a => a.name) : 'none');
    }
  }

  private _selectArtist(artists: Array<IArtist>) {
    const userId = this.artistFilter;
    for (const artist of artists) {
      artist.selected = artist.id === userId;
    }
    this.artists = [...artists];
    this.showTip = false; // reset when switching artists
  }

  private _updateLove(sketch: Sketch) {
    // reset per sketch
    const activeLoves = this.updateHearts(sketch);
    this.store.dispatch(
      new TagActions.Changed({
        activeSketch: sketch,
        activeLoves
      })
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    // reset
    // this.artistFilter = null;
    this.artists = [];
    this.cancelPromptIfWaiting();
  }
}
