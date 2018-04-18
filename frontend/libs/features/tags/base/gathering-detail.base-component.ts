import { OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// libs
import { Store, select } from '@ngrx/store';
import { Tag, Gathering, Sketch, SketchPage, SketchFrame, User, Sponsored, Love } from '@sketchpoints/api';
import {
  WindowService,
  LogService,
  BaseComponent,
  UserState,
  ModalActions
} from '@sketchpoints/core';
import { isObject, Tracking } from '@sketchpoints/utils';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { takeUntil, take, skip } from 'rxjs/operators';

import { TagService } from '../services/tag.service';
import { FrameService } from '../services/frame.service';
import { TagActions, TagState } from '../state';

export interface IPageBrowser {
  url: string;
  selected?: boolean;
}
export abstract class GatheringDetailBaseComponent extends BaseComponent implements OnInit, OnDestroy {
  public selected: Gathering;
  public selectedTag: Tag;
  public awaitImg = 'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fwaiting.png?alt=media';
  public awaitArtistImg = 'https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2Fwait-artist.png?alt=media';
  public isIOSWeb = false;

  private _activeSketch: Sketch;
  private _pageBrowser$: BehaviorSubject<IPageBrowser[]> = new BehaviorSubject([]);
  private _artistFilter$: BehaviorSubject<string> = new BehaviorSubject(null);
  private _sponsoredArtist$: BehaviorSubject<Sponsored> = new BehaviorSubject(null);
  private _hearts$: BehaviorSubject<Array<Love>> = new BehaviorSubject([]);
  private _streaming = false;
  private _streamTimer: number;
  private _frameCnt = 0;
  private _currentPageIndex = 0;
  private _helpOn = false;
  private _showTip = false;
  private _activeBadgeId: string;
  private _modalSub: Subscription;

  constructor(
    protected store: Store<TagState.IState>,
    protected ngZone: NgZone,
    protected route: ActivatedRoute,
    protected log: LogService,
    protected win: WindowService,
    protected tagService: TagService,
    public frameService: FrameService
  ) {
    super();
  }

  public get activeSketch() {
    return this._activeSketch;
  }

  public set activeSketch(value: Sketch) {
    this.log.debug('set activeSketch:', value);
    this._activeSketch = value;
  }

  public get artistFilter$() {
    return this._artistFilter$;
  }

  public get artistFilter() {
    return this._artistFilter$.getValue();
  }

  public set artistFilter(userId: string) {
    this._artistFilter$.next(userId);
  }

  public get sponsoredArtist$() {
    return this._sponsoredArtist$;
  }

  public get sponsoredArtist() {
    return this._sponsoredArtist$.getValue();
  }

  public set sponsoredArtist(value: Sponsored) {
    this._sponsoredArtist$.next(value);
  }

  public get streaming() {
    return this._streaming;
  }

  public set streaming(value: boolean) {
    this._streaming = value;
  }

  public get frameCnt() {
    return this._frameCnt;
  }

  public set frameCnt(value: number) {
    this._frameCnt = value;
  }

  public get currentPageIndex() {
    return this._currentPageIndex;
  }

  public set currentPageIndex(value: number) {
    this._currentPageIndex = value;
  }

  public get pageBrowser$() {
    return this._pageBrowser$;
  }

  public set pageBrowser(value: IPageBrowser[]) {
    this._pageBrowser$.next(value);
  }

  public get hearts$() {
    return this._hearts$;
  }

  public get hearts() {
    return this._hearts$.getValue();
  }

  public set hearts(value: Array<Love>) {
    this._hearts$.next(value);
  }

  public get activeBadgeId() {
    return this._activeBadgeId;
  }

  public set activeBadgeId(value: string) {
    this._activeBadgeId = value;
  }

  public get helpOn() {
    return this._helpOn;
  }

  public set helpOn(value: boolean) {
    this._helpOn = value;
  }

  public get showTip() {
    return this._showTip;
  }

  public set showTip(value: boolean) {
    this._showTip = value;
  }

  public get modalSub() {
    return this._modalSub;
  }

  public set modalSub(value: Subscription) {
    this._modalSub = value;
  }

  public selectPage(index: number) {
    const pages = [...(this._pageBrowser$.getValue() || [])];
    for (let i = 0; i < pages.length; i++) {
      if (i === index) {
        pages[i].selected = true;
      } else {
        pages[i].selected = false;
      }
    }
    this.pageBrowser = pages;
  }

  ngOnInit(): void {
    this.store
      .pipe(
        select(TagState.selectActiveSketch),
        takeUntil(this.destroy$)
        // skip( 1 ) // just reactions
      )
      .subscribe((sketch: Sketch) => {
        if (sketch) {
          if (sketch.id) {
            // TODO: graphql response objects are frozen :(
            // https://github.com/apollographql/apollo-client/issues/1909
            // create clone so we can mutate during sketch session before persisting updates
            const sketchPages: SketchPage[] = [];
            if (sketch.sketchPages) {
              for (const page of sketch.sketchPages) {
                const sketchFrames: SketchFrame[] = [];
                if (page.sketchFrames) {
                  for (const frame of page.sketchFrames) {
                    let { __typename, ...fr } = <any>frame;
                    sketchFrames.push(fr);
                  }
                }
                let { __typename, ...p } = <any>page;
                sketchPages.push({
                  ...p,
                  sketchFrames
                });
              }
            }
            let { __typename, ...sk } = <any>sketch;
            this.activeSketch = {
              ...sk,
              sketchPages
            };
            // this.log.debug('set activeSketch:', JSON.stringify(this.activeSketch));
            // this.log.debug('gatheringdetailbase set activeSketch with id:', this.activeSketch.id);
            // this.log.debug('activeSketch.sketchPages.length:', this.activeSketch.sketchPages.length);
            if (this.activeSketch.sketchPages.length === 0) {
              // reset page tracker
              this.currentPageIndex = 0;
            }
            // only show pages which have been completed with their latest frame
            this.pageBrowser = this._filterCompletedPages(this.activeSketch.sketchPages);
            this.updateHearts(this.activeSketch);
          } else {
            this.activeSketch = sketch ? { ...sketch } : null;
            this.pageBrowser = [];
          }
        } else {
          // // blank sketch
          // this.activeSketch = {
          //   gatheringId: this.selected.id,
          //   sketchPages: []
          // };
          // this.pageBrowser = [];
        }
      });

    this.store.pipe(select(TagState.selectState), takeUntil(this.destroy$)).subscribe((state: TagState.IState) => {
      this.selectedTag = state.selectedTag;
      const gathering = state.selectedGathering;
      if (this.selected && gathering && this.selected.id !== gathering.id) {
        // user navigating through gathering detail views without leaving them
        // always reset stream to beginning
        this.resetStreamStart();

        if (state.activeLoves && state.activeLoves.length) {
          // change activeBadge based on activeLoves
          // for now, just use first one
          this.activeBadgeId = state.activeLoves[0].badgeId;
          this.log.debug('setting activeBadgeId:', this.activeBadgeId);
        } else {
          this.activeBadgeId = null;
        }
      }
      this.selected = state.selectedGathering;
    });

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const slug = params['slug'];
      this.log.debug('params changed new slug:', slug);
      // if (this.selected && this.selected.slug !== slug) {
      //   // reset when changing routes
      //   this.hearts = [];
      //   this.artistFilter = null;
      //   this.sponsoredArtist = null;
      // }
      // reset when changing routes
      this.hearts = [];
      this.artistFilter = null;
      this.sponsoredArtist = null;
      this.showTip = false;
      this.store.dispatch(new TagActions.SelectGathering(slug));
    });
  }

  public updateHearts(sketch: Sketch) {
    let activeLoves = [];
    this.hearts = [];
    if (sketch) {
      combineLatest([this.store.pipe(select(TagState.selectLoves)), this.store.pipe(select(UserState.selectCurrent))])
        .pipe(take(1))
        .subscribe((data: [Love[], User]) => {
          const [loves, user] = data;
          // this.log.debug('_updateLove user.id:', user.id);
          // this.log.debug('_updateLove sketch:', sketch.id);
          // this.log.debug('_updateLove loves:', JSON.stringify(loves));
          if (loves && user) {
            activeLoves = [...(loves || []).filter(l => l.userId === user.id && l.sketchId === sketch.id)];
            this.log.debug('activeLoves:', JSON.stringify(activeLoves));
            this.hearts = activeLoves.map(l => {
              let { __typename, ...love } = <any>l;
              return {
                ...love,
                icon: `https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2F${
                  l.badgeId
                }.png?alt=media`
              };
            });

            if (activeLoves.length === 0) {
              // reset activebadge
              this.activeBadgeId = null;
            } else if (!this.activeBadgeId) {
              // change activeBadge based on activeLoves
              // for now, just use first one
              this.activeBadgeId = activeLoves[0].badgeId;
              this.log.debug('setting activeBadgeId from updateHearts:', this.activeBadgeId);
            }
          }
        });
    }
    return activeLoves;
  }

  public addLoveBadge(bonus?: boolean, color?: string) {
    return new Promise(resolve => {
      const hearts = [...(this.hearts || [])];
      const existingBadge = hearts.find(h => h.badgeId === this.activeBadgeId);
      if (existingBadge) {
        if (bonus) {
          existingBadge.bonus = existingBadge.bonus + 1;
        } else {
          existingBadge.total = existingBadge.total + 1;
        }
      } else {
        const icon = `https://firebasestorage.googleapis.com/v0/b/sketchpoints-c5004.appspot.com/o/app-assets%2F${
          this.activeBadgeId
        }.png?alt=media`;
        let bonusCnt = bonus ? 1 : 0;
        let love: Love = {
          icon,
          total: 1,
          bonus: bonusCnt,
          sketchId: this.activeSketch.id,
          badgeId: this.activeBadgeId
        };
        if (color) {
          love.color = color;
        }
        hearts.push(love);
      }
      this.hearts = hearts;
      resolve();
    });
  }

  public toggleStream() {
    this._streaming = !this._streaming;
    if (this._streaming) {
      this.frameService.startSketchTime();
      // implementation [omitted] for stream handling...
    } else {
      this.resetStreamTimer();
    }
  }

  public resetStreamTimer() {
    this.frameService.stopSketchTime();
  }

  public resetStreamStart() {
    this.frameCnt = 0;
    this.frameService.resetStreamStart();
  }

  public resetModal(resetState?: boolean) {
    if (this.modalSub) {
      this.modalSub.unsubscribe();
      this.modalSub = undefined;
    }
    if (resetState) {
      // reset result
      this.store.dispatch(
        new ModalActions.Closed({
          open: false,
          latestResult: null
        })
      );
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.streaming) {
      // ensure stream is turned off
      this.toggleStream();
    }
    this.store.dispatch(
      new TagActions.Changed({
        selectedGathering: null,
        activeSketch: null
      })
    );
  }

  private _filterCompletedPages(pages: SketchPage[]): IPageBrowser[] {
    if (pages) {
      return pages.filter(page => page.completed).map(p => {
        // always latest frame from each page
        const pb: IPageBrowser = {
          url: p.sketchFrames[p.sketchFrames.length - 1].url
        };
        return pb;
      });
    }
    return [];
  }
}
