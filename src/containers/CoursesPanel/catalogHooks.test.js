/* eslint-disable import/first, import/no-extraneous-dependencies */
// useCourseCatalog is a real data-fetching hook, so it needs React's real
// useState/useEffect rather than the stubs setupTest installs.
jest.unmock('react');

import { renderHook } from '@testing-library/react-hooks';

import api from 'data/services/lms/api';
import { useCourseCatalog, emptyCatalog } from './hooks';

jest.mock('data/services/lms/api', () => ({
  fetchCourseCatalog: jest.fn(),
}));

// No logging service is configured under test, so the real logError throws.
jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const catalog = {
  related: [{ courseId: 'course-v1:CloudSwyft+DS201+2026' }],
  recommended: [{ courseId: 'course-v1:CloudSwyft+PY101+2026' }],
};

describe('useCourseCatalog', () => {
  beforeEach(() => {
    api.fetchCourseCatalog.mockReset();
  });

  it('loads related and recommended courses from the catalog endpoint', async () => {
    api.fetchCourseCatalog.mockResolvedValue({ data: catalog });
    const { result, waitForNextUpdate } = renderHook(() => useCourseCatalog());
    expect(result.current.isLoading).toEqual(true);
    await waitForNextUpdate();
    expect(result.current.catalog).toEqual(catalog);
    expect(result.current.isLoading).toEqual(false);
  });

  it('defaults missing sections to empty lists', async () => {
    api.fetchCourseCatalog.mockResolvedValue({ data: {} });
    const { result, waitForNextUpdate } = renderHook(() => useCourseCatalog());
    await waitForNextUpdate();
    expect(result.current.catalog).toEqual(emptyCatalog);
  });

  it('leaves both lists empty when the request fails', async () => {
    api.fetchCourseCatalog.mockRejectedValue(new Error('catalog unavailable'));
    const { result, waitForNextUpdate } = renderHook(() => useCourseCatalog());
    await waitForNextUpdate();
    expect(result.current.catalog).toEqual(emptyCatalog);
    expect(result.current.isLoading).toEqual(false);
  });
});
