/* eslint-disable import/first, import/no-extraneous-dependencies */
// useAnnouncements is a real data-fetching hook, so it needs React's real
// useState/useEffect rather than the stubs setupTest installs.
jest.unmock('react');

import { renderHook } from '@testing-library/react-hooks';

import api from 'data/services/lms/api';
import { useAnnouncements } from './hooks';

jest.mock('data/services/lms/api', () => ({
  fetchAnnouncements: jest.fn(),
}));

// No logging service is configured under test, so the real logError throws.
jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const announcement = {
  id: 3,
  title: 'Scheduled maintenance',
  body: 'The site will be briefly unavailable on Sunday.',
  level: 'warning',
  date: '2026-08-20T02:30:00+00:00',
};

describe('useAnnouncements', () => {
  beforeEach(() => {
    api.fetchAnnouncements.mockReset();
  });

  it('loads announcements and parses their dates', async () => {
    api.fetchAnnouncements.mockResolvedValue({ data: { announcements: [announcement] } });
    const { result, waitForNextUpdate } = renderHook(() => useAnnouncements());
    expect(result.current.isLoading).toEqual(true);
    await waitForNextUpdate();
    expect(result.current.announcements).toEqual([
      { ...announcement, date: new Date(announcement.date) },
    ]);
    expect(result.current.isLoading).toEqual(false);
  });

  it('defaults a missing list to an empty one', async () => {
    api.fetchAnnouncements.mockResolvedValue({ data: {} });
    const { result, waitForNextUpdate } = renderHook(() => useAnnouncements());
    await waitForNextUpdate();
    expect(result.current.announcements).toEqual([]);
  });

  it('leaves the list empty when the request fails', async () => {
    api.fetchAnnouncements.mockRejectedValue(new Error('announcements unavailable'));
    const { result, waitForNextUpdate } = renderHook(() => useAnnouncements());
    await waitForNextUpdate();
    expect(result.current.announcements).toEqual([]);
    expect(result.current.isLoading).toEqual(false);
  });
});
