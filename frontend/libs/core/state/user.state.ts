import { createFeatureSelector, createSelector } from '@ngrx/store';
import { User, Donation } from '@sketchpoints/api';

export namespace UserState {
  export interface IState {
    /**
     * Current Authenticated User
     */
    current?: User;
    // all donations user has contributed to artist sketches
    donations?: Donation[];
  }

  export const initialState: IState = {};

  export const selectUser = (state: any) => state.user;
  export const selectCurrent = createSelector(selectUser, (state: IState): User => state.current);
  export const selectDonations = createSelector(selectUser, (state: IState): Donation[] => state.donations);
}
