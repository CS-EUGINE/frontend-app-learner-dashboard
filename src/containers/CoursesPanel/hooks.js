import React from 'react';

import queryString from 'query-string';

import { logError } from '@edx/frontend-platform/logging';

import { ListPageSize, SortKeys } from 'data/constants/app';
import api from 'data/services/lms/api';
import { reduxHooks } from 'hooks';
import { StrictDict } from 'utils';

import * as module from './hooks';

export const state = StrictDict({
  sortBy: (val) => React.useState(val), // eslint-disable-line
});

/**
 * Filters are fetched from the store and used to generate a list of "visible" courses.
 * Other values returned and used for the layout of the CoursesPanel component are:
 * the current page number, the sorting method, and whether or not to enable filters and pagination.
 *
 * @returns data for the CoursesPanel component
 */
export const useCourseListData = () => {
  const filters = reduxHooks.useFilters();
  const removeFilter = reduxHooks.useRemoveFilter();
  const pageNumber = reduxHooks.usePageNumber();
  const setPageNumber = reduxHooks.useSetPageNumber();

  const [sortBy, setSortBy] = module.state.sortBy(SortKeys.enrolled);

  const querySearch = queryString.parse(window.location.search, { parseNumbers: true });

  const { numPages, visibleList } = reduxHooks.useCurrentCourseList({
    sortBy,
    filters,
    pageSize: querySearch?.disable_pagination === 1 ? 0 : ListPageSize,
  });

  const handleRemoveFilter = (filter) => () => removeFilter(filter);

  return {
    pageNumber,
    numPages,
    setPageNumber,
    visibleList,
    filterOptions: {
      sortBy,
      setSortBy,
      filters,
      handleRemoveFilter,
    },
    showFilters: filters.length > 0,
  };
};

/**
 * Hook for getting in-progress courses (courses that have been started but not archived)
 * @returns Object containing in-progress course list data
 */
export const useInProgressCourseListData = () => {
  const filters = reduxHooks.useFilters();
  const removeFilter = reduxHooks.useRemoveFilter();
  const pageNumber = reduxHooks.usePageNumber();
  const setPageNumber = reduxHooks.useSetPageNumber();

  const [sortBy, setSortBy] = module.state.sortBy(SortKeys.enrolled);

  const querySearch = queryString.parse(window.location.search, { parseNumbers: true });

  const { numPages, visibleList } = reduxHooks.useCurrentCourseList({
    sortBy,
    filters,
    pageSize: querySearch?.disable_pagination === 1 ? 0 : ListPageSize,
  });

  const inProgressCourses = (visibleList || []).filter(
    course => course.courseRun?.isStarted && !course.courseRun?.isArchived
  );

  const handleRemoveFilter = (filter) => () => removeFilter(filter);

  return {
    pageNumber,
    numPages,
    setPageNumber,
    visibleList: inProgressCourses,
    filterOptions: {
      sortBy,
      setSortBy,
      filters,
      handleRemoveFilter,
    },
    showFilters: filters.length > 0,
  };
};

/**
 * Hook for getting completed courses (archived courses)
 * @returns Object containing completed course list data
 */
export const useCompletedCourseListData = () => {
  const filters = reduxHooks.useFilters();
  const removeFilter = reduxHooks.useRemoveFilter();
  const pageNumber = reduxHooks.usePageNumber();
  const setPageNumber = reduxHooks.useSetPageNumber();

  const [sortBy, setSortBy] = module.state.sortBy(SortKeys.enrolled);

  const querySearch = queryString.parse(window.location.search, { parseNumbers: true });

  const { numPages, visibleList } = reduxHooks.useCurrentCourseList({
    sortBy,
    filters,
    pageSize: querySearch?.disable_pagination === 1 ? 0 : ListPageSize,
  });

  const completedCourses = (visibleList || []).filter(
    course => course.courseRun?.isArchived
  );

  const handleRemoveFilter = (filter) => () => removeFilter(filter);

  return {
    pageNumber,
    numPages,
    setPageNumber,
    visibleList: completedCourses,
    filterOptions: {
      sortBy,
      setSortBy,
      filters,
      handleRemoveFilter,
    },
    showFilters: filters.length > 0,
  };
};

export const emptyCatalog = { related: [], recommended: [] };

/**
 * Loads the course catalog that backs the "Related" and "Recommended" strips.
 * One request serves both, so the panel fetches once and hands each strip its
 * own slice. A failure leaves both lists empty and the strips unrendered — a
 * suggestion the learner never asked for is not worth an error banner.
 *
 * @returns {{catalog: object, isLoading: boolean}}
 */
export const useCourseCatalog = () => {
  const [catalog, setCatalog] = React.useState(emptyCatalog);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    api.fetchCourseCatalog()
      .then(({ data }) => {
        if (!cancelled) {
          setCatalog({
            related: data.related || [],
            recommended: data.recommended || [],
          });
        }
      })
      .catch((error) => {
        logError(error);
      })
      .finally(() => {
        if (!cancelled) { setIsLoading(false); }
      });

    return () => { cancelled = true; };
  }, []);

  return { catalog, isLoading };
};

/**
 * Loads the site announcements shown under the course lists.
 *
 * The endpoint only answers signed-in callers and already applies the
 * active/starts_at/ends_at window, so whatever comes back is what the learner
 * should see; the component only paginates and filters it. A failure leaves the
 * list empty and the section unrendered — a notice we could not fetch is not
 * worth an error banner on the dashboard.
 *
 * `date` arrives as an ISO string and is parsed here so every consumer sorts
 * and formats the same Date rather than re-parsing the string.
 *
 * @returns {{announcements: object[], isLoading: boolean}}
 */
export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    api.fetchAnnouncements()
      .then(({ data }) => {
        if (!cancelled) {
          setAnnouncements((data.announcements || []).map((announcement) => ({
            ...announcement,
            date: new Date(announcement.date),
          })));
        }
      })
      .catch((error) => {
        logError(error);
      })
      .finally(() => {
        if (!cancelled) { setIsLoading(false); }
      });

    return () => { cancelled = true; };
  }, []);

  return { announcements, isLoading };
};

export default useCourseListData;
