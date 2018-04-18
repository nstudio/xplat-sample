import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Tag, Gathering, Sketch, Sponsored, Love, User } from '@sketchpoints/api';

export namespace TagState {
  export interface IState {
    tags?: Tag[];
    selectedTag?: Tag;
    gatherings?: Gathering[];
    selectedGathering?: Gathering;
    activeSketch?: Sketch;
    sketches?: Sketch[]; // viewer: all sketches for the selectedGathering
    activeLoves?: Love[]; // viewer: all the love a user has given to activeSketch
    loves?: Love[]; // viewer: love that all users have given to activeSketch
    sponsoredArtist?: Sponsored;
  }

  export const initialState: IState = {
    tags: [],
    gatherings: []
  };

  export const selectState = createFeatureSelector<IState>('tag');
  export const selectTags = createSelector(selectState, (state: IState): Tag[] => state.tags);
  export const selectSelectedTag = createSelector(
    selectState,
    (state: IState): Tag => (state.selectedTag ? state.selectedTag : null)
  );
  export const selectGatherings = createSelector(selectState, (state: IState): Gathering[] => state.gatherings);
  export const selectSelectedGathering = createSelector(
    selectState,
    (state: IState): Gathering => state.selectedGathering
  );
  export const selectActiveSketch = createSelector(selectState, (state: IState): Sketch => state.activeSketch);
  export const selectSketches = createSelector(selectState, (state: IState): Sketch[] => state.sketches);
  export const selectActiveLoves = createSelector(selectState, (state: IState): Love[] => state.activeLoves);
  export const selectLoves = createSelector(selectState, (state: IState): Love[] => state.loves);
  export const selectSponsoredArtist = createSelector(selectState, (state: IState): Sponsored => state.sponsoredArtist);
}
