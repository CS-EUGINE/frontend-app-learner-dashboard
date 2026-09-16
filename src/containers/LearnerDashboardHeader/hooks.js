import React from 'react';
import { useWindowSize, breakpoints } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import track from 'tracking';
import { StrictDict } from 'utils';
import { linkNames } from 'tracking/constants';
import api from 'data/services/lms/api';
import urls from 'data/services/lms/urls';

import getLearnerHeaderMenu from './LearnerDashboardMenu';

import * as module from './hooks';

export const state = StrictDict({
  isOpen: (val) => React.useState(val), // eslint-disable-line
});

// Fallback for when the redux store has not been populated with platform
// settings, which is the case on every route except the dashboard itself.
export const DEFAULT_COURSE_SEARCH_URL = '/courses';

/** True when the browser is currently on the cart route. */
export const isCartPath = () => global.location.pathname.replace(/\/$/, '').endsWith('/cart');

/** True when the browser is currently on the purchase history route. */
export const isPurchasesPath = () => global.location.pathname.replace(/\/$/, '').endsWith('/purchases');

export const useIsCollapsed = () => {
  const { width } = useWindowSize();
  const isCollapsed = React.useMemo(() => (width <= breakpoints.large.minWidth), [width]);
  return isCollapsed;
};

export const findCoursesNavClicked = (href) => track.findCourses.findCoursesClicked(href, {
  linkName: linkNames.learnerHomeNavExplore,
});

export const findCoursesNavDropdownClicked = (href) => track.findCourses.findCoursesClicked(href, {
  linkName: linkNames.learnerHomeNavDropdownExplore,
});

/**
 * useCartItemCount()
 * Fetches how many courses are sitting in the learner's cart, for the header
 * badge. Failures are swallowed: a cart outage should not break the header.
 */
export const useCartItemCount = () => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let cancelled = false;
    // Wrapped in try/catch as well as .catch(): the http client can throw
    // synchronously when auth is not initialized, and that would otherwise
    // escape the effect and take the whole header down with it.
    try {
      api.fetchCart()
        .then(({ data }) => {
          if (!cancelled) { setCount(data.itemCount || 0); }
        })
        .catch(() => {});
    } catch (e) {
      // A cart outage must never break the header.
    }
    return () => { cancelled = true; };
  }, []);
  return count;
};

/**
 * useAuthoredCourseCount()
 * How many courses the viewer authors. Drives whether the header offers a
 * "My courses" link -- learners who author nothing should never see an
 * authoring entry point. Failures are swallowed for the same reason as the
 * cart: this is a nav affordance, not something worth breaking the header for.
 */
export const useAuthoredCourseCount = () => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let cancelled = false;
    try {
      api.fetchAuthoredCourses()
        .then(({ data }) => {
          if (!cancelled) { setCount(data.count || 0); }
        })
        .catch(() => {});
    } catch (e) {
      // An approval-service outage must never break the header.
    }
    return () => { cancelled = true; };
  }, []);
  return count;
};

/**
 * Resolve the server-side permission for the superuser-only bulk registration link.
 * The backend remains authoritative; this only controls whether the navigation item
 * is displayed in the learner dashboard.
 */
export const useBulkRegistrationAccess = () => {
  const [allowed, setAllowed] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    try {
      getAuthenticatedHttpClient()
        .get(urls.baseAppUrl('/support/bulk_registration_access'))
        .then(({ data }) => {
          if (!cancelled) { setAllowed(data.is_superuser === true); }
        })
        .catch(() => {});
    } catch (e) {
      // Navigation permission must never break the dashboard.
    }
    return () => { cancelled = true; };
  }, []);

  return allowed;
};

export const useLearnerDashboardHeaderMenu = ({
  courseSearchUrl, authenticatedUser, exploreCoursesClick, cartItemCount = 0, isCartPage = false,
  isPurchasesPage = false, authoredCourseCount = 0, notifications = {}, canBulkRegisterUsers = false,
}) => {
  const { formatMessage } = useIntl();
  return getLearnerHeaderMenu(
    formatMessage,
    courseSearchUrl,
    authenticatedUser,
    exploreCoursesClick,
    cartItemCount,
    isCartPage,
    isPurchasesPage,
    authoredCourseCount,
    notifications,
    canBulkRegisterUsers,
  );
};

export const useLearnerDashboardHeaderData = () => {
  const [isOpen, setIsOpen] = module.state.isOpen(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);

  return {
    isOpen,
    toggleIsOpen,
  };
};

export default {
  useIsCollapsed,
  findCoursesNavClicked,
  findCoursesNavDropdownClicked,
  useCartItemCount,
  useAuthoredCourseCount,
  useBulkRegistrationAccess,
  useLearnerDashboardHeaderData,
  useLearnerDashboardHeaderMenu,
};
