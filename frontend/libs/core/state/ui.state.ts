import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ModalState } from './modal.state';
import { LocaleState } from './locale.state';

export namespace UIState {
  export interface IState {
    locale?: LocaleState.Locale;
    modal?: ModalState.IState;
  }

  export const initialState: IState = {
    locale: null,
    modal: ModalState.initialState
  };

  export const selectUi = (state: any) => state.ui;
  export const selectModal = createSelector(selectUi, (state: IState) => state.modal);
  export const selectLocale = createSelector(selectUi, (state: IState) => state.locale);
}
