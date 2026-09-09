import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';

import { apiHooks, reduxHooks } from 'hooks';
import { StrictDict } from 'utils';
import * as module from './hooks';

import messages from './messages';

export const state = StrictDict({
  masqueradeInput: (val) => React.useState(val), // eslint-disable-line
  isCollapsed: (val) => React.useState(val), // eslint-disable-line
});

export const COLLAPSED_STORAGE_KEY = 'masqueradeBar.collapsed';

// Reading and writing are both wrapped: a private window, or a browser set to
// block site data, throws on access rather than answering null, and the bar has
// to render correctly with no stored value at all.
export const readCollapsedPreference = () => {
  try {
    return window.localStorage.getItem(COLLAPSED_STORAGE_KEY) === 'true';
  } catch (e) {
    return false;
  }
};

export const writeCollapsedPreference = (value) => {
  try {
    window.localStorage.setItem(COLLAPSED_STORAGE_KEY, String(value));
  } catch (e) {
    // Losing the preference is not worth breaking the bar over.
  }
};

// The preference is remembered because the bar sits on every page of the
// dashboard: if minimizing only lasted until the next reload, it would not be
// worth doing. It is per-viewer and per-browser, which is the right scope for a
// "get this out of my way" control.
export const useCollapsedState = () => {
  const [isCollapsed, setIsCollapsed] = module.state.isCollapsed(module.readCollapsedPreference());
  const handleToggleCollapsed = () => {
    setIsCollapsed((wasCollapsed) => {
      module.writeCollapsedPreference(!wasCollapsed);
      return !wasCollapsed;
    });
  };
  return { isCollapsed, handleToggleCollapsed };
};

export const useMasqueradeInput = () => {
  const [masqueradeInput, setMasqueradeInput] = module.state.masqueradeInput('');
  const handleMasqueradeInputChange = (e) => setMasqueradeInput(e.target.value);
  return {
    handleMasqueradeInputChange,
    masqueradeInput,
  };
};

const masqueradeErrorMessageMap = {
  404: messages.NoStudentFound,
};

export const getMasqueradeErrorMessage = (errorStatus) => {
  if (errorStatus == null) {
    return null;
  }
  return masqueradeErrorMessageMap[errorStatus] || messages.UnknownError;
};

export const useMasqueradeBarData = ({
  authenticatedUser,
}) => {
  const { formatMessage } = useIntl();
  const handleMasqueradeAs = apiHooks.useMasqueradeAs();
  const handleClearMasquerade = apiHooks.useClearMasquerade();

  const {
    isMasquerading,
    isMasqueradingFailed,
    isMasqueradingPending,
    masqueradeErrorStatus,
  } = reduxHooks.useMasqueradeData();
  const { masqueradeInput, handleMasqueradeInputChange } = module.useMasqueradeInput();
  const { isCollapsed, handleToggleCollapsed } = module.useCollapsedState();

  const masqueradeErrorMessage = getMasqueradeErrorMessage(masqueradeErrorStatus);
  const handleMasqueradeSubmit = (user) => (e) => {
    handleMasqueradeAs(user);
    e.preventDefault();
  };

  return {
    canMasquerade: authenticatedUser?.administrator,
    isMasquerading,
    isMasqueradingFailed,
    isMasqueradingPending,
    masqueradeErrorMessage,
    masqueradeInput,
    handleMasqueradeSubmit,
    handleClearMasquerade,
    handleMasqueradeInputChange,
    // Never minimized while actually masquerading. The chip is the only thing
    // on screen saying whose account staff are looking at, and hiding that is
    // how someone ends up acting as a learner without realising it.
    isCollapsed: isCollapsed && !isMasquerading,
    handleToggleCollapsed,
    formatMessage,
  };
};

export default useMasqueradeBarData;
