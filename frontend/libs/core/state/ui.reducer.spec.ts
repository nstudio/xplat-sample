import { uiReducer } from './ui.reducer';
import { UIActions } from './ui.action';
import { UIState } from './ui.state';

describe('UIReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;

      const result = uiReducer(undefined, action);
      expect(result).toEqual(UIState.initialState);
    });
  });

  describe('CHANGED', () => {
    it('should update ui state', () => {
      const expectedResult = {
        modal: {
          open: true,
          cmpType: 'Test'
        },
        progressIndicator: {
          page: { enabled: true }
        },
        locale: null
      };
      const action = new UIActions.Changed(expectedResult);

      const result = uiReducer(UIState.initialState, action);
      expect(result).toEqual(expectedResult);
    });

    it('should only update ui state with incoming changes and leave other ui state as is', () => {
      const initialState = {
        modal: {
          open: true,
          cmpType: 'Test'
        },
        progressIndicator: {
          page: { enabled: true }
        }
      };
      const modalChanges = {
        open: false,
        cmpType: null
      };
      const payload = {
        modal: modalChanges
      };
      const action = new UIActions.Changed(payload);
      const expectedResult = {
        // only modal should change
        modal: modalChanges,
        // from initial state:
        progressIndicator: {
          page: { enabled: true }
        }
      };

      const result = uiReducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });
  });
});
