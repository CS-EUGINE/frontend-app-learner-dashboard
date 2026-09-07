/* eslint-disable import/first, import/no-extraneous-dependencies */
// The hook is real data fetching, so it needs React's own useState/useEffect.
jest.unmock('react');

import { renderHook, act } from '@testing-library/react-hooks';

import api from 'data/services/lms/api';
import { useNotifications } from './hooks';

jest.mock('data/services/lms/api', () => ({
  fetchNotifications: jest.fn(),
  markNotificationsRead: jest.fn(),
}));

// No logging service is configured under test, so the real logError throws.
jest.mock('@edx/frontend-platform/logging', () => ({ logError: jest.fn() }));

const feed = [
  {
    id: 1, kind: 'payment_successful', title: 'Payment successful', isRead: false,
  },
  {
    id: 2, kind: 'latest_news', title: 'News', isRead: false,
  },
];

describe('useNotifications', () => {
  beforeEach(() => {
    api.fetchNotifications.mockReset();
    api.markNotificationsRead.mockReset();
  });

  it('loads the feed and the badge count', async () => {
    api.fetchNotifications.mockResolvedValue({ data: { notifications: feed, unreadCount: 2 } });
    const { result, waitForNextUpdate } = renderHook(() => useNotifications());
    expect(result.current.isLoading).toEqual(true);
    await waitForNextUpdate();
    expect(result.current.notifications).toEqual(feed);
    expect(result.current.unreadCount).toEqual(2);
  });

  // The bell is chrome. A failed fetch must leave it silent, not shouting.
  it('leaves the bell empty when the feed cannot be fetched', async () => {
    api.fetchNotifications.mockRejectedValue(new Error('boom'));
    const { result, waitForNextUpdate } = renderHook(() => useNotifications());
    await waitForNextUpdate();
    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toEqual(0);
  });

  it('marks one read and takes the new count from the server', async () => {
    api.fetchNotifications.mockResolvedValue({ data: { notifications: feed, unreadCount: 2 } });
    api.markNotificationsRead.mockResolvedValue({ data: { updated: 1, unreadCount: 1 } });
    const { result, waitForNextUpdate } = renderHook(() => useNotifications());
    await waitForNextUpdate();

    await act(async () => { await result.current.markRead([1]); });

    expect(api.markNotificationsRead).toHaveBeenCalledWith({ ids: [1] });
    expect(result.current.unreadCount).toEqual(1);
    expect(result.current.notifications.find(n => n.id === 1).isRead).toEqual(true);
    expect(result.current.notifications.find(n => n.id === 2).isRead).toEqual(false);
  });

  it('marks everything read with no ids at all', async () => {
    api.fetchNotifications.mockResolvedValue({ data: { notifications: feed, unreadCount: 2 } });
    api.markNotificationsRead.mockResolvedValue({ data: { updated: 2, unreadCount: 0 } });
    const { result, waitForNextUpdate } = renderHook(() => useNotifications());
    await waitForNextUpdate();

    await act(async () => { await result.current.markRead(); });

    expect(api.markNotificationsRead).toHaveBeenCalledWith({});
    expect(result.current.unreadCount).toEqual(0);
    expect(result.current.notifications.every(n => n.isRead)).toEqual(true);
  });
});
