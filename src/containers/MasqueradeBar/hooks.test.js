import { MockUseState } from 'testUtils';
import { apiHooks, reduxHooks } from 'hooks';

import * as hooks from './hooks';
import messages from './messages';

jest.mock('hooks', () => ({
  apiHooks: {
    useMasqueradeAs: jest.fn(),
    useClearMasquerade: jest.fn(),
  },
  reduxHooks: {
    useMasqueradeData: jest.fn(),
  },
}));

const masqueradeAs = jest.fn();
const clearMasquerade = jest.fn();
apiHooks.useMasqueradeAs.mockReturnValue(masqueradeAs);
apiHooks.useClearMasquerade.mockReturnValue(clearMasquerade);
const state = new MockUseState(hooks);
const testValue = 'test-value';

describe('MasqueradeBar hooks', () => {
  const authenticatedUser = {
    administrator: true,
  };
  const defaultMasqueradeData = {
    isMasquerading: false,
    isMasqueradingFailed: false,
    isMasqueradingPending: false,
    masqueradeErrorStatus: null,
  };
  const createHook = (masqueradeData = {}, user = undefined) => {
    reduxHooks.useMasqueradeData.mockReturnValueOnce({
      ...defaultMasqueradeData,
      ...masqueradeData,
    });
    return hooks.useMasqueradeBarData({ authenticatedUser: user || authenticatedUser });
  };

  describe('state values', () => {
    state.testGetter(state.keys.masqueradeInput);
    state.testGetter(state.keys.isCollapsed);
  });
  describe('useMasqueradeBarData', () => {
    beforeEach(() => state.mock());
    afterEach(state.restore);
    test('canMasquerade', () => {
      const out = createHook();
      expect(out.canMasquerade).toEqual(true);
    });
    test('cannotMasquerade', () => {
      const out = createHook({}, { administrator: false });
      expect(out.canMasquerade).toEqual(false);
    });
    test('masqueradeErrorStatus', () => {
      let out = createHook();
      expect(out.masqueradeErrorMessage).toBeNull();
      out = createHook({ masqueradeErrorStatus: 0 });
      expect(out.masqueradeErrorMessage).not.toBeNull();
    });
    test('isMasqueradePending', () => {
      let out = createHook();
      expect(out.isMasqueradingPending).toEqual(false);
      out = createHook({ isMasqueradingPending: true });
      expect(out.isMasqueradingPending).toEqual(true);
    });
    test('handleMasqueradeInputChange', () => {
      const out = createHook();
      expect(state.stateVals.masqueradeInput).toEqual('');
      out.handleMasqueradeInputChange({ target: { value: testValue } });
      expect(state.setState.masqueradeInput).toHaveBeenCalledWith(testValue);
    });
    test('handleMasqueradeSubmit', () => {
      const out = createHook();
      const preventDefault = jest.fn();
      // make sure submit doesn't refresh the page
      out.handleMasqueradeSubmit(testValue)({
        preventDefault,
      });
      expect(masqueradeAs).toHaveBeenCalledWith(testValue);
      expect(preventDefault).toHaveBeenCalled();
    });
    test('handleClearMasquerade', () => {
      const out = createHook();
      out.handleClearMasquerade();
      expect(clearMasquerade).toHaveBeenCalled();
    });
    test('handleToggleCollapsed', () => {
      const out = createHook();
      expect(out.isCollapsed).toEqual(false);
      out.handleToggleCollapsed();
      const [updater] = state.setState.isCollapsed.mock.calls[0];
      expect(updater(false)).toEqual(true);
      expect(hooks.readCollapsedPreference()).toEqual(true);
      expect(updater(true)).toEqual(false);
      expect(hooks.readCollapsedPreference()).toEqual(false);
    });
    test('is never collapsed while masquerading', () => {
      state.mockVal(state.keys.isCollapsed, true);
      expect(createHook().isCollapsed).toEqual(true);
      expect(createHook({ isMasquerading: true }).isCollapsed).toEqual(false);
    });
  });

  describe('collapsed preference', () => {
    beforeEach(() => window.localStorage.clear());
    test('defaults to expanded when nothing is stored', () => {
      expect(hooks.readCollapsedPreference()).toEqual(false);
    });
    test('round-trips through storage', () => {
      hooks.writeCollapsedPreference(true);
      expect(hooks.readCollapsedPreference()).toEqual(true);
      hooks.writeCollapsedPreference(false);
      expect(hooks.readCollapsedPreference()).toEqual(false);
    });
    test('survives storage that throws on access', () => {
      const getItem = jest.spyOn(Storage.prototype, 'getItem')
        .mockImplementation(() => { throw new Error('denied'); });
      const setItem = jest.spyOn(Storage.prototype, 'setItem')
        .mockImplementation(() => { throw new Error('denied'); });
      expect(hooks.readCollapsedPreference()).toEqual(false);
      expect(() => hooks.writeCollapsedPreference(true)).not.toThrow();
      getItem.mockRestore();
      setItem.mockRestore();
    });
  });

  describe('getMasqueradeErrorMessage', () => {
    test('null', () => {
      expect(hooks.getMasqueradeErrorMessage()).toBeNull();
    });
    test('404', () => {
      expect(hooks.getMasqueradeErrorMessage(404)).toEqual(messages.NoStudentFound);
    });
    test('default', () => {
      expect(hooks.getMasqueradeErrorMessage(500)).toEqual(messages.UnknownError);
    });
  });
});
