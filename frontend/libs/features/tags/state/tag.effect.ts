// angular
import { Injectable, forwardRef, Inject } from '@angular/core';
// libs
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import {
  map,
  mergeMap,
  startWith,
  exhaustMap,
  concatMap,
  switchMap,
  withLatestFrom,
  filter,
  tap,
  take,
  catchError,
  debounceTime
} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import {
  ApiUser,
  ApiGathering,
  ApiLove,
  ApiTag,
  ApiSketch,
  ApiSponsored,
  Sponsored,
  Gathering,
  Tag,
  Sketch,
  Love,
  User
} from '@sketchpoints/api';
import { Tracking, moveItemTo } from '@sketchpoints/utils';
import {
  environment,
  LogService,
  WindowService,
  ModalService,
  NetworkCommonService,
  UserState,
  UserService
} from '@sketchpoints/core';
// module
import { TagActions } from './tag.action';
import { TagState } from './tag.state';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Injectable()
export class TagEffects {
  @Effect()
  fetchTags$ = this._actions$.pipe(
    ofType(TagActions.Types.FETCH_TAGS),
    concatMap((action: TagActions.FetchTags) => {
      return this._apiTag
        .getTags({})
        .pipe(map(tags => this._handleTags(tags)), catchError(err => of(new TagActions.ApiError(err))));
    })
  );

  private _handleTags(tags: Tag[], persist: boolean = true) {
    if (this._deepLinkTagSlug) {
      this._tags = tags;
      return new TagActions.SelectTag(this._deepLinkTagSlug);
    } else {
      return new TagActions.Changed({ tags });
    }
  }

  @Effect()
  selectTag$ = this._actions$.pipe(
    ofType(TagActions.Types.SELECT_TAG),
    withLatestFrom(this._store.pipe(select(TagState.selectTags))),
    map(([action, tags]: [TagActions.SelectTag, Tag[]]) => {
      tags = tags && tags.length ? tags : this._tags || [];
      const tag = tags.find(t => t.slug === action.payload);
      if (tag) {
        return new TagActions.FetchGatherings({ tag });
      } else {
        this._deepLinkTagSlug = action.payload;
        return { type: 'noop' }; // new TagActions.FetchTags();
      }
    })
  );

  @Effect()
  selectGathering$ = this._actions$.pipe(
    ofType(TagActions.Types.SELECT_GATHERING),
    withLatestFrom(this._store.pipe(select(TagState.selectState)), this._store.pipe(select(UserState.selectCurrent))),
    switchMap(([action, tagState, user]: [TagActions.SelectGathering, TagState.IState, User]) => {
      const slug = action.payload;
      const gatherings = tagState.gatherings && tagState.gatherings.length ? tagState.gatherings : [];
      const gathering = gatherings.find(g => g.slug === slug);
      const tags = tagState.tags;
      const selectedTag = tagState.selectedTag;

      const actions: Array<Action> = [];
      if (gathering) {
        this._handleSketches(actions, user, gathering);
        actions.push(
          new TagActions.Changed({
            selectedGathering: gathering
          })
        );
      } else if (tags && selectedTag) {
        // tags loaded, just need to fetch gatherings
        actions.push(new TagActions.FetchGatherings({ tag: selectedTag }));
      } else {
        this._deepLinkGatheringSlug = slug;
        actions.push({ type: 'noop' });
      }
      return actions;
    })
  );

  @Effect()
  fetchGatherings$ = this._actions$.pipe(
    ofType(TagActions.Types.FETCH_GATHERINGS),
    withLatestFrom(this._store.pipe(select(TagState.selectState)), this._store.pipe(select(UserState.selectCurrent))),
    switchMap(([action, tagState, user]: [TagActions.FetchGatherings, TagState.IState, User]) => {
      let tags = tagState.tags;
      if (this._tags) {
        tags = this._tags;
      }
      const gatherings = tagState.gatherings;

      const isForceReload = action.payload && action.payload.force === true;

      if (gatherings && gatherings.find(g => g.tags.includes(action.payload.tag.slug))) {
        return of(
          new TagActions.Changed({
            selectedTag: action.payload.tag,
            gatherings,
            tags
          })
        );
      } else {
        return this._apiGathering
          .getGatherings({
            match: {
              tags: [action.payload.tag.slug]
            }
          })
          .pipe(
            mergeMap((gatherings: Gathering[]) => this._handleGatherings(action, gatherings, tags, tagState, user)),
            catchError(err => of(new TagActions.ApiError(err)))
          );
      }
    })
  );

  private _handleGatherings(
    action: TagActions.FetchGatherings,
    gatherings: Gathering[],
    tags: Tag[],
    tagState: TagState.IState,
    user: User,
    persist: boolean = true
  ) {
    const actions: Array<Action> = [];
    let selectedGathering: Gathering = tagState.selectedGathering;
    if (this._deepLinkGatheringSlug) {
      selectedGathering = gatherings.find(g => g.slug === this._deepLinkGatheringSlug);
      this._deepLinkGatheringSlug = null; // reset
      this._handleSketches(actions, user, selectedGathering);
    } 
    actions.push(
      new TagActions.Changed({
        tags,
        selectedTag: action.payload.tag,
        gatherings,
        selectedGathering
      })
    );
    return actions;
  }

  @Effect()
  updateGathering$ = this._actions$.pipe(
    ofType(TagActions.Types.UPDATE_GATHERING),
    withLatestFrom(this._store.pipe(select(TagState.selectGatherings))),
    map(([action, gatherings]: [TagActions.UpdateGathering, Gathering[]]) => {
      return new TagActions.Changed({ gatherings });
    })
  );

  @Effect()
  getSketch$ = this._actions$.pipe(
    ofType(TagActions.Types.GET_SKETCH),
    switchMap((action: TagActions.GetSketch) =>
      this._apiSketch
        .getSketch({
          match: {
            userId: action.payload.userId,
            gatheringId: action.payload.gatheringId
          }
        })
        .pipe(
          map((sketch: Sketch) => {
            if (!sketch || (sketch && !sketch.id)) {
              // blank sketch
              sketch = {
                gatheringId: action.payload.gatheringId,
                sketchPages: []
              };
            }
            return new TagActions.Changed({ activeSketch: sketch });
          }),
          // if errors when fetching just reset active sketch
          catchError(err => of(new TagActions.ResetSketch()))
        )
    )
  );

  @Effect()
  getSketches$ = this._actions$.pipe(
    ofType(TagActions.Types.GET_SKETCHES),
    mergeMap((action: TagActions.GetSketches) =>
      combineLatest([
        of(action.payload),
        this._store.pipe(select(TagState.selectSelectedTag), take(1)),
        this._apiSketch
          .getSketches({
            match: {
              gatheringId: action.payload
            }
          })
          .pipe(catchError(err => of(new TagActions.ApiError(err))))
      ])
    ),
    mergeMap((data: [string, Tag, Sketch[]]) => {
      let [gatheringId, selectedTag, sketches] = data;

      // handle deep link issue
      if (!selectedTag && this._deepLinkTagSlug && this._tags) {
        selectedTag = this._tags.find(t => t.slug === this._deepLinkTagSlug);
      }

      return combineLatest([
        of(gatheringId),
        of(sketches),
        // sponsors are on their own table since this should be accessible to non-logged in users
        // find sponsored artist for this tag
        this._apiSponsored
          .getAllSponsors({
            match: {
              tagId: selectedTag.id
            }
          })
          .pipe(
            catchError(err => {
              return of(new TagActions.ApiError(err));
            })
          )
      ]);
    }),
    mergeMap((data: [string, Sketch[], Sponsored[]]) => {
      const [gatheringId, sketches, sponsored] = data;
      const orderedSketches = [...(sketches || [])];
      let activeSketch = orderedSketches.length ? orderedSketches[0] : null;
      let sponsoredArtist: Sponsored;

      if (sponsored && sponsored.length && activeSketch) {
        sponsoredArtist = sponsored[0];

        if (sponsoredArtist) {
          if (sponsoredArtist.users && sponsoredArtist.users.length) {
            // for now, just assume only 1 sponsored artist if any at all
            // TODO: in future, may want to support more than 1 sponsored artist
            const sponsorUser = sponsoredArtist.users[0];
            sponsoredArtist.name = sponsorUser.name;
            sponsoredArtist.userId = sponsorUser.id;
            // when there's a sponsored artist move them to the top always
            const index = sketches.findIndex(s => s.userId === sponsoredArtist.userId);
            if (index > -1) {
              // move to top
              moveItemTo(orderedSketches, index, 0);
            }
            activeSketch = orderedSketches[0];
          }
        }
      }

      let getLoves = of(null);
      if (activeSketch) {
        getLoves = this._apiLove
          .getLoves({
            match: {
              sketchId: activeSketch.id
            }
          })
          .pipe(catchError(err => of(new TagActions.ApiError(err))));
      }

      return combineLatest([
        of(gatheringId),
        this._store.pipe(select(UserState.selectCurrent), take(1)),
        of(orderedSketches),
        of(activeSketch),
        of(sponsoredArtist),
        getLoves
      ]);
    }),
    map((data: [string, User, Sketch[], Sketch, Sponsored, Love[]]) => {
      const [gatheringId, currentUser, sketches, activeSketch, sponsoredArtist, loves] = data;

      let activeLoves: Love[] = [];
      if (currentUser && loves) {
        const loveFilter = (l: Love) => {
          if (activeSketch) {
            return l.userId === currentUser.id && l.sketchId === activeSketch.id;
          } else {
            return l.userId === currentUser.id;
          }
        };
        // user logged in, restore the love from just them for the sketch
        activeLoves = loves.filter(loveFilter);

      }

      let blankSketch: Sketch;
      if (!activeSketch) {
        // fill with blank new sketch
        blankSketch = {
          gatheringId,
          sketchPages: []
        };
      }

      return new TagActions.Changed({
        activeSketch: activeSketch || blankSketch,
        sketches: [...(sketches || [])],
        activeLoves: [...activeLoves],
        loves: [...loves],
        sponsoredArtist
      });
    }),
    // if errors when fetching just reset active sketch
    catchError(err => of(new TagActions.Changed({ sketches: [] })))
  );

  @Effect()
  resetSketch$ = this._actions$.pipe(
    ofType(TagActions.Types.RESET_SKETCH),
    withLatestFrom(
      this._store.pipe(select(UserState.selectCurrent)),
      this._store.pipe(select(TagState.selectSelectedGathering))
    ),
    map(([action, currentUser, selectedGathering]: [TagActions.ResetSketch, User, Gathering]) => {
      // this._log.debug( 'ResetSketch' );
      return new TagActions.Changed({
        activeSketch: {
          userId: currentUser ? currentUser.id : null,
          gatheringId: selectedGathering ? selectedGathering.id : null,
          sketchPages: []
        }
      });
    })
  );

  @Effect()
  createSketch$ = this._actions$.pipe(
    ofType(TagActions.Types.CREATE_SKETCH),
    exhaustMap((action: TagActions.CreateSketch) =>
      this._apiSketch.createSketch(action.payload).pipe(
        map((sketch: Sketch) => {
          return new TagActions.Changed({ activeSketch: sketch });
        }),
        // if errors when fetching just empty out active sketch
        catchError(err => of(new TagActions.Changed({ activeSketch: null })))
      )
    )
  );

  @Effect()
  updateSketch$ = this._actions$.pipe(
    ofType(TagActions.Types.UPDATE_SKETCH),
    withLatestFrom(this._store.pipe(select(TagState.selectActiveSketch))),
    concatMap(([action, activeSketch]: [TagActions.UpdateSketch, Sketch]) => {
      return this._apiSketch.updateSketch(activeSketch.id, action.payload).pipe(
        map((sketch: Sketch) => {
          return new TagActions.Changed({ activeSketch: sketch });
        }),
        // if errors when fetching just empty out active sketch
        catchError(err => of(new TagActions.ApiError(err)))
      );
    })
  );

  @Effect()
  createLove$ = this._actions$.pipe(
    ofType(TagActions.Types.CREATE_LOVE),
    withLatestFrom(this._store.pipe(select(TagState.selectState))),
    concatMap(([action, tagState]: [TagActions.CreateLove, TagState.IState]) =>
      this._apiLove.createLove(action.payload).pipe(
        map((love: Love) => {
          const activeLoves = [...(tagState.activeLoves || [])];
          activeLoves.push(love);
          const loves = [...(tagState.loves || [])];
          loves.push(love);

          return new TagActions.Changed({
            activeLoves,
            loves
          });
        }),
        catchError(err => of(new TagActions.ApiError(err)))
      )
    )
  );

  @Effect()
  updateLove$ = this._actions$.pipe(
    ofType(TagActions.Types.UPDATE_LOVE),
    withLatestFrom(this._store.pipe(select(TagState.selectState))),
    concatMap(([action, tagState]: [TagActions.UpdateLove, TagState.IState]) =>
      this._apiLove.updateLove(action.payload.id, action.payload).pipe(
        map((love: Love) => {
          const updatedActiveLoves = [...(tagState.activeLoves || [])];
          const { __typename, ...updatedLove } = <any>love;
          for (let i = 0; i < updatedActiveLoves.length; i++) {
            if (updatedActiveLoves[i].id === updatedLove.id) {
              updatedActiveLoves[i] = updatedLove;
              break;
            }
          }
          const updatedLoves = [...(tagState.loves || [])];
          for (let i = 0; i < updatedLoves.length; i++) {
            if (updatedLoves[i].id === updatedLove.id) {
              updatedLoves[i] = updatedLove;
              break;
            }
          }
          return new TagActions.Changed({
            activeLoves: updatedActiveLoves,
            loves: updatedLoves
          });
        }),
        catchError(err => of(new TagActions.ApiError(err)))
      )
    )
  );

  @Effect({ dispatch: false })
  apiError$ = this._actions$.pipe(
    ofType(TagActions.Types.API_ERROR),
    tap((action: TagActions.ApiError) => {
      this._log.debug('TODO - tag ApiError handling:', action.payload);
    })
  );

  @Effect()
  init$ = this._actions$.pipe(
    ofType(TagActions.Types.INIT),
    startWith(new TagActions.Init()),
    map((action: TagActions.Init) => {
      this._log.debug('fetching tags on startup...');
      return new TagActions.FetchTags();
    })
  );

  // helpful to aid deep linking
  private _deepLinkTagSlug: string;
  private _deepLinkGatheringSlug: string;
  private _tags: Tag[];

  private _handleSketches(actions: Array<Action>, user: User, gathering: Gathering) {
    if (actions && gathering) {
      if (environment.isArtist) {
        if (user) {
          // check for existing sketch for this user
          actions.push(new TagActions.GetSketch({ userId: user.id, gatheringId: gathering.id }));
        }
      } else {
        // fetch all sketches for this gathering for the viewer
        actions.push(new TagActions.GetSketches(gathering.id));
      }
    }
  }

  constructor(
    private _store: Store<TagState.IState | UserState.IState>,
    private _actions$: Actions,
    @Inject(forwardRef(() => LogService))
    private _log: LogService,
    @Inject(forwardRef(() => WindowService))
    private _win: WindowService,
    private _translateService: TranslateService,
    // instantiates service automatically
    // even though not used this helps ensure single instance is created on boot
    @Inject(forwardRef(() => NetworkCommonService))
    private _network: NetworkCommonService,
    private _userService: UserService,
    private _apiUser: ApiUser,
    private _apiTag: ApiTag,
    private _apiGathering: ApiGathering,
    private _apiSketch: ApiSketch,
    private _apiLove: ApiLove,
    private _apiSponsored: ApiSponsored
  ) {}
}
